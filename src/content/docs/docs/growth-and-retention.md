---
title: Growth and retention
description: What grows in a Bazilion home, which parts are bounded by design, and what is safe to prune.
---

Running Bazilion for months eventually raises the question: how big should this home
be, and is that normal? Here is the per-artifact answer — what makes it grow, how to
inspect it, and what is safe to delete. The short version: **the coding-evidence
machinery is bounded by design; the conversation history is not, because it is the
product's record.**

## The layout

A home (`~/.bazilion` by default) contains:

| Path | What it is | Grows with |
| --- | --- | --- |
| `bazilion.db` | The database: messages, agents, receipts, reviews, coding evidence | Usage (turns, coding commands) |
| `bazilion.pre-migration-*.db` | Historical snapshots from earlier migration-capable releases | Earlier upgrades, not 0.23.0 refusal |
| `agents/<id>/sessions/*.jsonl` | Canonical conversation transcripts | Turns |
| `agents/<id>/uploads/` | User-attached files | Attachments |
| `profiles/`, `skills/`, `teams/` | Your configuration | You |
| `logs/` | *(empty — see below)* | Nothing |

Inspect sizes with `du -sh ~/.bazilion/* ~/.bazilion/agents/*` and, for the
database's table-level breakdown, any SQLite browser:
`sqlite3 ~/.bazilion/bazilion.db` → `SELECT * FROM dbstat ORDER BY pgsz DESC;` or
per-table `SELECT COUNT(*)` on the tables named below.

## The database: bounded evidence, unbounded history

**Bounded by design — the coding-evidence machinery prunes itself:**

- **Coding command logs** (`coding_command_logs`): every coding command's observable
  output is retained for **7 days** and, on top of the TTL, the whole table is
  evicted oldest-first under a **256 MB home-wide budget**. Pruning runs whenever a
  coding command completes; a log belonging to a still-running command is never
  evicted. Expired logs keep their row (id, provenance, state `expired`) but drop
  the text — receipts stay meaningful while the bulk is reclaimed.
- **Source snapshots** (`source_snapshots`): bounded code evidence for review.
  Snapshots are **content-addressed** — capturing an identical tree state again
  collapses onto the existing row rather than extending retention — and expire after
  **7 days**. Manifests hold paths and digests only; file content is never stored in
  the database.

**Unbounded by design — this is your history, not a leak:**

- **Messages** (`messages`): every turn's messages, growing with usage. This is the
  conversation record the product exists to keep. Structural retention and
  cold-archiving are deliberately deferred (planned post-1.0); today the honest
  guidance is: the database grows with use, and a full backup (see
  [backup and recovery](/docs/backup-recovery/)) is the way to snapshot it.
- Audit rows (`trigger_dispatches`, `agent_loop_break_events`,
  `communication_approval_events`, …) grow slowly — single rows per event, no blob
  content.

## Sessions JSONL

Each agent's canonical transcript lives at
`agents/<agentId>/sessions/<conversationId>.jsonl` and grows with every turn. The
daemon appends transactionally (staging file + link) but never prunes: the transcript
is the source of truth a session replays from.

- **Safe:** archiving (moving/copying) the `sessions/` directory of an agent you have
  removed.
- **Not safe:** deleting or truncating a session file of a live agent — the next turn
  replays from it.

## Uploads

User-attached files are persisted under `agents/<agentId>/uploads/`, one file per
attachment, referenced by message metadata. They are not daemon-pruned; removing an
agent removes its uploads with it (uninstall offers a full wipe of the home — see
`bazilion uninstall`).

## Pre-migration snapshots

**Historical 0.21/0.22 migration behavior:** earlier supported upgrades could write a verified
transactionally consistent database copy to `bazilion.pre-migration-<timestamp>.db`.
Existing files may therefore remain beside an older database.

**0.23.0 does not upgrade those homes in place and creates no automatic pre-refusal snapshot.**
It refuses incompatible state under the clean-rebootstrap contract. Preserve the entire old home,
paired DB/auth and external Team work before any separately authorized reset. Keep the matching
old binary/schema for old snapshots and archives; they are not importable current-schema backups.
See [upgrading](/docs/getting-started/#upgrade-to-0230) and
[backup and recovery](/docs/backup-recovery/).

Only consider pruning historical snapshots after a separate verified backup and confirmation that
wanted data remains accessible with its matching release. A database-only snapshot is not a backup
of the entire home; never delete the only recoverable copy.

## Why `logs/` is empty

The daemon **writes no log files**. The `logs/` directory is created at bootstrap and
wiped by uninstall, but nothing in the daemon writes into it — daemon diagnostics go
to stdout, so under systemd (or launchd on macOS) the service manager's journal holds
the log and its rotation is the service manager's job (`journalctl -u bazilion`,
size-capped by your distro's defaults). If `logs/` ever starts growing, that is a
bug, not a configuration problem.

## What is deliberately absent

- **No automatic retention on messages or sessions** — the conversation record is the
  product; structural retention/cold-archiving is post-1.0 work.
- **No automatic log shipping or telemetry.** Configured provider and integration traffic,
  including web research, browsing, MCP or Telegram, can leave the host within their capability
  boundaries. Local-first is not a promise of no network traffic.
