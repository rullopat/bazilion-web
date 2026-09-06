---
title: How Bazilion is different
description: Bazilion is built on Pi and OpenClaw-inspired in skill compatibility, but centers revisioned Team Templates, live Team Policy, shared memory, and one local daemon.
---

Bazilion's core engine is
[Pi's coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent):
Pi owns the per-turn session loop, transcript, compaction, provider/tool
execution, and coding tools. Bazilion layers Agent templates, Team Templates,
live Teams, policy, approvals, shared memory, mailbox, scheduler, daemon, CLI,
and web UI around that engine.

Bazilion is also openly **OpenClaw-inspired** in its prompt-only skill
compatibility: it can import skills from a local OpenClaw install. It is still a
different kind of tool with a different center of gravity.

## The one-line difference

**OpenClaw is a personal AI gateway** — it connects one assistant to many
channels and extends it through a large plugin and skill ecosystem.

**Bazilion is a local multi-agent runtime** — it is built around reviewed Teams
of permanent Agents sharing a workspace and memory, coordinating through a
mailbox, and communicating under one explicit live policy.

## What Bazilion is built around

### One canonical Team roster

An **Agent template** (the technical Profile entity) defines a reusable role. A
**Team Template** is the sole reusable Team roster: stable ordered slots,
profile-backed roles, optional name/model/reasoning overrides, directed
communication edges, and immutable revisions.

Spawning a reviewed revision creates the Agents atomically in one Team and
retains source-slot lineage. That lineage never becomes a second live roster.

### A shared place to work

Every Agent belongs to exactly one **Team**. The Team supplies one filesystem
root (optionally a symlink to a real project), one shared `USER.md`, one Agent
roster, one shared qmd memory, and exactly one effective revisioned Team Policy.

### Memory that is shared and searchable

Team memory is markdown indexed with **qmd** (BM25 search). A member can write a
decision once and another can find it later. It is a Team resource, not a
per-Agent transcript or a vector database.

### A mailbox under policy

Agents coordinate through durable messages (`send_message`, `read_inbox`, and
`wait_for_reply`), not only live chat. Interval and cron triggers can wake an
Agent to pick up work later.

When Team Policy enforcement is enabled, the same authorizer gates user,
same-Team, cross-Team, scheduler, inbox, worker, and Telegram boundaries.
Directed edges allow communication or require one operator approval; a missing
edge denies. Approval holds one attempt and can dispatch it at most once—it is
not a general workflow engine.

## Architecture differences

| | OpenClaw | Bazilion |
| --- | --- | --- |
| Shape | Personal assistant gateway | Local multi-agent Team runtime |
| Agent engine | Own assistant runtime | Pi for session loop, transcript, compaction, provider/tool execution, and coding tools |
| Team model | Not the center of the product | Revisioned Team Templates, permanent Agents, one live policy per Team |
| Extensibility | Skills and in-process plugins | Prompt-only skills, out-of-process MCP servers, and native daemon code |
| Channels | Many first-class transports | HTTP API + web UI + CLI, plus a deep Telegram integration |
| Config & secrets | JSON/config and credential files | One SQLite database with encrypted secrets and plaintext non-secret config |
| State | Workspace + config files | One daemon owns `~/.bazilion`; Team roots, Agent homes, sessions, skills, and memory remain inspectable |
| Registry | Community skill ecosystem | No registry; import skills from a directory, zip, or local OpenClaw install |

### One daemon owns everything

The Bazilion daemon owns the database, Team policy, approval queue, scheduler,
secrets, and Agent runtime. CLI, web, and mobile clients are stateless HTTP
clients. Each chat turn runs in its own short-lived worker subprocess, while
long-lived browser/MCP resources remain in the daemon and are reached over IPC.

### Local-first and yours

Bazilion is a personal, MIT-licensed project. It runs on your machine, with your
provider keys, and stores state under `~/.bazilion`. There is no hosted account.
Both listeners stay on loopback. Supported remote access uses the web listener
through [private Tailscale Serve](/docs/private-access/); direct daemon/LAN
exposure, public reverse proxies, and Funnel are unsupported.

## What Bazilion deliberately leaves out

- **No in-process plugin SDK.** Prompt-only skills use existing tools; MCP
  servers add out-of-process capabilities; the rest is native daemon code.
- **Fewer channels.** Bazilion concentrates on HTTP/web/CLI plus one deeply
  integrated Telegram forum surface.
- **No skill registry.** Import from local paths, zip archives, or an existing
  OpenClaw installation.
- **No general approval workflow.** Communication approval is a posture on one
  policy edge and protects one captured attempt.

## When to use which

Reach for **OpenClaw** when the center of the problem is one assistant available
across many messaging channels and a broad extension ecosystem.

Reach for **Bazilion** when you want to design revisioned Teams of Agents that
share real project files and memory, talk through an explicit policy, and run
locally under your control.
