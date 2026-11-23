---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.57.0 bundles Pi 1.6.0.
---

The latest four releases, newest first. Older releases are in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

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

## Bazilion 0.55.0

Published **2026-11-22**. What an Agent waits on came to reach you at once, and wherever you are.
The web UI is pushed every change instead of asking every few seconds, so a question shows the
moment it is asked. The browser can show a desktop notification when Bazilion is in the
background, a command waiting for your approval can be decided from Telegram, and on a phone the
Agents waiting for you are above the list. The embedded Pi engine moves to 1.6.0, with GPT-6.2.
See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.55.0) and
[the tour of the web interface](/docs/web-interface/#live-and-notifications).

### Upgrade: install and start again

The database schema was unchanged, so a 0.26, 0.27 or 0.50 to 0.54 home opened as it was. Stop the
daemon, then:

```sh
npm install -g bazilion@0.55.0
bazilion dashboard
```

Two settings may need you:

- **Qwen Token Plan:** each plan has its own key now (`QWEN_TOKEN_PLAN_TEAM_API_KEY`,
  `QWEN_TOKEN_PLAN_TEAM_CN_API_KEY`, `QWEN_TOKEN_PLAN_INDIVIDUAL_API_KEY`,
  `QWEN_TOKEN_PLAN_INDIVIDUAL_CN_API_KEY`). Enter yours again under **Setup → Models**.
- **llama.cpp:** Bazilion now looks for llama-server on its current default address,
  `http://127.0.0.1:9931/v1`. If yours listens on 8080, set its address under **Add a provider →
  llama.cpp** (`LLAMACPP_URL`).

Models your Agents already use are not changed.

### Added

- **Live updates.** The daemon pushes what every Agent is doing and what is open in Attention as
  it changes (`GET /api/events`). The list, the conversation, the overview, the top bar's count,
  the tab title and the Attention page follow it. One tab per browser holds the connection and
  shares it with the others. While it cannot connect, the pages ask every few seconds, as before.
- **Desktop notifications.** **Notify me on this computer**, in the menu at the end of the top
  bar, turns them on for this browser. When an Agent starts waiting for you and no Bazilion tab
  has the focus, a notification names the Agent and its question or command; clicking it opens
  the conversation.
- **Commands to approve, in Telegram.** A command still waiting after half a minute is posted in
  the Agent's topic with **Allow once** and **Deny**. Only the paired owner can use them. The
  message says how it was decided, there or anywhere else.
- **Waiting for you, on a phone.** Above the Agent list, a strip names the Agents waiting for you,
  one tap from their question.

<img src="/screenshots/phone-waiting.webp" width="320" alt="On a phone: a Waiting for you strip with Quill and its question above the list of Teams." />

### Changed

- **A command waits five minutes** for your decision, as long as a question, instead of two.
- **Pi 1.6.0.**
  - GPT-6.2 Sol and GPT-6.2 Astra are in the catalogs of ChatGPT, OpenAI and Azure.
  - GPT-6.2 Sol is the model ticked first when you connect ChatGPT or OpenAI.
  - Gemini 4 Carbon, Hydrogen and Neon are in the Google catalogs.
  - The Qwen Token Plan team plans are listed as Qwen Token Plan Team, and each plan has its own
    key.

### Fixed

- **A terminal chat** (`bazilion agent chat`) stopped when the command it was asking about had
  been decided elsewhere or had timed out. It now says so and goes on.
- **Jump to** did nothing when Enter was pressed before its lists had arrived (0.54.0). It now
  opens the first match as soon as they do.
- **Shortcuts** (`?`, `/`) did nothing while a closed dropdown kept the focus after a pick
  (0.54.0). Only an open dropdown holds the keys now.

### Limits

- Questions and commands waiting for approval still live in the daemon's memory: a daemon restart
  ends them.
- Browsers offer desktop notifications on `https://` addresses and on this computer only.
- Turns started from Telegram still deny flagged commands; only commands from a chat you are
  watching, on the web or in a terminal, can be approved there.
- Desktop notifications come with the live updates: while those are down, none are shown.
- The new browser tests run the built package in Chrome on Linux, as part of every pull request.
  They check every page in two languages and time zones, the live updates, answering a question,
  the dropdowns and shortcuts, the phone layout and the notifications switch.

## Bazilion 0.54.0

Published **2026-11-22**. 0.54.0 made the web UI agree on what needs you. An Agent's question or
command to approve came first in **Attention**, the top bar's count and the browser tab stayed
current, and an Agent blocked on you read **Waiting for you** everywhere. The workspace opened on
an overview, its sheets used the same cards as Setup and Manage, **Jump to** ran actions, and
keyboard shortcuts moved you around. The embedded Pi engine stayed at 1.5.2. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.54.0) and
[the tour of the web interface](/docs/web-interface/).

