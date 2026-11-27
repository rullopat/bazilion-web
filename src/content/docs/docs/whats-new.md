---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.64.0 bundles Pi 1.6.1.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.64.0

Published **2026-11-27**. Agents set their own schedules, ask for secrets without seeing them,
read pictures, PDFs and voice notes, and split work among helpers. The embedded Pi engine stays at
1.6.1. See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.64.0).

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

Or `npm install -g bazilion@0.64.0`. The database schema changes (schedules gain a one-time kind,
the conversation they run in and who set them). As with 0.63.0, the daemon copies the database to
`upgrades/` in the home when it first starts, then migrates it in one transaction; every schedule
and its runs are kept. To go back to 0.63.0, put that copy back first
([upgrading](/docs/getting-started/#upgrade)).

### Added

- **Schedules an Agent sets.** Ask "remind me on Friday at nine" or "check the deploy again in two
  hours", in chat or on Telegram, and the Agent sets the schedule itself: once, every few minutes
  or a cron expression. It runs in the conversation it was set in. Schedules can now run
  **once**, and you can **change** any schedule; the ones an Agent set are marked with its name
  ([schedules](/docs/operations/#schedules)).
- **Secrets an Agent asks for.** When an Agent needs a token, it asks for it by name and you type
  it into a masked field (on Telegram, a link to it; in a terminal,
  `bazilion agent secret set`). The Agent never sees the value: its commands get it as an
  environment variable, and `web_fetch` sends it only to the hosts you allowed. Each Agent has a
  **Secrets** sheet ([questions](/docs/questions/#secrets-an-agent-asks-for)).
- **Pictures, PDFs and voice notes.** `view_image` shows the Agent several pictures at once, from
  files, the web or its saved results; `pdf_read` reads a PDF page by page. With a model chosen
  under **Transcription** on **Setup → Models**, voice notes and audio you send are turned into
  words before the turn ([files in and out](/docs/tools/#files-in-and-out)).
- **Helpers.** An Agent can run copies of itself on separate tasks at once and wait for their
  answers, which keeps each task's pages out of its own context. Each helper works in a
  conversation of its own, listed on the Agent's **Helpers** sheet with **Stop**
  ([tools](/docs/tools/#helpers)).

### Changed

- Tool output reaches the model and the transcript with secrets and Bazilion's own credentials
  taken out, not only what the chat shows.
- `web_fetch` takes request headers, for APIs that need a key.

### Limits

- A secret is kept out of the conversation, not sandboxed: a command can still send it elsewhere,
  and only its exact value is taken out of output.
- Scanned PDFs have no text, and there is no OCR. A transcription is not counted in Usage.
- Helpers and waiting secret requests live in the daemon's memory: a restart stops them.

## Bazilion 0.63.0

Published **2026-11-27**. Upgrades keep your home: the daemon migrates the database when it starts,
so a 0.62 home moves to 0.63 without a reset. Agents get better tools: commands that keep running,
approvals that remember, search filters, a browser for checking web apps, questions in one card,
recall across conversations and pictures from pictures. The embedded Pi engine moves to 1.6.1.
See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.63.0).

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

Or `npm install -g bazilion@0.63.0`. The database schema changes (one new table, for remembered
command rules). When it first starts, the daemon copies the database to `upgrades/` in the home,
migrates it in one transaction and checks the result before it commits; a failed upgrade changes
nothing. Homes from 0.26 on are upgraded. To go back to 0.62.0, put that copy back first
([upgrading](/docs/getting-started/#upgrade)).

### Added

- **Commands that keep running.** An Agent can start a dev server, a watcher or a long build in
  the background. The daemon keeps it past the turn, the Agent reads its output, types into it or
  stops it, and is woken when it ends. **Background jobs** in the Agent's panel and
  `bazilion job list|show|stop` show them, with Stop.
- **Approvals that remember.** **Always for this Agent** keeps a rule for the start of a dangerous
  command, such as `git push`: on the card, in a terminal chat or on Telegram. The rules are on
  the Tools page and in `bazilion approval rules`. **A review model first** lets a model you
  choose allow or refuse each dangerous command, or pass it to you.
- **File tools in Docker mode**, and `apply_patch`, which changes several files in one step.
- **Search filters**: how recent, which sites, a country and a language. **Tavily** and **Exa**
  join the search backends. A page longer than what `web_fetch` returns is saved whole for the
  Agent to read on.
- **A browser for checking web apps**: page errors, failed requests, the page's text, waiting,
  a phone, dark mode, a locale or a time zone, screenshots of one element and PDFs. Files a page
  downloads in an Agent's own browser are saved with its uploads.
- **Questions in one card.** An Agent can ask several questions at once, a question can take
  several choices, and it can ask you to do something only you can do, such as signing in: your
  **Done** or **Can't** starts its next turn ([questions](/docs/questions/)).
- **Quiet messages** between Agents, which wait in the inbox without starting a turn.
- **Recall across conversations**: the Agent searches and reads its own earlier conversations.
- **Pictures from pictures**: `image_generate` starts from pictures in the workspace or uploads,
  and can make one in the background, waking the Agent to show it.
- **Files in MCP tool results** reach the Agent: text as text, others saved with its uploads.

### Changed and fixed

- **Dangerous commands** on the Commands card is a choice: off, ask you, or a review model first.
- With Pi 1.6.1, more temporary provider failures are retried, ChatGPT GPT-6 turns use the
  Agent's reasoning level instead of medium, very long conversations load again, and MCP servers
  that send request ids back as strings no longer time out.

### Limits

- A remembered rule covers one simple command: no chains, pipes or redirections.
- A job still running at a restart wakes its Agent when the daemon comes back; an unanswered
  request to do something, and a picture still being made, are lost on a restart.
- SearXNG takes no dates or country, and the model's own search no dates or exclusions.
- A sign-in in the Agent's own headless browser needs a visible window or your running Chrome.

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
