---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.58.0 bundles Pi 1.6.0.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

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

## Bazilion 0.57.0

Published **2026-11-23**. A release of polish and fixes. Agents know who their teammates are and
add teammates when you ask; the web UI follows changes made anywhere, keeps your place in each
conversation, and no longer resets what you are reading when a turn ends. A walk-through of the
whole app found sixteen more rough edges, and most are fixed here. The embedded Pi engine stays
at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.57.0) and the
[Agents concepts](/docs/concepts/#agents).

![Mira's conversation with a hand-off card for three teammates, and the Connections tab beside it.](/screenshots/handoffs.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.56 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.57.0
bazilion dashboard
```

### Added

- **Agents know their teammates.** Every turn tells an Agent its teammates' names and ids, which
  of them Team Policy lets it message, and the Agents of other Teams it may reach. You no longer
  paste ids into the chat, and `send_message` takes a teammate's name.
- **Agents add teammates when you ask.** The new `agent_create` tool adds an Agent to the asking
  Agent's own Team, with its model and template unless it names others. The new Agent starts
  knowing its role and who made it, without the first-run questions; in a restricted Team it is
  connected with its creator both ways. Only in a turn you started (a chat, a follow-up,
  Telegram), at most six per turn.

### Changed

- **The page follows changes made elsewhere.** A Team or an Agent created, renamed, moved or
  archived from a terminal, by an Agent running `bazilion` or in another tab shows up without a
  reload. A question asked or answered elsewhere comes and goes in the open conversation.
- **Your place is kept.** Going to another Agent and back opens the conversation where you left
  it, with your unsent text still in the composer. A finished turn reloads the diff, Files and
  the panels while they stay on screen, instead of flashing "Loading" and jumping to the top.
- **The first-run questions wait for you.** A new Agent whose first message comes from a teammate
  or a schedule does the work instead of asking what to call it, and the questions skip what
  USER.md already says.
- **A stopped reply says so**, and on a narrow screen the side panel closes with Escape. The
  button is called **Add an Agent** everywhere.

### Fixed

- Long Team, Agent or model names no longer push the conversation bar's menu and panel button out
  of reach.
- A Team whose folder is not a Git repository no longer logs a failed request each time one of
  its Agents is opened, and `bazilion team review show` says so instead of crashing.
- A memory note named without `.md` gets it, and a name leaving the memory folder is refused with
  a clear message.
- What you type straight after ⌘K or Ctrl+K is kept, and closing **Jump to** gives the focus back.

### Limits

- Kept places and drafts last while the page is open; a reload opens every conversation at its
  end.
- `agent_create` adds Agents to the asking Agent's own Team only; it does not create Teams.

## Bazilion 0.56.0

Published **2026-11-23**. Nothing goes wrong unnoticed: **Usage** shows what your Agents' model
calls cost, per day, Team, Agent, model and conversation; a background turn that fails is in
Attention; and **Jump to** searches your conversations. Checks on CI now compare pictures of the
web UI and scan every page for accessibility, and what they found is fixed. The embedded Pi
engine stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.56.0) and
[Usage in the web interface](/docs/web-interface/#manage).

![Manage, Usage: $96.57 spent in the last 30 days, 23M tokens of which 5.8M on a subscription, a bar per day, and the totals by Team.](/screenshots/usage.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.55 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.56.0
bazilion dashboard
```

Attention notifications in Telegram keep the kinds you chose: to be told about failed turns,
tick **Failed background turns** under **Setup → Telegram**.

### Added

- **Usage and cost.** **Manage → Usage** and `bazilion usage` show tokens and dollars per day,
  Team, Agent and model, for today, 7, 30 or 90 days or everything, with a bar per day you can
  read with the arrow keys. Each conversation's use is under its title in the conversation menu
  and in `bazilion conversation list`. The cost is what the provider billed when it says
  (OpenRouter does), otherwise Pi's catalog price, marked as an estimate. A ChatGPT plan, Copilot
  and the Qwen and Xiaomi MiMo token plans count in tokens only, as do models on your computer.
- **Failed background turns in Attention.** A follow-up sent from the web, a terminal or
  Telegram, or a turn for new mail, that fails is listed once per Agent and cause, so an expired
  key is one line however many turns it stopped. A later failure of the same cause opens it again.
- **Search your conversations.** Three characters or more in **Jump to** list the messages holding
  every word, with the words marked; one opens its conversation at that message.
  `bazilion conversation search` does the same in a terminal. A stored key is never found.
- **When a schedule runs next**, in the Schedules sheet and `bazilion trigger list`.
- **Text previews for every kind of text file** in Files, and a text file's first lines on its
  tile. HTML and SVG stay download-only.

![Jump to with "dark mode" typed: messages from Pixel, Quill, Dev and Mira that hold both words, each with its Agent and conversation.](/screenshots/search.webp)

### Changed

- **Easier to read and to use without a mouse.** Grey text is a step darker, and code and table
  headers use the darker ink, so everything reaches 4.5:1 contrast. Controls say what they show
  to a screen reader, buttons no longer sit inside fold-outs, and links among a row's facts are
  underlined.
- **Agent templates** cannot have a blank name.

### Fixed

- In the conversation header, a long conversation title no longer squeezes the Agent's name to
  one letter.
- Team messages sent in the same millisecond keep the order they were sent in.

### Limits

- Usage counts what conversations used: learning reviews, provider tests and generated images
  are not counted, and a deleted Agent's use goes with it.
- A failed turn for new mail is kept in the daemon's memory: a restart forgets it.
- Search looks at what a conversation shows; tool output is not searched.
