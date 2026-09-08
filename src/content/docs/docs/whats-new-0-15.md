---
title: What's new in 0.15.0
description: Bazilion 0.15.0 adds saved results, retained conversations, durable follow-ups, live questions and opt-in Attention notifications, with Pi 0.85.1.
---

Bazilion **0.15.0** makes work easier to retain, follow up and inspect. The public packages
`bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to 0.15.0.
The bundled engine remains **Pi 0.85.1**, including GPT-6 Astra support.

## Keep files and conversations

[Saved results](/docs/results/) capture immutable files in the Team library. Download them with
their original filenames after a reload or restart, inspect safe previews, and follow their exact
source conversation. Editing the workspace file does not change its saved copy.

[Conversations](/docs/conversations/) lets you list, read and rename earlier work. **New conversation**
retains history and files. Stale clients preserve drafts and cannot silently send into a different
conversation. Search, branching and manual resume of retained history remain outside this release.

## Follow up while an Agent works

The [follow-up queue](/docs/follow-up-queue/) stores accepted instructions and original attachment
bytes. Edit or remove pending input, pause or resume dispatch, and use Stop to pause before cancelling.
A lost acknowledgement can be retried with the same request identity. Interrupted work is visibly
uncertain and is never automatically replayed.

[Agent questions](/docs/questions/) offer choices, Other and Skip in web, interactive terminal and
paired-owner Telegram turns. Reload recovers a live question. Answer acceptance and verified
consumption in the original conversation are distinct; neither means the task succeeded or grants
permission. Mobile offers an explicit browser handoff rather than native question controls.

## Opt into operational notices

[Attention notifications](/docs/attention-notifications/) are off by default. Choose the paired
Telegram service topic, selected kinds and optional quiet hours. Enabling sends future items only;
including already-open items requires an explicit preview. Receipts distinguish confirmed delivery
from uncertainty. Retrying an uncertain notice requires accepting the possibility of a duplicate.
Restoring a backup pauses notifications for reconciliation.

The guided acceptance walkthrough also improved desktop and narrow-screen layouts: aligned
conversation controls, readable queue cards, compact question choices, and delivery cards with
technical IDs available under expandable details.

## Upgrade carefully: alpha schema change

This release changes the canonical database schema. **A 0.14.x home cannot be upgraded in place.**
Keep a complete backup and use the matching old release to export work you need before a deliberate
reset and fresh setup. An older-schema backup is not a migration into 0.15.0. Reset removes Agents,
Teams, templates, credentials and stored results; linked external Team directories remain untouched.
Read [the upgrade procedure](/docs/getting-started/#upgrade-to-0150) and
[backup and recovery](/docs/backup-recovery/) before proceeding.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.15.0) for publication
and validation details. The [0.14 release history](/docs/whats-new-0-14/) remains available.
