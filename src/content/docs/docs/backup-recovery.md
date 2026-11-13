---
title: Backup and recovery
description: Back up the Bazilion home while it runs, encrypted to an age key, restore it with the daemon stopped, and reset a home.
---

## Back up

```sh
bazilion backup create                                # bazilion-backup-<date>.tar.gz
bazilion backup create ~/backups/home.tar.gz
bazilion backup create --recipient age1…              # encrypted to an age recipient (.age)
```

On the web, **Download backup** on `/config` saves the same archive, unencrypted.

The backup works while the daemon runs: the archive is a tar.gz of the home around an online,
integrity-checked SQLite snapshot. The database snapshot is consistent; files Agents are writing
at that moment may not be, so prefer a moment when no turn runs.

| Included | Left out |
| --- | --- |
| `bazilion.db` and `auth.json`, Agent documents and conversations, uploads, Profiles, skills, Team workspaces and memory notes | Browser profiles (they hold site logins), the qmd search indexes (rebuilt from the notes) and the pidfile |

A Team registered with `--link` is archived as the link only, not the project it points to: back
that project up yourself.

Without `--recipient` the archive is plaintext and holds every stored credential, together with
the `auth.json` that decrypts them. Keep the age identity (private key) outside the home and away
from the archive. The CLI refuses to overwrite a file or to write inside the home.

## Restore

```sh
bazilion backup restore bazilion-backup-2026-11-13.tar.gz
bazilion backup restore home.tar.gz.age --identity ~/.config/age/key.txt
bazilion backup restore home.tar.gz --home /srv/bazilion --force
```

Stop the daemon first: restore refuses while a daemon runs on the target home. It decrypts the
archive if needed, refuses paths and links that leave the home (other than linked Teams) and
special files, checks the database (integrity, the schema of this release, the `auth.json` pair)
and only then swaps the restored home in. A non-empty target needs `--force`, which deletes its
current data.

The schema check means a backup can be restored only by the release that wrote it. A 0.25 or
older archive cannot be restored by 0.26.0; keep the release that wrote it if you need its data.

To try a restore without touching your home, restore into an empty directory and start it with
the scheduler off, so no trigger or inbox turn runs:

```sh
bazilion backup restore home.tar.gz.age --identity key.txt --home /tmp/bazilion-check
BAZILION_HOME=/tmp/bazilion-check BAZILION_SCHEDULER=off PORT=4331 bazilion serve
```

Do not run two copies of a home against the same Telegram bot.

## After a restore

A restored home is the home as it was when the backup was taken, access included: tokens and
browser sessions revoked after the backup are valid again, so revoke them again
(`bazilion token revoke`, `bazilion session revoke`). Follow-ups still waiting in the backup run
again, and Attention notices sent after the backup may be sent again. Restore only archives you
trust: the configuration it brings (MCP server commands, skills, Agent documents) runs as you.

## Reset and uninstall

```sh
bazilion uninstall                # asks once, then resets the home
bazilion uninstall --yes          # reset without asking
bazilion uninstall --yes --all    # also delete installed skills, then the emptied home
```

The reset deletes `bazilion.db` (and its journals), `auth.json`, `profiles/`, `agents/`, `teams/`
and `browsers/`, and keeps `skills/`; the next `bazilion serve` bootstraps a fresh home. `--all`
also deletes `skills/` and then the home directory, unless it holds files Bazilion does not
manage (they are listed and kept).

Uninstall refuses while the daemon runs, refuses your home directory itself, and refuses a
directory without `bazilion.db` that holds other files. Linked Team slots are unlinked; the
projects they point to are not touched. `--home <dir>` acts on another home.
