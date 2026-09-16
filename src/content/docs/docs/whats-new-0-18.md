---
title: What's new in 0.18.0
description: Bazilion 0.18.0 lets a coder hand one captured change to a specialist and get back evidence naming exactly what was verified, on Pi 0.85.1.
---

Bazilion **0.18.0** closes the coding loop. A coder can hand one captured change to an existing member of
its Team and get back evidence that names the code, the commands, the environment and the outcomes — and
the specialist cannot do anything the request did not ask for. The public packages `bazilion`,
`@bazilion/client` and `@bazilion/api-types` move together to 0.18.0. The bundled engine remains
**Pi 0.85.1**.

## Hand a change to a specialist

Capture the change on the [Review](/docs/coding-review/) page, then ask one teammate to verify it — the
full surface is in [requesting verification from a specialist](/docs/coding-verification/):

```sh
bazilion team review capture my-team
bazilion team verify create my-team --agent tester --snapshot <id> \
  --check 'pnpm test :: unit suite :: . :: 120'
bazilion team verify show my-team <requestId>
```

The request binds the captured change, up to eight exact commands and the environment they were admitted
into as one immutable contract. Requesting verification **runs nothing** — the daemon claims the request,
revalidates it, and only then admits the specialist. The Team page has a matching **Verifications**
section.

## The specialist cannot do more than it was asked

Its entire capability is two tools: read the request, and run one declared check **once**. There is no
command, working directory, timeout or environment argument anywhere in it, so a captured check cannot be
widened, swapped for another, or retried for a better answer. The daemon re-checks which request and
attempt the specialist is acting for, so a compromised turn still cannot reach someone else's work — and a
verification turn has no shell of its own, no editor, no browser and no MCP.

## Refusal instead of substitution

- **Drift is blocked, not absorbed.** If the tree moved after the capture, the verification is blocked and
  a fresh capture is named as the remedy. It never silently re-captures and never tests a different tree.
- **A container request stays a container request.** Captured against an isolated environment but the
  daemon is running host-backed? The check is refused rather than run somewhere the requester did not approve.
- **An approval nobody can give blocks the check.** A verification runs unattended, so a command needing an
  interactive approval is an explicit blocker, never an auto-approval.
- **A credential is never run, and never retained.** A check containing protected credential material is
  refused before it starts, and retained output is redacted with a live secrets list — including a
  credential learned mid-run. A check runs with the scrubbed environment a sandboxed command gets, never
  the daemon's own.

## Evidence that says what it is

Every executed check records a receipt naming the change it was verified against. A non-zero exit is a
**result**, reported per check — not an error and not a verdict — so a failing test and a verification that
could not run stay clearly different. A check that was never run reads **not run**, never as a pass.

**The result comes back to whoever asked.** A coder that requests verification and yields gets the outcome
through the normal messaging path, with references to the receipts it did not have access to before —
exactly those, and nothing more. If policy holds that message, it is held like any other.

When a receipt has been pruned by retention, the outcome says **receipt no longer available** rather than
falling silent, so "the evidence is gone" is never confused with "no evidence was recorded".

## Declared output paths are advisory

Tell a request where a check is expected to write generated output and it is recorded, validated as
team-relative, and shown to the specialist — but it does not confine writes. Any write still shows as a
change against the capture. Read that as a statement of what is checked, not a sandbox claim.

## Upgrade carefully: alpha schema change

This release adds four tables. **A 0.17.x home cannot be upgraded in place.** Keep a complete backup and
use the matching old release to export work you need before a deliberate reset and fresh setup. An
older-schema backup is not a migration into 0.18.0. Read
[the upgrade procedure](/docs/getting-started/#upgrade-to-0180) and
[backup and recovery](/docs/backup-recovery/) before proceeding.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.18.0) for publication and
validation details. The [0.17 release history](/docs/whats-new-0-17/) remains available.
