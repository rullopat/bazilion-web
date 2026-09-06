---
title: Daily operations
description: Diagnose Agent failures, inspect scheduled delivery and approvals, use Attention, and review or revoke learned lessons.
---

Start with the affected Agent and the way its turn was initiated. A local chat
can work while Telegram or a scheduled turn fails protected-runtime preflight.

## Diagnose an Agent that is not responding

```sh
bazilion doctor
bazilion agent list
bazilion attention summary
bazilion attention list
```

1. Confirm the CLI points at the intended daemon/home. Check provider enablement,
   curated model selection, credentials, and the Agent's active/archive state.
2. For Telegram, triggers, inbox, or private-gateway chat, inspect protected-work
   readiness and the [tool boundary](/docs/tools/#which-tools-can-this-turn-use).
3. Open the Agent's Chat and inspect the error or tool result. For Telegram,
   also run `bazilion telegram health` and `bazilion telegram pairing status`.
4. Check Operations → Approvals and the Team's Activity tab. A held attempt or
   policy denial is different from a provider failure.
5. If a turn is stuck, cancel it and inspect any partial work before retrying:

   ```sh
   bazilion agent cancel <agent-id>
   ```

Cancellation does not undo tool writes or sent messages. Retrying may repeat
side effects; check the workspace and conversation first.

## Inspect a schedule

```sh
bazilion trigger list <agent-id>
bazilion trigger history <trigger-id>
```

The trigger's last-fired timestamp means an occurrence was recorded, not that
the Agent completed it. Read dispatch history for attempts, errors, and terminal
results. Busy Agents defer delivery; retries are bounded. Interval occurrences
coalesce while a dispatch is open instead of building an unlimited queue.

Before testing a new schedule, complete Docker/provider readiness. Create a
disabled trigger, inspect it, and explicitly enable it when ready:

```sh
bazilion trigger add <agent-id> --every 300 --message 'Summarize project status' --disabled
bazilion trigger list <agent-id>
bazilion trigger enable <trigger-id>
```

To pause future scheduled work, use `bazilion trigger disable <trigger-id>`.
Disabling is not cancellation of an already active turn. After repairing a
terminally failed occurrence, decide whether to run a new explicit turn or wait
for the next occurrence; do not assume editing settings replays terminal work.

## Held communication versus shell approval

| What you see | Where to act | Meaning |
| --- | --- | --- |
| Pending communication | Operations → Approvals | One policy-gated attempt awaits a decision |
| Team Activity denial | Team → Policy | Missing or invalid permission; fix policy before a new attempt |
| Inline dangerous-command prompt | Interactive web chat or TTY CLI | Ephemeral shell decision for the active turn |
| Trigger retry/error | Agent → Triggers | Inspect delivery failure and readiness |

Inspect the payload and current policy before approving communication:

```sh
bazilion approval list
bazilion approval show <approval-id>
bazilion approval approve <approval-id> --yes
```

Use `deny` or `cancel` instead of `approve` when appropriate. Approval rechecks
membership and policy and dispatches at most once. For a scheduled occurrence,
approval grants that occurrence; the scheduler still executes it under its
lease/retry rules. A communication approval never grants a shell command.

## Work through Attention

Open Operations → Attention or use `bazilion attention list`. Follow an item's
source to the failed turn, trigger, approval, or lesson. Resolve that source
first. Acknowledging an informational item records that you saw it; it does not
repair a failure or approve work. CLI acknowledgement requires the item's displayed key and
`--yes`.

## Review and apply a lesson

1. Open the Agent's **Learning** section. Check the review model and reasoning
   settings and ensure protected/restricted review readiness is available.
2. Choose **Review now**, or enable periodic reviews. Review inspects a bounded
   set of successful user turns and may legitimately produce no proposals.
3. Read each proposed lesson and its evidence. Edit its text and choose whether
   it belongs to the Agent's future prompts or searchable Team memory. Click
   **Save edit** before approving changed text or scope.
4. Approve only the scoped lesson you intend to keep, or reject the proposal.
   No proposed lesson is applied without approval.
5. To withdraw an applied lesson, use **Revoke** and confirm the lesson removal. Agent-scoped revocation
   removes it from future prompts; Team-scoped revocation removes the applied
   memory note. Evidence and decision history remain. Previous conversations
   and actions are not undone.

Stable information about the human or project belongs in Team Context
(`USER.md`). A review proposal is not a replacement for that shared context.

## Before an upgrade or recovery

Use [Backup and recovery](/docs/backup-recovery/) and the
[version-specific upgrade steps](/docs/getting-started/#upgrade-to-0142).
If Node changes, reinstall native dependencies with the runtime used by the
daemon. Do not reset a healthy home just to update the model catalog.
