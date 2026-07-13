---
title: What's new in 0.9.0
description: Bazilion 0.9.0 makes Teams canonical, ships revisioned Team Templates and live Team Policy with communication approvals, removes alpha compatibility layers, and updates Pi to 0.80.6.
---

Bazilion 0.9.0 is a breaking alpha cleanup and the first release where the
production Team model stands on its own. It replaces the overlapping Group,
Profile Group, and Harness vocabulary with one coherent domain.

The three public packages move together: `bazilion@0.9.0`,
`@bazilion/client@0.9.0`, and `@bazilion/api-types@0.9.0`.

## Teams are canonical

The model now has five clear ownership boundaries:

1. **Agent templates (Profiles)** define reusable Agent personas, files, model,
   skills, and creation-time communication defaults.
2. **Team Templates** own the only reusable Team roster: revisioned stable slots
   plus directed communication edges.
3. **Teams** are live collaboration roots with one filesystem, `USER.md`, Agent
   membership, shared memory, and exactly one effective revisioned policy.
4. **Agents** are permanent resources with exactly one Team membership; their
   identity, private home, and transcript survive moves and policy changes.
5. **Approvals** protect one communication attempt on an
   `approval_required` edge. They are not a workflow engine.

Explicitly: there is **one canonical Team Template roster** and **one effective
live policy per Team**.

## New production surfaces

| Resource | Web | CLI | HTTP |
| --- | --- | --- | --- |
| Agent templates | `/templates/agents` | `bazilion profile` | `/api/profiles` |
| Team Templates | `/templates/teams` | `bazilion team-template` | `/api/team-templates` |
| Teams | `/teams` | `bazilion team` | `/api/teams` |
| Live Team Policy | `/teams/:id/policy` | `bazilion team policy` | `/api/teams/:id/policy` |
| Approvals | `/approvals` | `bazilion approval` | `/api/approvals` |

The web policy editor has Flow and Matrix views over one shared directed-edge
draft, presets for common Team shapes, safe previews, immutable template
revisions, optimistic conflict recovery, source/baseline comparison, explicit
rebaseline/adoption, and durable blocked-communication evidence.

## Policy and approvals

When enforcement is active, one shared authorizer covers:

- user ↔ Agent,
- same-Team Agent → Agent,
- cross-Team Agent communication (both Teams must consent),
- scheduler, inbox, HTTP/worker turn, and Telegram ingress/egress.

An edge can `allow` or require approval; a missing edge denies. Denial records
retain policy/revision evidence without retaining the attempted message payload.

Runtime enforcement is opt-in in 0.9.0:

```sh
BAZILION_TEAM_POLICY_ENFORCEMENT=on bazilion dashboard
```

An approval captures one typed attempt before its side effect. Approve it once,
deny it, or cancel it from the web queue or CLI. Approval revalidates the latest
membership and policy and dispatches at most once.

## Pi 0.80.6 and GPT-5.6

The bundled Pi packages move to 0.80.6 with a refreshed provider catalog.
ChatGPT OAuth examples now include:

- `openai-codex:gpt-5.6-luna`,
- `openai-codex:gpt-5.6-terra`,
- `openai-codex:gpt-5.6-sol`.

Connect with `bazilion auth openai login` (or the `/config` card), enable the
`openai-codex` provider, and curate the model you want to expose to templates.

## What was removed

The following are intentionally not aliases or redirects:

- Group and Profile Group domain entities,
- `/groups`, `/profile-groups`, and their API equivalents,
- the browser-local `/harnesses` prototype,
- detached Harness persistence and compatibility projections,
- incremental alpha schema migrations and legacy importers.

Old URLs return 404. Do not translate old API calls in place; update clients to
the canonical table above.

## Upgrading from an older alpha

There is no in-place data migration. Bazilion now boots from one canonical
`0001_init.sql` schema. Export or copy anything you need before wiping state,
then start fresh:

```sh
bazilion uninstall --yes --all
npx bazilion dashboard
```

The full wipe removes the database, `auth.json`, logs, and installed skills.
You will need to configure providers and integrations again. If Telegram was
connected, the bot and supergroup still exist on Telegram, but Bazilion's local
token, chat ID, access list, Agent bindings, and topic metadata were in the
removed local state and must be entered or rebuilt.

Team slots registered as symlinks are removed without deleting their external
target directories. Still, make an independent backup before any destructive
upgrade.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.9.0)
for the published artifact and validation summary.
