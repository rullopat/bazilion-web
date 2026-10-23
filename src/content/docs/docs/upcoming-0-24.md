---
title: Upcoming 0.24 — unreleased preview
description: Preview of ordinary macOS chat and clearer readiness diagnostics in the qualified but unpublished 0.24.0 candidate.
---

:::caution[Not a published release]
The 0.24.0 packages are versioned and qualified, but **not yet published**. The
[release PR](https://github.com/rullopat/bazilion/pull/79) is still draft and unmerged.
The public npm release remains **0.23.0**, which still refuses macOS Agent turns.
The existing installation guides and homepage describe that published release;
do not treat this preview as an available npm upgrade.
:::

The candidate focuses on three changes: ordinary macOS Agent chat, the embedded Pi 1.4.0
family, and diagnostics that distinguish a healthy installation from execution readiness.
Bazilion remains **alpha**. Codemode and Pi Durable are not included.

## Ordinary macOS chat

Ordinary interactive chat now has bounded qualification on **macOS 26 arm64 / Node 24.22.0**,
including fresh installed CLI, HTTP API and browser turns with empty Teams and actual repository
instructions. Linux remains supported. The runtime requirement stays
**Node 24.22.0+ within 24.x or 26.4.0+ within 26.x**.

The daemon retains directory identities and revalidates registration, source files, absence and
listings. Linux retains descriptor-relative access; macOS uses guarded rooted reads. These are
change detectors, **not atomic filesystem snapshots or a general sandbox**.

Ordinary chat support does not mean blanket platform parity:

- **Ordinary interactive chat:** Linux and macOS are supported, subject to all per-turn checks.
- **Hardened Git inspection:** Linux-only, with capture checks still mandatory. Unsupported on macOS.
- **MCP stdio:** Linux-only, with owned process-tree retirement required. On macOS, use Streamable HTTP.
- **MCP Streamable HTTP:** portable across Linux/macOS; configure and test each server separately.

Protected unattended prerequisites remain independent; protected turns do not gain browser or MCP
access and never fall back to ordinary host execution. Unknown worker ownership stays blocked.
A daemon restart, a cancelled request or a locally closed pipe is not cleanup confirmation.
**Windows remains unsupported.** Intel Macs, older macOS versions, macOS Node 26, arbitrary
detached-writer recovery and macOS image generation are not qualified by these ordinary-chat observations.

## Installation health is not execution readiness

The candidate's `bazilion doctor` and web configuration page separate:

- **Installation health:** structural checks, not proof that a provider or turn works.
- **Platform support:** static support labels, not execution or connectivity tests.
- **Ordinary chat execution:** **Not checked** by diagnostics; test a provider and run a turn separately.
- **Protected unattended baseline:** independent prerequisites and remediation, with per-turn checks
  still mandatory even when the baseline is ready.

**Doctor's exit status changes in 0.24:** zero means the structural installation checks passed.
A missing protected baseline remains visible but does not by itself produce a failed installation
exit. Automation requiring protected work must inspect `protectedWorkBaselineReady` in the
**authenticated** `/api/health/details` response separately. Public liveness stays minimal.
This change does not apply to the currently published 0.23.0 doctor command.

## Embedded engine, unchanged authority

The daemon and packaged CLI pin the Pi AI, agent-core, coding-agent and standalone MCP family to
**1.4.0**. Stored Agent/Profile provider choices are not rewritten. Azure catalog, credentials and
refresh share the canonical SDK identity while retaining Bazilion's stored provider ID.

The daemon still owns credentials, MCP connections and tool admission. No ambient extension or
resource discovery, automatic MCP OAuth, Codemode/model bridge or uncertain-call replay is added.
Catalog membership is not account entitlement or proof that a provider works. Existing live
search/image qualification limits remain unchanged.

## Existing 0.23 homes

The candidate keeps the canonical 0.23 schema unchanged. Its genuine 0.23.0 fixture retained Team
sentinel data and paired `auth.json` bytes across two healthy candidate starts. All eight older
incompatible fixtures still refused without state changes. This is bounded startup/state evidence,
not a general transcript, backup or cross-platform upgrade guarantee.

Before any future upgrade, stop the old daemon safely and preserve the entire home, keeping
`bazilion.db` and `auth.json` together, plus external linked Team work. A valid 0.23 home should not
be reset merely to update. The older clean-rebootstrap boundary remains unchanged; there is no
new importer, ALTER compatibility layer or force-clear for ownership records.

## Candidate qualification and next step

The versioned candidate passed [all six CI jobs](https://github.com/rullopat/bazilion/actions/runs/39923495901):
source checks/builds and installed CLI trials on Linux/macOS, real browser diagnostics at desktop
and phone widths, 399 required security cases and the expanded nine-entry release matrix.
Both library tarballs were installed together offline and checked through runtime imports and
browser-only consumer types. CLI artifacts retain platform/build-specific hashes; cross-platform
byte equivalence and public-registry signatures or attestations are not claimed.

Publication, public-byte verification and promotion of this website to 0.24 are separate next steps.
Until then, use the [published 0.23 release notes](/docs/whats-new-0-23/) for current availability.
