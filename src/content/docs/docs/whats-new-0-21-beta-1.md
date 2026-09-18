---
title: What's new in 0.21.0-beta.1
description: Bazilion 0.21.0-beta.1 retires the alpha clean-install contract — homes now upgrade in place — and adds per-device scopes, one-paste pairing codes and an auth-posture probe, on Pi 0.85.1.
---

Bazilion **0.21.0-beta.1** is a **pre-beta checkpoint**: the alpha database contract is gone. Until now,
every schema change cost you your home — agents, Teams, conversations, results — because the release
expected a fresh install. From this release, Bazilion **migrates your database forward on startup** and
keeps a verified snapshot of the previous state beside it.

This is not yet beta. The remaining beta work — the cross-platform CI matrix, the UI consistency sweep,
the failure-mode visibility audit and the supportability gates — is tracked in the backlog and will ship
as `0.21.0-beta.N` before `1.0.0-beta.1`.

The public packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to
0.21.0-beta.1. The bundled engine remains **Pi 0.85.1**.

## Homes upgrade in place

The headline is a contract, not a feature. Four rules now govern startup:

- **Migrations run forward, inside a transaction.** Your applied migrations must be an unbroken prefix of
  the release's migration chain; anything pending is applied on open. The applied set is recorded in a
  `schema_migrations` receipt ledger.
- **A snapshot precedes the first migration.** Before touching an existing home, the daemon copies the live
  database to `bazilion.pre-migration-<timestamp>.db` beside it and integrity-checks the copy. If the
  snapshot cannot be produced or verified, nothing is migrated. A failed migration leaves the home on its
  previous schema and that snapshot is your recovery point.
- **A newer database is refused, not mutated.** The schema version is stamped numerically; a database
  written by a newer release stops startup with upgrade guidance. Downgrades are unsupported — restore the
  pre-migration snapshot instead.
- **Unknown or historical homes still fail closed.** A home from before this contract (0.19.x and earlier)
  is refused with recovery guidance and left untouched. Reset or restore, as
  [before](#what-this-means-for-older-homes).

The upgrade path is proven, not asserted: CI seeds a real home with a real prior-release daemon and
upgrades it, so `v0.20.0 → 0.21.0-beta.1` is exercised on every release. Read
[the upgrade procedure](/docs/getting-started/#upgrade-to-0210-beta1).

## Give every device only what it needs

Until now any credential reached everything. Web tokens now carry **scopes** — `read`, `write`,
`approvals` and `admin` — enforced per request, with a structured refusal that names the scope you are
missing. The bootstrap credential from `auth.json` keeps implicit full access, browser sessions inherit
their device's scopes, and **existing credentials were migrated to full access, so nothing changes until
you choose to narrow one.**

- **Mint narrow devices.** `bazilion token create --scope read` for the wall tablet,
  `--scope approvals` for the phone that only answers questions, or the same choices on the tokens page.
- **Pair with one paste.** `bazilion token pair` prints a `bazilion-pair://` setup URL and QR code: it
  expires in ten minutes, works once, and admits exactly one credential exchange — a short-lived key that
  hands out a durable device identity. It is not itself an API credential.
- **Ask the server what it expects.** `GET /api/health` now reports the auth posture — whether the gate is
  on, which credential kinds are accepted, and whether first-run setup is complete — so a client that cannot
  connect can tell you why.

## Two half-finished surfaces removed

- **The Expo mobile app is gone.** It was a thin wrapper that could not reach the device integration a
  phone deserves. Mobile is the responsive web UI over your private gateway with named device credentials —
  the same auth path native clients will use later.
- **The interactive chat REPL is gone** from `bazilion agent chat`. One-shot mode
  (`--message`, `--image`, `--file`) and piped stdin remain, as do the chat management commands.

## What this means for older homes

- **0.20.x** upgrades in place, automatically, with the pre-migration snapshot.
- **0.19.x and earlier** are refused cleanly and left untouched — those homes predate this contract.
  Keep the old home with its matching release for export, then
  [reset it](/docs/getting-started/#reset-a-home) or point `BAZILION_HOME` at a new empty directory.
- Existing token scopes, Teams, Agents and conversations are all preserved across the upgrade.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.1) for publication
and validation details. The [0.20.0 release notes](/docs/whats-new-0-20/) remain available, and everything
before 0.19.0 is summarised in [previous changes](/docs/previous-changes/).
