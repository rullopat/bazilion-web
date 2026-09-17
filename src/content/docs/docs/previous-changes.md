---
title: Previous changes
description: Summarised release history for Bazilion 0.13 through 0.17, before the current release notes. Each entry links to its GitHub release.
---

Release notes for the three most recent releases live in their own pages. Everything older is summarised
here, newest first, with a link to the full GitHub release for each.

## 0.17.0 — coding work becomes reviewable

Live command progress, retained diagnostics, and read-only Git change review with source-bound evidence.

- **Watch a command while it runs**, with output that arrives as it happens rather than when it finishes.
- **Reopen what a command printed** after the container is gone — retained, bounded, redacted evidence with
  an explicit expiry, and a truthful "not shared" state rather than an empty box.
- **Review what changed**: a read-only Git review of the working tree against a pinned baseline, with source
  snapshots that tie a result to the exact revision it tested.
- **Schema change**: 0.17.0 could not be upgraded in place from 0.16.x.


## 0.16.0 — coding work becomes agent-led

Repository context, scoped commands and prepared execution during ordinary Agent tasks — no check catalogue
or readiness form first.

- **Ask for the work, not a checklist.** At the start of a coding turn the Agent receives the applicable
  repository instructions and can resolve a deeper scope itself.
- **Run a finite command** in the turn's admitted environment, with the outcome observed rather than asserted.
- **Hand work to a teammate**, with workspace preparation and recovery that survives interruption.
- **Schema change**: 0.16.0 could not be upgraded in place.


## 0.15.0 — retain, follow up and inspect work

Saved results, retained conversations, durable follow-ups, live questions and opt-in Attention notifications.

- **Keep files and conversations**: deliverables are published into a Team results library instead of
  scrolling away, and conversation threads are retained and named.
- **Follow up while an Agent works**: a bounded queue for steering a running turn, and questions the Agent
  can ask you without ending its work.
- **Opt into operational notices**: Attention notifications are off by default and forbidden from leaking
  any message payload into notification metadata.
- **Schema change**: 0.15.0 could not be upgraded in place.


## 0.14.x — GPT-6 Astra, and a safer first run

- **0.14.2 upgraded the bundled engine** from Pi 0.84.3 to **Pi 0.85.1** and added GPT-6 Astra selection
  through OpenAI API keys and ChatGPT OAuth.
- **0.14.1 improved recovery and failures**: clearer recovery guidance when a home is incomplete, and
  failures that name what was wrong instead of failing silently.
- Earlier 0.14 work covered first-run setup, provider configuration at small screen sizes, mobile pairing
  with trustworthy streamed chat, protected drafts with explicit consequences, and gateway reliability.


## 0.13 — the security-focused release

Credential-minimal protected execution, a private Tailscale gateway, encrypted recovery, hardened Telegram
ownership, and Pi 0.84.3.

- **Credential-minimal protected execution**: Agent turns run with only the selected provider credential
  they need, never the daemon's ambient environment.
- **Private HTTPS through Tailscale Serve**, with a strict production gateway profile and QR pairing over
  the same origin.
- **Encrypted backup and safer recovery**, with validated restore and rollback.
- **Telegram owner pairing**, so only the paired owner drives an Agent.


## Older releases

Everything before 0.13 is covered by the commit history and the tagged releases.

[All Bazilion releases](https://github.com/rullopat/bazilion/releases)
