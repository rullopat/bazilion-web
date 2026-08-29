---
title: What's new in 0.14.0
description: Bazilion 0.14 connects first-run setup, reliable mobile chat, protected editing, clearer provider and navigation flows, and responsive accessible management.
---

Bazilion 0.14 makes the path from a clean install to daily Agent operation more
predictable and safer. The three public packages move together:
`bazilion@0.14.0`, `@bazilion/client@0.14.0`, and
`@bazilion/api-types@0.14.0`.

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

Node.js 24 or newer is still required. This release does not change the
canonical database schema; Bazilion's alpha compatibility contract remains
clean-install-only.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.14.0)
for the published artifacts and package-level changelog.
