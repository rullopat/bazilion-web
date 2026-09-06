---
title: Backup and recovery
description: Create encrypted backups, account for linked projects, rehearse an offline restore, and recover from failed upgrades or exposed credentials.
---

A Bazilion backup protects the daemon's home and database. Plan separate backups
for project directories linked into Teams, and keep the decryption identity
available independently of the machine you are backing up.

## What is covered?

| Data | Coverage |
| --- | --- |
| Database and paired `auth.json` | Included; SQLite uses a verified online snapshot |
| Agent homes, transcripts, templates, installed skills, ordinary Team files | Included under the Bazilion home |
| Team slot linked to an external project | The link is included; the external files are not |
| Memory inside a linked project | External too; back it up with that project |
| Live WAL state and rebuildable qmd indexes | Not copied as authoritative state |
| age decryption identity | Store separately; do not place it inside the home |

Stop Agents writing project files when you need a consistent filesystem copy.
The database snapshot is consistent, but the archive is not a transaction
across concurrently changing project files and transcripts.

## Create an encrypted backup

Use an age recipient whose corresponding private identity you have saved in a
separate secure location. The recipient is public and begins with `age1`.
Replace the example recipient and paths with your own:

```sh
bazilion backup create /path/to/backups/bazilion.tar.gz.age --recipient age1...
```

Run this while the daemon is available. Choose an output location outside
`BAZILION_HOME`, then copy the archive to your backup storage. Back up linked
projects separately at the same time. A successful archive write is not a
restore rehearsal.

The private age identity is required for decryption. On Unix, keep its file
owner-readable only (`chmod 600 /path/to/age-identity.txt`). Use a real file,
not a symlink. Keep a recoverable copy separately from the archive and host.
Plaintext archives require an explicit `--plaintext` acknowledgement and contain
sensitive authentication material.

## Rehearse an offline restore

1. Stop the dashboard with Ctrl+C, or stop the managed daemon and web services.
   Avoid two active copies of the same Telegram bot or scheduler.
2. Restore into a new, empty, explicit directory. Use the Bazilion version
   matching the archive's alpha schema:

   ```sh
   bazilion backup restore /path/to/backups/bazilion.tar.gz.age \
     --identity /path/to/age-identity.txt --home /path/to/bazilion-restore-check
   ```

3. Read the result. Restore validates archive paths, the database/auth pairing,
   SQLite integrity, foreign keys, and schema before installing the staged home.
   A non-empty destination is refused unless `--force` is supplied. Do not add
   that flag for a rehearsal: it replaces the destination's existing data.
4. Check the restored Team links and separate project backups before starting
   the restored copy. Links retain their external targets; restoring elsewhere
   does not isolate them from the original project directories.
5. Choose which home will be active. Before starting a restored home, disconnect
   the host from external networks and use `BAZILION_SCHEDULER=off` to inspect
   it without provider/Telegram activity or scheduled delivery. Do not start a
   second copy against the same external integrations.
6. With the chosen home running, inspect `bazilion doctor`, Agents, Teams,
   transcripts, and a known memory note. Confirm linked project files are
   present. Reconnect and re-enable scheduling only when ready to resume work.

Commands must address the chosen home consistently. Set `BAZILION_HOME` in the
daemon and CLI environments; remove stale `BAZILION_SERVER`/`BAZILION_TOKEN`
overrides that point the CLI at a different instance. For example, on a Unix
host disconnected for the inspection above:

```sh
BAZILION_HOME=/path/to/bazilion-restore-check BAZILION_SCHEDULER=off bazilion dashboard
```

The private age identity unlocks the archive; it does not replace Bazilion's
restored bootstrap credential. Use the restored device credentials for browser
login, or create a new one with the local CLI after startup.

## Interrupted restore or incompatible schema

Keep the archive, the previous home, and any recovery paths named by the error.
Do not manually delete recovery markers or edit database tables to force
startup. Follow the reported recovery guidance before retrying a swap.

An older alpha schema cannot be migrated by restoring it into a newer schema.
Use the matching old release to recover/export work first. A working 0.14.1
home needs no reset for 0.14.2; see [upgrading](/docs/getting-started/#upgrade-to-0142).
If a reset is necessary, it removes Agents, Teams, templates, credentials, and
the paired database/auth identity. Review the
[reset consequences](/docs/getting-started/#recover-an-alpha-install) first.

## If credentials were exposed

```sh
bazilion backup inventory
bazilion backup recovery-guide
```

Inventory lists credential classes without revealing their values. The recovery
guide explains local token recovery and external credential rotation. Rotating
Bazilion's bootstrap identity does not revoke Telegram, provider, OpenAI OAuth,
or MCP credentials at their issuers. After recovery, create and rehearse a new
encrypted backup.
