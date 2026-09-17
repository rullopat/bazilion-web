---
title: What's new in 0.20.0
description: Bazilion 0.20.0 publishes a reviewed revision to a code host — a pull request opened from an operator decision, with no model in the path — and observes the boundary claims where they are made. On Pi 0.85.1.
---

Bazilion **0.20.0** closes the gap the whole coding sequence was building towards: an accepted change can
leave the machine. The daemon commits a **reviewed** revision to a new branch and opens a pull request — and
it does that without any model in the path at all.

The public packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to 0.20.0. The
bundled engine remains **Pi 0.85.1**.

## Publish a reviewed change

Every story before this one ended with the same sentence: *this is not an approval to publish, merge or
deploy*. This is the release that makes publishing real, and it keeps the sentence honest about everything
else.

- **It is a decision, not a workflow.** You publish a review packet that has been reviewed. `bazilion team
  publish create`, `POST /api/teams/:id/publications`, or the **Publications** panel on the Team Review page.
- **There is no publication tool, worker or capability.** Publishing is deterministic — there is no content
  to read and no command to choose — so the daemon does the work itself. The guarantee is that no model is in
  this path, which is stronger than a capability an Agent would have to be refused.
- **The content is the reviewed revision, or nothing.** A source snapshot stores digests, never file bytes, so
  every path is read back from the working tree and checked against the digest the capture recorded. If it no
  longer matches, the publication **refuses and names the path** rather than committing bytes nobody reviewed.
- **A refusal sends nothing.** No host configured, no credential, a protected head branch, a branch name that
  is not a valid ref, an unreproducible revision, a packet already published — each comes back with a reason,
  and the record states that nothing was sent.
- **Never a force push.** A branch that already exists on the host is refused *before* the commit is built.
  `main`, `master`, `trunk`, `develop` and `release` are never a head branch.
- **Unsigned, and said out loud.** The commit is unsigned, the record says `signed: false`, and the schema
  refuses to store anything else. It cannot claim a signature it does not have.
- **The credential is never an argument or a URL**, and the remote comes from your configuration — never from
  the repository's own `origin`.
- **The outcome is what the host said.** A pull request is recorded only if the host returned one. A push that
  succeeded without one is reported as a published branch, not as a pull request that exists.
- **Nothing is merged and nothing is deployed.** Those stay things you report, exactly as before.

Configure it on `/config` → *Code host publication*: `PUBLICATION_HOST` (`github`, or `local` for a bare
repository path), `PUBLICATION_REPOSITORY`, `PUBLICATION_BASE_BRANCH`, and a `GITHUB_TOKEN` secret with
`contents:write` and `pull_requests:write` on that repository.

Read the [publication guide](/docs/publication/) for the rules and the refusals in full.

## Boundaries observed, not just asserted

Three guards existed and had tests; none of them was ever observed in the configuration where the product
claims it. This release is the small, cheap counterpart to that:

- **A check's working directory was scoped in the wrong place.** It was length-bounded when a request was
  captured and only scoped when the check ran, so a `cwd` pointing outside the workspace was accepted, had
  its rows written, and surfaced later as a check that mysteriously did not execute. It is now refused at
  capture, naming the value, before anything exists.
- **"An unverified finding cannot be resolved" held for Agents and not for you.** The operator route stored
  every finding as *open*, so a finding about a revision whose content was no longer readable looked
  resolvable — the one rule that state exists to enforce. Both entry points now ask the same question.
- **The verification panel said nothing about the limits the result message states.** There, "all inside the
  declared paths" read as confinement and a completed request read as an approval. One shared wording now
  renders on both surfaces — always, not only after a check has run.
- **A review turn is observed to run nothing** with container isolation switched on, with a control that
  registers a container and proves the measurement can see one, so "no container" is not an assertion that is
  always true.

## A defect found by building on top of it

Recording a conclusion used to leave an operator's packet **open forever**, while the same report's own facts
already said it was reviewed — one report giving two answers, and nothing downstream would accept it. A
recorded conclusion now settles the packet, whoever recorded it. The trade-off is stated plainly: once you
conclude an operator packet, delegating a reviewer afterwards needs a new packet.

## Also corrected

The 0.19.1 notes claimed a clean lint, and that claim was **false** — one error in a script added by the same
release. The notes were corrected at the time, and this release's validation was checked rather than assumed.

## Upgrading

**0.19.x homes cannot be upgraded in place.** This release adds the `publications` table and three indexes,
and the alpha contract remains clean-install only. Take a backup if you need the state, then set up fresh.
Read [the upgrade procedure](/docs/getting-started/#upgrade-to-0200) and
[backup and recovery](/docs/backup-recovery/).

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.20.0) for publication and
validation details. The [0.19.1 notes](/docs/whats-new-0-19-1/) remain available, and everything before
0.19.0 is summarised in [previous changes](/docs/previous-changes/).
