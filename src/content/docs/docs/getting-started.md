---
title: Getting started
description: Install Bazilion, open the local dashboard, and finish first-run setup in a few minutes.
---

Bazilion ships as an npm package that bundles the CLI, daemon, and production
web UI. The daemon self-bootstraps its workspace on first run — there is no
separate `init` step.

## What you need

- **Node.js 24+** — the published CLI requires it.
- **A model provider** — an API key for Anthropic, OpenAI, or Google, a
  ChatGPT account for OAuth, or a local backend (Ollama / LM Studio).

> **Upgrading from an older alpha?** Bazilion 0.9.0 deliberately has no legacy
> database, API, URL, or filesystem adapters. Back up anything you need and
> follow the [0.9 clean-install instructions](/docs/whats-new-0-9/#upgrading-from-an-older-alpha)
> before starting the new daemon.

## Install and open the dashboard

The fastest path is the one-line installer:

```sh
curl -fsSL https://bazilion.com/install.sh | bash
bazilion dashboard
```

On Windows PowerShell:

```powershell
irm https://bazilion.com/install.ps1 | iex
bazilion dashboard
```

Already have Node 24+? Use npm directly:

```sh
npm install -g bazilion
bazilion dashboard
```

On first boot `bazilion dashboard`:

- creates `~/.bazilion/` (profiles, agents, teams, skills, logs),
- opens the SQLite database and applies the clean-install schema,
- mints a bootstrap token and writes it to `~/.bazilion/auth.json`,
- binds the HTTP API on `127.0.0.1:4321`,
- opens the bundled web UI on `http://127.0.0.1:4322`.

## Hack on the source

```sh
git clone https://github.com/rullopat/bazilion
cd bazilion
npm install -g pnpm # if pnpm is missing
pnpm install

# Start the source daemon, then run the web UI in another terminal.
pnpm tsx apps/cli/src/index.ts serve
cd apps/web && pnpm dev
```

Open `http://127.0.0.1:4322` and log in with your **bootstrap token** — the
`token` value in `~/.bazilion/auth.json`, written on first
`bazilion dashboard` or `bazilion serve`. Then finish first-run setup on the
`/config` page: enable at least one provider and pick a model. Crossing that
threshold seeds a `default` Agent template and a `default` Team so you can spawn your
first agent.

See [The web interface](/docs/web-interface/) for a full tour of the UI.

## First agent

The web sidebar can spawn from the `default` Agent template. From the CLI:

```sh
bazilion agent spawn --profile default --name first --team default
bazilion agent chat <agent-id>
```

## Where to next

- [Core concepts](/docs/concepts/) — Agent templates, Team Templates, Teams,
  policy, approvals, memory, and the mailbox. Read this before building teams.
- [The web interface](/docs/web-interface/) — a tour of every screen.
- [Tools & integrations](/docs/tools/) — browser automation, MCP servers, and
  sending files to and from agents.
- [Connecting Telegram](/docs/telegram/) — give your agents their own Telegram
  topics.
- [Configuration](/docs/configuration/) — providers, secrets, tokens, and the
  on-disk layout.
- [How Bazilion is different](/docs/why-bazilion/) — if you're coming from
  OpenClaw.
