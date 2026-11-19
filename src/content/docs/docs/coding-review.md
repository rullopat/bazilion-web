---
title: Reviewing what changed
description: Live tool output in the chat, and Git change review of a Team's repository in the web workspace and the CLI, with line and file comments sent to an Agent as one review.
---

## Live tool output

While a tool runs, its output streams into the chat. The web chat shows a live tail under the
running step, and `bazilion agent chat --message` prints each new output line as it arrives. Any
tool that reports progress takes part; in practice that is `bash`, on the host or in the Docker
sandbox. The tool's result replaces the live tail when it finishes.

Known credential values (stored secrets and the turn's provider credentials) are redacted from tool
output before it reaches a client, both live and in reloaded history.

## Change review

**Changes** in the web workspace and `bazilion team review` show what changed in a Team's Git
repository since a base: `HEAD` by default, or any branch, tag, commit id or revision such as
`HEAD~1`. Review is read-only: Bazilion never stages, commits, checks out or reverts anything.
When a turn wrote files, **Review changes** under it in the chat opens the first of them.

![The Changes view: a side-by-side diff with two line comments and the review about to be sent.](/screenshots/changes.webp)

```sh
bazilion team review show <team>                             # changed files since HEAD
bazilion team review show <team> --base main --patch src/app.ts
bazilion team review show <team> --json                      # everything, diffs included
bazilion team review feedback <team> --path src/app.ts --line 42 --agent <agent> --note 'Handle the empty case'
```

- The list names each changed file, the lines it gained and lost, and the Agent whose turn last
  wrote it with `write` or `edit`. A file changed by a shell command has no author.
- Select a file (or pass `--patch`) to see its diff: in the side panel in one column, in the
  full-width view with the old and the new file side by side. A new, untracked file shows as an
  added file. Diffs are read only when asked for and are bounded.
- Click a line number to comment on that line, or **Comment on the file**. Comments gather into
  one review, and **Send review** sends them to one Team member as a single message: each comment
  with its file, its change, the diff around it and your note. The Agent offered first is the one
  that wrote the commented files. From the CLI, `feedback` sends one comment; `--line` picks the
  part of the diff that holds that line.
- The message goes through the ordinary [follow-up queue](/docs/follow-up-queue/), so it runs as
  that Agent's next turn.
- A review that is not sent yet lives in the page: reloading it, or leaving the workspace for
  another page, drops it.
- The Team's own `memory/` store and credential-shaped paths (`.env`, `*.pem`, `credentials.*`,
  `.ssh/`, …) never show content; untracked ones are only counted.
- A Team whose workspace is not a Git repository says so instead of showing an empty list.

The API is `GET /api/teams/:id/review[?base=&patches=1&path=&authors=1]` and
`POST /api/teams/:id/review/feedback` with
`{ agentId, comments: [{ path, line?, note? }], note?, base? }`: 1 to 20 comments, `line` being a
line of the file as it is now.

## How Git is read

Inspection never modifies the repository and never runs repository-configured helpers. It copies
the Git metadata into a scratch directory with a Bazilion-written config: hooks, external diff,
textconv and fsmonitor are not used, and the original index is not refreshed or written. Git never
searches for a repository above the Team directory.

Refused rather than followed: a config that uses includes, filters or `core.worktree`, alternates,
links that leave the Team (a Team registered with `--link` is fine), special files, linked worktree
and submodule metadata, and sparse or split-index layouts. One inspection has 5 seconds, each Git
command 1 MiB of output, and the metadata copy at most 64 MiB in 16,384 entries.
