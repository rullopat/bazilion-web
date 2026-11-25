---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.60.0 bundles Pi 1.6.0.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.60.0

Published **2026-11-25**. The Agent can reread what a summary replaced. In a long conversation,
older messages are summarized to make room; a new `recall` tool lets the Agent search them and
read them in full when the summary leaves out a detail it needs. The embedded Pi engine stays at
1.6.0. See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.60.0) and
[conversations](/docs/conversations/#compact-and-context).

![Dev's conversation: asked what was asked first, Dev searched the older messages for dark-mode; the step shows the summarized message it found, then Dev answers.](/screenshots/recall.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.59 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.60.0
bazilion dashboard
```

Then reload the Bazilion tabs you had open.

### Added

- **`recall`, in every turn.** It searches the summarized messages of the conversation for
  every word given, tool output included, and reads them in full by number. The Agent uses it
  when the summary leaves out an exact value, a link or your own words, instead of guessing or
  asking you again. Stored credentials are never shown.
- **The step says what it did:** **Searched older messages for …** or **Reread older
  messages**. Open it to see what the Agent found.

### Limits

- It reads only the current conversation, and only its summarized part.
- Words are matched as written (case ignored), not by meaning.
- A message longer than about 20,000 characters is cut, even when read alone.

## Bazilion 0.59.0

Published **2026-11-25**. Long conversations keep working: near the end of the model's window,
older messages are summarized instead of every reply being cut to a few words. The whole
conversation stays on the page, and the conversation bar says how full the window is. With
browser attach on, your own Chrome keeps its downloads and its settings. The embedded Pi engine
stays at 1.6.0. See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.59.0)
and [conversations](/docs/conversations/#compact-and-context).

![Dev's conversation: earlier messages above a line that says they were summarized to make room, the summary open below it, and 1K / 33K beside the model in the bar.](/screenshots/compacted-conversation.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.58 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.59.0
bazilion dashboard
```

Then reload the Bazilion tabs you had open. A conversation that is already nearly full is
summarized during its next turn.

### Added

- **Automatic compaction.** When a conversation comes within about 16,000 tokens of the model's
  window, the turn summarizes older messages and keeps the last 20,000 tokens or so as they are,
  and redoes a reply the full window cut short. While it runs, the conversation says so.
- **The whole conversation stays.** Summarized messages stay on the page above a line that says
  so; **Show the summary** shows what the Agent reads in their place. It stays one conversation,
  with its files and follow-ups, and search still finds those messages. `/compact` works the same
  way.
- **How full the window is.** The conversation bar shows `41K / 272K`, amber past 80%;
  `bazilion agent chat-context` prints the same figure.

### Fixed

- **A full conversation no longer cuts every reply to a few words.** Compaction used to run only
  on `/compact`, so a conversation that filled the window left each reply 16 tokens.
- **Hand-offs that did not go out say so**, as `not sent`, and a teammate addressed by name shows
  with its name.
- **Editing the last message after a summary keeps the summary.**
- **Browser attach leaves your own Chrome alone.** Your downloads went nowhere while Agents
  worked in your Chrome, and your tabs were forced to light mode. Now only a download started in
  an Agent's tab is cancelled.

### Limits

- Each summary is one model request over the conversation, billed like a turn.
- The size shown is what the model reported for its last reply; right after a summary it is
  unknown until the next reply.
- A local server's model is taken to have a 32,768-token window, so its conversations are
  summarized from about 16,000 tokens.

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
