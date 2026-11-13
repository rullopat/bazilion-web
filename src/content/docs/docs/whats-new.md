---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.26.0 bundles Pi 1.4.0.
---

The latest four releases, newest first. Older releases are summarised on
[Previous changes](/docs/previous-changes/) and in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.26.0

Published **2026-11-13**. Bazilion 0.26.0 simplifies the whole product for a single local
operator: about 186,000 lines of code, tests and docs were removed, and the features you use stay
on both the CLI and the web UI. The embedded Pi engine stays at 1.4.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.26.0).

### Upgrade: back up, reset, start fresh

The database schema was reset to one clean-install schema, and a 0.25 (or older) home is refused
at startup. Nothing is migrated or imported. With the old daemon stopped:

```sh
cp -a ~/.bazilion ~/.bazilion-0.25     # keep the old home, and any linked Team projects
npm install -g bazilion@0.26.0
bazilion uninstall --yes
bazilion dashboard                     # bootstraps a fresh home
```

Then connect a provider again and recreate the Teams and Agents you need. See
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

## Bazilion 0.23.0

Published 2026-10-21, with Pi 1.0.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.23.0).

- Native OpenAI and ChatGPT web search, with guarded reading of the cited pages.
- Recovery for generated images whose delivery was interrupted.
- Workspace blocker reporting with limited cleanup attempts (removed in 0.26.0).
- Legacy MCP SSE retired; Streamable HTTP and stdio remained.
- Node 24.22.0+ or 26.4.0+ required. The schema changed: 0.22.0 and older homes needed a fresh
  home.
