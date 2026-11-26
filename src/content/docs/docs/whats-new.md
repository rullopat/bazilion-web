---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.62.0 bundles Pi 1.6.0.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.62.0

Published **2026-11-26**. Bazilion stops assuming two numbers: how many tokens a model reads, and
how long Agents may talk to each other. A local model's context window comes from its server or
from you, and an exchange between Agents lasts as long as the work needs. **Setup → System** shows
the version Bazilion runs. The embedded Pi engine stays at 1.6.0. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.62.0).

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

Or `npm install -g bazilion@0.62.0`. The database schema is unchanged, so a 0.26, 0.27 or 0.50 to
0.61 home opens as it is. A local model on LM Studio or Ollama has its window once the server
has loaded it: before a first turn on a model that is not loaded, set its window on
**Setup → Models**, or load the model first.

### Added

- **Context windows from the server, or from you.** Each turn asks the local server the window
  it loaded the model with: llama.cpp, LM Studio 0.4 or later and Ollama say it. When the server
  does not, set it on the model's row on **Setup → Models**, or with
  `bazilion provider window <provider:model> <tokens>`. A turn on a model whose window nothing says
  is refused at once, saying where to set it ([context windows](/docs/configuration/#context-windows)).
- **Exchanges between Agents without a length limit.** An exchange stops when its Agents go round
  in circles (one sends another the same message again: it is not delivered, and the Agent tells
  you where the work stands) or when you stop it. A woken Agent reads the exchange so far and ends
  it when it no longer moves the first request forward. While one goes on, **Connections** shows
  it under **Going on now**, with how many messages, what it used and **Stop**
  ([mailbox](/docs/concepts/#mailbox)).
- **The version in Setup → System**, first on the page; `bazilion doctor` prints it too.

### Changed and fixed

- A local model on a 32k llama.cpp server stopped answering a few seconds into a reply: every
  local model was taken to read 32,768 tokens, and its conversation was summarized again on every
  turn, so the prompt cache never held and the reply had almost no room. Summaries are now sized
  to the window, and a reply may use what the window leaves.
- The **Messages between Agents** setting (`BAZILION_AGENT_LOOP_MAX_HOPS`) is gone, and
  `bazilion inbox loop-breaks` is now `bazilion inbox stopped`.

### Limits

- LM Studio and Ollama say nothing about a model before it is loaded.
- A window too small for Bazilion's instructions and tools (about 9,500 tokens) is not refused up
  front: replies are cut.
- Two Agents that keep asking each other new, different things are not stopped by Bazilion: they
  judge it, and you can stop it. A reworded repeat is not caught.

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
