---
title: Conversations
description: Each Agent writes to one active conversation and keeps the earlier ones, which you can list, read, rename and continue from the web chat or the CLI.
---

Each Agent writes to one active conversation at a time and keeps the earlier ones. Starting a new
conversation gives the Agent an empty history; old conversations and their saved files stay
available to read, rename and continue.

A conversation starts as `Conversation N` and takes its name from the first message you send in
it (the first line, 60 characters at most), unless you named it yourself.

- **Web:** the menu at the top right of the chat lists the Agent's conversations. Pick an earlier
  one to read it; **Continue this conversation** makes it the active one. The menu also starts a
  **New conversation** and renames the one on screen. `/new` in the composer opens the same menu.
  A saved file in **Files** links to the conversation it came from.
- **CLI:**

  ```sh
  bazilion conversation list <agent> [--json]
  bazilion conversation show <agent> <conversation-id> [--json]
  bazilion conversation new <agent> [--title "Next task"]
  bazilion conversation rename <agent> <conversation-id> "Weekly report"
  bazilion conversation select <agent> <conversation-id>      # continue an earlier one
  ```

Starting or switching a conversation is refused while the Agent is running a turn; try again
when it finishes. Follow-ups that are already queued keep the conversation they were sent to. A
conversation whose history file is missing or unreadable cannot be continued.

If the active conversation's history file is missing or unreadable, the chat says so; start a new
conversation to continue. Nothing recreates or replaces a missing history.

Editing the last message in the web chat is refused when the Agent has switched to another
conversation since the page loaded; reload and try again.

## Search

Search finds the messages, yours and the Agents' replies, that hold every word you give, in every
Agent's conversations, newest first. It looks at what a conversation shows: tool output and
anything a summary replaced are not searched. A stored key is never found, and is taken out of
what a result shows.

- **Web:** type three characters or more in **Jump to** (⌘K or Ctrl+K). **In conversations** lists
  the messages found, with the words marked; opening one shows its conversation at that message.
- **CLI:** `bazilion conversation search "launch email" [--agent <id or name>] [--limit 20]
  [--json]` prints each message's Agent, conversation and time, the text around the words, and
  the command that shows the whole conversation.

Each conversation's use (tokens, and cost for a provider paid per use) is under its title in the
conversation menu and in `bazilion conversation list`; **Manage → Usage** adds them up
([the web interface](/docs/web-interface/#manage)).

## Compact and context

- A conversation that nears the model's window is summarised during a turn: older messages
  become one summary the Agent reads in their place, and the last 20,000 tokens or so stay as they
  are. It stays one conversation; the summarised messages stay on the page above a line with
  **Show the summary**, and search still finds them. A reply the full window would have cut short
  is redone after the summary.
- `/compact` in the web chat, or `bazilion agent chat-compact <agent>`, does the same at once. It
  is a model call, like each automatic summary.
- The bar above the conversation says how full the window is (`41K / 272K`, amber past 80%).
- `/context`, or `bazilion agent chat-context <agent>`, shows what the next turn would carry:
  prompt sections, tools, skills, USER.md and history size, and how full the window is.
- `bazilion agent chat-trim <agent> --keep N` keeps the first N messages for the next turn.

## API

| Route | |
| --- | --- |
| `GET /api/agents/:id/conversations?limit=20&offset=0` | Newest first, with `selectedId` (the active one) |
| `POST /api/agents/:id/conversations` | `{title?}`: start a conversation and make it active |
| `GET /api/agents/:id/conversations/:conversationId` | Its messages (409 when its history is unreadable) |
| `PATCH /api/agents/:id/conversations/:conversationId` | `{title}`: 1–200 characters |
| `POST /api/agents/:id/conversations/:conversationId/select` | Make it the active one (409 while a turn runs or when its history is unreadable) |

Each conversation's transcript is Pi's session file `agents/<id>/sessions/<conversation-id>.jsonl`;
the database keeps titles and which conversation is active. Backups include both.
