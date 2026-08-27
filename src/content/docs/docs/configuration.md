---
title: Configuration
description: Providers, Team Policy enforcement, secrets, access tokens, the clean-install schema, and the ~/.bazilion on-disk layout.
---

The daemon is the single owner of `~/.bazilion`, SQLite, configuration,
secrets, scheduler state, and Agent turns. CLI, web, and mobile clients are
stateless and talk to it over HTTP.

## Providers and models

Models use `provider:model`, for example `anthropic:claude-opus-5`,
`openai-codex:gpt-5.6-luna`, or `lmstudio:my-loaded-model`. The provider list is
data-driven from Pi's catalog. Bazilion 0.13.0 bundles Pi 0.84.3, including
current GPT-5.6, Claude 5, Gemini 3.6, Kimi K3, Grok 4.5, and Qwen 3.8 models.

Common providers include:

| Provider | Credential |
| --- | --- |
| ChatGPT OAuth (`openai-codex`) | Connect on `/config` or run `bazilion auth openai login` |
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| Baseten | `BASETEN_API_KEY` |
| Qwen Token Plan | `QWEN_TOKEN_PLAN_API_KEY` |
| Qwen Token Plan CN | `QWEN_TOKEN_PLAN_CN_API_KEY` |
| Qwen Token Plan Individual | `QWEN_TOKEN_PLAN_API_KEY` |
| LM Studio | `LMSTUDIO_URL` / `LMSTUDIO_API_KEY` |
| Ollama | `OLLAMA_URL` |

Credentials alone do not clear first-run setup. Enable the provider and save at
least one curated model in `/config` or with `bazilion provider`.

ChatGPT OAuth credentials live encrypted in the database and refresh lazily.
During worker turns, expiring access tokens refresh through provider-, Agent-,
and turn-bound daemon IPC; refresh credentials never enter the worker.
After connecting, enable `openai-codex` and curate a model such as
`gpt-5.6-luna`, `gpt-5.6-terra`, or `gpt-5.6-sol`.

## Team Policy enforcement

The Team Policy management surfaces are always available. Runtime enforcement
is opt-in:

```sh
BAZILION_TEAM_POLICY_ENFORCEMENT=on bazilion dashboard
```

Set the variable in the daemon environment and restart it. When active, one
shared authorizer gates user, peer, cross-Team, scheduler, inbox, HTTP/worker,
and Telegram boundaries. A missing edge denies. Durable denial records keep
policy evidence but never the attempted message payload.

## Secrets and config

Credentials and settings live in `bazilion.db`, not loose `config.json` or
`secrets.enc` files:

- **`secrets`** stores AES-256-GCM envelopes, one row per env-var-shaped key.
  The key is derived from the bootstrap token in `auth.json`. This protects
  against accidental exposure, not an attacker who can read both files.
- **`config`** stores non-confidential values such as URLs, region slugs, and
  project IDs in plaintext.

## Access tokens

Every protected route uses the same token table. The bootstrap token in
`auth.json` is minted on first run and cannot be revoked. Additional tokens:

```sh
bazilion token create <label>
bazilion token list
bazilion token revoke <id>
```

Add `--qr` to create a `bazilion://pair?...` URL and terminal QR code for a
mobile client.

## Shell isolation and command approval

The default `BAZILION_BASH_SANDBOX=off` keeps Pi's host-backed coding tools.
Opt into a fresh, network-disabled Docker container for each shell command:

```sh
BAZILION_BASH_SANDBOX=docker bazilion dashboard
```

Docker mode exposes the Team workspace as the only writable mount, keeps
memory, skills, and Agent inputs read-only, uses a read-only root and temporary
`/tmp`, and refuses remote Docker contexts or images with implicit volumes. It
fails closed if Docker or the configured local image is unavailable.

Independently, `BAZILION_BASH_APPROVAL=dangerous` pauses commands classified as
dangerous for a turn-scoped decision in the web UI or an interactive TTY. A
non-interactive turn denies them automatically. Run `bazilion doctor` to inspect
the active posture.

## Backup and restore

Create a recipient-encrypted online backup while the daemon is running:

```sh
bazilion backup create bazilion-backup.tar.gz.age --recipient age1...
```

The archive contains a verified SQLite snapshot rather than live WAL state.
Restore is deliberately offline and staged. Keep the age identity in an
owner-only file (`chmod 600`) and pass it explicitly:

```sh
bazilion backup restore bazilion-backup.tar.gz.age --identity ./age-identity.txt
```

Plaintext archives remain available only with an explicit `--plaintext` flag.
Restore validates paths and links, the auth/database pair, SQLite integrity,
foreign keys, and the exact schema before an atomic install. It rebases stored
Profile and Agent directories to the destination home, preserves contained
relative work-product links, rejects escaping targets, and leaves recovery
markers if a swap is interrupted.

## On-disk layout

```text
~/.bazilion/
  bazilion.db          # entities + policy + approvals + secrets + config + tokens
  auth.json            # bootstrap bearer token (+ optional remote target)
  teams/<slug>/        # Team root (real directory or symlink); memory/ + work
  agents/<id>/         # private Agent home, prompt/identity files, sessions/, agent.json
  profiles/<id>/       # Agent template files
  skills/<name>/       # installed prompt-only skills (SKILL.md)
  logs/
```

Override the root with `$BAZILION_HOME`. A Team registered with `--link` gets a
symlink under `teams/`; uninstalling Bazilion removes that link, never the
external project directory.

## Alpha clean-install contract

Bazilion intentionally has one canonical schema in `0001_init.sql`. There
are no incremental Group/Profile Group/Harness migrations and no database, API,
URL, CLI, or filesystem compatibility adapters.

For an older alpha install, export anything you need first, then recreate the
state rather than attempting an in-place upgrade:

```sh
bazilion uninstall --yes --all
npx bazilion dashboard
```

The full wipe removes the database, bootstrap token, logs, and local skill
library, so provider and integration credentials—including Telegram—must be
entered again. Linked Team targets remain untouched.

## Private web gateway

The supported remote-access profile uses Tailscale Serve for tailnet-only HTTPS
while both Bazilion listeners remain on loopback. Set one exact public origin in
the daemon and web environments:

```sh
BAZILION_PUBLIC_ORIGIN=https://bazilion.example.ts.net
HOST=127.0.0.1
PORT=4321
WEB_HOST=127.0.0.1
WEB_PORT=4322
```

After starting both services, configure Serve and run the read-only preflight:

```sh
tailscale serve --bg --https=443 http://127.0.0.1:4322
bazilion gateway preflight
```

Funnel and direct daemon exposure are unsupported. Mint a different expiring
device credential for each browser or phone; the plaintext is shown once:

```sh
bazilion token create personal-laptop --expires-days 90 --qr
bazilion token list
bazilion session list
```

Browser login exchanges the device credential for a bounded server session.
Revoking or expiring the credential also invalidates its derived sessions. The
local bootstrap token is not accepted by browser login.

## LAN and mobile

The daemon binds `127.0.0.1:4321` by default. To reach it from a phone or other
trusted device:

```sh
bazilion serve --host 0.0.0.0
```

The API is admin-level and the daemon does not provide TLS. Use Tailscale for a
personal network or a correctly configured TLS reverse proxy; do not expose the
raw port to the public internet.
