---
title: Growth and retention
description: What grows in a Bazilion home, what is pruned by itself, and what you can safely delete.
---

| Path | Holds | Grows with |
| --- | --- | --- |
| `bazilion.db` | Agents, messages, saved results, settings, encrypted secrets | Use |
| `agents/<id>/sessions/*.jsonl` | Conversation transcripts, tool output included | Turns |
| `agents/<id>/uploads/` | Files attached to chats | Attachments |
| `teams/<slug>/` | Team work tree and shared memory notes | The Agents' work |
| `profiles/`, `skills/` | Agent templates and installed skills | You |
| `browsers/<agent-id>/` | Managed browser profiles (cookies, logins) | Browsing |

Conversations, messages and uploads are never pruned: they are the record. Finished follow-ups and
their attachments are deleted seven days after they end. Saved results are capped at 25 MiB per
file and 1 GiB per home; they do not expire, and deleting one (Team → Results or
`bazilion result rm`) frees its share.

## Inspect

```sh
du -sh ~/.bazilion/* ~/.bazilion/agents/*
sqlite3 ~/.bazilion/bazilion.db "SELECT name, SUM(pgsize) FROM dbstat GROUP BY name ORDER BY 2 DESC"
```

## Reclaim space

- Delete an Agent you no longer need (`bazilion agent delete <id>`), which removes its directory
  and conversations.
- Reset an Agent's browser (`bazilion agent browser reset <agent>`).
- Delete saved results you no longer need.
- A Team's `memory/.qmd-index.sqlite` can be deleted at any time; it is rebuilt from the Markdown
  notes.

Do not delete session files by hand: the database still lists those conversations, and the active
one's next turn continues from its file. SQLite reuses freed pages, so the database file does not
shrink right away when you delete something.

## Logs

The daemon writes no log files. It logs to stdout, so under a service manager such as systemd the
journal holds and rotates the log.
