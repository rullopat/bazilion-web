---
title: Core concepts
description: Pi's agent engine, Profiles, Agents, Teams, Team templates, Team Policy, USER.md, shared memory, the mailbox, triggers and skills.
---

Bazilion is built from a few concepts. The CLI, the HTTP API and the web UI all work on the same
model.

## Pi agent engine

Bazilion is built on
[Pi's coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent). Pi runs the
turn loop and the provider calls, compacts history and writes the JSONL transcript under each
Agent's `sessions/` directory. Bazilion supplies Agents and Teams, credentials, the tool list, the
worker processes and the long-lived browser and MCP connections. Version 0.66.0 bundles Pi 1.6.1,
with Pi's own discovery of extensions, skills, prompt templates and context files switched off.

## Profiles (Agent templates)

A **Profile** is an Agent template: `SOUL.md`, `IDENTITY.md`, `AGENTS.md`, `TOOLS.md`, an
optional first-run `BOOTSTRAP.md`, a default model and a skills mode (`all` attaches every
installed skill, `selected` a chosen list). The web UI lists them under **Manage → Agent
templates**; the CLI is `bazilion profile`. Editing a Profile affects future spawns only.

## Agents

An **Agent** is spawned from a Profile into one Team. Its documents and conversations live in
`~/.bazilion/agents/<id>/`: it edits its own documents with the `home_*` tools, and
`BOOTSTRAP.md` stays until the Agent calls `bootstrap_done`. The first-run questions are asked
only in a conversation you start: a teammate's message or a schedule gets the work done first.
You can change an Agent's model, reasoning level and skills after spawning, move it to another
Team, archive it or delete it.

When you add an Agent you can say what it is for (**What is it for?**, or
`bazilion agent spawn --role "…"`). The role goes on top of its `AGENTS.md` with who added it, and
the Agent starts working instead of asking its name and purpose. Names are unique within a Team,
whatever their case. An Agent that gave itself another name in its `IDENTITY.md` shows it next
to its own, teammates reach it by either, and the Agent tab offers to make it its name.

An Agent can also add Agents to its own Team when you ask it to, with the `agent_create` tool: it
names them and says what each is for, and they start knowing their role and who made them,
without the first-run questions. In a restricted Team each is connected with its creator both
ways. Agents never add teammates on their own, from a schedule or from a teammate's message.

## Teams

A **Team** is where Agents work together. It has:

- a workspace directory at `~/.bazilion/teams/<slug>/`, or a symlink to an existing project
  (`bazilion team add my-app --link /path/to/my-app`);
- a `USER.md` about you, added to every member's system prompt;
- a shared memory;
- its members and its policy.

Every Agent belongs to exactly one Team. The Team directory is the Agents' working directory.

## Team templates

A **Team template** is a reusable roster: one slot (Profile and Agent name, with optional model
and reasoning) per Agent, plus allow edges between slots and a policy mode. Spawning a template
creates its Agents and edges; an unknown Team slug creates the Team. You can also save a live Team
as a new template.

```sh
bazilion team-template spawn <template> <team>
bazilion team-template save <team> <new-template>
```

## Team Policy

Team Policy decides which Agent may send a message to which other Agent. It never limits you:
you can always chat with every Agent, and every Agent can always reach you.

A Team's policy is a **mode** plus directed **allow edges**. An edge endpoint is a member Agent
or `outside`, which stands for every Agent in other Teams. The web names the modes by what they
do: **Everyone** (`open`: everyone can message everyone) and **Connections only** (`restricted`).

| Message | Allowed when |
| --- | --- |
| Between members of an **open** Team (the default) | always |
| Between members of a **restricted** Team | an edge `sender -> recipient` exists |
| From a member of Team A to a member of Team B | Team A has `sender -> outside` and Team B has `outside -> recipient` |

A denied message is an error returned to the sender, with the reason; nothing is stored or
queued. Edits take effect immediately. An Agent that moves to another Team loses its edges.
Connections between teammates of an open Team are kept but change nothing, so drawing one there
asks whether to switch the Team to **Connections only** first.

```sh
bazilion team policy show <team>
bazilion team policy mode <team> open|restricted
bazilion team policy allow <team> <from> <to>
bazilion team policy deny <team> <from> <to>
```

On the web, **Connections** in the workspace's side panel shows who may message whom, and the
Connections view edits it on a map or in a table
([the web interface](/docs/web-interface/#connections)). `bazilion team messages <team>` lists what
a Team's Agents said to each other.

## USER.md and memory

Each Team has one `USER.md` for stable context about you and the project. You edit it under
**Team** in the workspace's side panel or with `bazilion team user-md set`; Agents read and update
it with `user_md_get` and `user_md_write`.

Memory is **Team-shared** Markdown notes in `<team>/memory/`, searched with
[qmd](https://github.com/tobilu/qmd) (BM25). Agents use the `memory_*` tools; keys are Markdown
paths such as `notes/topic.md`. You can search, browse and edit the notes under **Team** in the
side panel or with `bazilion memory`. Personal notes belong in the Agent's own `IDENTITY.md`
instead.

## Mailbox

Agents message each other with `send_message`, `read_inbox` and `wait_for_reply`. Every turn
tells an Agent its teammates' names and ids, and which of them [Team Policy](#team-policy) lets
it message, so it can write to a teammate by name; you never pass ids around. An idle Agent
with unread mail wakes up and gets one turn with those messages, in its current conversation.
A quiet message (`wake: false`), for something a teammate only needs to know, waits in the inbox
without starting a turn: the recipient's next turn says how many are unread. `wait_for_reply` can
wait for the replies to several messages at once. It must answer a new message. A reply is not answered back: the Agent tells you what it brought
back and delivers the files it names, so they show in [Files](/docs/results/).

Messages form exchanges: the first, sent in a turn someone started, opens one, and every message
sent in a turn that messages woke continues it. An exchange has no length limit. A woken Agent
reads the exchange so far and ends it when it no longer moves the first request forward. A
message its sender already sent the same Agent in the exchange is not delivered: the Agents are
going round in circles, so the sender tells you where the work stands, and Attention says so.
While an exchange goes on, **Connections** shows it under **Going on now**, with **Stop**
(`bazilion inbox exchanges <team>`, `bazilion inbox stop <exchange>`); stopped exchanges are in
`bazilion inbox stopped <agent>`. From outside the loop: `bazilion send`, `bazilion inbox` and
**Mailbox** in the Agent's side panel.

## Triggers

A **trigger** wakes an Agent on an interval (`--every <seconds>`) or a 5-field cron expression
(daemon local time) with a stored message:

```sh
bazilion trigger add <agent> --cron '0 9 * * 1-5' --message 'Summarise yesterday'
bazilion trigger history <trigger-id>
```

Each occurrence runs at most once. A busy Agent leaves it pending, and nothing is retried; a
failure shows in Attention and in the trigger history. A minute missed while the daemon was down
is not caught up.

## Skills

A **skill** is an OpenClaw-style `SKILL.md` in `~/.bazilion/skills/<name>/`. Its text is added
to the system prompt of the Agents it is attached to, and its scripts run through `bash`. Import
skills from a local OpenClaw install, a directory or a `.zip` with `bazilion skill import --from
…` or the **Skills** page; imported skills are scanned for suspicious text.

## Turns

Every turn, whether it comes from web or CLI chat, a follow-up, Telegram, a trigger or an inbox
wake, runs the same way in a short-lived worker process and gets the same tools. Only two things
depend on someone being there: `ask_user` questions, and dangerous-command approval, which is
denied when nobody can answer. See [Tools & integrations](/docs/tools/).

## State on disk

The daemon owns the database, secrets, scheduler, browsers and MCP connections. Team workspaces,
Agent documents, transcripts, skills and memory stay readable under `~/.bazilion/`. See
[Configuration](/docs/configuration/) for the layout.
