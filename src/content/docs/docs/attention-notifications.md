---
title: Attention notifications
description: Send new Attention items to the Telegram bot's service topic, by kind and with quiet hours, from the web or the CLI.
---

**Attention** lists what needs you: an Agent's questions and commands waiting for approval, lesson
proposals, failed or cancelled learning reviews, failed scheduled triggers, stopped Agent message
loops, Agent queues paused after a daemon restart, and failed background turns (see
[Daily operations](/docs/operations/#attention)). Bazilion can post new items to the
[Telegram](/docs/telegram/) bot's service topic, so they reach your phone. This is off by default.
Questions and commands waiting for approval are not posted here: they go to the Agent's own topic
(see [Telegram](/docs/telegram/)), and the web UI can show a
[desktop notification](/docs/web-interface/#live-and-notifications) for them.

Each new open item of a selected kind is sent once, with its title, Agent and Team. When the web UI
is published at `BAZILION_PUBLIC_ORIGIN` the notice links to the item; otherwise open
**Attention** in the web UI. A notice resolves nothing.

## Failed background turns

A turn nobody was watching can fail where you would not see it: a follow-up sent from the web, a
terminal or Telegram, or a turn an Agent ran for new mail. Attention lists them as one item per
Agent and cause, so an expired key or a rate limit is one line however many turns it stopped,
with what the provider said. **Acknowledge** sets it aside; a later failure of the same cause opens
it again. Retrying or removing the failed follow-ups takes them off. Turns for new mail are kept in
the daemon's memory, so a restart forgets them.

They can be sent to Telegram like the other kinds: tick **Failed background turns**. A choice of
kinds saved before 0.56.0 does not include them.

## Configure

On the web: **Attention notifications** under **Setup → Telegram** (`/config/telegram`). Switch
it on, pick the kinds, optionally set quiet hours, and save. From the CLI:

```sh
bazilion notification settings
bazilion notification configure --enable
bazilion notification configure --kinds review_failure,trigger_failure
bazilion notification configure --quiet-start 22:00 --quiet-end 07:00 --timezone Europe/Warsaw
bazilion notification configure --clear-quiet-hours
bazilion notification configure --disable
```

The kinds are `lesson_proposal`, `review_failure`, `trigger_failure`, `agent_loop_break` and
`queue_interrupted`.

## How sending works

- Items that were already open when you switch notifications on are not sent; only items that
  open or change afterwards are.
- During quiet hours (start inclusive, end exclusive, in the given IANA timezone; overnight
  ranges work) nothing is sent; waiting notices go out when quiet hours end.
- The daemon checks every 30 seconds and sends at most 10 notices per check. Nothing is sent while
  the bot is stopped. A notice that fails to send is tried again on the next check.
- An item that is resolved and later opens again is sent again. A notice cut off by a daemon
  restart can arrive twice, and restoring a backup repeats notices sent after the backup was taken
  for items that are still open.
