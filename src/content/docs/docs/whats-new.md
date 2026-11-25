---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.61.0 bundles Pi 1.6.0.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.61.0

Published **2026-11-25**. Bazilion installs with one line and nothing installed first, and on a
Mac it then opens like any app. The installer brings its own Node.js, adds the **Bazilion** app
to Applications, keeps Bazilion running in the background from login on, and opens it in your
browser, already signed in. The embedded Pi engine stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.61.0) and
[getting started](/docs/getting-started/#install-on-a-mac).

![The Bazilion app's icon: the Bazilion cat on a cream rounded square.](/screenshots/bazilion-app-icon.webp)

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.60 home opens as it is. Stop a
`bazilion dashboard` you run in a terminal first: the app's Bazilion uses the same ports. The line
installs its own copy beside one you installed with npm or the earlier installer; keep using
that one instead (`npm install -g bazilion@0.61.0`, then `bazilion app install` for the app), or
remove it with `npm uninstall -g bazilion`.

### Added

- **One line, nothing else first.** The installer downloads Node.js 26.12.1 from nodejs.org,
  checks it against the published checksums, and installs it and Bazilion in
  `~/.local/share/bazilion`, with a `bazilion` command in `~/.local/bin`. It no longer uses Volta,
  changes no shell settings and asks for no password. Running it again updates.
- **The Bazilion app on a Mac.** Opening it starts Bazilion when it is not running and opens it in
  your browser, signed in. Bazilion runs in the background from login on, and starts again if it
  fails. `bazilion app install`, `app status` and `app remove` manage it.
- **Signed in without a token.** The installer, the app, `bazilion dashboard` and the new
  `bazilion open` open the browser with a link that works once, for two minutes. A token is
  needed only on another device; the login page says so.

### Limits

- Terminal is still needed once, for the line. A downloadable app needs Apple's notarization and
  is not available yet.
- Windows is not supported. On Linux the installer installs Bazilion but adds no app.
- Updates are not automatic: run the same line again.
- The background Bazilion does not see your shell's variables, such as provider keys: keep keys in
  **Setup**.

## Bazilion 0.60.1

Published **2026-11-25**. An Agent tells you what a teammate brought back. The embedded Pi engine
stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.60.1) and the
[mailbox](/docs/concepts/#mailbox).

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 to 0.60 home opens as it is. Stop the
daemon, then:

```sh
npm install -g bazilion@0.60.1
bazilion dashboard
```

### Fixed

- **A teammate's answer reaches you.** When an Agent handed out work and the teammate replied,
  the Agent was told that no response was required, and it sometimes ended its turn without a
  word. What the teammate found then stayed in a closed **Update from …** line in the
  conversation, and the file it named never reached Files. Now the Agent still sends nothing
  back to the teammate, but tells you in a few lines what came back and delivers the files the
  reply names, so they show in Files. A reply that only acknowledges gets one line.

### Limits

- The model still decides what is worth telling you and which files you should see.
- Replies that arrived before the upgrade are not replayed: ask the Agent for a result you
  missed.

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
