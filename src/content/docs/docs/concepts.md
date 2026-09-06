---
title: Core concepts
description: Pi's agent engine, Agent templates, revisioned Team Templates, Teams, live Team Policy, approvals, shared memory, mailbox, triggers, and tools.
---

Bazilion is built from a small set of concepts that compose. The CLI, HTTP API,
and web UI are surfaces over the same model.

## Pi agent engine

Bazilion is based on
[Pi's coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent).
Pi runs the per-turn agent loop, stores the canonical JSONL transcript under
each Agent's `sessions/` directory, handles replay and compaction, executes
providers and tools, and supplies the coding tools.

Bazilion adds the multi-agent shell around that engine: templates, Teams,
policy, shared context, mailbox, triggers, browser/MCP integrations, the daemon,
CLI, and web UI. Version 0.14.2 bundles Pi 0.85.1 and constructs provider,
catalog, authentication, and session state through Pi's public `ModelRuntime`
and `DefaultResourceLoader` APIs.

## Agent templates (Profiles)

An **Agent template** is the reusable definition technically stored as a
**Profile**. It bundles the persona and defaults that shape a new Agent:

- `SOUL.md`, `IDENTITY.md`, and the optional workspace instruction files,
- a default model, skills policy, and creation-time communication defaults,
- a skills mode (`all` attaches every installed skill; `selected` uses a
  curated list).

Spawning an Agent template creates a permanent live **Agent** with a private
home under `~/.bazilion/agents/<id>/`. The public HTTP resource remains
`/api/profiles`; the user-facing web route is `/templates/agents`.

## Team Templates

A **Team Template** is the only reusable Team roster and policy source. It owns:

- a revisioned ordered roster of **stable slots**,
- one Agent template reference per slot, with optional name, model, and
  reasoning overrides,
- directed communication edges between the user, slots, and the outside-Team
  boundary,
- immutable snapshots for every saved revision.

Spawning a reviewed template revision materializes its Agents atomically into a
Team and retains template/slot lineage. Stable slot IDs belong to the template;
live Agent IDs do not change when an Agent later moves or the policy changes.

## Teams

A **Team** is a live collaboration context. Every Agent belongs to exactly one
Team. A Team provides:

- one filesystem root at `~/.bazilion/teams/<slug>/`, optionally a symlink to
  an existing project tree,
- one Agent roster,
- one shared `USER.md`,
- one shared memory,
- exactly one effective revisioned **Team Policy**.

There is **one canonical Team Template roster** and **one effective live policy
per Team**. Source lineage does not create a second live roster or a detached
policy object.

## Agent lifecycle

Lifecycle changes are revision checked so concurrent edits fail visibly instead
of silently overwriting policy:

| Operation | Result |
| --- | --- |
| Spawn Agent | Joins one Team with an explicit placement (`isolated`, `open`, or `profile_defaults`); the Team policy revision advances. |
| Spawn Team Template | Creates Agents and retained slot lineage atomically in initialize or append mode. |
| Move Agent | Keeps the Agent ID, private home, and transcript while source/destination membership and policies update atomically. |
| Archive Agent | Keeps membership and policy intact; the Agent is hidden from normal active views. |
| Delete Agent | Removes the Agent and its policy edges atomically at the expected Team revision. |
| Delete Team | Requires the expected revision and no members; removes the Team root and its sole policy. |

## Team Policy

The live policy is a directed graph. Its endpoints are the user, live Agents,
and an `outside_team` boundary. An edge posture is either `allow` or
`approval_required`; a missing edge denies when enforcement is active.

The shared authorizer covers:

- user → Agent and Agent → user,
- same-Team Agent → Agent,
- cross-Team Agent communication (both Teams must allow their side),
- scheduler, inbox, HTTP/worker-turn, and Telegram ingress/egress boundaries.

Production enforcement remains opt-in. Set
`BAZILION_TEAM_POLICY_ENFORCEMENT=on` and restart the daemon. When enabled,
there is no alternate authorization path. Durable block records retain the
policy evidence and reason, never the message payload.

## Communication approvals

An `approval_required` edge captures and holds one typed attempt before its
side effect. The operator can inspect it in `/approvals` or with
`bazilion approval`, then approve once, deny, or cancel it. Approval revalidates
current membership and policy and delivers at most once.

This is an edge posture, not a workflow engine: there are no stages,
transformations, general retries, or approver assignments.

## Shared USER.md and memory

Each Team has one `USER.md` for stable context about the human, project, and
standing instructions. Normal coding tools cannot overwrite it directly;
Agents use the guarded, concurrency-checked USER.md tools, and the operator can
edit it from the Team page or CLI.

Memory is **Team-shared** at `<team>/memory/` and indexed with
[qmd](https://github.com/tobilu/qmd) (BM25 over markdown). Members write
decisions once and retrieve them later by search. Personal Agent notes belong
in that Agent's private `IDENTITY.md` instead.

## Mailbox, triggers, and tools

Agents coordinate through a durable mailbox. In-loop tools are `send_message`,
`read_inbox`, and `wait_for_reply`; outside the loop the same messages are
available through `bazilion inbox`, the HTTP API, and the Agent inbox page.

Interval and cron **triggers** can wake an Agent with a stored message. Due
occurrences are durably materialized, coalesced while an earlier dispatch is
open, leased across daemon restarts, and retried to a bounded terminal state.
Inspect delivery with `bazilion trigger history <id>` or the Agent's Triggers
tab.

Alongside the coding, web, mailbox, and memory tools, the daemon can provide an
opt-in Docker-isolated shell, dangerous-command approval, a persistent
Playwright browser, tools from connected MCP servers, and bidirectional file
delivery. See [Tools & integrations](/docs/tools/).

## State on disk

The daemon owns SQLite, the scheduler, secrets, and Agent turns. Most work stays
inspectable under `~/.bazilion/`: Team roots, Agent homes, Agent-template files,
session transcripts, skills, and memory. See
[Configuration](/docs/configuration/) for the complete layout and the alpha
clean-install contract.
