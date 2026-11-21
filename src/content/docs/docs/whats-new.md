---
title: What's new
description: The latest four Bazilion releases, newest first; Bazilion 0.51.0 bundles Pi 1.5.2.
---

The latest four releases, newest first. Older releases are summarised on
[Previous changes](/docs/previous-changes/) and in
[GitHub Releases](https://github.com/rullopat/bazilion/releases). Each section describes its own
release; the rest of the documentation describes the current one.

## Bazilion 0.51.0

Published **2026-11-21**. Setup is sorted by what a model does for your Agents, and a provider is
connected in one step that tests it before anything is saved. The embedded Pi engine stays at
1.5.2. See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.51.0) and
[providers and models](/docs/configuration/#providers-and-models).

![Setup, Models: the chat models with their size, price and who uses them, the image model, and three providers that each say when they were last tested.](/screenshots/models.webp)

### Upgrade: install and start again

The database schema is unchanged, so a 0.26, 0.27 or 0.50 home opens as it is. Stop the daemon,
then:

```sh
npm install -g bazilion@0.51.0
bazilion dashboard
```

Providers you had switched on keep working. They read "Not tested yet" until you press **Test
them** on the Models page or run `bazilion provider test <id>`. A key that was saved but never
switched on shows as "Saved, not in use", with a **Connect** button. A 0.25 or older home still
needs the reset described in [Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260).

### Added

- **Setup opens on Models (`/config`).** One page with three cards: **Chat**, the models Agents
  think with; **Images**, the model they draw with, or off; and **Providers**, the accounts and
  local servers behind them. Only the providers in use are listed; the others are behind **Add a
  provider**.
- **What a model is.** Each chat model shows its name, how much it can read, whether it takes
  images, its list price per million tokens and which Agents and templates use it. These facts
  come from the catalog bundled with Pi.
- **Connect in one step.** Paste the key (or sign in with ChatGPT, or give a local server's
  address), keep the suggested models or choose others, and press **Connect and test**. The
  cheapest chosen model is asked for a short reply. Only when it answers are the key and the
  models saved and the provider switched on, so a key that does not work is never stored.
- **A state that was checked.** A provider is "Working", "Key rejected", "Not answering", "Model
  unavailable", "Limit reached", "Not tested yet", "Needs a key" or "Turned off". A failed test
  says what happened and what to do, with the provider's own message beside it. A line above the
  cards names the provider that does not answer.
- **First run on one screen.** `/welcome` is choose, connect, start chatting. **On this computer**
  finds LM Studio, Ollama and llama.cpp at their usual addresses, and **Start chatting** opens
  your first Agent ([getting started](/docs/getting-started/#sign-in-and-connect-a-provider)).
- **Model picker.** **Add models** searches every connected provider, filters by image input or
  reasoning, and folds dated copies of a model away. Removing a model that Agents use says so
  first.
- **CLI.** `bazilion provider connect <id>`, `bazilion provider disconnect <id>` and
  `bazilion provider test <id>`; `bazilion provider list` shows each provider's state.

### Changed

- Installation health, the runtime summary and **Download backup** moved from the top of the
  providers page to **Setup → System** (`/config/system`).
- The image model is chosen under **Images** on the Models page. The Services page no longer has
  a card for it.
- `bazilion provider list` shows only the providers in use; `--all` lists every one.
- A provider cannot be switched on without credentials: `bazilion provider enable` and
  `PUT /api/config/providers/:id/enabled` refuse it.
- `GET /api/config/providers` has a new shape and asks no provider for its model list, so the
  page opens at once whatever a local server is doing. `GET /api/config/providers/:id/models` is
  gone; `GET /api/config/providers/:id/catalog` replaces it.
- The ChatGPT sign-in is shown as "ChatGPT" and Google as "Google Gemini". Provider ids and
  setting names are unchanged.

### Limits

- Prices are list prices from the bundled catalog, not what your account was billed.
- Nothing tests a provider on its own. A state is as old as its last test, and the page says how
  old that is.
- The new pages were checked by hand in Chrome on macOS with a stand-in model server. The
  automated tests cover their logic on Linux but do not drive a browser.

## Bazilion 0.50.0

Published **2026-11-20**. The web UI became one workspace: the conversation, the Team, who may
message whom, the diff of what was written and the delivered files are on one screen, and the list
of Agents says what each one is doing. The version jumped from 0.27 to 0.50 to mark the rework.
The embedded Pi engine stayed at 1.5.2. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.50.0) and the
[tour of the web interface](/docs/web-interface/).

![The workspace: the list of Teams and Agents with a state each, a conversation with its steps, and the Changes tab with a diff.](/screenshots/workspace.webp)

### Upgrade: install and start again

The database schema was unchanged, so a 0.26 or 0.27 home opened as it was. The current commands
are in [Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260).

### Added

- **One workspace on `/`.** Teams and their Agents on the left, the open Agent's conversation in
  the middle, and a side panel with five tabs: Agent, Team, Connections, Changes and Files. The
  address holds what is on screen, so links and the back button work.
- **What each Agent is doing.** Every Agent has a line of its own: `Needs you: 1 question`,
  `Working: writing theme.js`, `Follow-ups paused`, `2 new files` or `Idle`. Before, the list
  showed the lifecycle status, which read `IDLE` for an Agent in the middle of a turn.
- **A transcript that reads.** Tool calls are steps in words with the lines added and removed,
  instead of escaped JSON. A message to a teammate is a hand-off card that shows what the teammate
  is doing now. Delivered pictures show as pictures, a turn that wrote files links to their diff,
  and a question has one button per choice.
- **Connections.** The Team as a map: one line per pair of Agents, an arrowhead for each allowed
  direction and the number of recent messages. Select an Agent or a line to switch each direction
  and to read what they said to each other.
- **Changes.** Changed files with the Agent that wrote each, the diff in one column or with the
  old and the new file side by side, comments on a line or a file, and all comments sent to one
  Agent as one review ([reviewing what changed](/docs/coding-review/)).
- **Files.** A gallery of everything a Team's Agents delivered, by Agent and by kind, with
  details, two files side by side and one zip of the lot ([results](/docs/results/)).
- **Conversations.** An earlier conversation can be continued, not only read, and a conversation
  is named after the first message you send in it ([conversations](/docs/conversations/)).
- **Jump to.** Ctrl+K (⌘K on a Mac) opens any Agent, Team, view or page by name.
- **CLI.** `bazilion activity`, `bazilion team messages <team>`, `bazilion conversation select`,
  `bazilion result archive`, `bazilion result list --conversation` and
  `bazilion team review feedback --line`; `team review show` names who wrote each file.

### Changed

- The Agent pages (`/agents/<id>` with its Inbox, Triggers, Learning and Settings tabs) and the
  Team pages (`/teams/<id>` with its Members, Policy, Memory, Review and Results tabs) are gone.
  Their content is in the side panel and in sheets that open over the workspace. The old addresses
  are not redirected; [Attention](/docs/operations/#attention) items link into the workspace.
- `POST /api/teams/:id/review/feedback` takes
  `{ agentId, comments: [{ path, line?, note? }], note?, base? }`. The 0.27 body with a single
  `path` is refused.

### Limits

- The live states come from polling every three seconds, not from a push channel.
- "New" markers and the layout of the Connections map are kept in the browser, per browser.
- A changed file's author is the Agent whose `write` or `edit` last touched it in its five newest
  conversations. Changes made by shell commands have no author.
- A review that is not sent yet lives in the page and is lost on a reload.
- The workspace was checked by hand in Chrome on macOS with a scripted model. The automated tests
  cover its logic and rendering on Linux but do not drive a browser.

## Bazilion 0.27.0

Published **2026-11-19**. The managed browser works from the first start on Linux and macOS, and
Agents can work in the browser you already have open. The embedded Pi engine stayed at 1.5.2. See
the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.27.0).

### Upgrade: install and start again

The database schema was unchanged, so a 0.26 home opened as it was. The current commands are in
[Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260).

### Fixed

- **macOS found no browser.** The lookup only knew Linux install paths. Chrome, Brave, Edge and
  Chromium are now found in `/Applications` and `~/Applications`. A `BROWSER_EXECUTABLE_PATH` set
  as a workaround keeps working and is no longer needed.
- **A machine without Chrome had no browser.** Playwright's Chromium came from an npm install
  script, which current npm and pnpm skip. The daemon now downloads Chromium itself when no
  browser is installed, at startup or at the first browser action. The Agent page shows the
  download or why it failed, and `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` turns it off.
- **Crash cleanup on macOS.** A browser left on an Agent's profile by a daemon that crashed is
  killed on macOS as well.

### Added

- **Your running browser.** With `BROWSER_ATTACH=true`, Agents work in the Chrome or Chromium you
  have open, signed in as you, in tabs of their own. Your own tabs are never listed, read or
  closed. The daemon's network proxy cannot cover this mode and the Agent acts as you on every
  site you are signed in to: read [Your running browser](/docs/tools/#your-running-browser)
  before turning it on.

### Limits

- Attaching is tested against a Chromium started with a debugging port. Chrome's own
  remote-debugging switch and approval prompt need a person and are not covered by tests.
- The browser suites pass on macOS against real Chrome but run in CI on Linux only.

## Bazilion 0.26.1

Published **2026-11-19**. A patch release: a fix in model selection, current model catalogs and a
ChatGPT sign-in fix on macOS. The embedded Pi engine moves from 1.4.0 to 1.5.2. See the
[GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.26.1).

### Upgrade: install and start again

The database schema was unchanged, so a 0.26.0 home opened as it was. The current commands are in
[Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260).

### Fixed

- **Model list edits reach Agent templates.** The `default` Profile is created with the first
  model on a provider's list and used to keep it, so correcting a mistyped model id on `/config`
  left new Agents on the old one. Saving a list without a model that a Profile defaults to now
  moves the Profile to the provider's first remaining model, or to the first available model of
  another provider when none remains. The web save message and `bazilion provider models-set`
  report each move. A Profile on a model that was never listed and an Agent's own model override
  are not changed.
- **ChatGPT sign-in on macOS.** **Connect ChatGPT** on `/config` opens the sign-in page with the
  system `open`. A terminal app that puts its own `open` first on the daemon's `PATH` could keep
  the page in its built-in browser and leave the button on "opening browser…".

If a Profile already points at a model you removed before upgrading, set it once:
`bazilion profile update default --model <provider:model>`.

### Changed

- The embedded Pi engine moved to 1.5.2 (AI, agent core, coding agent and MCP client). The model
  catalogs on `/config` follow Pi's: GPT-6.1 Terra, Claude Fable 5.2 and Kimi K3.1 Pro are among
  the additions, and ids Pi dropped are no longer offered.
- New provider: Qwen Token Plan (Individual, CN), `qwen-token-plan-individual-cn`, with
  `QWEN_TOKEN_PLAN_CN_API_KEY`.
