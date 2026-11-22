---
title: Configuration
description: Providers and models, settings and secrets, environment variables, access tokens, the schema rule and the ~/.bazilion layout.
---

The daemon owns `~/.bazilion`: the database, settings, secrets, scheduler and Agent turns. The
CLI and the web UI are clients of its HTTP API.

## Providers and models

Models are written `provider:model`, for example `anthropic:claude-fable-5-2`,
`openai-codex:gpt-6.2-sol` or `lmstudio:my-loaded-model`. Model ids come from Pi's bundled
catalog; Bazilion 0.55.0 bundles Pi 1.6.0. An id that is not in the catalog is refused as
"Unknown model" unless the provider has an endpoint you configured, so a typo never sends a key to
another vendor.

**Setup → Models** (`/config`) is sorted by what a model does for your Agents:

- **Chat**: the models Agents think with. Each Agent and each Agent template uses one of them.
- **Images**: the model Agents draw with, or off
  ([image generation](/docs/tools/#image-generation)).
- **Providers**: the accounts and local servers those models run on.

![Setup, Models: six chat models with their size, price and who uses them, the image model, and three providers that each say when they were last tested.](/screenshots/models.webp)

### Connect a provider

A provider is connected in one step. Press **Add a provider**, choose one, paste its key (or sign
in with ChatGPT, or give a local server's address), keep the suggested models or choose others,
and press **Connect and test**. From a terminal:

```sh
bazilion provider connect anthropic       # asks for the key, without echo
bazilion provider connect openai --key sk-… --models gpt-6.2-sol,gpt-6-luna
bazilion provider connect lmstudio --url http://127.0.0.1:1234/v1
# A ChatGPT plan: sign in, then connect.
bazilion auth openai login && bazilion provider connect openai-codex
```

Connecting asks the cheapest chosen model for a short reply first. Only when it answers are the
key and the models saved and the provider switched on, so a key that does not work is never
stored. A model the provider refuses for your account is left out and the next one is asked. A
local server that is switched off is reported as such, and nothing is saved. **Save without
testing** (`--no-test`) skips the request and leaves the provider "Not tested yet".

![The connect form on a first run: the API key, the two suggested Claude models with their size and price, and the Connect and test button.](/screenshots/connect.webp)

| Provider | Id | Connects with |
| --- | --- | --- |
| ChatGPT (a Plus, Pro or Team plan) | `openai-codex` | **Sign in**, or `bazilion auth openai login` (`--device-code` when headless) |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY` |
| Google Gemini | `google` | `GEMINI_API_KEY` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` |
| LM Studio | `lmstudio` | `LMSTUDIO_URL` (default `http://127.0.0.1:1234/v1`), optional `LMSTUDIO_API_KEY` |
| Ollama | `ollama` | `OLLAMA_URL` (default `http://127.0.0.1:11434/v1`) |
| llama.cpp | `llamacpp` | `LLAMACPP_URL` (default `http://127.0.0.1:9931/v1`, llama-server's own default) |

Many more are behind **Add a provider** (`bazilion provider list --all`): Azure OpenAI, Amazon
Bedrock, Google Vertex AI, GitHub Copilot, DeepSeek, Mistral, xAI, Groq, Cerebras, Fireworks,
Together, Baseten, Moonshot, Kimi, MiniMax, Qwen Token Plan (Team and Individual, each with its
own key), Xiaomi MiMo, NVIDIA, zAI, Meta,
Radius, Hugging Face, Cloudflare, Vercel AI Gateway and OpenCode. `--set NAME=value` sets a
provider's other fields; `bazilion provider models <id>` lists their names.

The ChatGPT sign-in is stored encrypted and refreshed by the daemon; a worker only ever gets a
short-lived access token.

### What a provider's state means

| State | |
| --- | --- |
| Working | Its last test got a reply; the page says when |
| Key rejected, Not answering, Model unavailable, Limit reached | Its last test failed; the provider's sheet says what to do and shows the provider's own message |
| Not tested yet | Saved without a test, or its key or models changed since |
| Needs a key | Switched on, but its credentials are gone |
| Turned off | Paused; what is saved stays saved |
| Saved, not in use | A key was saved but no model chosen, as 0.50 allowed; **Connect** chooses its models and tests it |

Nothing tests a provider on its own. A state is the outcome of connecting, of **Test again**
(`bazilion provider test <id>`) or of `bazilion provider test <provider:model>`, and changing a
provider's key or address makes it "Not tested yet" again.

```sh
bazilion provider list                   # the providers in use, with their state
bazilion provider test anthropic         # ask its cheapest chat model
bazilion provider disable anthropic      # pause it; enable switches it back on
bazilion provider disconnect anthropic   # remove its key, its models and its test
```

A provider cannot be switched on without credentials. Disconnecting removes the stored key or
sign-in; a key two providers share stays while the other one is on.

### Chat models

**Add models** lists every model of the connected providers with its name, how much it can read,
whether it takes images, whether it reasons and its list price per million tokens. These facts
come from Pi's catalog; a model the catalog does not know is listed by its id, and a local server
lists what it has loaded.

```sh
bazilion provider models anthropic       # in use, and offered
bazilion provider models-set anthropic claude-fable-5-2,claude-haiku-5-5
```

Wherever a model is chosen (an Agent's **Agent** tab, **Spawn an agent**, an Agent template) the
menu shows these names by provider, with how much each model reads and whether it sees images.
The CLI and the API keep the `provider:model` id.

Each row on the page says who uses the model. New Agents use their Profile's default model unless
you pick another. Saving a provider's list without a model that a Profile defaults to moves the
Profile to the provider's first remaining model (or to the first available model of another
provider when none remains), and the save reports each move. A Profile on a model that was never
listed and an Agent's own model override are not rewritten; change them with
`bazilion profile update <id> --model …`, under **Agent** in the side panel or with
`bazilion agent edit <id> --model …`.

## Settings and secrets

Settings are environment-variable-shaped keys. Set them under **Setup** (the tools on
[**Setup → Tools**](/docs/tools/#setting-the-tools)), or:

```sh
bazilion config list                              # every setting, and what is in effect
bazilion config set BAZILION_BASH_SANDBOX docker
bazilion config set BROWSER_ATTACH=true BROWSER_ATTACH_URL=http://127.0.0.1:9222
bazilion config rm BAZILION_BASH_SANDBOX          # back to its default
```

A value is checked before it is stored, on the page and by `config set`: a choice must be one of
its values, a switch `true` or `false`, a number whole and in range, an address `http://` or
`https://`. With `NAME=value` pairs, either all are stored or none.

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
| `BROWSER_ATTACH` | `false` | `true` makes Agents work in [your running browser](/docs/tools/#your-running-browser) |

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
device token, on **Setup → Access** (`/config/access`) or:

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
