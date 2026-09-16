---
title: Requesting review from a teammate
description: Hand one captured change to a teammate for a reading, and get findings back — with a reviewer that cannot run, change or publish anything.
---

A coding Agent reports what it did. **Review** adds a reading of one captured change by someone else, and
the difference between review and [verification](/docs/coding-verification/) is worth stating plainly: a
verifier *runs* the checks you selected, and a reviewer *reads* the change and says what they think.
Neither one publishes anything.

Available in Bazilion 0.19.0.

## Capture first, then ask

A packet binds one captured change, so capture one from the [Review](/docs/coding-review/) page first:

```sh
bazilion team review capture my-team
bazilion team review packet create my-team --snapshot <id> --reviewer tester --summary "the crash fix"
bazilion team review packet list my-team
bazilion team review packet show my-team <packetId>
```

A coder can ask from inside its own turn with `request_review`, naming a teammate by **name or id** — the
daemon captures the change at that moment, so editing afterwards does not change what will be reviewed. Omit
`--reviewer` for a packet that only you will read: nothing is delegated, so nothing is dispatched.

## What the reviewer can do

Four things, and nothing else: read the packet, read one changed path's patch, record a finding, record a
conclusion.

There is no shell, no editor, no browser, no network, no command to run and nothing to publish. A path that
is not part of the reviewed revision is refused, whatever happens to exist on disk. The daemon enforces this
at its boundary, so it does not depend on the reviewer's instructions being followed.

## What review refuses to pretend

| Situation | What happens |
| --- | --- |
| The tree moved since the capture | The packet reads **stale**, and the reviewer is told the revision's content is no longer reproducible. A patch is **not** offered: a diff of later code is a different change. |
| A finding is recorded while content could not be read | It is stored as **unverified** and cannot be resolved — resolving it would attach a decision to evidence nobody established. |
| A finding seems fixed because lines moved | Resolution requires an explicit decision or a named later revision. A moved line proves nothing. |
| The policy edge says approval is required | The packet waits in `awaiting_approval`. Nothing is read and nothing is written until an operator releases it. |
| The reviewer stops without concluding | The attempt settles **failed** and the packet returns to `open`. A turn that reviewed nothing must not read as a review that found nothing. |

## How to read the result

- **A conclusion is a reviewer's statement**: `changes_requested`, `commented` or `recommended`. It is not a
  pass, not operator acceptance, and not permission to publish, merge or deploy.
- **Findings are per path and per revision**, with the line range as context. Each carries whether it still
  applies: *unchanged since capture*, *changed since capture* or *not checked*.
- **Completion is a set of separate facts**: change prepared, checks current, reviewed, then committed,
  pushed, pull request, merged, deployed, production accepted. The last six are whatever you report them to
  be — Bazilion has no code-host integration and does not check them.
- **Checks current** means executor-owned evidence exists for this exact revision and still applies to it.
  A review never implies checks ran.

The findings come back to whoever asked through the normal messaging path.

## Handoff and file links

`bazilion team review packet export my-team <packetId>` produces the patch and a handoff document: the
problem, what the reviewer concluded, the verification evidence by receipt, the unresolved findings, and
the limitations. It names one revision. If the tree has moved, it offers **no** patch and says why rather
than showing a diff of different code.

An export can also be delivered as a durable artifact (`--deliver`). That is a **publication**: the bytes
are held in the results library until the shipped egress authorizer releases them, so an export cannot
bypass an approval-held delivery.

`bazilion team review packet link my-team <packetId> --path app.ts --line 12` resolves where a location
points: the daemon host that owns the workspace, a copyable repository-relative target, and whether the
file is the reviewed revision or the current one. Opening an editor is an explicit action, requires an
editor configured on the daemon host (`BAZILION_REVIEW_EDITOR`), and runs as argv without a shell — so a
hostile filename is a filename, not a command. If you are viewing the site from another machine, copy the
location; the daemon cannot open a file on your computer.

## Deliberately not included

Automatic commit, push, pull-request creation, merge or deployment; code-host credentials; and a
reviewer that runs anything. Review produces a reading and a handoff, and what you do with them stays
yours.

Read more in [reviewing what changed](/docs/coding-review/) and
[what changed in 0.19.0](/docs/whats-new-0-19/).
