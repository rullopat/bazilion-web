---
title: Reviewing what changed
description: Inspect the changes an Agent produced in read-only Git change review — pinned baselines, bounded diffs, source snapshots, and three-valued applicability from the Review page, the CLI and the API.
---

A coding Agent reports what it did. **Git change review** shows you what actually changed, and ties a
result to the source version it was produced against. Everything here is read-only: Bazilion never
stages, commits, checks out or reverts anything on your behalf.

Available in Bazilion 0.17.0.

## Where to look

- **The Team page** — a **Review** section beside Context, Members, Policy, Memory and Results. Select a
  file row to read its diff; the keyboard alone is enough (tab to a row, press Enter).
- **The CLI** — `bazilion team review …`
- **The authenticated API** — `GET /api/teams/:id/review`, `…/review/snapshots`, and the
  `@bazilion/client` methods behind them.

## Changes since a baseline

```sh
bazilion team review show my-team
bazilion team review show my-team --base main --patch src/app.ts
```

The review always names the baseline it compared against, for example `main · base HEAD (a1b2c3d4e5f6)`.
A branch name is resolved to a concrete commit **when the review loads**, so a tip that moves later
cannot quietly rewrite what you are reviewing.

You get a file list with status, line counts, rename source, mode changes and binary markers, plus a
bounded diff for one file at a time. Untracked files are listed by name only; their content is read only
when you include it explicitly:

```sh
bazilion team review capture my-team --include notes.md --include config/local.yaml
```

Ignored files never appear. Credential-shaped paths (`.env`, keys, `credentials*`, `.ssh/…`) and
Bazilion-owned Team state are refused, recorded and **counted**, so a withheld file never looks like an
absent one.

If the Team's directory is not a Git repository, the review says so. It does not show an empty list,
because an empty list would read as "nothing changed".

## Snapshots: what a result was tested against

A snapshot is bounded **code evidence**, not a copy of your code:

- the HEAD commit, which covers all committed content;
- a digest of the index, which covers staged content exactly;
- a digest of every path that differs from the pinned baseline;
- a digest of each untracked file you explicitly included.

It stores paths and digests, **never file content**, and modification times are never used — a file
that was touched but not changed keeps its identity. The id is content-addressed, so the same tree
always produces the same id, and an incomplete capture can never be mistaken for an exact one.

A snapshot is captured for you when a command runs, and the Agent can capture one before it starts
editing. Captured evidence is retained for seven days.

## Does this result still apply?

A command receipt records the source state at its own execution boundary. The chat card reports whether
that version still matches the tree, in one of three states:

- **unchanged** — the source is byte-identical to what was tested;
- **changed** — the source moved. Whether that change was *relevant* to the result is unknowable, so no
  claim is made either way;
- **unknown** — no snapshot, an incomplete one, or it has expired.

A result with no captured source reads **Not checked**. Nothing here is a pass or a badge, and a
successful command still never certifies the whole repository — an exit code is not coverage.

Read more in [coding during an Agent task](/docs/coding-environment/) and
[the release it arrived in](/docs/previous-changes/#0170--coding-work-becomes-reviewable).
