---
title: Configuration
description: Providers and models, settings and secrets, environment variables, access tokens, the schema rule and the ~/.bazilion layout.
---

The daemon owns `~/.bazilion`: the database, settings, secrets, scheduler and Agent turns. The
CLI and the web UI are clients of its HTTP API.

## Providers and models

Models are written `provider:model`, for example `anthropic:claude-opus-5`,
`openai-codex:gpt-6-astra` or `lmstudio:my-loaded-model`. Model ids come from Pi's bundled
catalog; Bazilion 0.26.0 bundles Pi 1.4.0. An id that is not in the catalog is refused as
"Unknown model" unless the provider has an endpoint you configured, so a typo never sends a key to
another vendor.

| Provider | Credential |
| --- | --- |
| ChatGPT login (`openai-codex`) | **Connect ChatGPT** on `/config`, or `bazilion auth openai login` (`--device-code` when headless) |
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| LM Studio | `LMSTUDIO_URL` (default `http://127.0.0.1:1234/v1`), optional `LMSTUDIO_API_KEY` |
| Ollama | `OLLAMA_URL` (default `http://127.0.0.1:11434/v1`) |
| llama.cpp | `LLAMACPP_URL` (default `http://127.0.0.1:8080/v1`) |

Many more have a card on `/config`: Azure OpenAI, Amazon Bedrock, Google Vertex, GitHub
Copilot, DeepSeek, Mistral, xAI, Groq, Cerebras, Fireworks, Together, Baseten, Moonshot, Kimi,
MiniMax, Qwen Token Plan, Xiaomi MiMo, NVIDIA, zAI, Meta, Radius, Hugging Face, Cloudflare,
Vercel AI Gateway and OpenCode.

A credential alone does not make a provider usable. Enable it and save at least one model:

```sh
bazilion provider list
bazilion provider enable anthropic
bazilion provider models anthropic             # curated, catalog and live model ids
bazilion provider models-set anthropic claude-opus-5,claude-sonnet-5
bazilion provider test anthropic:claude-opus-5  # one real request
```

The ChatGPT sign-in is stored encrypted and refreshed by the daemon; a worker only ever gets a
short-lived access token. After connecting, enable `openai-codex` and save a model such as
`gpt-6-astra`. Saved Agent and Profile model choices are never rewritten for you; change them in
the Agent's **Settings** or with `bazilion agent edit <id> --model …`.

## Settings and secrets

Settings are environment-variable-shaped keys. Set them on the `/config` pages, or:

```sh
bazilion config list
bazilion config set BAZILION_BASH_SANDBOX docker
bazilion config rm BAZILION_BASH_SANDBOX
```

Secrets (API keys, tokens) are stored as AES-256-GCM envelopes in the `secrets` table, with a key
derived from the bootstrap token in `auth.json`; other values are plain text in `config`. Anyone
who can read both `bazilion.db` and `auth.json` can decrypt the secrets. The daemon's own
environment wins over stored secrets, which win over stored config.

The settings you are most likely to change:

| Key | Default | |
| --- | --- | --- |
| `BAZILION_BASH_SANDBOX` | `off` | `docker` runs each `bash` command in a fresh network-less container ([coding](/docs/coding-environment/)) |
| `BAZILION_BASH_SANDBOX_IMAGE` | `debian:bookworm-slim` | the local Docker image |
| `BAZILION_BASH_APPROVAL` | `off` | `dangerous` pauses flagged shell commands for approval in chat |
| `BAZILION_AGENT_LOOP_MAX_HOPS` | `8` | hop limit for Agent message chains |
| `BAZILION_WEB_SEARCH_ROUTE` | `auto` | `brave`, `searxng`, `native` or `off` ([web research](/docs/tools/#web-research)) |
| `BAZILION_IMAGE_MODEL` | `off` | the image model and account ([image generation](/docs/tools/#image-generation)) |
| `BROWSER_ENABLED` | `true` | the managed browser ([browser](/docs/tools/#managed-browser)) |

Read only from the process environment:

| Variable | |
| --- | --- |
| `BAZILION_HOME` | the home directory (default `~/.bazilion`) |
| `HOST`, `PORT` | the daemon listener (default `127.0.0.1:4321`) |
| `WEB_HOST`, `WEB_PORT` | the web UI listener when run as its own service (default `127.0.0.1:4322`) |
| `BAZILION_PUBLIC_ORIGIN` | the [private gateway](/docs/private-access/) origin |
| `BAZILION_SCHEDULER=off` | no triggers, inbox wakes or learning reviews |
| `BAZILION_SCHEDULER_TICK_MS` | the scheduler tick (default 5000) |
| `BAZILION_SERVER`, `BAZILION_TOKEN` | point the CLI at another daemon |

## Access tokens

The bootstrap token in `auth.json` is created on first start. The CLI uses it by itself, the web
login accepts it, and it cannot be revoked. Give every other browser, phone or remote CLI its own
device token, on **Setup → Tokens** (`/config/tokens`) or:

```sh
bazilion token create personal-laptop          # --expires-days 90 for one that expires
bazilion token list
bazilion token revoke <id>
bazilion session list
bazilion session revoke <id>
```

The plaintext is shown once. Every token has full access, and a device token expires only when
created with `--expires-days`. The browser exchanges a token for a session cookie, which ends
after 30 days without use or when its token is revoked.

## Schema

The database has no migrations. A release opens a home only when its schema matches; otherwise
the daemon refuses to start and leaves the home untouched. `bazilion.db` and `auth.json` are a
pair: when only one of them exists, or they do not match, the daemon refuses too. See
[Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260) and
[Reset a home](/docs/getting-started/#reset-a-home).

## On-disk layout

```text
~/.bazilion/                  # or $BAZILION_HOME
  bazilion.db                 # every record, settings, encrypted secrets, tokens, saved results
  auth.json                   # bootstrap token; the CLI's remote target after `bazilion login`
  daemon.pid                  # PID of the running daemon
  agents/<id>/                # SOUL.md IDENTITY.md AGENTS.md TOOLS.md [BOOTSTRAP.md], sessions/, uploads/
  teams/<slug>/               # Team workspace (a directory, or a symlink to a project); memory/
  profiles/<id>/              # Agent templates
  skills/<name>/              # SKILL.md and helper files
  browsers/<agent-id>/        # managed browser profile (cookies, logins)
```

A Team registered with `--link` is a symlink under `teams/`; reset and uninstall remove the link,
never the project it points to.
