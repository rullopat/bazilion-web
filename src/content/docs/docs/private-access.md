---
title: Private access
description: Reach the web UI from a laptop or phone over Tailscale Serve, with one device token per device.
---

To use Bazilion from a laptop or phone elsewhere, publish the web UI over Tailscale Serve:
tailnet-only HTTPS in front of the loopback web listener. The daemon and the web UI both stay on
loopback. Tailscale Funnel, a public reverse proxy and exposing the daemon directly are not
supported.

## Set up

Install Tailscale on the host and on your devices. Run Bazilion as an ordinary user, with the
exact HTTPS origin in its environment (the daemon and the web UI both read it):

```sh
export BAZILION_PUBLIC_ORIGIN=https://your-host.your-tailnet.ts.net
bazilion dashboard --no-open        # daemon on 127.0.0.1:4321, web UI on 127.0.0.1:4322
tailscale serve --bg --https=443 http://127.0.0.1:4322
tailscale serve status --json       # must show Serve on the web port, never Funnel
```

Use an origin only: no path, query or credentials. With `BAZILION_PUBLIC_ORIGIN` set, the daemon
refuses a non-loopback `HOST`, cookies become `__Host-` cookies, and the web UI answers only
requests for that host. When the two processes run as separate services (`bazilion serve` with
`HOST`/`PORT`, the web server with `WEB_HOST`/`WEB_PORT`), give both the same value.

Check from another machine that ports 4321 and 4322 are not reachable and that the HTTPS name does
not resolve off the tailnet. See the
[Tailscale Serve reference](https://tailscale.com/docs/reference/tailscale-cli/serve) for setup on
your tailnet.

## Sign in

Open the HTTPS origin on a tailnet device and log in with a token: the bootstrap token
(`bazilion token show-local` on the host) or a device token. The daemon turns it into a session
cookie; the browser does not keep the token. A session ends after 30 days without use.

Give each browser, phone or remote CLI its own device token, on **Setup → Tokens**
(`/config/tokens`) or with the CLI. The plaintext is shown once. Every token has full access (with
`BAZILION_BASH_SANDBOX=off` that includes running host commands through an Agent) and expires only
when you ask:

```sh
bazilion token create personal-laptop               # --expires-days 90 for one that expires
bazilion token list
bazilion session list
```

## Phones

On a phone with Tailscale connected, open the same HTTPS origin in the browser and sign in with
its own device token. There is no native app; the web UI works at phone widths.

## A remote CLI

A remote CLI talks to the same HTTPS origin. Set `BAZILION_SERVER=https://your-host.your-tailnet.ts.net`
and `BAZILION_TOKEN=<device token>` in its environment, or save the pair:

```sh
bazilion login --server https://your-host.your-tailnet.ts.net --token <device token>
bazilion login --clear              # back to the local daemon
```

`login` checks the token against the server first (`--skip-verify` skips that) and stores the
remote in the local `auth.json`, so it needs a machine that has run `bazilion serve` once;
elsewhere use the two environment variables.

## Lost device

Revoke its token with `bazilion token revoke <id>` or on the Tokens page; every browser session
opened with it ends at once. A single session can be revoked with `bazilion session revoke <id>`.
The bootstrap token cannot be revoked.

## Troubleshooting

- **Origin or CSRF error:** use the exact configured HTTPS URL, and check that the daemon and the
  web UI got the same `BAZILION_PUBLIC_ORIGIN`; restart both after changing it.
- **Phone cannot connect:** check that both devices are on the tailnet and its access rules allow
  the connection, then `tailscale serve status`.
