---
title: How Bazilion is different
description: Bazilion is built on Pi and imports OpenClaw-style skills, but centers Teams of Agents that share a workspace, memory and a mailbox, run by one local daemon.
---

Bazilion's engine is
[Pi's coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent): Pi owns the
turn loop, provider calls, compaction, the transcript and the coding tools. Bazilion adds
Profiles, Agents, Teams, shared memory, a mailbox, a scheduler, the daemon, the CLI and the web UI
around it.

Bazilion is also openly **OpenClaw-inspired** in its skills: it imports prompt-only skills from a
local OpenClaw install. It is still a different kind of tool.

## The one-line difference

**OpenClaw is a personal AI gateway**: it connects one assistant to many channels and extends it
through a large plugin and skill ecosystem.

**Bazilion is a local multi-agent runtime**: Teams of Agents that share a workspace and memory,
message each other through a mailbox, and run on schedules, all on your own machine.

## What Bazilion is built around

### Teams with a shared place to work

Every Agent belongs to one **Team**. The Team has one workspace directory (or a link to a real
project), one `USER.md` about you, one shared memory and a simple policy for who may message whom.
A **Team template** spawns a whole Team at once.

### Memory that is shared and searchable

Team memory is Markdown indexed with **qmd** (BM25 search). One member writes a decision down;
another finds it later. It is a Team resource, not a per-Agent transcript or a vector database.

### A mailbox and a scheduler

Agents coordinate through messages (`send_message`, `read_inbox`, `wait_for_reply`), not only live
chat. An idle Agent with unread mail wakes up, and interval and cron triggers wake an Agent to do
recurring work.

## Architecture differences

| | OpenClaw | Bazilion |
| --- | --- | --- |
| Shape | Personal assistant gateway | Local multi-agent Team runtime |
| Agent engine | Its own assistant runtime | Pi for the loop, transcript, compaction, providers and coding tools |
| Team model | Not the center of the product | Profiles, Agents, Teams with shared workspace, memory and policy |
| Extensibility | Skills and in-process plugins | Prompt-only skills, MCP servers and native daemon code |
| Channels | Many first-class transports | Web UI, CLI and HTTP API, plus a deep Telegram integration |
| Config and secrets | JSON config and credential files | One SQLite database with encrypted secrets |
| State | Workspace and config files | One daemon owns `~/.bazilion`; workspaces, Agent documents, transcripts, skills and memory stay readable |
| Registry | Community skill ecosystem | No registry; import from a directory, a zip or a local OpenClaw install |

### One daemon owns everything

The daemon owns the database, the scheduler, secrets and the Agent runtime. The CLI and the web
UI are clients of its HTTP API. Each turn runs in its own short-lived worker process, while
browsers and MCP connections stay in the daemon and are reached over IPC.

### Local and yours

Bazilion is a personal, MIT-licensed project. It runs on your machine with your provider keys and
keeps its state under `~/.bazilion`. There is no hosted account. Both listeners stay on loopback;
remote access goes through the web UI over
[Tailscale Serve](/docs/private-access/).

## What Bazilion leaves out

- **No in-process plugin SDK.** Skills are prompt text that uses the existing tools; MCP servers
  add out-of-process tools; the rest is daemon code.
- **Fewer channels.** Web, CLI and HTTP, plus one Telegram forum integration.
- **No skill registry.** Import from local paths, zip archives or an OpenClaw install.

## When to use which

Reach for **OpenClaw** when the problem is one assistant across many messaging channels with a
broad extension ecosystem.

Reach for **Bazilion** when you want Teams of Agents that share real project files and memory,
message each other and run locally under your control.
