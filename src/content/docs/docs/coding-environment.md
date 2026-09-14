---
title: Coding during an Agent task
description: Give an Agent a coding task and let it discover repository instructions, inspect its admitted runtime, run scoped commands and hand work to a teammate.
---

Available in Bazilion 0.16.0. Operator inspection is available in the web UI, the CLI and the
authenticated API.

Ask an Agent to do the work: **“Fix this bug and run the relevant test.”** There is no Team
checklist to fill out first. The Agent receives root repository instructions when its turn starts,
can resolve a deeper scope, discover source-backed commands, check the execution environment it was
actually admitted into, prepare available prerequisites, and run a finite command. Results appear
beside that work in chat, with expandable output. A failed test is a result to investigate — it
does not send you to a configuration dashboard.

## What the Agent can do

| Tool | Purpose |
| --- | --- |
| `repository_context` | Resolve applicable instructions, Git state and suggested commands for a scope |
| `coding_environment` | Describe this turn's actual host, Docker or protected posture, directory and restrictions |
| `coding_command` | Execute a task-selected runtime, dependency, preparation, build or test command |
| `coding_receipt` | Read retained command evidence and check whether its recorded inputs still apply |

Commands use the turn's admitted shell backend, approval policy, cancellation and resource cleanup,
with a 1–300 second timeout. They do not start independent jobs or acquire another workspace lease,
and no tool accepts a caller-selected Team or host execution override.

Pi owns the model and tool loop and the canonical session transcript. Bazilion supplies bounded
repository context and the execution adapter. Existing Bazilion-managed skills remain available;
this does not activate ambient Pi extensions or repository-provided executable plugins.

## Repository instructions and discovered commands

Repository context reports root and applicable nested `AGENTS.md` files with their contents, scope,
precedence and SHA-256 fingerprints. A missing instruction file is normal. Platform and runtime
policy and explicit operator instructions take priority; repository instructions specialize general
Agent preferences for repository work, and deeper files govern only their own subtree. Private Agent
documents are labelled **Agent instructions** separately. Repository text cannot grant execution
authority or change Team Policy.

Alongside instructions, the report includes the contained repository's Git state — branch or
unborn/detached state, plus staged, unstaged, untracked and conflicted counts — and command
suggestions drawn from `package.json`, `pnpm-workspace.yaml`, `README.md` and `CONTRIBUTING.md` on
the target ancestry. Git state is not attributed to any particular Agent, and discovery does not
scan workspace globs, dependency trees or generated folders.

A suggestion is evidence, not permission. Suggestions are neither approved nor tested commands, and
conflicting or ambiguous candidates stay visible. A context fingerprint is not a full code snapshot,
an environment-readiness result or a test receipt.

## Execution posture and missing prerequisites

The Agent can inspect the posture its turn was admitted into before running anything. In a protected
or Docker turn every command runs in a fresh network-disabled container: workspace files persist,
temporary files do not, and the root filesystem and Team memory are read-only to shell commands.
There are no ambient host credentials or package caches.

The Agent can install from workspace-local artifacts or an available offline package store under its
existing authority. If a package must be downloaded, a service is unavailable, or the image lacks a
required tool, it names the missing prerequisite and yields. It cannot silently switch to host
execution, and network-enabled dependency provisioning is outside this release.

A local toolchain image is an installation prerequisite for Docker execution, not a per-task
checklist. Host execution remains host execution under its existing policy.

## Reading a command result

A receipt records the purpose, exact command, scope, admitted posture and image, observed exit, time
and bounded diagnostic output. Terminal states distinguish success, failure, block, timeout,
cancellation and interruption.

**Success means that command exited zero at that time.** It does not certify later edits, other
commands or the whole repository. Applicability compares bounded instruction, manifest and lockfile
identities, runtime selection and workspace identity, and expires after fifteen minutes; it does not
recursively hash installed dependencies or code. Restart or restore invalidates input evidence, and
reading a receipt never reruns work.

