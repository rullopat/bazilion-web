---
title: What's new in 0.11.0
description: Bazilion 0.11.0 adds opt-in Docker shell isolation, dangerous-command approval, durable scheduled dispatches, verified backup and restore, and worker-safe ChatGPT OAuth refresh.
---

Bazilion 0.11.0 makes long-running and unattended Agents safer and more
recoverable. The three public packages move together: `bazilion@0.11.0`,
`@bazilion/client@0.11.0`, and `@bazilion/api-types@0.11.0`.

It also includes the 0.10.0 web application refresh: a responsive management
shell, clearer Team Policy lifecycle handling, and explicit interval/cron
trigger instructions in place of the old `HEARTBEAT.md` convention.

## Opt-in Docker shell isolation

`BAZILION_BASH_SANDBOX=docker` replaces Pi's host-backed coding tools with a
containerized `bash` for each invocation. The container has:

- no network and a read-only root,
- a temporary `/tmp` and scrubbed environment,
- the Team workspace as its only writable mount,
- read-only Team memory, Agent inputs, and attached skills.

Only a local Unix-socket Docker context and a pre-existing compatible image are
accepted. Missing Docker, invalid mounts, remote contexts, and images declaring
implicit volumes fail closed without falling back to host execution.

The default remains `off`, preserving the normal Pi coding-tool surface.

## Dangerous-command approval

`BAZILION_BASH_APPROVAL=dangerous` pauses classified commands for a
turn-scoped decision. Interactive web and TTY CLI turns can approve or deny;
non-interactive turns deny automatically. Timeout, cancellation, and worker
disconnect clean up pending requests.

Shell approval is deliberately separate from Team Policy communication
approval: it is ephemeral and guards one command, not a durable workflow.

## Durable scheduled dispatches

Interval and cron occurrences are now persisted before execution. The
scheduler:

- coalesces later occurrences while one dispatch remains open,
- defers busy Agents without losing work,
- recovers expired leases after restart,
- retries provider and turn failures within a bounded state machine,
- keeps approval-gated occurrences pending until their durable grant executes.

Inspect recent outcomes in the Agent's Triggers tab or with
`bazilion trigger history <id>`.

## Consistent online backup and staged restore

`bazilion backup create` now archives a verified SQLite online snapshot instead
of live database/WAL state. `bazilion backup restore` validates the archive,
links, auth/database pair, SQLite integrity, foreign keys, and exact schema in a
staging directory before installing it atomically.

Restore also rebases Profile and Agent paths for a different destination home,
preserves contained relative symlinks, rejects escaping targets, coordinates
exclusive ownership with the daemon, and retains a recovery marker if a crash
interrupts the directory swap.

## ChatGPT OAuth survives long turns

An expiring `openai-codex` access token can now refresh during a worker turn
through provider-, Agent-, and turn-bound daemon IPC. Refresh credentials stay
inside the daemon-owned encrypted secrets table; only the renewed access token
crosses the worker boundary. Concurrent refreshes are single-flighted and
pending IPC calls are cleaned up on cancellation or disconnect.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.11.0)
for the published artifacts and package-level changelog.
