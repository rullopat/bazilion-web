---
title: What's new in 0.19.1
description: Bazilion 0.19.1 fixes the endpoint used for a model newer than the bundled catalogue, on Pi 0.85.1.
---

Bazilion **0.19.1** is a patch release. It fixes the endpoint used for a model newer than the bundled
catalogue — and it corrects a misdiagnosis that followed, which is worth stating plainly because the fix and
the mistaken conclusion came from the same place.

The public packages `bazilion`, `@bazilion/client` and `@bazilion/api-types` move together to 0.19.1. The
bundled engine remains **Pi 0.85.1**. **No schema change: a 0.19.0 home upgrades in place.**

## What was broken

Two defects, both introduced with the Fireworks endpoint in 0.19.0.

**A model newer than the catalogue was called at the wrong URL.** An id absent from the bundled catalogue is
built for the OpenAI-compatible adapter, and the OpenAI SDK appends only `/chat/completions` to the base URL
it is given. The pinned endpoint was the provider's own catalogue base (`…/inference`) — correct for its
other entries, which add their own version segment — so the fallback requested
`…/inference/chat/completions` and got a **404**, where Fireworks serves `…/inference/v1/chat/completions`.
Catalogue models were never affected, which is exactly why only an upstream model broke.

**One caller never received the endpoint at all.** The session paths resolve it through the provider base
URL helper, while the provider registry built from the loaded config, which carried only the API key. So
`bazilion provider test` failed closed with *"it is not in that provider's catalog, and no endpoint is
configured for it … configure an endpoint for a custom one"* — for precisely the models that endpoint was
meant to admit. The remedy the error recommended did nothing.

Both are fixed. The version-segment translation applies **only** to the fallback, explicitly per provider and
idempotently, so catalogue models keep their own endpoint and API type; and the default endpoint travels in
the provider config from the same single source, with an explicit `FIREWORKS_BASE_URL` still winning.

## Verified against a real model

With a model newer than this build's catalogue:

- `bazilion provider test` answers.
- A real Agent turn produces a visible reply, confirmed in the session transcript.
- **[Specialist verification](/docs/coding-verification/) completes**: the model designed its own check set,
  the executor ran each captured command, and the receipts name the exact revision.
- **[Review](/docs/coding-review-packets/) completes**: the reviewer read the patch and said, in its own
  words, that confirming the value *"would need the test suite to be run — I have no shell and cannot run
  it"*, concluding *"nothing was executed, and this is not an approval."*

Nothing about the boundaries depends on trusting the model to respect them; this is what it looks like when
they hold.

## A correction

An earlier report from this work said the model *"produced no assistant content"* and that uncatalogued
models were unusable through Bazilion. **That was wrong.** The turn had failed on the 404 and reported it;
that output was truncated, and a model problem was inferred from an empty transcript. Both live-run harnesses
now **assert that a turn actually put an assistant message in the transcript**, so a turn that does nothing
cannot read as a turn that succeeded.

## Upgrading

A 0.19.0 home upgrades in place — this release changes no schema. Homes from **0.18.x or earlier still
cannot** be upgraded in place; keep a backup and set up fresh. Read
[the upgrade procedure](/docs/getting-started/#upgrade-to-0200) and
[backup and recovery](/docs/backup-recovery/).

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.19.1) for publication and
validation details. The [0.19.0 release notes](/docs/whats-new-0-19/) remain available, and everything
before 0.18.0 is summarised in [previous changes](/docs/previous-changes/).
