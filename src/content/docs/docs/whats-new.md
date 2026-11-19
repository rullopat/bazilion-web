---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.26.1 bundles Pi 1.5.2.
---

The latest four releases, newest first. Older releases are summarised on
[Previous changes](/docs/previous-changes/) and in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.26.1

Published **2026-11-19**. A patch release: a fix in model selection, current model catalogs and a
ChatGPT sign-in fix on macOS. The embedded Pi engine moves from 1.4.0 to 1.5.2. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.26.1).

### Upgrade: install and start again

The database schema is unchanged, so a 0.26.0 home opens as it is. Stop the daemon, then:

```sh
npm install -g bazilion@0.26.1
bazilion dashboard
```

A 0.25 or older home still needs the reset described in
[Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260).

### Fixed

- **Model list edits reach Agent templates.** The `default` Profile is created with the first
  model on a provider's list and used to keep it, so correcting a mistyped model id on `/config`
  left new Agents on the old one. Saving a list without a model that a Profile defaults to now
  moves the Profile to the provider's first remaining model, or to the first available model of
  another provider when none remains. The web save message and `bazilion provider models-set`
  report each move. A Profile on a model that was never listed and an Agent's own model override
  are not changed.
- **ChatGPT sign-in on macOS.** **Connect ChatGPT** on `/config` opens the sign-in page with the
  system `open`. A terminal app that puts its own `open` first on the daemon's `PATH` could keep
  the page in its built-in browser and leave the button on "opening browser…".

If a Profile already points at a model you removed before upgrading, set it once:
`bazilion profile update default --model <provider:model>`.

### Changed

- The embedded Pi engine moved to 1.5.2 (AI, agent core, coding agent and MCP client). The model
  catalogs on `/config` follow Pi's: GPT-6.1 Terra, Claude Fable 5.2 and Kimi K3.1 Pro are among
  the additions, and ids Pi dropped are no longer offered.
- New provider: Qwen Token Plan (Individual, CN), `qwen-token-plan-individual-cn`, with
  `QWEN_TOKEN_PLAN_CN_API_KEY`.

## Bazilion 0.26.0

Published **2026-11-13**. Bazilion 0.26.0 simplifies the whole product for a single local
operator: about 186,000 lines of code, tests and docs were removed, and the features you use stay
on both the CLI and the web UI. The embedded Pi engine stays at 1.4.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.26.0).

### Upgrade: back up, reset, start fresh

The database schema was reset to one clean-install schema, and a 0.25 (or older) home is refused
at startup. Nothing is migrated or imported: back up the old home, run
`bazilion uninstall --yes` and start Bazilion again to bootstrap a fresh one, then connect a
provider and recreate the Teams and Agents you need. The current commands are in
[Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260).

### Removed

- Review packets, specialist verification and publication to a code host. The Team **Review**
  diff page and file feedback stay ([Reviewing what changed](/docs/coding-review/)).
- The communication approval queue, Team Policy template lineage and denial history. Team Policy
  is now plain allow edges with an open or restricted mode per Team, and Team templates are plain
  rosters.
- The workspace lease and its recovery commands. Teammates run concurrently again, and
  `wait_for_reply` works between them.
- The coding evidence layer: the `coding_*` tools, receipts, retained command logs and source
  snapshots. Live output now streams for every tool, in the web UI and the CLI.
- The native Bubblewrap sandbox and the separate protected turn surface.
- Device pairing codes and token scopes.
- macOS-specific process, keychain and Git layers.
- `@bazilion/client` and `@bazilion/api-types` are no longer published to npm; only the
  `bazilion` package is.

### Changed

- Docker is the only sandbox. `BAZILION_BASH_SANDBOX=off|docker` applies to every turn: chat,
  Telegram, follow-ups, schedules and inbox wakes. With `off`, unattended turns run on the host
  with the same tools as chat.
- The bootstrap token works at the web login. Browser sessions last until 30 days without use,
  and device tokens do not expire unless created with `--expires-days`.
- Scheduled triggers and learning reviews run once per occurrence, without retries. Failures show
  in Attention and in the trigger history with the real error.
- Bazilion's own credentials (ChatGPT sign-in, MCP tokens, Telegram bot token, bootstrap token) no
  longer reach agent shells or MCP stdio servers.
- A chat sent while its Agent is compacting, resetting or archiving is refused as busy.
- CLI flags renamed: `bazilion token create --expires-days` and `bazilion login --skip-verify`.
- Team memory keys must end in `.md`.
- Linux is the tested platform; macOS runs commands on the host and is untested.

Many fixes came along the way, including a path traversal in skill deletion, CSRF and Origin
checks for web server functions, attachments over 1.5 MB, Fireworks endpoints, files lost in queued
follow-ups, Telegram members unable to chat and a hung MCP server slowing every turn.

## Bazilion 0.25.0

Published 2026-10-30, with Pi 1.4.0. An alpha that required Node `^26.12.1` and retired Node 24.
See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.25.0).

- Apple Silicon Mac coding as explicitly unisolated host execution, with private-worktree Git
  inspection, daemon-owned MCP stdio and managed browsing on an Agent-private keychain.
- A Linux native sandbox (unprivileged Bubblewrap with seccomp) next to the Docker sandbox.
  0.26.0 removed the native sandbox again.
- The schema changed: 0.24.0 and older homes were refused and needed a fresh home.

## Bazilion 0.24.0

Published 2026-10-23. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.24.0).

- Ordinary interactive Agent chat on macOS, with guarded repository-instruction reads.
- The embedded Pi engine moved to 1.4.0 (AI, agent core, coding agent and MCP client).
- `bazilion doctor` and `/config` separated installation health from execution readiness.
- The 0.23 schema was unchanged, so a 0.23 home opened as it was.
