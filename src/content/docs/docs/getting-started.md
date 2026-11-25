---
title: Getting started
description: Install Bazilion, open the dashboard, connect a provider and spawn your first Agent.
---

Bazilion ships as one npm package, `bazilion`, with the CLI, the daemon and the web UI. The daemon
creates its home on first start; there is no separate `init` step.

## What you need

- **Node.js `^26.12.1`** (26.12.1 or a later 26.x). The CLI refuses any other Node version before
  it starts.
- **A model provider**: a ChatGPT account, an API key (OpenAI, Anthropic, Google and many others)
  or a local server (LM Studio, Ollama, llama.cpp).
- Linux is the tested platform; macOS runs commands on the host and is untested.

## Install and open the dashboard

The one-line installer installs Node 26.12.1 through Volta when no supported Node is found, then
the `bazilion` package:

```sh
curl -fsSL https://bazilion.com/install.sh | bash
bazilion dashboard
```

With a supported Node already installed, use npm (or run each command as `npx bazilion …`):

```sh
npm install -g bazilion
bazilion dashboard
```

`bazilion dashboard` starts the daemon on `127.0.0.1:4321` and the web UI on `127.0.0.1:4322`,
and opens your browser (`--no-open` skips that). On first start the daemon creates `~/.bazilion`
(or `$BAZILION_HOME`) with its database and a bootstrap token in `auth.json`. `bazilion serve`
starts only the daemon.

## Sign in and connect a provider

Sign in to the web UI with the bootstrap token; `bazilion token show-local` prints it. The CLI
reads it by itself.

Until one provider is connected, every page leads to the first-run screen (`/welcome`). It is
one step: choose a provider, paste its API key (or sign in with ChatGPT, or use a model server
found **On this computer**), keep the suggested models and press **Connect and test**. The test
asks the cheapest chosen model for a short reply, which the provider may bill, and nothing is
saved unless it answers. Bazilion then creates a `default` Profile and a `default` Team.

![The first-run screen: tiles for a ChatGPT account, OpenAI, Anthropic, Google Gemini, a model server on this computer and another provider.](/screenshots/first-run.webp)

The same from a terminal:

```sh
bazilion provider connect anthropic     # asks for the key, without echo
bazilion provider connect lmstudio      # a model server at its usual address
# A ChatGPT plan: sign in, then connect.
bazilion auth openai login && bazilion provider connect openai-codex
```

`bazilion auth openai login` opens a browser and waits for the callback on `localhost:1455`; use
`--device-code` on a remote or headless machine. `provider connect` also takes `--key`, but a key
on the command line can land in your shell history; its prompt and the web page avoid that.
[Providers and models](/docs/configuration/#providers-and-models) has the other providers, how
to choose models and what a provider's state means.

## First Agent

**Start chatting** on the first-run screen spawns an Agent from the `default` template and opens
its conversation. From the workspace, use **Add the first Agent** or **New**, and say what it is
for so it starts working at once; or:

```sh
bazilion agent spawn --profile default --name first --role "Answers questions about my notes"
bazilion agent chat <agent-id> --message "say hi"
```

`agent chat` runs one turn and streams it; the web chat is the conversational client. Next, read
[Core concepts](/docs/concepts/) and the [web interface tour](/docs/web-interface/).

## Upgrade to 0.26.0

There are no database migrations. A release opens a home only when its schema matches the one it
ships; otherwise the daemon refuses to start and leaves the home untouched.

**From 0.26, 0.27 or 0.50 to 0.58:** 0.59.0 uses the same schema, so the
home opens as it is. Stop the daemon, run `npm install -g bazilion@0.59.0` and start Bazilion
again. Coming from 0.26 or
0.27, the web UI is laid out anew: see the [tour of the web interface](/docs/web-interface/).
Coming from 0.50 or earlier, providers you had switched on keep working and read "Not tested yet"
under **Setup → Models** until their first test.

**From 0.25.0 or earlier:** 0.26.0 reset the schema, so the home is refused. To move to the
current release:

1. Stop the daemon and copy the whole home somewhere safe, with any project a linked Team points
   to. A `bazilion backup create` archive works too, but only the release that wrote it can
   restore it.

   ```sh
   cp -a ~/.bazilion ~/.bazilion-0.25
   ```

2. Install the new release and reset the home. `uninstall` keeps installed skills; `--all`
   removes them too.

   ```sh
   npm install -g bazilion@0.59.0
   bazilion uninstall --yes
   ```

3. Start Bazilion again; it bootstraps a fresh home. Connect a provider and recreate the Teams and
   Agents you need.

   ```sh
   bazilion dashboard
   ```

Nothing is imported from the old home. Keep the copy, and the release that wrote it, for as long
as you need the old data. A refusal caused by the Node version means upgrading Node, never
resetting the home.

## Reset a home

```sh
bazilion uninstall                # asks once, then resets the home
bazilion uninstall --yes          # reset without asking
bazilion uninstall --yes --all    # also delete installed skills, then the emptied home
```

The reset deletes `bazilion.db`, `auth.json`, `profiles/`, `agents/`, `teams/` and `browsers/`,
and keeps `skills/`. It refuses while the daemon runs. Linked Team slots are unlinked; the
projects they point to are not touched. Provider keys and the Telegram setup must be entered
again afterwards.

## Work on the source

```sh
git clone https://github.com/rullopat/bazilion && cd bazilion
mise install                                  # Node 26.12.1 and pnpm 12.15.0 from mise.toml
pnpm install
pnpm tsx apps/cli/src/index.ts serve          # the daemon from source, no build step
cd apps/web && pnpm dev                       # the web UI on http://127.0.0.1:4322
```

From a checkout every `bazilion <cmd>` is `pnpm tsx apps/cli/src/index.ts <cmd>`. After switching
Node versions, run `pnpm rebuild better-sqlite3` (or `pnpm install --force`).

## Where to next

- [Core concepts](/docs/concepts/): Profiles, Agents, Teams, policy, memory and the mailbox.
- [The web interface](/docs/web-interface/): a tour of every page.
- [Tools & integrations](/docs/tools/): web research, the browser, MCP and files.
- [Coding with Agents](/docs/coding-environment/): host or Docker, and repository instructions.
- [Connecting Telegram](/docs/telegram/): one topic per Agent.
- [Configuration](/docs/configuration/): providers, settings, tokens and the on-disk layout.
- [How Bazilion is different](/docs/why-bazilion/): if you are coming from OpenClaw.
