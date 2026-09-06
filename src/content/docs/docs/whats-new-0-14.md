---
title: What's new in 0.14.2
description: Bazilion 0.14.2 upgrades Pi to 0.85.1 and adds GPT-6 Astra selection through OpenAI API keys and ChatGPT OAuth.
---

Bazilion 0.14.2 upgrades the bundled Pi engine from 0.84.3 to 0.85.1 and adds
**GPT-6 Astra** to the OpenAI and OpenAI Codex model catalogs. The three public
packages move together: `bazilion@0.14.2`, `@bazilion/client@0.14.2`, and
`@bazilion/api-types@0.14.2`.

## GPT-6 Astra in 0.14.2

Use the exact model ID `gpt-6-astra` through an OpenAI API key or ChatGPT OAuth.
After [upgrading and restarting](/docs/getting-started/#upgrade-to-0142), open
Config, add Astra to the provider's curated models, and select it for an Agent
or Agent template. Existing model selections stay as they are.

The release updates setup examples and adds catalog regression coverage for
both providers. Missing-Docker integration tests now use an explicit unavailable
endpoint so they behave consistently on machines with Docker installed.

This patch has no database schema change. A working 0.14.1 installation can
upgrade without resetting its home. Local validation passed 1,181 tests with
3 skipped, the provider catalog audit, root and web TypeScript checks, lint,
and the production build. The release workflow and published CLI smoke test
also passed.

## Safer recovery and clearer failures in 0.14.1

The daemon now validates the exact alpha schema and the pairing between
`bazilion.db` and `auth.json` before the scheduler, HTTP listener, or any other
runtime work starts. An older database therefore produces one actionable reset
error instead of repeated missing-table messages. A missing or mismatched
bootstrap identity also fails closed rather than minting a new credential that
could strand encrypted secrets.

The standard `bazilion uninstall --yes` reset removes the database and
`auth.json` together, plus Agent templates, Agents, Teams, and obsolete alpha
state. Logs and installed skills remain unless `--all` is explicitly added.
Cleanup is guarded against a running daemon, survives interruption, and unlinks
Team slots without deleting their external targets. Back up the complete
`~/.bazilion` directory before resetting anything you need to preserve.

ChatGPT OAuth no longer treats Pi's raced manual prompt as a failed web flow.
Browser login preflights the loopback callback on port 1455, bounds and cleans
up abandoned flows, and propagates client cancellation through the web gateway.
For headless, remote, or occupied-port setups, the CLI now offers:

```sh
bazilion auth openai login --device-code
```

Native Node module ABI mismatches in Agent turns and qmd-backed Team memory now
produce sanitized recovery guidance without exposing checkout paths. If a
source checkout changes Node versions, rebuild `better-sqlite3` with the same
runtime used to start Bazilion and restart the daemon.

The sections below cover the broader 0.14 feature release included in 0.14.2.

## From first boot to the first conversation

A clean install can now sign in and finish setup without a CLI-only token step.
Browser login accepts the `auth.json` bootstrap secret only while provider
setup is incomplete, exchanges it through an internal expiring device identity
for a bounded session, and never retains the bootstrap bearer in browser
cookies. Once setup is complete, that first-run session remains valid until its
normal expiry; subsequent browser logins and native pairing require separately
named device credentials.

The welcome and provider screens connect the remaining steps: find a provider,
add credentials or a local endpoint, enable it, select a model, optionally send
a real connection test, seed the default Agent template and Team, and spawn the
first Agent. Connection tests use the provider's normal model API and may incur
its usual token charge.

## Provider setup and navigation that scale down

Provider configuration is searchable and grouped into configured choices,
recommended starting points, local models, and the rest of the Pi catalog.
Credentials use human-readable labels while technical environment keys remain
available as supporting detail. Blank inputs preserve stored secrets; removing
one is a separate explicit action.

Primary navigation now emphasizes **Chat**, **Agents**, and **Teams**.
**Operations** distinguishes one-shot communication approvals from the broader
Attention Center, while **Manage** collects Templates, Skills, and Setup. Agent
administration has its own Chat, Inbox, Triggers, Learning, and Settings
sections instead of competing with the conversation workspace.

## Mobile pairing and trustworthy streamed chat

The Expo mobile client now accepts camera scans, manual pairing URLs, and
`bazilion://pair` deep links through one verified flow. It rejects unsafe
origins, suppresses repeated QR callbacks, pauses after failed scans, and gives
clearer camera and private-gateway guidance.

Native chat preserves the optimistic user message, decodes NDJSON frames even
when transport chunks split them, coalesces assistant deltas with the final
persisted transcript, and handles tool/file events, Team Policy holds, `done`,
and `fatal` frames without duplicate messages. It shows the recipient, supports
cancellation, explains retryable and offline failures, and unpairs cleanly when
the device credential is rejected.

Dangerous shell commands remain fail closed on mobile. Use interactive web chat
when a turn needs an operator shell-approval decision.

## Protected drafts and explicit consequences

Unsaved Team context, Team memory, Agent-template, and Team-policy edits are
guarded before selection changes or navigation can discard them. Destructive
actions name their target, explain what will happen, show progress and API
failure, and require an explicit confirmation. Confirmation dialogs also return
keyboard focus to the control that opened them.

Persisted web-chat Markdown now hydrates through the same escaped server and
browser snapshot before upgrading to sanitized Markdown, eliminating a noisy
and trust-eroding render mismatch.

## Responsive and accessible management

Agents, Teams, Approvals, members, and trigger history use mobile-friendly card
projections instead of forcing page-wide tables at narrow widths. Menus and
dialogs are keyboard operable, controls have accessible names, status changes
use live regions, both themes meet the same contrast bar, and decorative motion
respects reduced-motion preferences.

## Gateway reliability

The web gateway retains strict exact-origin and session-bound CSRF checks.
Unsafe request bodies are bounded to 2 MiB normally and 25 MiB for uploads,
then buffered into replayable bodies before forwarding. This preserves daemon
error statuses under Node/Undici while response and NDJSON chat bodies remain
streamed.

Mobile pairing supports the private HTTPS web gateway published through
tailnet-only Tailscale Serve. Direct daemon exposure, public reverse proxies,
and Tailscale Funnel remain unsupported.

Node.js 24 or newer is still required. Bazilion's alpha compatibility contract
remains clean-install-only; 0.14.1 detects incompatible state before startup
instead of attempting an in-place migration.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.14.2)
for the published artifacts and package-level changelog.
