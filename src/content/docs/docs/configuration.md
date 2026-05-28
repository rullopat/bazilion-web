---
title: Configuration
description: Providers, secrets, access tokens, and the ~/.bazilion on-disk layout.
---

The daemon is the single owner of `~/.bazilion` and all configuration. Clients
(CLI, web, mobile) are stateless and talk to it over HTTP.

## Providers

Models are addressed as `provider:model`, for example
`anthropic:claude-opus-4-6`, `openai-codex:gpt-5.3-codex`, or
`lmstudio:my-loaded-model`. Supported providers:

| Provider      | Credential                                  |
| ------------- | ------------------------------------------- |
| Anthropic     | `ANTHROPIC_API_KEY`                         |
| OpenAI        | `OPENAI_API_KEY`                            |
| Google Gemini | `GEMINI_API_KEY`                            |
| ChatGPT OAuth | Connect via `/config` or `bazilion login`   |
| LM Studio     | `LMSTUDIO_URL` / `LMSTUDIO_API_KEY`         |
| Ollama        | `OLLAMA_URL`                                |

Plain API-key providers read from the environment. The ChatGPT (`openai-codex`)
provider stores an OAuth credential blob in the database and refreshes it
lazily.

## Secrets and config

Credentials and settings live in the database, not in loose files:

- **`secrets`** — AES-256-GCM envelopes, one row per env-var-shaped key. The
  encryption key is derived from the bootstrap token in `auth.json`. This guards
  against accidental exposure (a `cat`'d dump, a screenshare), not against a
  full filesystem read.
- **`config`** — plaintext for non-confidential, env-var-shaped values (server
  URLs, region slugs, project IDs).

## Access tokens

The daemon gates every route with a single bearer-token check. The bootstrap
token in `auth.json` is minted on first run and cannot be revoked. Mint and
manage additional tokens with:

```sh
bazilion token create <label>
bazilion token list
bazilion token revoke <id>
```

Add `--qr` to `token create` to emit a `bazilion://pair?...` URL and a terminal
QR code for pairing a mobile client.

## On-disk layout

```
~/.bazilion/
  bazilion.db          # all DB state: entities + secrets + config + tokens
  auth.json            # bootstrap bearer token (+ optional remote target)
  groups/<slug>/       # collaboration root (may be a symlink); memory/ + work
  agents/<id>/         # an agent's private home: SOUL.md, sessions/, agent.json
  profiles/<id>/       # profile templates
  skills/<name>/       # installed skills (SKILL.md)
  logs/
```

Override the workspace location with the `$BAZILION_HOME` environment variable.

## LAN and mobile

By default the daemon binds `127.0.0.1:4321`. To reach it from a phone on your
network:

```sh
bazilion serve --host 0.0.0.0
```

The API is admin-level, so TLS is your responsibility — Tailscale handles it
for a personal network, or put it behind a reverse proxy with TLS.
