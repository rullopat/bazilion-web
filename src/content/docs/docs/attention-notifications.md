---
title: Attention notifications
description: Send new Attention items to the Telegram bot's service topic, by kind and with quiet hours, from the web or the CLI.
---

**Attention** lists what needs you: lesson proposals, failed or cancelled learning reviews,
failed scheduled triggers, stopped Agent message loops and Agent queues paused after a daemon
restart (see [Daily operations](/docs/operations/#attention)). Bazilion can post new items to the
[Telegram](/docs/telegram/) bot's service topic, so they reach your phone. This is off by default.

Each new open item of a selected kind is sent once, with its title, Agent and Team. When the web UI
is published at `BAZILION_PUBLIC_ORIGIN` the notice links to the item; otherwise open
**Attention** in the web UI. A notice resolves nothing.

## Configure

On the web: **Attention notifications** on `/config/integrations/telegram`. Switch it on, pick the
kinds, optionally set quiet hours, and save. From the CLI:

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
