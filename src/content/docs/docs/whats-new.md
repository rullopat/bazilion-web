---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.58.2 bundles Pi 1.6.0.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.58.2

Published **2026-11-24**. The rest of 0.58.1's fix for keeping your place in a conversation.
The embedded Pi engine stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.58.2).

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.58 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.58.2
bazilion dashboard
```

Then reload the Bazilion tabs you had open, once.

### Fixed

- **Going to another Agent and back keeps where you were, in every tab.** The router keeps
  scroll positions in the browser tab, and a reload keeps them. 0.58.1 stopped it saving a
  conversation's position where the next Agent's would find it, but positions saved before, in
  a tab already open, still landed on every conversation: each Agent opened where the Agent
  visited last had been. The router no longer restores scrolling in the workspace at all, so
  each conversation keeps only its own place and a reload opens every conversation at its end.
  Other pages, such as Setup and Manage, still return to where you were when you go Back.

## Bazilion 0.58.1

Published **2026-11-24**. A fix for keeping your place in a conversation. The embedded Pi engine
stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.58.1).

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.58 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.58.1
bazilion dashboard
```

Then reload the Bazilion tabs you had open.

### Fixed

- **Going to another Agent and back keeps where you were in the conversation.** The web UI's
  router also restored scroll positions, by where a scrolling area stands on the page, and every
  conversation stands in the same place. So after each switch it put the previous conversation's
  position on the next one: an Agent opened where the previous one had been scrolled to, and
  coming back opened where the other Agent had been left. Each conversation now keeps only its
  own place in a new tab; a tab already open before the upgrade still needed
  [0.58.2](#bazilion-0582).

## Bazilion 0.58.0

Published **2026-11-23**. The app says what things do. Connections are named by their effect, an
Agent gets its job when you add it, every Agent has one name in its Team, a Team's day fits on
one screen, and Agents can work in your mail, calendar, chat and notes through four common
connections, asking you before anything goes out. The embedded Pi engine stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.58.0) and
[MCP servers](/docs/tools/#mcp-servers).

![Setup, MCP: Common connections for Microsoft 365, Google Workspace, Slack and Notion, each with a Connect button.](/screenshots/common-connections.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.57 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.58.0
bazilion dashboard
```

If a Team already has two Agents with the same name, both keep working; rename one to make the
name unique.

### Added

- **Common connections.** **Setup → MCP** lists Microsoft 365, Google Workspace, Slack and
  Notion. Each is a third-party MCP server that runs on your computer, and connecting one asks
  only for what it needs: nothing for Microsoft 365 (ask an Agent to sign in), an OAuth client
  for Google Workspace, a token for Slack or Notion. From the CLI: `bazilion mcp presets` and
  `bazilion mcp add <name> --preset <id>`.
- **Tools that ask first.** An MCP tool whose name says it sends, posts, replies, shares,
  creates, updates, moves or deletes something waits for your **Allow once**, as a risky shell
  command does: in the conversation, in Telegram after 30 seconds, and in Attention. In a turn
  nobody can answer it is refused, so nothing goes out unseen. After **Test** you can tick or
  untick single tools; every other tool, one the server adds later too, keeps following the rule.
- **A server's own variables.** A token or a client id is stored encrypted, shown by name only,
  and given to that server alone: **Variables** on its row, or `--env`.
- **What is it for?** **Add an Agent** asks for the Agent's job (`agent spawn --role`). With one,
  the Agent starts working instead of asking its name and purpose.
- **Today.** A Team's overview shows its day: hand-offs and replies between its Agents, files
  delivered, conversations worked in, and the questions and approvals waiting, newest first.
  `bazilion team today <team>` prints the same.

![The Launch Team's day: Quill waiting on a question, conversations worked in, files delivered and Mira's hand-offs, newest first.](/screenshots/team-today.webp)

### Changed

- **Connections say what they do.** The modes are **Everyone** and **Connections only**. Drawing
  a connection between teammates of an open Team asks whether to switch it to Connections only,
  since the connection would otherwise change nothing.
- **One name per Agent.** The name an Agent gave itself shows next to its own, and the Agent tab
  offers to make it its name; teammates reach it by either. Two Agents of a Team can no longer
  share a name, whatever its case.
- **Changes** shows only for a Team whose folder is a Git repository, and the Team tab keeps the
  folder's path behind **Show the folder**.
- **Stop** says that it paused the follow-ups waiting behind the turn. Team templates say
  **Use**. The Mailbox's tool for trying a message from a teammate is folded at the bottom.

### Fixed

- **Setup → System** and `bazilion doctor` name a skill that cannot be read, and say where to
  fix it.
- A dialog that was just closed no longer takes the focus back from **Jump to**.

### Limits

- Common connections are other people's programs; each one's own guide is the reference.
  Notion's remote server, which signs in only through a browser, cannot be connected.
- Which tools ask first is judged from their names until you choose: look at the list after
  **Test**.
- With host execution an Agent's shell runs as you: a server's variables are kept out of its
  environment, not out of its reach. The Docker sandbox keeps them out.

## Bazilion 0.57.1

Published **2026-11-23**. A fix for browser tabs left open across an upgrade. The embedded Pi
engine stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.57.1).

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.57 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.57.1
bazilion dashboard
```

Then reload the Bazilion tabs you had open.

### Fixed

- **A tab opened before an upgrade no longer fails** on a part it had not loaded yet, such as the
  Connections map. Such a tab showed "Could not load this page — Failed to fetch dynamically
  imported module", which **Retry** could not fix; it now reloads itself once to get the new
  version, and otherwise says that Bazilion was updated and offers **Reload**. Tabs opened before
  0.57.1 still need one reload by hand.
- **⌘K or Ctrl+K just after closing a dialog** opens **Jump to** again.