![The workspace with nothing open: an overview of who is waiting for you, who is working, the Teams and the latest files.](/screenshots/overview.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27, 0.50, 0.51, 0.52 or 0.53 home opens as it is.
Stop the daemon, then:

```sh
npm install -g bazilion@0.54.0
bazilion dashboard
```

Nothing is set or moved by the upgrade. A Team you already have keeps its USER.md as it is,
starter text included; only new Teams start with an empty one. Clear the old text under **About
you** in the Team tab if you want Agents to fill it in from scratch.

### Added

- **What waits on you comes first in Attention.** An Agent's open question and a command waiting
  for your approval are Attention items, listed before everything else, soonest to expire first,
  each with the time it stops waiting. **Answer** and **Decide** open the Agent's conversation.
  `bazilion attention list` shows them as `agent_question` and `command_approval`. They are not
  sent as Telegram notifications; a question asked from Telegram is answered there.
- **An overview to open on.** With nothing open, the workspace shows who is waiting for you, who
  is working, every Team with its members, the latest files from every Team and the Agents that
  were active last.
- **Tab titles.** The browser tab names the page (`Mira · Launch — bazilion`, `Models · Setup —
  bazilion`) and counts what waits for you (`(1) Quill · Launch — bazilion`).
- **Jump to runs actions.** Agents waiting for you come first, then those working. It can start a
  new conversation with the open Agent, add an Agent, switch the theme and list the shortcuts, and
  it shows recent conversations.
- **Keyboard shortcuts.** `?` lists them, `/` writes to the open Agent, Alt+↑ and Alt+↓ (⌥ on a
  Mac) open the previous or next Agent, and ⌘. or Ctrl+. shows or hides the side panel. Keys
  without ⌘ or Ctrl wait while you type in a field or a list is open.

![Jump to with Quill waiting for an answer at the top, Scout working, and actions to start a conversation, add an Agent, switch the theme and list the shortcuts.](/screenshots/palette.webp)

### Changed

- **One phrase for an Agent blocked on you.** The list, the conversation's steps, the line under the
  conversation, Jump to and the Team say `Waiting for you` in amber; green and `working` mean it is
  working. `bazilion activity` says the same.
- **The top bar** has three places, **Attention**, **Manage** and **Setup**, and a menu at the
  end with the theme and **Log out**. The count on Attention stays current on every page.
- **The workspace's sheets use the shared cards.** Schedules, learning, the mailbox, skills,
  Telegram, the browser, About you, memory and a Team's settings look and work like Setup and
  Manage. Schedules read as words (`Weekdays at 09:00`) and are added in a dialog with presets,
  with cron kept for the rest. Memory notes are listed by title and read formatted. Skills are
  switched on and off. The mailbox names Agents instead of showing ids.
- **USER.md.** A new Team's USER.md starts empty and the Team tab invites you to write it; its
  Agents fill it in as they learn about you. The **About you** editor reads it afresh when it
  opens. A save made from text an Agent has changed since is refused, so the Agent's lines are
  not lost.
- **One kind of dropdown everywhere,** drawn like the model menu. The Agent tab saves a model or
  reasoning change at once, with **Undo**. The Files tab and the gallery filter by kind and by
  whom in the same way.
- **Smaller things.** Headings use the text face, except page titles and the Agent's name, on one
  type scale. A new or deleted file opens in one column in Changes, and a new Markdown file has a
  **Preview**. The conversation's header stays on one line. The side panel's tabs scroll on a
  phone. **Edit** sits under your last message. A Team opened on its own lists its members once.

![Mira's schedules: a schedule that reads Weekdays at 09:00 with its message and a switch, and the recent runs below.](/screenshots/schedules.webp)

### Fixed

- **Manage → Skills** showed a skill with a scan finding one letter per line (0.53.0).

### Limits

- Questions and commands waiting for approval live in the daemon's memory: a daemon restart ends
  them, and with them their Attention items.
- The changes were checked by hand and by script in Chrome on macOS, at desktop and phone width
  and in the dark theme, with a stand-in model server; the automated tests cover their logic on
  Linux but do not drive a browser.
