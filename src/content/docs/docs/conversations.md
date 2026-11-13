---
title: Conversations
description: Each Agent writes to one active conversation and keeps the earlier ones, which you can list, read and rename from the web chat or the CLI.
---

Each Agent writes to one active conversation at a time and keeps the earlier ones. Starting a new
conversation gives the Agent an empty history; old conversations and their saved files stay
available to read and rename, but an old conversation cannot be made active again.

- **Web:** in the chat, open **Conversations** to list them, start a **New conversation**, read an
  earlier one or rename it. `/new` in the composer opens the same panel. **Open conversation** on a
  saved result in **Team → Results** opens the conversation it came from.
- **CLI:**

  ```sh
  bazilion conversation list <agent> [--json]
  bazilion conversation show <agent> <conversation-id> [--json]
  bazilion conversation new <agent> [--title "Next task"]
  bazilion conversation rename <agent> <conversation-id> "Weekly report"
  ```

A new conversation is refused while the Agent is running a turn; try again when it finishes.
Follow-ups that are already queued keep the conversation they were sent to.

If the active conversation's history file is missing or unreadable, the chat says so; start a new
conversation to continue. Nothing recreates or replaces a missing history.

Editing the last message in the web chat is refused when the Agent has switched to another
conversation since the page loaded; reload and try again.

## Compact and context

- `/compact` in the web chat, or `bazilion agent chat-compact <agent>`, summarises older messages
  and keeps the recent part verbatim. It is a model call.
- `/context`, or `bazilion agent chat-context <agent>`, shows what the next turn would carry:
  prompt sections, tools, skills, USER.md and history size.
- `bazilion agent chat-trim <agent> --keep N` keeps the first N messages for the next turn.

## API

| Route | |
| --- | --- |
| `GET /api/agents/:id/conversations?limit=20&offset=0` | Newest first, with `selectedId` (the active one) |
| `POST /api/agents/:id/conversations` | `{title?}`: start a conversation and make it active |
| `GET /api/agents/:id/conversations/:conversationId` | Its messages (409 when its history is unreadable) |
| `PATCH /api/agents/:id/conversations/:conversationId` | `{title}`: 1–200 characters |

Each conversation's transcript is Pi's session file `agents/<id>/sessions/<conversation-id>.jsonl`;
the database keeps titles and which conversation is active. Backups include both.
