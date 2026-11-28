---
title: What's new
description: The latest ten Bazilion releases, newest first; Bazilion 0.66.0 bundles Pi 1.6.1.
---

The latest ten releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.66.0

Published **2026-11-28**. Agents find their tools when they need them and run one script for
several calls, each message shows when it was sent, and you tell an Agent in the conversation which
browser to use. Reviewed learning is removed; the lessons you approved are kept. The embedded Pi
engine stays at 1.6.1, whose own `tool_search` and `codemode` Bazilion now uses. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.66.0).

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

Or `npm install -g bazilion@0.66.0`. The database schema changes (reviewed learning's tables and
settings go). The daemon copies the database to `upgrades/` in the home when it first starts, then
migrates it in one transaction; the lessons you approved for one Agent are then added to its
`AGENTS.md` ([upgrading](/docs/getting-started/#upgrade)).

### Added

- **Tool search.** Agents no longer get every MCP tool up front: the prompt lists each connection
  with how many tools it has, and the Agent loads the ones a task needs with `tool_search`; they
  stay for the rest of the conversation. Many connections no longer fill the model's window
  ([tools found when needed](/docs/tools/#tools-found-when-needed)).
- **Code Mode.** With `codemode` the Agent writes one short script that calls several of its tools,
  MCP tools included, and hands back only what matters. Scripts run in a sandbox with no network or
  files; the conversation shows **Ran a script** with the calls it made, and a dangerous command or
  a tool that asks first still waits for you ([scripts](/docs/tools/#scripts)).
- **When each message was sent.** Every message shows its time under it, as in a messaging app, and
  a line before each day's first message says **Today**, **Yesterday**, the weekday or the date,
  in your browser's language and time zone; earlier conversations too
  ([the conversation](/docs/web-interface/#the-conversation)).
- **Which browser, chosen in the conversation.** Tell an Agent "use my Chrome" or "use your own
  browser": it switches with `browser_use` for the rest of that conversation. Moving to your Chrome
  asks you first, in the chat and on Telegram, and is refused where nobody can answer
  ([its own or yours](/docs/tools/#its-own-or-yours-per-conversation)).

### Removed

- **Reviewed learning.** It was off unless switched on, and saw only the selected conversation and
  each tool call as its name. The **Learning** sheet, the `bazilion agent review-config`, `review`,
  `reviews`, `lessons` and `lesson` commands, its two kinds of Attention item and Google Vertex's
  credentials JSON for reviews are gone. Approved lessons for one Agent move into its `AGENTS.md`; Team lessons stay notes in
  its memory. Skills Agents write for themselves are planned to replace it.

### Changed

- The **Browser** card's choice is now **Which browser, unless you say otherwise**, and the Agent's
  **Browser** panel names the browser it is using.
- `/context` counts `codemode` and `tool_search`; MCP tools waiting to be found cost nothing.

### Fixed

- A long command output's full text, which Pi writes to a file in the system's temporary folder,
  kept any credential the command printed. Output now loses the turn's credentials as it arrives,
  and a script's long output file is cleaned when it returns.
- **Add an Agent** picked in Jump to before its lists arrived opened with no Team to choose.

### Limits

- Code Mode adds about 840 tokens to every request. A script's long output file is out of reach of
  a Docker turn.
- An Agent works in one browser at a time. Approval to use your Chrome is asked once per
  conversation; a helper cannot move there itself.
- Lessons waiting for a decision, rejected ones and the history of reviews are dropped; the copy in
  `upgrades/` keeps them.
- Times use the browser's clock; a conversation left open past midnight keeps its day labels until
  it changes or is reloaded.

## Bazilion 0.65.1

Published **2026-11-27**. A tab left open across an upgrade now says so, and the list's handles
for resizing and dragging show. The embedded Pi engine stays at 1.6.1. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.65.1).

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

Or `npm install -g bazilion@0.65.1`. The database schema is unchanged from 0.65.0, so a 0.65 home
opens as it is, and an older one is migrated as with 0.65.0
([upgrading](/docs/getting-started/#upgrade)). Then reload the Bazilion tabs you had open, once,
with the browser: a tab still running 0.65.0 cannot tell you yet.

### Fixed

- **A tab open across an upgrade says so.** A tab left open showed the old interface until a full
  browser reload, and **Retry** on **Could not load this page**, which shows while Bazilion
  restarts, kept the old page. Now a tab running an older version shows **Bazilion was updated**
  with **Reload**, and **Retry** reloads the whole page. What you typed and had not sent stays in
  the message field.
- **The list's handles show.** The edge that resizes the list is a faint line with a grip at its
  middle, and a Team or Agent row you point at shows a grip, to drag it into place.

## Bazilion 0.65.0

Published **2026-11-27**. Agents make videos, music and sound, speak and hear, and work in the
workspace with you; the list on the left takes your order and width, and what arrives from
elsewhere shows at once. The embedded Pi engine stays at 1.6.1. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.65.0).

### Install or upgrade

```sh
curl -fsSL https://bazilion.com/install.sh | bash
```

Or `npm install -g bazilion@0.65.0`. The database schema changes (Teams and Agents get a place in
the list, numbered in the order they had). The daemon copies the database to `upgrades/` in the
home when it first starts, then migrates it in one transaction. To go back to 0.64.0, put that
copy back first ([upgrading](/docs/getting-started/#upgrade)).

### Added

- **Videos, music and sound.** Choose a model on the new **Video** and **Music and sound** cards
  (Grok Imagine Video, Gemini Omni Flash, MiniMax H3; ElevenLabs, Lyria) and Agents make short
  clips from a prompt or a picture, songs, jingles and sound effects. They play in the chat and
  under Files, and go to Telegram. ElevenLabs is a new account for media only
  ([video and sound](/docs/tools/#video-and-sound)).
- **Speech, both ways.** A **Speech** card with the provider's voices and a sample; `speak`;
  **Read aloud** on every Agent message; voice notes on Telegram answered by voice. With a
  Transcription model, dictation in the composer and `transcribe` for recordings, now through
  Gemini, xAI, Groq, Mistral and ElevenLabs besides OpenAI ([speech](/docs/tools/#speech)).
- **The Agent in the workspace.** It opens the Changes or Files tab, a view or its schedules for
  you, switches the theme when asked, keeps one progress card per long task (one edited message
  on Telegram), and shows small HTML pages and SVG drawings in the chat in a sealed frame
  ([web interface](/docs/web-interface/#the-conversation)).
- **The list in your order and width.** Drag Teams and Agents, or Move up and Move down; the order
  is kept for every browser and the CLI (`bazilion team order`, `agent order`). Drag the list's
  edge to resize it ([the list](/docs/web-interface/#the-list)).

### Changed

- What a teammate, Telegram, a schedule or a follow-up adds to the open conversation shows at
  once and flashes for a moment, instead of waiting behind **Show it**. A teammate's message shows
  open, with who wrote it.

### Limits

- Not offered because their providers shut them down: OpenAI's Sora and speech endpoint, and Veo
  on the Gemini API.
- What is made is saved like any result, at most 25 MiB a file; making, speaking and transcribing
  are not counted in Usage.
- A canvas has no network, so it cannot load libraries from a CDN.

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
