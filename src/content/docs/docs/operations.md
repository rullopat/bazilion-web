---
title: Daily operations
description: Diagnose an Agent that does not answer, inspect schedules and work through Attention.
---

## Diagnose an Agent that is not answering

```sh
bazilion doctor
bazilion agent list
bazilion attention list
```

1. `bazilion doctor` checks the home, the database, skills, providers, web search and the Docker
   image. Make sure the CLI talks to the daemon you mean (`BAZILION_SERVER`, `BAZILION_HOME`).
2. Check the Agent's provider. **Setup → Models** and `bazilion provider list` say what its last
   test found; `bazilion provider test <provider:model>` asks the Agent's own model now.
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
bazilion trigger add <agent> --at '2026-12-04 09:00' --message 'Renew the domain'
bazilion trigger list <agent>
bazilion trigger edit <trigger-id> --cron '0 9 * * 1-5' --message 'Weekday check'
bazilion trigger enable <trigger-id>
bazilion trigger history <trigger-id>
bazilion trigger disable <trigger-id>
```

On the web, open **Schedules** in the Agent's side panel; it and `bazilion trigger list` say when
each schedule runs next. A schedule runs every few minutes, at times a cron expression gives, or
**once**, and then shows as done. **Change…** edits its timing or message.

An Agent sets schedules itself when you ask ("remind me on Friday at nine", "check the deploy
again in two hours"): they run in the conversation they were set in, are marked with the Agent's
name, and you change or remove them like your own. The Agent removes only the ones it set. Times
are this computer's clock. Each occurrence runs at most once and
is never retried: a busy Agent leaves it pending, then it ends succeeded, failed or cancelled. The
history shows each run with its real error, and a failure also shows in Attention. Disabling a
trigger stops future runs, not a turn that is already running.

## Attention

**Attention** lists what needs you. First what an Agent is waiting on right now: a
[question](/docs/questions/) it asked and a command waiting for your approval, soonest to expire
first, each with the time it stops waiting. Then failed triggers, stopped Agent message loops,
Agent queues paused after a daemon restart, and background turns that failed (a follow-up or a turn for new mail, one item per Agent
and cause). Open the **Attention** page (the count in the top bar stays current, and the browser tab
counts what waits for you) or:

```sh
bazilion attention summary
bazilion attention list
bazilion attention acknowledge <key> --yes
bazilion attention acknowledge-all --yes
```

Acknowledging a failure, or Agents that went round in circles, records that you saw it; it repairs nothing. A failed
background turn opens again when another fails for the same cause. Questions,
commands and paused queues leave the list when you act on them; a question or a command
also leaves it when it stops waiting, or when the daemon restarts. Attention items can also go to Telegram; see
[Attention notifications](/docs/attention-notifications/).

## Around a running Agent

- [Conversations](/docs/conversations/): read earlier ones or start a new one.
- [Follow-up queue](/docs/follow-up-queue/): messages sent while the Agent is busy.
- [Agent questions](/docs/questions/): questions the Agent asks you during a turn.
- [Saved results](/docs/results/): files the Agent delivered.

Before an upgrade, read [Upgrade](/docs/getting-started/#upgrade) and
[Backup and recovery](/docs/backup-recovery/).
