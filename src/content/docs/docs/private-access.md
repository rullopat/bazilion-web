---
title: Private access and mobile pairing
description: Publish the loopback web UI privately with Tailscale Serve, verify readiness, and pair a browser or phone using its own credential.
---

The supported remote topology is a private HTTPS web gateway through Tailscale
Serve. Both Bazilion listeners stay on loopback. Direct daemon exposure, public
reverse proxies, and Tailscale Funnel are unsupported.

## Prepare the host

Finish local provider setup first. Install Tailscale and connect the host and
client devices to your tailnet. Use the host's actual HTTPS name, such as
`https://your-host.your-tailnet.ts.net`, for every step below.

Remote chat uses protected execution. Prepare Docker and confirm
[protected-work readiness](/docs/tools/#prepare-docker-for-protected-work)
before exposing the web UI. Enabled browser and MCP tools remain unavailable
in protected turns.

The current `bazilion gateway preflight` command runs on the Linux daemon host
and uses `ss` and the Tailscale CLI to inspect listeners and Serve configuration.

## Start Bazilion with one exact origin

Stop the running dashboard or managed services. For a terminal-managed setup,
export these values and start the dashboard in that shell:

```sh
export BAZILION_PUBLIC_ORIGIN=https://your-host.your-tailnet.ts.net
export HOST=127.0.0.1
export PORT=4321
export WEB_HOST=127.0.0.1
export WEB_PORT=4322
bazilion dashboard
```

Use an origin only: no URL path, query, or credentials. For managed services,
put these settings in their service environments and restart both processes.
Do not start a second dashboard alongside them. Both the daemon and web UI must
receive the same origin. Once set, all HTTP Agent turns use protected execution,
even when a client connects locally.

## Publish only the web listener

In another terminal on the host:

```sh
tailscale serve --bg --https=443 http://127.0.0.1:4322
tailscale serve status
BAZILION_PUBLIC_ORIGIN=https://your-host.your-tailnet.ts.net bazilion gateway preflight
```

Use the same port environment values if you changed the defaults. Preflight
checks loopback listeners, the private Serve target, absence of Funnel, and
authenticated protected-runtime readiness. It does not reconfigure anything.
Resolve a failed check before proceeding.

Serve may prompt you to enable HTTPS for the tailnet. Its `--bg` setting persists
in the background. See the [Tailscale Serve reference](https://tailscale.com/docs/reference/tailscale-cli/serve)
for installation-specific setup and command details.

## Give each browser a credential

From the authenticated local CLI:

```sh
bazilion token create personal-laptop --expires-days 90
```

Open the exact HTTPS origin from that laptop while connected to Tailscale and
paste the newly displayed device credential into the login form. It is shown
once. Browser login exchanges it for a bounded session; it does not put the
bootstrap bearer into browser cookies.

Use a separate named credential for each device. The first-run bootstrap login
exception ends when provider setup completes.

## Pair the mobile app

With the Bazilion mobile app installed and Tailscale connected on the phone:

```sh
bazilion token create phone --expires-days 90 --qr \
  --server https://your-host.your-tailnet.ts.net
```

Scan the QR in the app, paste its pairing URL manually, or open the
`bazilion://pair` deep link. The app verifies the origin and credential before
saving them. Treat the QR as a credential; do not post it in a shared channel.
The phone connects to the HTTPS web gateway, never port 4321 directly.

Open an Agent and send a short message. Confirm the streamed reply, cancel
control, and reconnect behavior. Mobile denies dangerous shell commands rather
than offering an interactive shell approval; use web chat for those decisions.

## Revoke access and troubleshoot

```sh
bazilion token list
bazilion session list
bazilion token revoke <device-token-id>
```

Revoking a device credential invalidates its derived browser sessions too.
The bootstrap token cannot be revoked. An expired or rejected mobile credential
requires pairing again with a newly minted credential.

- **Origin or CSRF error:** use the exact configured HTTPS URL; check both
  service environments and restart after changing them.
- **Gateway preflight cannot inspect listeners:** run it on the Linux host
  with `ss` available, not on the phone or a different computer.
- **Protected runtime unavailable:** run `bazilion doctor` and repair Docker,
  the image, or the selected provider configuration. Remote chat cannot fall
  back to host tools.
- **Phone cannot connect:** confirm both devices are in the tailnet and its
  access rules permit the connection, then check `tailscale serve status`.
