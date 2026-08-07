---
title: What's new in 0.12.2
description: Bazilion 0.12 adds an Operator Attention Center, reviewed Agent learning, message-loop protection, and a Pi 0.83 provider/runtime refresh.
---

Bazilion 0.12 makes long-lived Agent teams easier to supervise and safer to
leave running. Version 0.12.2 is the current release. The three public packages
move together: `bazilion@0.12.2`, `@bazilion/client@0.12.2`, and
`@bazilion/api-types@0.12.2`.

## One Attention Center for operator work

The web navigation now shows one source-owned queue for items that need human
attention:

- pending communication approvals,
- reviewed-learning proposals,
- terminal review and trigger failures,
- Agent message loop breaks.

Filter the queue, open the canonical decision screen, and acknowledge or restore
informational failures without copying sensitive payloads into a second audit
store. The same state is available through authenticated HTTP and CLI surfaces.

## Reviewed learning for long-lived Agents

Successful user turns can enqueue restricted background reviews. A review
produces an evidence-backed proposal rather than changing prompts immediately.
Operators can inspect and edit the proposal, approve or reject it, and later
revoke an approved lesson.

Private lessons enter only that Agent's prompt. Shared lessons become
deterministic notes in the Team's qmd-indexed memory. Review cadence, model, and
reasoning are configurable from the Agent Learning surface.

## Agent message-loop protection

Agent messages retain causal-chain and hop metadata across inbox wake turns.
The daemon rejects over-budget sends before another LLM turn can start, even if
an Agent omits `reply_to`. Configure the ceiling with
`BAZILION_AGENT_LOOP_MAX_HOPS`; inspect payload-free stop events through the
Agent API, `bazilion inbox loop-breaks`, or the web inbox.

## Pi 0.83 and the current model catalog

Bazilion 0.12.2 updates the bundled Pi packages to 0.83.0. Direct provider chat
and full Agent sessions now share one public `ModelRuntime` boundary for model
resolution, provider aliases, authentication, local endpoints, and arbitrary
model IDs. Sessions use Pi's public `DefaultResourceLoader`; runtime and tests no
longer depend on Pi's former compatibility entry points.

The provider catalog adds Qwen Token Plan international and China endpoints and
refreshes curated examples for current model families including GPT-5.6,
Claude 5, Gemini 3.6, Kimi K3, Grok 4.5, and Qwen 3.8. ChatGPT OAuth credentials
remain encrypted and daemon-owned while the runtime preserves refresh state.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.12.2)
for the published artifacts and package-level changelog.
