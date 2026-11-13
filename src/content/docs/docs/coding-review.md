---
title: Reviewing what changed
description: Live tool output in the chat, and Git change review of a Team's repository from the Review tab and the CLI, with file feedback to an Agent.
---

## Live tool output

While a tool runs, its output streams into the chat. The web chat shows a live tail under the tool
call, and `bazilion agent chat --message` prints each new output line as it arrives. Any tool that
reports progress takes part; in practice that is `bash`, on the host or in the Docker sandbox. The
tool's result replaces the live tail when it finishes.

Known credential values (stored secrets and the turn's provider credentials) are redacted from tool
output before it reaches a client, both live and in reloaded history.

## Change review

The Team **Review** tab and `bazilion team review` show what changed in a Team's Git repository
since a base: `HEAD` by default, or any branch, tag, commit id or revision such as `HEAD~1`.
Review is read-only: Bazilion never stages, commits, checks out or reverts anything.

```sh
bazilion team review show <team>                             # changed files since HEAD
bazilion team review show <team> --base main --patch src/app.ts
bazilion team review show <team> --json                      # everything, diffs included
bazilion team review feedback <team> --path src/app.ts --agent <agent> --note 'Handle the empty case'
```

- Select a file (or pass `--patch`) to see its diff. A new, untracked file shows as an added file.
  Diffs are read only when asked for and are bounded.
- Feedback sends one Team member a message with the file, its change, a diff excerpt and your note.
  It goes through the ordinary [follow-up queue](/docs/follow-up-queue/), so it runs as that
  Agent's next turn.
- The Team's own `memory/` store and credential-shaped paths (`.env`, `*.pem`, `credentials.*`,
  `.ssh/`, …) never show content; untracked ones are only counted.
- A Team whose workspace is not a Git repository says so instead of showing an empty list.

## How Git is read

Inspection never modifies the repository and never runs repository-configured helpers. It copies
the Git metadata into a scratch directory with a Bazilion-written config: hooks, external diff,
textconv and fsmonitor are not used, and the original index is not refreshed or written. Git never
searches for a repository above the Team directory.

Refused rather than followed: a config that uses includes, filters or `core.worktree`, alternates,
links that leave the Team (a Team registered with `--link` is fine), special files, linked worktree
and submodule metadata, and sparse or split-index layouts. One inspection has 5 seconds, each Git
command 1 MiB of output, and the metadata copy at most 64 MiB in 16,384 entries.
