---
title: Requesting verification from a specialist
description: Hand one captured change to an existing teammate and get back executor-owned evidence — the capability they receive, the refusals that protect the change, and how to read the result.
---

A coding Agent reports what it did. **Specialist verification** lets a coder — or you — hand one captured
change to an existing member of the same Team and get back evidence naming exactly what was exercised.
Requesting verification runs nothing by itself.

Available in Bazilion 0.18.0.

## Capture first, then request

Verification binds a specific captured change, so capture one on the
[Review](/docs/coding-review/) page first:

```sh
bazilion team review capture my-team
bazilion team verify create my-team --agent tester --snapshot <id> \
  --check 'pnpm test :: unit suite :: . :: 120' \
  --check 'pnpm test -- failing.spec.ts :: expected failure :: . :: 60'
bazilion team verify list my-team
bazilion team verify show my-team <requestId>
```

A `--check` is `command :: purpose [:: cwd] [:: timeoutSeconds]`. Up to eight are captured. The request
records them, the environment they were admitted into, and the change — and nothing reinterprets them
later. The same operations exist in the API (`/api/teams/:id/verifications`) and on the Team page's
**Verifications** section.

## What the specialist can do

Two things: read the request, and run one declared check — once.

There is no command, working directory, timeout or environment argument anywhere in that capability. A
check cannot be widened, swapped for a different one, or retried to get a better answer, and an
unrun check reads **not run** rather than passing by default. The daemon separately re-checks which
request and attempt the specialist is acting for, so a compromised turn cannot reach another request's
work. A verification turn has no shell of its own, no editor, no browser, no MCP access and no deployment
credential.

## What it refuses to do

| Situation | What happens |
| --- | --- |
| The tree moved after the capture | Blocked, with a fresh capture named as the remedy. It never quietly re-captures. |
| Captured for a container, daemon running host-backed (or the reverse) | Blocked — a check is never run somewhere you did not approve. |
| A check needs an approval nobody can give | Blocked. Verification runs unattended, so nothing is auto-approved. |
| The command contains protected credential material | Refused before it starts. |
| The captured evidence expired | Blocked, not re-captured. |

Each refusal comes back as a reason you can act on, and a refused capture writes nothing.

## How to read the result

- **Outcomes are per check**, and they stay distinct: succeeded, failed, skipped, blocked, timed out,
  cancelled, unknown.
- **A failing check is a result, not an error.** It is reported as a failure with its exit code, and the
  verification itself completed with evidence. "The change did not pass" and "the verification could not
  run" are never the same sentence.
- **A successful exit is evidence about the commands that ran** — not proof about later code, and not an
  approval to publish, merge or deploy.
- **Applicability is three-valued.** *Unchanged since capture*, *changed since capture* or *not checked*.
  It shows that the source moved; it never claims the change was relevant to the result.
- **A pruned receipt says so.** When retention removed the stored output, the outcome reports *receipt no
  longer available* rather than going silent.

The result returns to whoever asked through the normal messaging path, with references to the receipts
involved — those, and nothing more. Team Policy applies to that message like any other peer message.

## Declared output paths are advisory

You can declare where a check is expected to write generated output. That declaration is validated as
team-relative, recorded, and shown to the specialist — but it **does not confine writes**. Any write still
appears as a change against the capture. Treat it as documentation of intent, not a sandbox.

## Deliberately not included

Cross-Team verification, managed test databases, services or browser environments, framework parsers,
automatic retries, changing source to fix a failing check, and any automatic commit, push, pull request or
deployment. Verification produces evidence; what you do with it stays yours.

Read more in [reviewing what changed](/docs/coding-review/) and
[what changed in 0.18.0](/docs/previous-changes/).
