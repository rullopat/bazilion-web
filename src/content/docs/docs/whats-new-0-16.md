---
title: What's new in 0.16.0
description: Bazilion 0.16.0 makes coding work agent-led — repository context, scoped commands and prepared execution during ordinary Agent tasks, with Pi 0.85.1.
---

Bazilion **0.16.0** makes coding work agent-led. You ask for the task; the Agent discovers its
instructions, inspects the runtime it was admitted into, and runs the commands it needs. The public
packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to 0.16.0.
The bundled engine remains **Pi 0.85.1**, including GPT-6 Astra support.

## Ask for the work, not a checklist

There is no Team check catalog or readiness form to fill in first. At the start of a coding turn the
Agent receives the applicable root repository instructions, and it can resolve a deeper scope on its
own through the `repository_context` tool. [Repository context](/docs/coding-environment/) reports
which `AGENTS.md` files apply, their precedence and fingerprint, the contained repository's Git
state, and source-backed command suggestions drawn from package manifests, `README.md` and
`CONTRIBUTING.md`.

A suggestion is evidence, not permission. Command suggestions are never approved or tested commands,
and a context fingerprint is not a code snapshot or a test result.

The Team page keeps the same inspection under **Advanced repository diagnostics**, and the CLI and
authenticated API expose it directly:

```sh
bazilion team context my-team
bazilion team context my-team --target apps/web/src/example.ts --json
```

## Run a finite command

The Agent checks the execution environment it was actually admitted into, prepares available
prerequisites, and runs a task-selected command with `coding_command`. Commands use the turn's
existing shell backend, approval policy, cancellation and cleanup, with a 1–300 second timeout.
They do not start background jobs or take another workspace lease, and no tool accepts a
caller-selected execution override.

Results appear beside the work in chat, with an expandable diagnostic tail. A command records its
purpose, exact command, scope, admitted posture, observed exit and timing, and distinguishes
success, failure, block, timeout, cancellation and interruption. **Success means that command
exited zero then** — it does not certify later edits or the whole repository.

Diagnostics retain a secret-redacted tail of at most 64 KiB per command. A Team keeps at most twenty
terminal receipts for seven days, and applicability expires after fifteen minutes. This is bounded
execution evidence, not a new runs-and-events system.

In a protected or Docker turn every command runs in a fresh network-disabled container: workspace
files persist, temporary files do not, and the root filesystem and Team memory are read-only to
shell commands. If a package must be downloaded or the image lacks a tool, the Agent names the
missing prerequisite and yields rather than silently switching to host execution.

## Hand work to a teammate

An Agent can send a scoped request to an existing teammate and include a receipt reference. The
sender ends its turn so the workspace is released, and the existing inbox scheduler admits the
teammate. Merely sharing a Team is not enough: the producer's message, the current communication
policy and current Team membership must all permit access before the evidence can be read.

## Prepare and recover workspaces

Overlapping Agent workspaces are coordinated rather than raced. A command keeps its turn's
ownership until process or container cleanup is confirmed, and cancellation alone is not proof of
cleanup. Uncertain cleanup leaves the workspace blocked for recovery instead of recording a
fabricated success. After a restore, copied process or container records are not adopted as
permission to terminate the original home's resources, so a backup containing active work stays
recovery-blocked.

## Optional runtime defaults

Teams can set optional runtime defaults for image, directory and a small allowlisted environment
(`CI`, `NO_COLOR`, `TZ`). These are troubleshooting and repository-specific conveniences, not a
per-task checklist, and saving them never executes anything:

```sh
bazilion team environment show default
bazilion team environment configure default --file environment.json
```

## Upgrade carefully: alpha schema change

This release changes the canonical database schema. **A 0.15.x home cannot be upgraded in place.**
Keep a complete backup and use the matching old release to export work you need before a deliberate
reset and fresh setup. An older-schema backup is not a migration into 0.16.0. Reset removes Agents,
Teams, templates, credentials and stored results; linked external Team directories remain untouched.
Read [the upgrade procedure](/docs/getting-started/#upgrade-to-0180) and
[backup and recovery](/docs/backup-recovery/) before proceeding.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.16.0) for publication
and validation details. The [0.15 release history](/docs/whats-new-0-15/) remains available.
