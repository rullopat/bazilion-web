---
title: How Bazilion is different
description: Bazilion is OpenClaw-inspired but takes a different shape — built around teams of agents, shared memory, and a single local daemon you fully control.
---

Bazilion is openly **OpenClaw-inspired**: it borrows OpenClaw's prompt-only skill
format, and it can import skills straight from a local OpenClaw install. But it is
a different kind of tool with a different center of gravity. If you know OpenClaw,
this page explains what's the same, what's different, and why.

## The one-line difference

**OpenClaw is a personal AI gateway** — it connects one assistant to the many
channels you already use (WhatsApp, Telegram, iMessage, Signal, and more) and
extends it with a rich plugin system.

**Bazilion is a multi-agent runtime** — it's built around spawning *teams* of
agents that share a workspace, a memory, and a mailbox, and coordinate on work.
The unit isn't "one assistant on many channels"; it's "many agents collaborating
in one place."

## What Bazilion is built around

### Teams, from templates

A **profile** is an agent template; a **profile group** is a *team* template. One
action spawns an ordered set of agents — each with its own name, model, and
reasoning level — into a shared group. This team-first model has no direct
OpenClaw equivalent. See [Core concepts](/docs/concepts/).

### A shared place to work

Every agent belongs to exactly one **group**, which provides one filesystem root
(optionally a symlink to a real project), one **`USER.md`** of shared context,
one **mailbox**, and one **memory**. Agents work on the same material rather than
each living in a private silo.

### Memory that's shared and searchable

Group memory is markdown indexed with **qmd** (BM25 search). Any agent in the
group can write a decision once and another can find it later by searching —
memory is a team resource, not a per-agent log.

### A mailbox between agents

Agents coordinate through durable messages (`send_message`, `read_inbox`,
`wait_for_reply`), not just live chat. Combined with **triggers** (interval and
cron wake-ups), an agent can pick up work left by another and act on a schedule.

## Architecture differences

| | OpenClaw | Bazilion |
| --- | --- | --- |
| Shape | Personal assistant gateway | Multi-agent team runtime |
| Extensibility | Skills **and** plugins (in-process TypeScript, ~28 lifecycle hooks) | Prompt-only skills **and** out-of-process MCP servers; all other capability is native daemon code |
| Channels | Many first-class transports (WhatsApp, iMessage, Signal, IRC, …) | HTTP API + web UI + CLI, plus Telegram |
| Config & secrets | `openclaw.json` (JSON5) + credential files | A single SQLite database (encrypted secrets, plaintext config) |
| State | Workspace + config files | One daemon owns `~/.bazilion`; agents, groups, sessions, and memory are inspectable files |
| Registry | ClawHub (thousands of community skills) | None — import skills from a directory, zip, or a local OpenClaw |

### One daemon owns everything

Bazilion runs a single daemon that owns the database, the scheduler, secrets, and
the agent runtime. The CLI, web UI, and any future client are stateless and talk
to it over HTTP. Each chat turn even runs in its own short-lived worker
subprocess, so one turn can't corrupt another. This keeps the security and state
model small and auditable.

### Local-first and yours

Bazilion is a personal, MIT-licensed project. It runs on your machine, with your
provider keys, storing state under `~/.bazilion`. There's no hosted service and
no account — the daemon binds to localhost by default, and exposing it to your
LAN or a phone is an explicit opt-in.

## What Bazilion deliberately leaves out

- **No plugin SDK.** OpenClaw's plugin system (new channels, providers, tools,
  and lifecycle hooks via in-process code) is powerful but is also arbitrary code
  running inside the gateway. Bazilion keeps extensibility to prompt-only skills,
  out-of-process MCP servers, and native code, so a third-party extension can't
  crash the runtime or intercept every tool call.
- **Fewer channels.** Bazilion isn't trying to be everywhere you chat. It exposes
  a clean HTTP API (with a web UI and CLI on top) and a single, deeply-integrated
  Telegram surface.
- **No registry.** Skills come from a local directory, a zip, or your existing
  OpenClaw install — there's no marketplace to browse.

## When to use which

Reach for **OpenClaw** if you want one assistant reachable across every messaging
channel, with a large catalog of plugins and community skills.

Reach for **Bazilion** if you want to design small teams of agents that share a
project, a memory, and a way to talk to each other — and you want all of that
running locally, under your control, as inspectable files.
