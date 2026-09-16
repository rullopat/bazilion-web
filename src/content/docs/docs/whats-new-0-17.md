---
title: What's new in 0.17.0
description: Bazilion 0.17.0 makes coding work reviewable — live command progress, retained diagnostics, and read-only Git change review with source-bound evidence, on Pi 0.85.1.
---

Bazilion **0.17.0** makes coding work reviewable. You can watch a command while it runs, reopen what it
actually printed after the container is gone, and inspect the changes an Agent produced against an
explicit baseline — with the source state each result was produced against recorded as evidence. The
public packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to 0.17.0.
The bundled engine remains **Pi 0.85.1**.

## Watch a command while it runs

A running `coding_command` now streams a bounded, **cumulative** output tail beside the work in chat.
Each update replaces the previous tail for that call, so a reconnect or a slow client never sees
duplicated output, and live progress never releases anything by itself. A rerun or correction is still
ordinary Agent input.

## Reopen what a command printed

Diagnostics are retained after the command finishes — up to 2 MiB per command, 256 MiB per home, for
seven days — so a failure can be investigated after the container has disappeared. Retention states are
explicit and truthful: `available`, `truncated`, `expired`, `deleted`, `unavailable`. Truncation is a
stored fact rather than a guess, because redaction can change how long output is.

**Keeping output and sharing it are separate decisions.** Captured bytes stay private until something
source-owned releases them: your own terminal result, an authorized teammate read, or an approved
message. A log that was never shared reads as *not shared* — never as an empty result.

```sh
bazilion team log my-team <commandId> --search "cannot find module"
```

## Review what changed

`bazilion team review` inspects a Team's registered repository **read-only**, and the Team page has a
matching **Review** section:

```sh
bazilion team review show my-team
bazilion team review show my-team --patch src/app.ts
bazilion team review capture my-team --include notes.md
```

- **Baselines are pinned.** A branch name is resolved to a concrete commit when the review loads, so a
  moving branch tip cannot silently rewrite what you are looking at.
- **Diffs are bounded** and say when they were cut. Patches are opt-in, and one file can be requested
  without paying for the rest. Renames, deletes, mode changes and binary files are labelled for what
  they are.
- **Untracked content is opt-in per path.** Names are listed; content is read only when you name it.
  Ignored files are never listed, and credential-shaped or Bazilion-owned paths are refused and counted
  rather than quietly dropped.
- **Inspection changes nothing.** No repository-configured helper runs — no `diff.external`,
  `fsmonitor`, textconv or filters — the work tree is reached through a pinned directory rather than a
  path, unsupported layouts are refused with guidance, and the repository is left byte-identical.
- **A Team that is not a repository says so**, instead of showing an empty change list that would read
  as "nothing changed".

## Tie a result to the version it tested

A command receipt now records the source state at its own execution boundary, and a **source snapshot**
is bounded code evidence: HEAD, the index, a digest of every path differing from the pinned baseline,
and a digest of each explicitly included untracked file. It stores paths and digests — **never file
content** — and its id is content-addressed, so identical trees share an id and an incomplete capture
can never be mistaken for an exact one.

The chat card reports whether a result still applies, in one of three states — *unchanged*, *changed*,
or *unknown* — and never as a pass. A result with no captured source reads **Not checked**. Feedback
about a file carries the snapshot it was written against, so later edits mark it **stale** instead of
silently re-pointing at different lines.

Read [reviewing what changed](/docs/coding-review/) for the full surface.

## Two fixes worth knowing

- **Unknown models now fail closed.** Asking for a model id that is not in a provider's catalog used to
  fall back to a build with no endpoint, which resolved to a provider default — and could send that
  provider's API key to a different vendor. It is now refused with a clear error.
- **Repeated CLI flags repeat.** `bazilion agent chat --image a.png --image b.png` silently kept only
  the last attachment; the same applied to `team review capture --include`. Both now honour every
  occurrence.

## Upgrade carefully: alpha schema change

This release adds two evidence tables to the canonical database schema. **A 0.16.x home cannot be
upgraded in place.** Keep a complete backup and use the matching old release to export work you need
before a deliberate reset and fresh setup. An older-schema backup is not a migration into 0.17.0. Reset
removes Agents, Teams, templates, credentials and stored results; linked external Team directories
remain untouched. Read [the upgrade procedure](/docs/getting-started/#upgrade-to-0170) and
[backup and recovery](/docs/backup-recovery/) before proceeding.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.17.0) for publication
and validation details. The [0.16 release history](/docs/whats-new-0-16/) remains available.
