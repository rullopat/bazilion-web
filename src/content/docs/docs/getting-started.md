---
title: Getting started
description: Install Bazilion, open the local dashboard, and finish first-run setup in a few minutes.
---

Bazilion ships as an npm package that bundles the CLI, daemon, and production
web UI. The daemon self-bootstraps its workspace on first run — there is no
separate `init` step.

**0.25.0 is alpha software for operator testing.** Already using Bazilion? Read the
[upgrade procedure](#upgrade-to-0250) first: 0.24.0 and older homes require preservation
and an explicit choice of clean rebootstrap, not an in-place import.

## What you need

- **Node.js 26.12.1+ within 26.x only** (`^26.12.1`) — Node 24, earlier 26.x and other majors refuse before opening state.
- **A model provider** — an API key for Anthropic, OpenAI, or Google, a
  ChatGPT account for OAuth, or a local backend (Ollama / LM Studio).

## Install and open the dashboard

The fastest path is the one-line installer:

```sh
curl -fsSL https://bazilion.com/install.sh | bash
bazilion dashboard
```

On Windows PowerShell (unsupported — see the platform boundary below):

```powershell
irm https://bazilion.com/install.ps1 | iex
bazilion dashboard
```

:::note[Platform boundary]
**Linux and trusted Mac operation are supported within explicit alpha limits.** Actual Mac
qualification uses **macOS 27.0.1 arm64 / Node 26.12.1**; the tested 27.x major line is accepted,
not every minor, Intel or older Mac qualified. Mac coding is **trusted, unisolated host execution**
(`BAZILION_BASH_SANDBOX=off`). Native/Docker selections and isolation-required coding or specialist
command checks refuse without downgrade. Fixed-tool reviewers, guarded Git, daemon-owned MCP and
browsing retain independent admission; MCP stdio is no longer Linux-only.

**Mac headed/desktop-browser testing is deferred**, not passed. Actual non-GUI browser, SSRF and
shutdown/restart/restore evidence does not prove live-model/generated-image or arbitrary-site access.
Linux native Bubblewrap/seccomp and retained Linux Docker have separate per-turn admission.
See the [0.25 limits](/docs/whats-new/#bazilion-0250) and [tool boundary](/docs/tools/).

**Windows remains unsupported**: no current end-to-end qualification or CI covers it.
The PowerShell script is retained for contributors, not as a support claim.
:::

Already have a supported Node runtime? Use npm directly:

```sh
npm install -g bazilion
bazilion dashboard
```

On first boot `bazilion dashboard`:

- creates `~/.bazilion/` (profiles, agents, teams, skills, logs),
- creates the canonical SQLite schema on a fresh home; incompatible older homes are refused,
- mints a bootstrap token, stores its row, and writes it to
  `~/.bazilion/auth.json`,
- on later starts, requires the database and auth file to be present together
  and the bootstrap token to match its active database row,
- binds the HTTP API on `127.0.0.1:4321`,
- opens the bundled web UI on `http://127.0.0.1:4322`.

## Hack on the source

```sh
git clone https://github.com/rullopat/bazilion
cd bazilion
npm install -g pnpm@12.15.0 # product development baseline
pnpm install

# Start the source daemon, then run the web UI in another terminal.
pnpm tsx apps/cli/src/index.ts serve
cd apps/web && pnpm dev
```

Open `http://127.0.0.1:4322`. On a clean install, log in with the **bootstrap
token** — the `token` value in `~/.bazilion/auth.json`, written on first
`bazilion dashboard` or `bazilion serve`. It is accepted by browser login only
until provider setup is complete. Bazilion exchanges it for an internal
expiring device identity and a bounded browser session; the bootstrap bearer is
never retained in browser cookies.

The guided first-run path then takes you through three steps:

1. Search or browse configured, recommended, local, and additional providers.
2. Add credentials or a local endpoint, enable the provider, and save at least
   one model. A connection test sends a real model request, so the provider may
   charge its normal token cost.
3. Crossing the setup threshold seeds the `default` Agent template and
   `default` Team, then offers a direct action to spawn the first Agent.

After setup, the first-run browser session remains valid until its normal
expiry. Subsequent browser logins and native pairing use separately named,
expiring device credentials rather than the bootstrap token.

For ChatGPT OAuth, the normal CLI flow opens a browser and receives its callback
on local port 1455. Use device-code login when the browser is remote or that
callback is unavailable:

```sh
bazilion auth openai login --device-code

# Source checkout: run from the Bazilion repository root.
pnpm tsx apps/cli/src/index.ts auth openai login --device-code
```

See [The web interface](/docs/web-interface/) for a full tour of the UI.

## Upgrade to 0.25.0

**The canonical alpha schema changed. Genuine 0.24.0 and older homes refuse unchanged.** There
is no ALTER migration, legacy importer or old-backup compatibility adapter. A matching current
0.25 home reopens normally; do not reset it merely to update. Downgrades are unsupported.

1. Safely stop the old dashboard/services and finish active work. Unknown ownership or cleanup
   remains blocked: never delete resource rows, browser slots, locks or owner markers to proceed.
2. Preserve the **entire old home**, including paired `bazilion.db` / `auth.json`, transcripts,
   Results, skills and Team files. Preserve external linked Team work separately. Keep the matching
   old binary/runtime/schema for inspecting/exporting old state or restoring old archives. No
   automatic snapshot is promised before refusal.
3. Install supported **Node 26.12.1+ within 26.x**. For an npm installation, update the binary:

   ```sh
   npm install -g bazilion@0.25.0
   bazilion --version
   ```

4. Choose a **new empty absolute `BAZILION_HOME`**, leaving the old home untouched, or separately
   authorize a destructive [reset](#reset-a-home) after preservation and confirmed safe shutdown.
   For the fresh-home option, consistently use your chosen path for daemon and CLI:

   ```sh
   BAZILION_HOME=/path/to/new-empty-home bazilion dashboard
   ```

5. Complete provider setup again and deliberately recreate needed Teams/Agents. Old credentials,
   Results and conversations are **not automatically imported**. Native modules must be installed
   or rebuilt with the runtime that starts Bazilion; source development uses pnpm 12.15.0.

For a matching current home, restart the dashboard or managed services rather than starting a
second copy. Doctor's successful exit means structural installation health only, not provider,
ordinary-turn or protected-work execution. See [readiness](/docs/operations/#read-installation-and-execution-readiness-separately).

## Upgrade to 0.24.0

**Historical 0.24 instructions only.** For the current release, use [0.25 steps](#upgrade-to-0250).
The continuity below does not make a 0.23/0.24 home compatible with 0.25.

**A valid 0.23 home can reopen with 0.24; the canonical schema is unchanged.** A genuine
0.23 fixture retained its Team sentinel and paired auth bytes across two candidate starts.
That is bounded continuity evidence, not a general transcript, backup or cross-platform guarantee.
Do not reset a valid 0.23 home merely to update.

Stop the dashboard (Ctrl+C), or stop managed daemon/web services. Preserve the complete home,
keeping `bazilion.db` and `auth.json` together, and preserve external linked Team work separately.
Then, for an npm installation:

```sh
npm install -g bazilion@0.24.0
bazilion --version
bazilion dashboard
```

Restart managed services instead of starting a second dashboard. If Node changes, reinstall
native dependencies using the runtime that starts Bazilion. Doctor's zero exit now means
structural installation health only; protected automation must separately inspect
`protectedWorkBaselineReady` in authenticated health details. See [readiness](/docs/operations/#read-installation-and-execution-readiness-separately).

## Upgrade to 0.23.0

This historical heading retains the **0.23 schema boundary**, also enforced by 0.24.
Current 0.25 adds a new boundary; use the [current upgrade steps](#upgrade-to-0250) for installation commands.
**Older homes, including 0.22.0, do not upgrade in place.** The alpha schema contract is clean-install
only; legacy SSE-capable schemas are incompatible even without configured SSE rows. Startup refuses
rather than altering/importing them. No automatic snapshot is promised before refusal.

Before an explicitly authorized [reset](#reset-a-home), preserve the **entire old home** with
`bazilion.db` and `auth.json` together, plus external linked Team work separately. Use the matching
old release to inspect/export old state or restore old archives. Alternatively, keep it untouched
and set `BAZILION_HOME` to a new empty directory. Old credentials/Results are not automatically
imported into the new home. **Downgrades are unsupported.**

## Reset a home

Bazilion checks the database schema and the database/bootstrap identity pair
before background work or the HTTP listener starts. If startup reports an
incompatible or mismatched home, back up the complete `~/.bazilion` directory
first, including paired DB/auth and external Team work. Shut down safely and obtain explicit
operator authorization before the destructive reset below. If ownership is uncertain, stop and
follow the reported guidance; never manually remove browser profiles or owner/lock markers.
Then reset and bootstrap:

```sh
bazilion uninstall --yes
bazilion dashboard
```

The standard reset removes the database, `auth.json`, Agent templates, Agents,
and Teams while preserving logs and installed skills. Linked Team targets are
never deleted. Add `--all` only for an intentional full wipe.

When developing from source, run this from the Bazilion repository root after
changing Node versions, using the same Node runtime that starts Bazilion:

```sh
pnpm rebuild better-sqlite3
```

## First agent

The web sidebar can spawn from the `default` Agent template. From the CLI:

```sh
bazilion agent spawn --profile default --name first --team default
bazilion agent chat <agent-id> --message "Say hello"
```

## Where to next

- [Daily operations](/docs/operations/) — readiness, schedules, approvals, and learning.
- [Backup and recovery](/docs/backup-recovery/) — archive scope and a restore rehearsal.
- [Private access](/docs/private-access/) — private HTTPS and device credentials.

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
