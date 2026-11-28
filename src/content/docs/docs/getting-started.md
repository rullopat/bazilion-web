---
title: Getting started
description: Install Bazilion, open the dashboard, connect a provider and spawn your first Agent.
---

Bazilion ships as one npm package, `bazilion`, with the CLI, the daemon and the web UI. The daemon
creates its home on first start; there is no separate `init` step.

## What you need

- **Nothing to install first** with the one-line installer: it brings its own Node.js. With npm,
  **Node.js `^26.12.1`** (26.12.1 or a later 26.x); the CLI refuses any other Node version.
- **A model provider**: a ChatGPT account, an API key (OpenAI, Anthropic, Google and many others)
  or a local server (LM Studio, Ollama, llama.cpp).
- **macOS or Linux.** Linux is the tested platform; macOS runs commands on the host. Windows is
  not supported yet.

## Install on a Mac

1. Open **Terminal**: press ⌘ Space, type `Terminal` and press Return.
2. Paste this line and press Return:

   ```sh
   curl -fsSL https://bazilion.com/install.sh | bash
   ```

3. Wait a minute or two. Bazilion opens in your browser, already signed in, on its first-run
   screen.

That is the only time you need Terminal. Bazilion keeps running in the background and starts by
itself when you log in. Next time, open the **Bazilion** app from Applications, Launchpad or
Spotlight. To update, run the same line again.

![The Bazilion app's icon: the Bazilion cat on a cream rounded square.](/screenshots/bazilion-app-icon.webp)

The installer asks for no password and changes no settings. It puts its own Node.js and
Bazilion in `~/.local/share/bazilion`, a `bazilion` command in `~/.local/bin`, the app in
Applications, and your data in `~/.bazilion`. macOS may say that `node` added an item that can
run in the background: that is Bazilion, listed under **System Settings → General → Login
Items**. To remove the app and stop it running, `~/.local/bin/bazilion app remove`;
`bazilion uninstall` then deletes your data.

## Install on Linux

The same line installs its own Node.js and Bazilion, without an app; then start Bazilion, which
opens your browser signed in:

```sh
curl -fsSL https://bazilion.com/install.sh | bash
~/.local/bin/bazilion dashboard
```

## Install with npm

With a supported Node already installed (or run each command as `npx bazilion …`):

```sh
npm install -g bazilion
bazilion dashboard
```

`bazilion dashboard` starts the daemon on `127.0.0.1:4321` and the web UI on `127.0.0.1:4322`,
and opens your browser, signed in (`--no-open` skips that). On a Mac, `bazilion app install`
gives this install the Bazilion app and runs it in the background. On first start the daemon
creates `~/.bazilion` (or `$BAZILION_HOME`) with its database and a bootstrap token in
`auth.json`. `bazilion serve` starts only the daemon.

## Sign in and connect a provider

The installer, the Bazilion app, `bazilion dashboard` and `bazilion open` open the browser
signed in, with a link that works once. Another browser or device signs in with a token:
`bazilion token show-local` prints the bootstrap token, and the CLI reads it by itself.

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

## Upgrade

Run the one-line installer again, which updates Bazilion and, on a Mac, restarts it; or stop the
daemon, run `npm install -g bazilion@0.66.0` and start Bazilion again. If you installed with npm
first and then ran the installer, the installer's copy runs: remove the old one with
`npm uninstall -g bazilion`.

A Bazilion tab left open across an upgrade shows **Bazilion was updated** once Bazilion is back:
choose **Reload** to use the new version. What you typed and had not sent is kept. Tabs opened
before 0.65.1 cannot say so: reload them once with the browser.

Since 0.63.0 an upgrade keeps your home. When it starts, the daemon brings the database up to the
new release:

1. It copies the database to `upgrades/bazilion-schema-<version>-<time>.db` in the home.
2. It applies the release's migrations in one transaction and checks the result against the
   schema the release ships; only then does it commit.

When a migration fails, nothing it did is kept: the daemon refuses to start, says why and leaves
the home as it was. Report the message; do not reset the home. A refusal caused by the Node
version means upgrading Node, never resetting the home. Homes from 0.26.0 to 0.62.0 are
recognised and upgraded from there. Copies in `upgrades/` stay until you delete them; backups
leave them out.

0.66.0 removed reviewed learning. Upgrading from an earlier release adds each Agent's approved
private lessons to its `AGENTS.md`, so it keeps following them; lessons for the whole Team stay
notes in its memory. Lessons waiting for a decision and the history of reviews are dropped, and
the copy in `upgrades/` keeps them.

**Going back to an earlier release.** A release refuses a home that a later one has already
upgraded. Releases up to 0.62.0 call it incompatible and suggest a reset: do not reset it. Stop
the daemon, copy the file from `upgrades/` over `bazilion.db`, delete `bazilion.db-wal` and
`bazilion.db-shm`, and install the earlier release. What changed in the database since the upgrade
is lost; conversations, memory and Team workspaces are files and are not touched.

Coming from 0.26 or 0.27, the web UI is laid out anew: see the
[tour of the web interface](/docs/web-interface/). Coming from 0.50 or earlier, providers you had
switched on keep working and read "Not tested yet" under **Setup → Models** until their first test.

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
