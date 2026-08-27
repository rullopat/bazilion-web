---
title: What's new in 0.13.0
description: Bazilion 0.13 adds credential-minimal protected execution, a private Tailscale gateway, encrypted recovery, hardened Telegram ownership, and Pi 0.84.3.
---

Bazilion 0.13 is the security-focused release for running personal Agent teams
unattended or reaching them remotely. The three public packages move together:
`bazilion@0.13.0`, `@bazilion/client@0.13.0`, and
`@bazilion/api-types@0.13.0`.

## Credential-minimal protected execution

Telegram, scheduled, inbox, approved-delivery, restricted-review, and hosted
HTTP turns can now use one protected worker boundary. Each turn receives only
the credential fields selected for its provider, an authenticated invocation
identity, and a fresh network-disabled Docker environment. Browser and MCP
tools stay outside this surface, and a failed preflight never falls back to the
configured host runtime.

Protected and restricted-review workers cover every provider in the pinned Pi
catalog. Exhaustive catalog tests fail closed when Pi adds a provider that has
not yet been assigned an explicit credential projection.

## Private HTTPS through Tailscale Serve

The supported personal-server topology keeps both Bazilion listeners on
loopback and publishes only the web app through tailnet-only Tailscale Serve.
`bazilion gateway preflight` verifies the exact HTTPS origin, loopback binds,
Serve target, absence of Funnel, authenticated health, and protected-turn
readiness without changing network configuration.

Named device credentials replace copying the bootstrap token onto browsers and
phones. Browser login exchanges a device credential for a bounded, hashed
server session with secure cookies, session-bound CSRF, strict origin checks,
and logout/revocation controls. See [Private gateway setup](/docs/configuration/#private-web-gateway).

## Encrypted backup and safer recovery

Backup creation now requires either an age recipient or an explicit
`--plaintext` acknowledgement. Encrypted restores require an owner-only age
identity file and retain the existing authenticated, staged, crash-safe
installation checks. Secret inventories expose names rather than values;
recovery can rotate the bootstrap credential and revoke non-bootstrap device
credentials without exposing their plaintext.

## Telegram owner pairing

An empty Telegram allowlist is no longer open to the first sender. The operator
generates a short-lived, one-use pairing code locally and sends `/pair <code>`
from the intended Telegram account. Ingress identity is then fail closed, with
private-supergroup guidance and secret-safe diagnostics.

## Pi 0.84.3 and provider updates

Bazilion 0.13 bundles Pi 0.84.3, adds Baseten and Qwen Token Plan Individual,
updates OAuth cancellation and prompt normalization, and refreshes curated
examples across the current model catalog.

The release boundary is covered by a deterministic 60-case adversarial suite
across the gateway, credentials, Telegram, protected workers, SSRF, Docker, and
restore seams. This is a repeatable release gate, not a claim of external
penetration testing.

See the [GitHub release](https://github.com/rullopat/bazilion/releases/tag/v0.13.0)
for the published artifacts and package-level changelog.
