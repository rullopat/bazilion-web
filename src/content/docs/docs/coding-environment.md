---
title: Coding with Agents
description: Agents work on code with bash and file tools in the Team directory, on the host or in a Docker sandbox, guided by the repository's AGENTS.md files.
---

Agents work on code with the `bash` tool and, when the sandbox is off, Pi's file tools. Ask for
the work ("fix this bug and run the relevant test") and the Agent runs what it needs. Output
streams into the chat while a command runs; the result carries the output and the exit code, and
a non-zero exit is a result to investigate.

To work on an existing project, register a Team on it; the Team directory is the Agents' working
directory:

```sh
bazilion team add my-app --link /path/to/my-app
```

On the web, use **Register a team** on the Teams page with a link target. Review the changes on
the Team's
**Review** tab ([Reviewing what changed](/docs/coding-review/)).

## Repository instructions

When a turn starts, the daemon reads `AGENTS.md` in the Team workspace root and, in Docker mode,
in each directory down to the Team's working directory. Pi gets them as project instructions, and
the system prompt tells the Agent that an `AGENTS.md` governs its directory and everything below
it, so it reads deeper ones before editing there.

A file is used when it is a regular file of at most 128 KiB whose real path stays inside the Team
workspace; a link to another workspace file (such as `AGENTS.md -> CLAUDE.md`) is fine. Anything
else is skipped with a line in the daemon log. The Agent's own documents are separate. Pi's own
discovery of extensions, skills and context files stays off, so a repository's `.pi/` runs nothing.

## Host or Docker

`BAZILION_BASH_SANDBOX` applies to every turn: chat, Telegram, follow-ups, schedules and inbox
wakes. Set it on `/config/services` (**Agent Runtime → Agent Shell Security**) or with
`bazilion config set BAZILION_BASH_SANDBOX docker`.

| Setting | What runs |
| --- | --- |
| `off` (default) | `bash` and Pi's file tools (`read`, `edit`, `write`, `grep`, `find`, `ls`) run on the host as the daemon's user, in the Team directory. Nothing is isolated. |
| `docker` | Only `bash`, each command in a fresh container. The file tools are hidden, because they take host paths. |

In Docker mode every command is one `docker run --rm` with:

- no network;
- the Team directory read/write at `/workspace`, with its `memory/` store read-only;
- the Agent's uploaded files read-only at `/inputs` and attached skills read-only under `/skills`;
- a read-only root filesystem and a 64 MiB `/tmp` that does not persist between commands;
- the daemon user's uid/gid, no capabilities, `no-new-privileges` and at most 256 processes;
- nothing from the host environment;
- the local image only: Bazilion never pulls.

Cancelling a turn removes its running container. If Docker or the image is missing, the command
fails and the Agent sees the error; nothing falls back to the host. `bazilion doctor` and
`/config` show whether the configured image is available.

## The image

The default image is `debian:bookworm-slim`:

```sh
docker pull debian:bookworm-slim
```

Any local image with `/bin/bash` works; select it with `BAZILION_BASH_SANDBOX_IMAGE`. There is no
network inside the container, so the tools and dependencies a project needs must already be in
the image or in the workspace. The repository's
[example Dockerfile](https://github.com/rullopat/bazilion/tree/main/examples/coding-environment)
adds Node and pnpm:

```sh
docker build -t bazilion-coding:node26-pnpm12 examples/coding-environment
bazilion config set BAZILION_BASH_SANDBOX_IMAGE bazilion-coding:node26-pnpm12
```

## Team defaults

A Team can name its own image and a working directory inside the Team; both apply only in Docker
mode. On the web, open the Team page and expand **Docker sandbox defaults**. From the CLI:

```sh
bazilion team environment show <team>
bazilion team environment set <team> --image bazilion-coding:node26-pnpm12 --cwd app
bazilion team environment set <team> --image ''   # back to the installation image
```

The directory must exist when it is saved, and neither it nor a parent inside the Team may be a
symbolic link.

## Credentials

Bazilion's own credentials are kept out of shell commands and MCP stdio servers: the ChatGPT
sign-in, MCP bearer tokens, the Telegram bot token and the bootstrap or CLI token.

On the host, the provider API keys and other secrets saved on `/config` are in the commands'
environment, and a command runs as the daemon's user: it can read the Bazilion home, including
`auth.json` and the database whose secrets that token decrypts. In Docker only the Team directory,
the uploads and the attached skills are mounted and no host environment is passed.

## Dangerous-command approval

With `BAZILION_BASH_APPROVAL=dangerous`, commands a classifier flags pause for a decision:
credential paths, recursive deletes or permission changes outside the Team, piping a download into
a shell, uploads to remote hosts, `sudo` and environment dumps. The web chat shows **Allow once**
and **Deny**; `bazilion agent chat` in a terminal asks on stdin. An unanswered request is denied
after two minutes. Turns with nobody to ask (Telegram, schedules, inbox wakes, queued follow-ups,
piped CLI) deny flagged commands.

The classifier is a tripwire, not a sandbox: a determined command can get around it.

## Teammates

Teammates' turns run at the same time, in the same workspace. An Agent can ask another one for
work with `send_message` and wait for the answer with `wait_for_reply`, within the Team's
[policy](/docs/concepts/#team-policy).

## Limits

- Bind mounts use `bind-recursive=disabled`, which needs Docker Engine 25 or later.
- A process a command detaches from the worker's process group is not tracked.
- The Docker sandbox is used on Linux; elsewhere it is untested.
