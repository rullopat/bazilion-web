# Documentation audit for Bazilion 0.14.2

Reviewed 2026-09-06 against Bazilion commit
`13c3a639643eabc09b19df5e119d5ca159433f47`. Scope: all ten website documentation
pages, homepage release copy, navigation, and installer version selection.

## Assessment

The operational guides need a focused overhaul. The concepts, Team Template
and live-policy model, first-run browser identity, and 0.14 interface tour are
largely current and do not need a wholesale rewrite. Release announcements
explain some runtime restrictions more accurately than the evergreen guides.

The 0.14.2 update refreshes the homepage, sidebar, overview, concepts, provider
configuration, upgrade instructions, and release page. It adds the exact Astra
selection path and distinguishes this schema-preserving patch from incompatible
alpha upgrades. Historical 0.13 and 0.14.1 descriptions remain historical.
The findings below are follow-up work, not fixes included in that update.

## Findings, in priority order

### High: tools and Docker requirements depend on the turn's origin

`src/content/docs/docs/tools.mdx` says enabled browser and MCP tools are injected
into every Agent turn and describes host-backed coding as the general default.
The homepage's tools feature and the end of `concepts.md` omit this distinction
too. Telegram, scheduler, inbox, approved delivery, restricted review, and HTTP
under the configured public origin use protected execution. Protected normal
turns require Docker preflight and exclude browser, MCP, credentialed search,
and Firecrawl. Their web fetch is uncredentialed.

Evidence: Bazilion `apps/daemon/src/lib/turn-invocation.ts`,
`apps/daemon/src/lib/protected-execution.ts`, and
`apps/daemon/src/runtime/pi/tools.ts:createProtectedBazilionCustomTools`.

Action: lead the tools guide with a local-operator/protected-turn capability
table, then document Docker image preparation and `bazilion doctor` before
Telegram, scheduling, or private-gateway setup. Distinguish configured Docker
shell isolation from the mandatory protected worker boundary.

### High: Telegram pairing instructions can send the operator to the wrong place

`telegram.mdx` puts spawning before owner pairing and says to send `/pair` and
`/whoami` "to the bot". Direct messages are rejected as foreign chats; initial
pairing is accepted only in the configured supergroup's service topic. The
documented CLI `allow ... --owner` option is rejected by the API: owners are
created only through pairing. Member allowlisting still exists in code, so it
would be inaccurate to say all additional-member operations were removed.
The private owner-plus-bot guidance and legacy member management need to be
clearly distinguished.

Evidence: Bazilion `apps/daemon/src/lib/telegram/routing.ts:203-221`,
`apps/daemon/src/routes/telegram.ts:185-203`, and
`apps/cli/src/commands/telegram.ts` (health and pairing commands).

Action: reorder setup to credentials, preflight, activation, owner pairing in
the service topic, protected-runtime readiness, then first Agent. Remove the
unsupported owner flag and specify chat/topic destinations for commands.

### Medium: backup coverage and recovery need an operator procedure

`configuration.md` gives encrypted create/restore commands but does not explain
that linked Team directories are archived as links. Their external files,
including Team memory under those targets, need a separate backup. It also
does not walk the reader through checking a restored installation before reuse.

Evidence: Bazilion `apps/daemon/src/lib/backup.ts` and
`apps/cli/src/commands/backup.ts` (Team-slot link validation and restore).

Action: add a backup/recovery guide covering archive scope, separate linked
project backups, age identity storage, stopping services, restoration, and
post-restore checks. Keep destructive alpha resets separate from patch upgrades.

### Medium: remote-access guidance contradicts itself

`why-bazilion.md` describes LAN access as an opt-in with "your own TLS/VPN
boundary". `configuration.md` correctly narrows the supported topology to
tailnet-only Tailscale Serve over the loopback web listener and excludes direct
daemon/LAN exposure and public reverse proxies.

Action: replace the broad wording with a link to the canonical private-gateway
guide. Split gateway and phone pairing into a task-oriented guide rather than
burying both at the end of the configuration reference.

### Medium: daily operations are named but not taught

The interface tour mentions Attention and reviewed learning, but the corpus
does not show how to diagnose a stopped/background Agent, distinguish a held
communication from a failed trigger, inspect retries, or review and revoke a
lesson. These are discoverability gaps rather than demonstrated code defects.

Action: add workflows for `bazilion doctor`, trigger history, approvals versus
shell decisions, Attention, and learning.

## Suggested delivery order

1. Correct the tools/runtime and Telegram guides together; verify the local
   conversation and documented protected preflight/pairing paths.
2. Add backup/recovery and private-gateway/mobile guides; repair contradictory
   cross-links and copy.
3. Add daily operations examples and checks for generated internal links,
   anchors, and current release references.

Keep the current concepts and UI-tour structure. Move implementation invariants
out of introductory prose where they interrupt completing a task.
