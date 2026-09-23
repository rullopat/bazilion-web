---
title: What's new in 0.22.0
description: Bazilion 0.22.0 adds image generation with four explicit routes and durable, non-replayable spend, plus opt-in bounded web discovery for protected Agents, on Pi 0.87.1.
---

Bazilion **0.22.0** gives Agents **eyes**: protected Agents can generate images through explicit,
individually opt-in routes, and — if you configure it — discover sources on the public web through
a bounded, credential-free search backend.

Bazilion remains **alpha**. Version 0.22.0 ships as a plain `0.22.0` — no beta suffix. Feature
checkpoints keep landing as `0.N.0` releases; a `1.0.0-beta.1` label is reserved for a deliberate,
later decision.

The public packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to
0.22.0. The bundled engine is **Pi 0.87.1**.

## Image generation, with the spend handled honestly

Protected Agents can generate images when you enable it. Four routes are supported, each an
independent opt-in: **Google Gemini** (`google/gemini-3.1-flash-image`) and a generic
**OpenRouter/Pi** route (`openai/gpt-image-2`) using OpenRouter or Pi keys, a direct **OpenAI API
key** route (`openai:gpt-image-2`), and a **ChatGPT/Codex** OAuth route
(`openai-codex:gpt-image-2`). An Agent's automatic route follows its enabled text providers and
identity — but only when image generation is enabled for it.

The spend contract is the headline: an image **intent is recorded before the request is sent**, the
request is never replayed or silently retried, and a configuration change between intent and
dispatch fails the operation truthfully ("No image request was sent") rather than billing against
stale settings. Every image lands in the existing Results surface with a receipt, so what was
generated, when, and at what cost is always inspectable.

## Bounded web discovery for protected Agents (opt-in)

A protected Agent whose operator sets `BAZILION_WEB_SEARCH_URL` (a self-hosted
[SearXNG](https://docs.searxng.org/) instance) gains a `web_search` tool with a deliberately narrow
contract: the worker never sees the backend URL or any credential, queries are capped, results are
bounded and arrive as **untrusted data**, there is one request per invocation with a deadline, and
no retry or fallback. Fetching a discovered URL still goes through the SSRF-guarded `web_fetch`.

Discovery is **opt-in** — without the variable, protected Agents simply have no search tool, and
report that honestly rather than working around it. (Looking for a search that works with no
configuration at all? That — a browser-backed default — is the planned headline of **0.23.0**.)

## Engine refresh: Pi 0.87.1

The bundled Pi engine moves from 0.85.1 to **0.87.1**, and the model catalog with it — including
current model families across providers and two new provider surfaces (**Meta** and **Radius**) you
can enable with their API keys. The catalog ships typed with the engine, so the models list cannot
drift from what the engine actually supports.

## Also in this release

- **Workers exit promptly.** A turn's worker process could linger for tens of seconds after its
  turn ended, holding the Team's workspace lease and blocking interleaved turns with
  `workspace_busy`. It now exits as soon as its work is done.
- **Operator honesty about limits:** a failed turn still leaves the Team's workspace in a
  recovery-required state by design (fail-closed); the supported operator surface for clearing it
  is planned, not shipped.

See the GitHub release for publication and validation details. The
[0.21.0 release notes](/docs/whats-new-0-21/) cover the home-upgrade and platform-hardening line;
everything before 0.19.0 is summarised in [previous changes](/docs/previous-changes/).
