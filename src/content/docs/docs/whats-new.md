---
title: What's new
description: Recent Bazilion releases; the current release bundles Pi 1.4.0.
---

The latest four release lines, newest first. Older details remain in
[GitHub Releases](https://github.com/rullopat/bazilion/releases).
Historical sections describe their own release, not today's platform or upgrade guarantees.

## Bazilion 0.25.0

Published **2026-10-30**: the CLI, API types and HTTP client are all **0.25.0 on npm latest**.
This is **alpha software for operator testing**, not production readiness or complete platform parity.
See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.25.0) and read the
[0.25 upgrade guidance](/docs/getting-started/#upgrade-to-0250) before changing an existing home.
The embedded Pi family stays **1.4.0**; no ambient discovery or extra Agent authority is enabled.

### Trusted Mac 27.x and Linux isolation

Actual installed CLI/API/web, trusted host coding, hardened private-worktree Git and owned MCP
stdio are observed on **macOS 27.0.1 (26A434), M2 Pro arm64 / Node 26.12.1**. The tested **27.x
major line** is sufficient for this alpha; other minors are not implied tested or automatically
incompatible. Ordinary Mac shell execution is explicitly **trusted and unisolated** (`off`).
Working from a Team directory and asking for command approval are not an OS sandbox.

Linux adds **unprivileged Bubblewrap with mandatory seccomp**, minimal credentials, scoped files
and original-owner cleanup. Retained Linux Docker remains a separate explicit backend. Neither
backend falls back to host execution when admission or cleanup fails.

**Mac generic native isolation is deferred/unqualified; Mac Docker/VM execution is removed.**
Explicit or stale native/Docker choices refuse rather than becoming host execution.
Isolation-required Mac coding and specialist command verification refuse before model/tool effects.
Existing fixed-tool reviewers still have no shell/coding capability. Browser, MCP, guarded Git,
policy/approvals and worker ownership retain independent boundaries.

### Non-GUI browsing and real lifecycle evidence

The installed non-GUI browser path uses an Agent-private native keychain, not the operator's
personal profile/keychain. Observed checks include actual source reads/snapshots, PNG delivery,
private-network denial, main-process shutdown with a live browser/worker, and restart/offline
restore. Stop preserves the profile; backup excludes it; restored homes launch fresh owned
browsers only for a new explicit turn. Unknown cleanup remains blocked, never force-cleared.

**Mac headed/desktop-browser qualification is deferred to a later version**, explicitly untested
for 0.25. Public-page reads, browser PNGs and synthetic providers do not qualify live models,
generated-image routes, account entitlement, Google access or arbitrary sites. Earlier failed
runs and unconfirmed resources remain preserved; publication does not settle them.

### Node 26 and a new clean-rebootstrap boundary

Require **Node `^26.12.1` only**, with **26.12.1 / pnpm 12.15.0** as the product development
baseline. Node 24, earlier 26.x releases and other majors are refused before application/state
bootstrap. Updating Node does not authorize resetting data.

The canonical alpha schema changed. **Genuine 0.24.0 and older homes refuse unchanged**; there is
no ALTER migration or old-backup importer. Preserve the entire old home, paired `bazilion.db` and
`auth.json`, and external Team work before any explicitly authorized reset. Keeping the old home
and choosing a fresh `BAZILION_HOME` is an alternative; old data is not automatically imported.

### Published artifacts and qualification limits

[All nine final CI jobs](https://github.com/rullopat/bazilion/actions/runs/41024307235) and the
[existing publication workflow](https://github.com/rullopat/bazilion/actions/runs/41025663188)
passed. Genuine public CLI installs/CLI/API/web/MCP and owned cleanup pass on Linux and the
accepted Mac. Guarded installs disable lifecycle scripts and rebuild only admitted dependencies;
this does not qualify unrestricted default npm scripts. Public libraries pass offline runtime
and browser-only type consumers.

Public archives pass integrity, safe-structure and registry ECDSA checks. Library bytes match
qualified candidates; CLI differences are confined to proven generated SSR build-root metadata
and its manifest reference. Registry metadata supplies no `gitHead` or build-source attestations:
**no cryptographic build-source provenance is claimed**. Alpha scope, deferred testing and
unobserved provider/image limits remain explicit.

## Bazilion 0.24.0

Bazilion **0.24.0 was published on npm latest** for the CLI, API types and client.
The [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.24.0) identifies the
published source. Read the [upgrade guidance](/docs/getting-started/#upgrade-to-0240) first.

This release focuses on three changes: ordinary macOS Agent chat, the embedded Pi 1.4.0
family, and diagnostics that distinguish a healthy installation from execution readiness.
Bazilion remains **alpha**. Codemode and Pi Durable are not included.

### Ordinary macOS chat

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

### Installation health is not execution readiness

`bazilion doctor` and web configuration page separate:

- **Installation health:** structural checks, not proof that a provider or turn works.
- **Platform support:** static support labels, not execution or connectivity tests.
- **Ordinary chat execution:** **Not checked** by diagnostics; test a provider and run a turn separately.
- **Protected unattended baseline:** independent prerequisites and remediation, with per-turn checks
  still mandatory even when the baseline is ready.

**Doctor's exit status changes in 0.24:** zero means the structural installation checks passed.
A missing protected baseline remains visible but does not by itself produce a failed installation
exit. Automation requiring protected work must inspect `protectedWorkBaselineReady` in the
**authenticated** `/api/health/details` response separately. Public liveness stays minimal.
This differs from the historical 0.23.0 doctor exit contract.

### Embedded engine, unchanged authority

The daemon and packaged CLI pin the Pi AI, agent-core, coding-agent and standalone MCP family to
**1.4.0**. Stored Agent/Profile provider choices are not rewritten. Azure catalog, credentials and
refresh share the canonical SDK identity while retaining Bazilion's stored provider ID.

The daemon still owns credentials, MCP connections and tool admission. No ambient extension or
resource discovery, automatic MCP OAuth, Codemode/model bridge or uncertain-call replay is added.
Catalog membership is not account entitlement or proof that a provider works. Existing live
search/image qualification limits remain unchanged.

### Existing 0.23 homes

0.24 keeps the canonical 0.23 schema unchanged. Its genuine 0.23.0 fixture retained Team
sentinel data and paired `auth.json` bytes across two healthy candidate starts. All eight older
incompatible fixtures still refused without state changes. This is bounded startup/state evidence,
not a general transcript, backup or cross-platform upgrade guarantee.

Before upgrading, stop the old daemon safely and preserve the entire home, keeping
`bazilion.db` and `auth.json` together, plus external linked Team work. A valid 0.23 home should not
be reset merely to update. The older clean-rebootstrap boundary remains unchanged; there is no
new importer, ALTER compatibility layer or force-clear for ownership records.

### Qualification and public artifacts

[All six final CI jobs](https://github.com/rullopat/bazilion/actions/runs/39941560898) passed:
source checks/builds and installed CLI trials on Linux/macOS, real browser diagnostics at desktop
and phone widths, 399 required security cases and the nine-entry release matrix.
The [publication workflow](https://github.com/rullopat/bazilion/actions/runs/39942502773) also passed.

Actual public archives passed integrity, safe-structure and registry ECDSA signature checks.
Both public libraries passed offline runtime imports and browser-only consumer types. A fresh
Linux Node 24.22.0 guarded installation of the public CLI passed CLI/API/browser chat, diagnostics
and owned cleanup. Lifecycle scripts were disabled and admitted dependencies rebuilt explicitly;
this is not unrestricted npm lifecycle qualification or a new public-artifact macOS campaign.
The library archives match the qualified bytes; the CLI comparison differs only in proven generated
SSR source-root metadata and its corresponding manifest filename reference.

**No cryptographic build-source provenance is claimed:** npm attestation endpoints returned 404
and registry metadata supplied no `gitHead`. Registry signatures establish registry artifact
integrity, not a signed source-build attestation. Earlier live provider/search/image limits remain.


## Bazilion 0.23.0

Published 2026-10-21; **alpha**, with **Pi 1.0.0**. Agent execution was Linux-only in this
release; macOS ordinary chat arrived in 0.24.0.

- **Source-grounded research:** eligible interactive Agents gained daemon-owned native
  OpenAI/ChatGPT discovery followed by guarded source reads. Status did not prove entitlement;
  direct API-key native search remained experimental/live-unqualified. Protected turns gained
  no native-search or browser authority.
- **Private image recovery:** completed, identity-bound captures could survive interrupted
  delivery. Team Results exposed policy-gated recovery/discard without another provider request.
  Live image acceptance was ChatGPT-only with recorded geometry/evidence limits; direct OpenAI
  and OpenRouter remained live-unqualified.
- **Workspace blockers:** CLI/API/Team pages exposed limited recorded-cleanup attempts.
  Cancellation or restart did not prove commands stopped; unknown ownership remained blocked.
- **MCP:** legacy SSE was retired. Streamable HTTP remained available; stdio execution required
  Linux-owned process-tree retirement. No automatic OAuth or uncertain-call replay was added.

**0.23 introduced a clean-rebootstrap boundary for incompatible older homes, including 0.22.**
Preserve the complete home and paired DB/auth identity before an authorized reset. The later
0.24 release did not change that schema and must not trigger a reset of a valid 0.23 home.
See [current upgrade guidance](/docs/getting-started/#upgrade-to-0250) and the
[0.23 schema boundary](/docs/getting-started/#upgrade-to-0230).

Public archive integrity, registry signatures and guarded public installations passed.
Npm build attestations were unavailable; no cryptographic build-source provenance was claimed.
The limited scheduler/process observations did not qualify a composed live content-Team campaign.

[0.23.0 GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.23.0).

## Bazilion 0.22.0

Published 2026-09-23 as a plain version at **alpha** maturity, with **Pi 0.87.1**.

- **Opt-in image generation:** direct OpenAI API keys, ChatGPT/Codex login and Pi's OpenRouter
  route were explicit choices. Automatic routing followed enabled providers, never credential
  fallback after an error. Durable intent/receipts prevented automatic replay of uncertain spend;
  generated files used policy-authorized Results. Account-dependent live acceptance remained
  deferred, not a promise every route worked.
- **Protected public-web discovery:** an operator-configured SearXNG backend supplied bounded,
  untrusted results through `web_search`. Backend credentials stayed daemon-side, requests had
  limits/deadlines and no retry/fallback, and source fetches retained SSRF checks. Restricted
  review/verification workers did not receive this capability.
- **Engine/catalog refresh:** Pi 0.87.1 added current models plus Meta and Radius provider
  surfaces; catalog membership was not account entitlement.
- **Prompt worker exit:** settled turns stopped holding the Team workspace lease through a
  lingering post-turn process handle. Abnormal ownership still failed closed; the later
  operator recovery surface was not yet shipped.

The historical release supported its declared 0.20/0.21 home upgrades. That does **not** make
those homes compatible with the later 0.23 boundary. Follow
[current upgrade guidance](/docs/getting-started/#upgrade-to-0250), not an old install pin.

[0.22.0 GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.22.0).