Diagnostics retain a secret-redacted tail of at most 64 KiB per command. A Team keeps at most twenty
terminal receipts for seven days, a turn permits at most 64 receipts, and active commands are never
evicted. This is bounded execution evidence, not a general runs-and-events system.

Already-delivered cards stay visible in the open chat after the turn completes. Reloading the page
does not independently republish their private output; the Agent can retrieve retained evidence in a
new authorized turn. The canonical Pi transcript retains the private result, and public history
projections do not bypass existing transport approval.

## Handing work to a teammate

An Agent may send a scoped request to an existing teammate through `send_message`. If the teammate
needs the same workspace, the sender ends its turn so the workspace can be released, and the existing
inbox scheduler admits the teammate, which performs the work and replies. Waiting for that reply
while holding the same workspace is rejected with handoff guidance.

A producer can include a `coding-receipt:<id>` reference in its message. The recipient supplies that
message ID when reading the evidence. Merely belonging to the same Team is insufficient: the producer
message, current communication policy and current Team membership must all permit access. Old recipes
in Team memory can help choose commands, but they are not fresh evidence.

## Workspace ownership and recovery

Canonical workspace ownership covers aliases and overlapping roots, including Teams without saved
defaults. A command keeps its Agent turn's ownership until process or container cleanup is confirmed,
and cancellation is not proof of cleanup. Uncertain cleanup leaves the workspace blocked for recovery
and never records a fabricated success.

A lost host worker may leave separate process groups, so restarting the daemon alone cannot prove
those commands stopped; the same-boot workspace stays blocked while cleanup is uncertain. A host
restart proves the old local processes are gone, and Docker recovery uses recorded container
identities. Restore never adopts copied process or container records as permission to terminate the
original home's resources, so a backup containing active work remains recovery-blocked after restore.
Prefer backups taken after all Agent turns finish.

## Operator inspection and optional defaults

The Team page retains passive inspection under **Advanced repository diagnostics**, alongside optional
runtime defaults. Inspection itself never runs project commands. The CLI and authenticated API
expose the same read:

```sh
bazilion team context my-team
bazilion team context my-team --target apps/web/src/example.ts --json
```

The authenticated API is `GET /api/teams/:id/repository-context?target=...`, and refreshing captures
a new report rather than serving a cached one. Optional runtime defaults are troubleshooting
conveniences for a repository-specific image or directory, not a per-task checklist:

```sh
bazilion team environment show default
bazilion team environment configure default --file environment.json
```

`GET/PUT /api/teams/:id/coding-environment` reads and saves those defaults; later writes require the
current revision, and saving never executes commands. Allowed environment values are only `CI`,
`NO_COLOR` and `TZ`. Arbitrary credentials and startup hooks are rejected, and Docker defaults do not
change a host turn's directory or environment.

There are no named checks, readiness badges, probe history or review-and-run workflows.

## Bounds

Instruction reads are limited to 64 KiB per file, 128 KiB total and 16 nested directories. Command
sources are limited to 32 files, 64 KiB per file and 256 KiB total, with at most 32 candidates, and
the report itself is limited to 256 KiB. Limits produce explicit incomplete states; partial
instruction bytes are never presented as complete guidance.

Git inspection uses a disposable, bounded copy of Git metadata with a Bazilion-authored config, so
hooks, filters, includes and alternates are never activated. The registered Team-root symlink is
supported; nested links, instruction-file links, traversal and external Git metadata links are
rejected, and Git never discovers an ancestor repository outside the Team.

If an applicable instruction is unsafe, unreadable, oversized or changing during capture, the scope
is incomplete. Initial preparation fails with inspection guidance, and a targeted mid-turn failure
removes the previous scope from the active context and tells the Agent not to edit the blocked scope.
This guidance does not mechanically police arbitrary shell commands.
