---
title: Previous changes
description: A short summary of Bazilion releases older than the four on What's new, newest first, each with a link to its GitHub release.
---

[What's new](/docs/whats-new/) covers the latest four releases. Older ones are summarised here,
newest first. Each entry describes its own release: several of the features named below, such as
review packets, specialist verification, publication, approvals and the protected turn surface,
were removed in 0.26.0.

## 0.22.0 — image generation

Opt-in image generation through an OpenAI API key, the ChatGPT login or OpenRouter, saved as
Results. A SearXNG-backed `web_search` for scheduled and inbox turns. Pi 0.87.1, with Meta and
Radius providers.

[GitHub release for 0.22.0](https://github.com/rullopat/bazilion/releases/tag/v0.22.0)

## 0.20.0 and 0.21.0 — publication and beta checkpoints

0.20.0 let the daemon commit a reviewed revision to a new branch and open a pull request. The
0.21.0 checkpoints added failure visibility in Attention, a CI security gate, a growth guide and a
UI consistency sweep.

[GitHub release for 0.20.0](https://github.com/rullopat/bazilion/releases/tag/v0.20.0) ·
[last 0.21.0 checkpoint](https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.5)

## 0.19.x — teammate review

0.19.0 let a coder ask a teammate to read one captured change with read-only tools, and let a
coding Agent request specialist verification. 0.19.1 fixed the endpoint used for a model id newer
than the bundled catalogue.

[GitHub release for 0.19.0](https://github.com/rullopat/bazilion/releases/tag/v0.19.0) ·
[0.19.1](https://github.com/rullopat/bazilion/releases/tag/v0.19.1)

## 0.18.0 — specialist verification

A coder could hand one captured change to a Team member that ran its declared checks and reported
the outcomes.

[GitHub release for 0.18.0](https://github.com/rullopat/bazilion/releases/tag/v0.18.0)

## 0.17.0 — reviewable coding work

Live command progress, retained command output and read-only Git change review.

## 0.16.0 — agent-led coding

Repository instructions and Git state at the start of a coding turn, scoped commands and handing
work to a teammate.

## 0.15.0 — keep and follow up on work

Saved results, retained conversations, the follow-up queue, Agent questions and opt-in Attention
notifications.

## 0.14.x — GPT-6 Astra and a smoother first run

Pi 0.85.1 with GPT-6 Astra through OpenAI API keys and the ChatGPT login, clearer recovery when a
home is incomplete, and first-run setup work.

## 0.13 — security work

Credential-minimal execution, the private Tailscale gateway, encrypted backups, Telegram owner
pairing and Pi 0.84.3.

## Older releases

Everything before 0.13 is in the commit history and the
[tagged releases](https://github.com/rullopat/bazilion/releases).
