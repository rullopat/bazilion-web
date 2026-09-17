---
title: Publishing a reviewed change
description: How Bazilion publishes a reviewed revision to a code host — the decision, the rules it cannot break, and what a refusal means.
---

Publishing carries one **reviewed** revision from a Team workspace to a code host: the daemon commits it to a
new branch and opens a pull request. It is the last step of the coding sequence —

[repository context](/docs/coding-environment/) → [verification](/docs/coding-verification/) →
[review](/docs/coding-review-packets/) → **publication**.

## Where a publication is different

The other coding features give an Agent a narrow capability and refuse everything else. Publication does
something stronger and simpler:

> **There is no publication tool, worker or capability, because no model is involved.**

Publishing is deterministic. There is no content to read and no command to choose, so there is nothing for a
model to decide — which means there is nothing for it to be refused. That is why the daemon does this work
itself, and why this guide has no "what the reviewer cannot do" section: nothing, model or otherwise, is in
this path except your decision.

## Asking for it

- **Web:** the **Publications** panel on a Team's Review page.
- **CLI:** `bazilion team publish create <team> --packet <packet-id>` (also `list` and `show`).
- **HTTP:** `POST /api/teams/:id/publications`.

The decision is a **reviewed packet**. A packet that is open, or has no recorded conclusion, is refused: a
publication is a decision about a reviewed revision, not a promise about one.

## What it commits

A source snapshot records **paths and digests, never bytes**. So the reviewed revision's content exists only
in the working tree, and only while that tree still matches the capture. Before anything is sent, every path
is read back and verified against the digest recorded at capture:

- **A mismatch refuses, and names the path.** Current bytes are never committed under a reviewed packet's
  name — the whole point of the feature is that this cannot happen.
- A capture that is incomplete (something could not be fingerprinted) is refused too, because committing it
  would publish part of a change.

## The rules it cannot break

| Rule | What that means in practice |
| --- | --- |
| The remote comes from your configuration | `PUBLICATION_HOST` and `PUBLICATION_REPOSITORY`, never the repository's own `origin`. A repository value that is not an `owner/name` pair is refused. |
| No force push, ever | The commit is pushed plainly, so a non-fast-forward is refused by Git, and a branch that already exists on the host is refused *before* the commit is built. |
| Protected branches are never the head | `main`, `master`, `trunk`, `develop`, `release` — including `nested/main`. |
| Unsigned, and stated | Commits are unsigned, the record says so, and the schema refuses to store anything else. Nothing claims a signature. |
| The credential stays out of sight | It travels in the environment as a Git `http.extraheader`, never as an argument, a URL or a file. |
| No ambient Git configuration | A private scratch repository: no system or global config, no credential helper, no hooks, no template, and no interactive prompt that could hang. |
| The commit is based on the pinned base | The branch shares the reviewed change's history, so the pull request shows your change and not a rewritten tree. |

## Refusals, and the one state that means "we do not know"

- **Refused** — nothing was sent: no commit, no push, no pull request. You get a reason, not an error. Fix it
  and publish again; the review is untouched. Reasons include no configured host, no stored credential, a
  protected or malformed branch name, an unreproducible revision, a packet that was not reviewed, and a packet
  that already has a published revision.
- **Published** — the branch is on the host. The pull request is recorded **only if the host returned one**; a
  push that succeeded without one is a published branch with a note attached.
- **Failed** — the attempt ended with a reason, and nothing is known to be on the host.
- **Uncertain** — the attempt was interrupted. A push may already have landed, so this is **never retried
  automatically** and never recorded as a failure. Check the host first: if the branch is there, publishing
  again will refuse rather than overwrite it.

Nothing here merges and nothing deploys. `merged`, `deployed` and `productionAccepted` remain things you
report on the packet, because Bazilion has no integration that could verify them.

## What the Agent that asked for the review is told

The outcome: branch, commit, pull request — or the refusal reason. Not the credential, not the remote URL, and
not the host path a local publication used. Those are yours.

## Configuration

| Setting | Where | Notes |
| --- | --- | --- |
| `PUBLICATION_HOST` | config | `github`, or `local` pointing at a bare repository path — useful for a dry run against a repository you own. |
| `PUBLICATION_REPOSITORY` | config | `owner/name` for GitHub; an absolute path for `local`. |
| `PUBLICATION_BASE_BRANCH` | config | The branch the publication is based on and the pull request targets (default `main`). |
| `GITHUB_TOKEN` | secret (encrypted) | Needs `contents:write` and `pull_requests:write` on that repository. Used for one push and one pull request. |

Set them on `/config` → *Code host publication*, with `bazilion config set PUBLICATION_HOST github` and so
on, or through the API.
