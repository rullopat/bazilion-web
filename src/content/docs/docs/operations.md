---
title: Daily operations
description: Diagnose an Agent that does not answer, inspect schedules, work through Attention and review the lessons an Agent proposes.
---

## Diagnose an Agent that is not answering

```sh
bazilion doctor
bazilion agent list
bazilion attention list
```

1. `bazilion doctor` checks the home, the database, skills, providers, web search and the Docker
   image. Make sure the CLI talks to the daemon you mean (`BAZILION_SERVER`, `BAZILION_HOME`).
2. Check that the Agent's provider is enabled, has a saved model and a working credential:
   `bazilion provider test <provider:model>`.
3. Open the Agent's chat and read the error or the failed tool result. For Telegram, also run
   `bazilion telegram health`.
4. If a message to another Agent failed, check the Team's [policy](/docs/concepts/#team-policy):
   a denied message is an error returned to the sender.
5. If a turn is stuck, cancel it:

   ```sh
   bazilion agent cancel <agent>
   ```

Cancelling does not undo files the Agent wrote or messages it sent. Look at the workspace and the
conversation before asking again.

## Schedules

```sh
bazilion trigger add <agent> --every 300 --message 'Summarise project status' --disabled
bazilion trigger list <agent>
bazilion trigger enable <trigger-id>
bazilion trigger history <trigger-id>
bazilion trigger disable <trigger-id>
```

On the web, use the Agent's **Triggers** tab. Each occurrence runs at most once and is never
retried: a busy Agent leaves it pending, then it ends succeeded, failed or cancelled. The history
shows each run with its real error, and a failure also shows in Attention. Disabling a trigger
stops future runs, not a turn that is already running.

## Attention

**Attention** lists what needs you: lesson proposals, failed or cancelled learning reviews, failed
triggers, stopped Agent message loops and Agent queues paused after a daemon restart. Open the
**Attention** page (the badge in the top bar shows the count) or:

```sh
bazilion attention summary
bazilion attention list
bazilion attention acknowledge <key> --yes
bazilion attention acknowledge-all --yes
```

Acknowledging a failure or loop break records that you saw it; it repairs nothing. Proposals and
paused queues leave the list when you act on them. Attention items can also go to Telegram; see
[Attention notifications](/docs/attention-notifications/).

## Reviewed learning

An Agent can turn its recent conversations into lessons, but only the lessons you approve change
its behaviour. Learning is off by default.

1. On the Agent's **Learning** tab, switch reviews on and choose how often (every N completed turns
   you started, default 8), a review model and a reasoning level. From the CLI:

   ```sh
   bazilion agent review-config <agent> --enable --every 8 --model agent --reasoning low
   bazilion agent review <agent>            # run one now
   ```

2. A review runs in a restricted worker whose only tool is `propose_lesson`, and proposes at most
   five lessons. A review runs once; a failure shows in Attention.
3. Read each proposal, edit its text or scope, then approve or reject it. A **private** lesson is
   added to the Agent's system prompt; a **shared** one is written to the Team's memory as
   `lessons/<id>.md`.

   ```sh
   bazilion agent lessons <agent> --status pending
   bazilion agent lesson edit <proposal-id> --text '…' --scope private
   bazilion agent lesson approve <proposal-id> --yes
   bazilion agent lesson reject <proposal-id> --yes
   ```

4. Revoke an approved lesson later with **Revoke** or `bazilion agent lesson revoke <id> --yes`.
   Earlier conversations are not changed.

Reviews cost model calls; pick a cheap review model for busy Agents. Stable facts about you or the
project belong in the Team's `USER.md`, not in a lesson.

## Around a running Agent

- [Conversations](/docs/conversations/): read earlier ones or start a new one.
- [Follow-up queue](/docs/follow-up-queue/): messages sent while the Agent is busy.
- [Agent questions](/docs/questions/): questions the Agent asks you during a turn.
- [Saved results](/docs/results/): files the Agent delivered.

Before an upgrade, read [Upgrade to 0.26.0](/docs/getting-started/#upgrade-to-0260) and
[Backup and recovery](/docs/backup-recovery/).
