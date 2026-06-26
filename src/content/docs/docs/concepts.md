---
title: Core concepts
description: Pi's agent engine, profiles, profile groups, groups, USER.md, shared memory, the mailbox, triggers, and tools.
---

Bazilion is built from a small set of concepts that compose. Once you know
these, the CLI, API, and web UI are all just surfaces over the same model.

## Pi agent engine

Bazilion is based on
[Pi's coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent).
Pi runs the per-turn agent loop, stores the canonical JSONL transcript under
each agent's `sessions/` directory, handles replay and compaction, executes
providers and tools, and supplies the coding tools.

Bazilion adds the multi-agent shell around that engine: profiles, profile
groups, groups, shared `USER.md`, qmd memory, mailbox, triggers, browser/MCP
integrations, the daemon, CLI, and web UI.

## Profiles

A **profile** is an agent template. It bundles the persona and defaults that
shape an agent when it is spawned:

- `SOUL.md` / `IDENTITY.md` — who the agent is,
- a default model and reasoning level,
- a skills mode (`all` attaches every installed skill, `selected` uses a
  curated list).

Spawning a profile creates a live **agent** with its own private home under
`~/.bazilion/agents/<id>/`.

## Profile groups

A **profile group** is a reusable *team* template: an ordered list of members,
each pointing at a profile with optional per-member overrides for name, model,
and reasoning level. Spawning a profile group materializes the whole roster into
a target group in one transactional call.

## Groups

A **group** is a collaboration context. Every agent belongs to exactly one
group, and a group provides three shared things:

- a single filesystem root (`~/.bazilion/groups/<slug>/`, optionally a symlink
  to an existing project tree),
- one `USER.md` describing the human, project, and standing instructions —
  read-only to agents, injected into every member's prompt,
- one shared memory and one mailbox.

## Shared memory

Memory is **per-group**, shared by every agent in it. It lives at
`<group>/memory/` and is indexed with [qmd](https://github.com/tobilu/qmd)
(BM25 over markdown). Agents write decisions and discoveries once and retrieve
them later by search, rather than relying on chat history. Personal notes
belong in an agent's own `IDENTITY.md` instead.

## The mailbox

Agents coordinate through a durable mailbox, not just chat. The in-loop tools
are `send_message`, `read_inbox`, and `wait_for_reply`; outside the loop the
same messages are available over the CLI (`bazilion inbox …`), the HTTP API,
and the web inbox.

## Triggers

Interval and cron **triggers** can wake an agent with a stored message — so an
agent can check its inbox, review notes, or run a recurring task without a chat
window open.

## Tools

Agents act through **tools**. Alongside the built-in coding, web, mailbox, and
memory tools, the daemon can give every agent a real Playwright **browser**, the
tools of any **MCP server** you connect, and the ability to send files back with
`deliver_file`. See [Tools & integrations](/docs/tools/) for the full toolset.

## State on disk

Most of the useful material stays inspectable as files under `~/.bazilion/`:
agent homes, group roots, profile templates, session transcripts, skills, and
memory. The daemon owns the SQLite database; everything else is on disk. See
[Configuration](/docs/configuration/) for the full layout.
