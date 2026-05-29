---
title: Getting started
description: Install the Bazilion daemon, boot it, and finish first-run setup in a few minutes.
---

Bazilion ships as an npm package that bundles the daemon and CLI. The daemon
self-bootstraps its workspace on first run — there is no separate `init` step.

## What you need

- **Node.js 24+** — the published CLI requires it.
- **A model provider** — an API key for Anthropic, OpenAI, or Google, a
  ChatGPT account for OAuth, or a local backend (Ollama / LM Studio).

## Run the daemon

The fastest path is `npx`, which downloads and runs the latest release:

```sh
npx bazilion serve
```

On first boot the daemon:

- creates `~/.bazilion/` (profiles, agents, groups, skills, logs),
- opens the SQLite database and runs migrations,
- mints a bootstrap token and writes it to `~/.bazilion/auth.json`,
- binds the HTTP API on `127.0.0.1:4321`.

Prefer a global install? It is equivalent:

```sh
npm install -g bazilion
bazilion serve
```

## The web UI

While the project is young, the web UI is run from the source checkout rather
than the npm package:

```sh
git clone https://github.com/rullopat/bazilion
cd bazilion
pnpm install

# Terminal 1 — the daemon from source
pnpm tsx apps/cli/src/index.ts serve

# Terminal 2 — the web app on :4322
cd apps/web
pnpm dev
```

Open `http://127.0.0.1:4322` and log in with your **bootstrap token** — the
`token` value in `~/.bazilion/auth.json`, written on first `bazilion serve`. Then
finish first-run setup on the `/config` page: enable at least one provider and
pick a model. Crossing that threshold seeds a `default` profile and a `default`
group so you can spawn your first agent.

See [The web interface](/docs/web-interface/) for a full tour of the UI.

## First agent

From the CLI, you can chat with an agent once you have one:

```sh
bazilion agent chat <agent-id>
```

## Where to next

- [Core concepts](/docs/concepts/) — profiles, profile groups, groups, memory,
  and the mailbox. Read this before building teams.
- [The web interface](/docs/web-interface/) — a tour of every screen.
- [Tools & integrations](/docs/tools/) — browser automation, MCP servers, and
  sending files to and from agents.
- [Connecting Telegram](/docs/telegram/) — give your agents their own Telegram
  topics.
- [Configuration](/docs/configuration/) — providers, secrets, tokens, and the
  on-disk layout.
- [How Bazilion is different](/docs/why-bazilion/) — if you're coming from
  OpenClaw.
