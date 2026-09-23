---
title: What's new in 0.21.0
description: Bazilion 0.21 retires the alpha clean-install contract — homes now upgrade in place — and adds per-device scopes, one-paste pairing codes and an auth-posture probe, on Pi 0.85.1.
---

> **A note on names (2026-09-21):** the 0.21 line shipped to npm as `0.21.0-beta.1` through
> `0.21.0-beta.5`. We have dropped the beta naming — Bazilion is and remains **alpha** until a
> deliberate 1.0 beta, so these releases are described here as **0.21.0**. `0.21.0` final is
> published from the same commit as beta.5; the installed code is identical either way.

Bazilion **0.21** retired the alpha database contract: since the first 0.21 release, Bazilion
**migrates your database forward on startup** and keeps a verified snapshot of the previous state
beside it — no schema change costs you your home any more. The second release hardened the
platforms; the third made failure modes visible; the fourth gated security in CI and documented
home growth; the fifth is the UI consistency sweep — **every surface degrades well**.

Bazilion remains **alpha**: feature checkpoints ship as plain `0.N.0` versions, and a
`1.0.0-beta.1` label is reserved for a deliberate, later decision.

The public packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together.
The bundled engine remains **Pi 0.85.1**.

## Beta.5 — every surface degrades well

The coding sequence added roughly ten screens after the v0.14 UI hardening pass,
and the audit found they degraded differently: a dead daemon could surface a
developer-grade error screen. Two router-level defaults changed that for every
route at once — a calm recovery state (what happened, retry, a safe exit;
nothing substituted for the missing data) and a marked loading state during
navigation. The coding surfaces also name themselves in the error
("Specialist verification unavailable"), and cancel-verification now requires a
confirmation stating the consequence. A browser-acceptance walk pins the result:
desktop and narrow viewports with overflow assertions, fresh-home empty states,
then a **real daemon-kill pass** asserting the recovery state on every audited
route.

En route, the sweep closed a CI gap: the web app was excluded from the
typecheck that runs on every pull request — it is now included.

## Beta.4 — the gate is not a convention

The BAZ-032 adversarial security suite — 153 required cases covering the daemon's
security boundaries — existed as a script that ran only at release time. A new
**security-acceptance CI job** runs it on every pull request (~2 minutes,
docker-free). The script fails closed: deleting or renaming a required case is
itself a CI failure, so the manifest is the gate, not a convention.

Beta.4 also ships [Growth and retention](/docs/growth-and-retention/), the
operator answer to "how big should a home be?": coding evidence is bounded by
design (7-day TTLs, a 256 MB home-wide budget, content-addressed snapshots that
store paths and digests only), messages and sessions grow with use because they
are the record, pre-migration snapshots are safe to delete once an upgrade is
confirmed good, and `logs/` is intentionally empty — the daemon writes no log
files.

## Beta.3 — no silent failure

Two silent failure modes were found and fixed, and every remaining recoverable
failure mode is now pinned by a deterministic fault-injection test that asserts
what the *operator sees*:

- **The queue stall after a daemon crash.** A restart that interrupts queue
  processing pauses the Agent's queue until you inspect and resume it — but
  nothing surfaced the pause: new messages were accepted and never drained, with
  no visible reason anywhere. A crash could make an Agent go permanently quiet.
  A new Attention kind, **Paused queues**, names the crash and the uncertain
  item count; resuming the queue clears it.
- **Opaque OAuth refresh failures.** A revoked or expired ChatGPT refresh token
  surfaced the raw upstream error mid-turn. The error now says what to do: sign
  in again with `bazilion auth openai login` or the Connect button on /config.
- **Pinned by injection tests:** provider outages retry boundedly then surface
  as trigger-failure attention items; Telegram delivery failures leave a
  terminal receipt while the underlying attention item stays open; message-loop
  breaches surface payload-free; a daemon kill mid-coding-run leaves an
  interrupted receipt with a reason; a failed backup is clean — no partial file,
  home and daemon intact.

Beta.3 also fixed a build race the CI matrix exposed: the web build and the CLI
build (which bundles the web output) ran concurrently and could corrupt each
other's output.

## Beta.2 — the CI matrix catches Windows and macOS

Test suites and a fresh-machine installer E2E now run on ubuntu, macOS and Windows on every PR, and
the first runs caught six real defects:

- **Windows: every conversation write failed** — `fsync` on a directory handle is not permitted there;
  the file fsync remains the durability floor.
- **Windows: bootstrap rotation failed** — fsync on a read-only handle needs a write handle.
- **Windows followed symlinked session files** despite the no-follow boundary; now rejected explicitly.
- **`pnpm build` matched no packages on Windows**, so `pnpm pack` silently shipped an **empty tarball** —
  a Windows release would have published an empty npm package.
- **Symlinked `BAZILION_HOME`** broke uninstall's keep-the-root semantics.
- **Canonical-path identity guards** rejected every worker spawn and session read on macOS.

The installer E2E runs the operator path on every PR — packed tarball → install → fresh-home bootstrap
→ provider setup → agent spawn → turn → clean uninstall, with no API key, no network egress and no
Docker.

## The platform boundary, stated

**Linux is the validated platform.** The workspace-claim identity is now portable (the same `dev:ino`
semantics everywhere), but every agent turn also resolves repository context for the team root — and
those content reads pin ancestry with Linux-only primitives, by design. Off-Linux, turns refuse with a
clean, explicit `safe_reads_unavailable` response — the installer E2E asserts exactly that on macOS and
Windows on every PR. Installing on macOS or Windows works (daemon, dashboard, setup); the first chat
turn is where the wall is, and the error says so. Content-read portability is tracked as BAZ-057.

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
upgrades it, so `v0.20.0 → beta.5` and each beta hop are exercised on every release. Read
[the upgrade procedure](/docs/getting-started/#upgrade-to-0210-beta5).

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

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.5) for publication
and validation details (the [beta.1 release](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.1)
covers the schema-contract checkpoint, [beta.2](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.2)
the cross-platform hardening, [beta.3](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.3)
the failure-mode visibility audit, [beta.4](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.4)
the security gate and growth documentation). The [0.20.0 release notes](/docs/whats-new-0-20/) remain available, and everything
before 0.19.0 is summarised in [previous changes](/docs/previous-changes/).
