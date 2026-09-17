---
title: What's new in 0.19.0
description: Bazilion 0.19.0 lets a coder hand one captured change to a teammate for a reading, with a reviewer that cannot run, change or publish anything, on Pi 0.85.1.
---

Bazilion **0.19.0** completes the coding loop. A coder asks a teammate to *read* one captured change and
say what they think of it, and gets the findings back — while the reviewer cannot run anything, change
anything or publish anything. The public packages `bazilion`, `@bazilion/client` and
`@bazilion/api-types` move together to 0.19.0, and three gaps in the previous release's verification are
closed. The bundled engine remains **Pi 0.85.1**.

## Ask a teammate to review a change

```sh
bazilion team review capture my-team
bazilion team review packet create my-team --snapshot <id> --reviewer tester --summary "the crash fix"
bazilion team review packet finding my-team <packetId> --path app.ts --severity major --note "no test" --lines 12-20
bazilion team review packet conclude my-team <packetId> --conclusion changes_requested
bazilion team review packet export my-team <packetId>
```

A coder can ask the same way from inside its own turn with `request_review`, naming a teammate by name or
id. The API and the Team page's **Review** section show the same thing. The full surface is in
[requesting review from a teammate](/docs/coding-review-packets/).

## One captured revision, and it does not move

A packet names one captured change and stores no copy of the tree, so editing the repository afterwards
cannot rewrite it — it makes the packet **stale**, which is shown as a fact rather than smoothed over.

A patch is offered only while the tree still matches the capture. That is not caution, it is arithmetic: a
snapshot stores paths and digests, never bytes, so the old revision's content cannot be reproduced once the
working tree has moved. The reviewer is told that instead of being shown later code as if it were the
reviewed change, and a finding recorded at that point is marked **unverified** and cannot be resolved.

Findings are append-only and about `(packet, path, revision)` — the line range is context, not identity.
Resolving one requires an explicit decision or a named later revision, because a moved line proves nothing.

## A reviewer that cannot do anything else

The reviewer's entire capability is four read-only tools: read the packet, read a changed path's patch,
record a finding, record a conclusion. There is no shell, editor, browser, network, check-execution or
publication verb, and the daemon refuses each of them at its boundary rather than trusting a system prompt.
A path that is not part of the reviewed revision is refused, whatever exists on disk.

The result comes back to whoever asked through the normal messaging path. Note that a review never rides a
peer message: the inbox wake starts a *writable coding turn*, so it cannot be the thing that executes a
review.

## Completion is a set of facts, not a vibe

Change prepared, checks current, reviewed, committed, pushed, pull request, merged, deployed, production
accepted — each shown only when it has its own evidence. **Checks current** is true only when
executor-owned evidence exists for *this* revision and still applies to it.

The last six are **operator-reported and never verified**. Bazilion has no code-host integration, so those
states are labelled reported rather than presented as checked.

## Handoff, and file links that do not lie

An export is a **publication, not a download**. Its bytes go into the durable results library held, and stay
unreadable until the shipped egress authorizer releases them — so an export cannot bypass an
approval-held delivery. A handoff carries its own unresolved findings and limitations, and offers no patch
for a revision it cannot vouch for.

File links name the daemon host, always offer a copyable location, distinguish the reviewed revision from
the live file, and run a configured editor as argv **without a shell**: a file named
`app; touch pwned.txt` is a filename, not a command.

## Verification gaps closed

- **A container check runs with the posture its receipt claims.** Before, the Team's shared memory was
  writable to a captured check while the receipt recorded `read_only_memory`, and the container was not
  registered for recovery. Both are fixed, and a fresh container check is observed doing it.
- **Declared output paths are checked rather than trusted.** The attempt records writes outside the
  declaration and the requester is told — while still not pretending to confine them.
- **A coding Agent can now ask for verification at all.** This is the one that mattered: the result
  delivery existed (and was tested) but was unreachable on any path an agent could take, because only the
  operator could create a request. A live-model run now observes a coder choosing the tool unprompted,
  designing its own check sets, and the executor's receipts naming the exact captured revision.

## Upgrade carefully: alpha schema change

This release adds four review tables and widens result provenance, so **a 0.18.x home cannot be upgraded in
place**. Keep a complete backup and export work with your current release before a deliberate reset and
fresh setup. Read [the upgrade procedure](/docs/getting-started/#upgrade-to-0191) and
[backup and recovery](/docs/backup-recovery/) before proceeding.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.19.0) for publication and
validation details. The [0.18 release history](/docs/whats-new-0-18/) remains available.
