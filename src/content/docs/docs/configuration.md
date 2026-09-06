---
title: Configuration
description: Providers, Team Policy enforcement, secrets, access tokens, the clean-install schema, and the ~/.bazilion on-disk layout.
---

The daemon is the single owner of `~/.bazilion`, SQLite, configuration,
secrets, scheduler state, and Agent turns. CLI, web, and mobile clients are
stateless and talk to it over HTTP.

## Providers and models

Models use `provider:model`, for example `anthropic:claude-opus-5`,
`openai-codex:gpt-6-astra`, or `lmstudio:my-loaded-model`. The provider list is
data-driven from Pi's catalog. Bazilion 0.14.2 bundles Pi 0.85.1, including
GPT-6 Astra, GPT-5.6, Claude 5, Gemini 3.6, Kimi K3, Grok 4.5, and Qwen 3.8 models.

Common providers include:

| Provider | Credential |
| --- | --- |
| ChatGPT OAuth (`openai-codex`) | Connect on `/config` or run `bazilion auth openai login`; add `--device-code` for headless or remote setup |
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
`gpt-6-astra`, `gpt-5.6-terra`, or `gpt-5.6-sol`.

### Select GPT-6 Astra

1. Upgrade to Bazilion 0.14.2 and restart the daemon and web UI.
2. Open `/config` and connect **OpenAI Codex** with ChatGPT OAuth, or configure
   **OpenAI** with an API key. Enable the provider.
3. Add the `gpt-6-astra` catalog chip to its curated models and save, keeping
   any existing models you still use.
4. Select `openai-codex:gpt-6-astra` or `openai:gpt-6-astra` in the Agent's
   Settings or an Agent template's model selector.

Catalog availability does not automatically change existing Agents. Agent
template edits apply to future spawns; update an existing Agent separately.
Models appear in selectors only when their provider is enabled and they are
in its saved curated list.

The normal CLI flow opens a browser and listens for the loopback callback on
port 1455. Use the device-code flow when that callback cannot reach the client:

```sh
bazilion auth openai login --device-code

# From a source checkout, run the same command at the repository root.
pnpm tsx apps/cli/src/index.ts auth openai login --device-code
```

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
`auth.json` is minted on first run and cannot be revoked. On a clean install,
browser login accepts it only while provider setup is incomplete and exchanges
it for an internal expiring device identity plus a bounded session. The browser
never retains the bootstrap bearer. After setup, use a named device credential.
Additional tokens:

```sh
bazilion token create <label>
bazilion token list
bazilion token revoke <id>
```

Add `--qr` to create a `bazilion://pair?...` URL and terminal QR code for a
mobile client.

## Shell isolation and command approval

Local operator chat uses host-backed coding tools when
`BAZILION_BASH_SANDBOX=off`. Setting it to `docker` replaces those coding
tools with containerized `bash`. Background, Telegram, approved-delivery, and
private-gateway turns always require protected Docker execution regardless of
that setting.

`BAZILION_BASH_SANDBOX_IMAGE` selects a compatible locally installed image
(default `debian:bookworm-slim`). Bazilion never pulls it during a turn.
`BAZILION_BASH_APPROVAL=dangerous` independently gates classified shell commands;
non-interactive clients auto-deny them. Set these in the daemon environment and
restart after changes.

See [Tools & integrations](/docs/tools/) for the capability table, Docker
preparation, and approval behavior. Run `bazilion doctor` to inspect readiness.

## Backup and restore

Create encrypted backups with `bazilion backup create` and restore offline
with `bazilion backup restore`. The database is snapshotted consistently;
linked external Team projects and their memory require separate backups.

Follow [Backup and recovery](/docs/backup-recovery/) for archive scope, identity
storage, an empty-destination rehearsal, restore validation, and recovery from
credential exposure. Do not use destructive alpha resets as a normal upgrade step.

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

Startup verifies the exact schema and checks that `bazilion.db` and `auth.json`
form one valid bootstrap identity before the scheduler or HTTP listener starts.
An older schema, a missing half of the pair, or a mismatched bootstrap token
fails closed with recovery guidance instead of partially starting.

For an older alpha install, export anything you need first, then recreate the
state rather than attempting an in-place upgrade:

```sh
bazilion uninstall --yes
npx bazilion dashboard
```

The standard reset removes the database and bootstrap token together, plus
Agent templates, Agents, Teams, and obsolete alpha state. It preserves logs and
the local skill library; add `--all` only when you intend to remove those too.
Provider and integration credentials—including Telegram—must be entered again.
Linked Team targets remain untouched.

## Private web gateway

Set the same exact `BAZILION_PUBLIC_ORIGIN` in the daemon and web environments.
Keep both listeners on loopback and publish only the web listener through
private Tailscale Serve. Direct daemon exposure, public reverse proxies, and
Funnel are unsupported. The origin setting activates protected execution for
HTTP Agent turns.

Follow [Private access and mobile pairing](/docs/private-access/) for the full
setup and host-side `bazilion gateway preflight` checks.

## Mobile pairing

Mint a separate expiring device credential for each phone and pair it with the
exact private HTTPS origin. The app accepts QR scans, manual URLs, and
`bazilion://pair` deep links; it verifies the origin and credential before saving.

Use the [phone pairing steps](/docs/private-access/#pair-the-mobile-app).
Revoking a device credential invalidates its derived sessions. Mobile cannot
approve dangerous shell commands interactively.
