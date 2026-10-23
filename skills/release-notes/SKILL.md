---
name: release-notes
description: Use when updating the Bazilion website for a published release — maintaining one rolling "What's new" page with at most the latest four releases, moving current-release references, and syncing navigation and LLM-readable docs.
metadata:
  short-description: Maintain rolling Bazilion release notes and site docs
  tags:
    - bazilion
    - release
    - documentation
    - starlight
  version: 2.0.0
---

# Release notes and site docs

## Use This Skill For

- Updating the single `src/content/docs/docs/whats-new.md` release-notes page
- Keeping only the latest four published releases on that page, newest first
- Consolidating existing version-specific what's-new pages into that permanent page
- Moving the site's **current release** references and updating accurate upgrade guidance
- Syncing guide navigation and LLM-readable documentation
- Verifying the documentation gate before the change reaches `main`

This skill edits copy and documentation. For layout, styling, or marketing-page visual work see
`astro-static-site`. Read `AGENTS.md` before editing.

## One What's new page, at most four releases

The canonical page is **`/docs/whats-new/`**, backed by
`src/content/docs/docs/whats-new.md`, with frontmatter `title: What's new`.
There must be exactly one What's new page and one sidebar entry labelled **What's new**.
Do not create a new page, slug, or sidebar entry for each release.

The page contains **at most four release sections**, ordered newest first:

```md
---
title: What's new
description: Recent Bazilion releases; the current release bundles Pi X.Y.Z.
---

## Bazilion X.Y.Z

Concise shipped changes, upgrade implications, qualification limits, and a GitHub release link.

### A release-specific detail

Details belong under the release section, not in another level-two heading.

## Bazilion A.B.C

The previous release's own facts and limits.
```

Use exact published versions, including prerelease suffixes when applicable. All level-two
headings identify releases; use level-three or deeper headings for their details. The first
release section identifies the current release. The description records that release's embedded
Pi version, independently of Bazilion's version.

For each release:

1. Confirm actual publication and release facts; do not present a candidate as released.
2. Prepend one section, or update the existing section if that version is already present.
   Never duplicate a release.
3. Retain the three immediately preceding published releases, or fewer if fewer exist. Determine
   release order from confirmed release-line history, not from whichever old page filenames happen
   to exist. Group superseded prerelease checkpoints under their published final release; a
   backfilled final version stays with its original release line rather than displacing a later one.
4. When a fifth section would appear, remove the oldest section in full. Do not create another
   What's new page or grow a website archive to preserve it; Git and GitHub Releases retain history.
5. Repair inbound links to removed sections. Link to the corresponding GitHub release for older
   release details, or to the current upgrade guide for upgrade instructions.

Each retained section keeps its own version-specific facts and qualification limits. Do not
rewrite an older section to imply it shipped the current engine or gained later capabilities.
A reader must be able to distinguish current guidance from historical release observations.

### One-time consolidation of existing pages

When adopting this policy in a site that still has `whats-new-0-XY.md` pages:

1. Create `whats-new.md` with the latest four published releases at most. Check source release
   facts for any intervening release that lacks a standalone page.
2. Replace the version-specific sidebar entries with the single **What's new** entry, and point
   the homepage announcement at `/docs/whats-new/`.
3. Delete the old version-specific What's new source pages. In `astro.config.mjs`, redirect both
   slash and non-slash variants of each retired URL to its retained section on the canonical
   page, or its GitHub release if that release is outside the four-release window. With Astro's
   `trailingSlash: 'ignore'`, one redirect key covers both URL forms; do not add duplicate static
   routes. Test both forms. Keep retired links useful without retaining duplicate content pages.
4. Repoint internal links, including docs index and upgrade references. Keep any separately needed
   schema-history guidance accurate; `previous-changes.md` is not a second What's new feed and
   must not receive automatically archived release sections.
5. Update `scripts/check-docs.mjs` for the rolling-page contract below in the same change. Its
   legacy version-specific frontmatter parser must not dictate creating another release page.
6. Build and check all links, redirect destinations, retained section anchors, navigation and
   LLM-readable output before merging. Redirect stubs are not additional release-content pages.

This skill change alone does not migrate or deploy the site. Perform consolidation as part of
an explicitly requested website content update.

## Documentation gate

```sh
pnpm check:docs
```

`pnpm build` runs the same documentation check. Preserve existing link, anchor, navigation,
LLM-doc, homepage and installer policy checks; never weaken them to make the migration pass.
Do not hardcode a particular release version in the checker.

For the rolling page, the checker must:

1. Require the homepage announcement to link to `/docs/whats-new/` and the canonical page to have
   `title: What's new`.
2. Derive the current Bazilion version from the first `## Bazilion X.Y.Z` heading, accepting stable
   and prerelease versions. Derive the current Pi version from the page description.
3. Require one to four distinct release headings, newest first, and reject leftover standalone
   version-specific What's new source pages or sidebar entries. Validate release order against
   confirmed publication facts during review, not a guessed numerical sort of prerelease labels.
4. Require the single sidebar entry and matching current-release references in the files below.
5. Verify built internal links and anchors, and ensure the canonical page and its release headings
   are present in `dist/llms-full.txt`; `dist/llms.txt` must reference that full document.

### Current-release references

| File | Required current information |
| --- | --- |
| `astro.config.mjs` | One `What's new` entry for `docs/whats-new` |
| `src/pages/index.astro` | `/docs/whats-new/`, `vX.Y.Z` badge, accurate announcement |
| `src/content/docs/docs/whats-new.md` | Current release first; its Pi version in the description |
| `src/content/docs/docs/index.mdx` | `Bazilion X.Y.Z` and canonical release-notes link |
| `src/content/docs/docs/concepts.md` | `Version X.Y.Z bundles Pi P.Q.R` |
| `src/content/docs/docs/configuration.md` | `Bazilion X.Y.Z bundles Pi P.Q.R` |
| `src/content/docs/docs/getting-started.md` | `bazilion@X.Y.Z` and accurate upgrade instructions |

**Never state the Pi version on the homepage**, including metadata or generated homepage text.
Unversioned Pi attribution is welcome. Engine versions belong in detailed docs, not `/`.
The Pi version changes only when the embedded engine actually changes.

## Upgrade guidance and historical facts

Update the current upgrade instructions and their inbound links to match the released product.
Do not assume every release requires a reset: an unchanged schema can permit an in-place upgrade.
Preserve older schema-boundary headings/anchors when they still explain incompatible homes or
are needed by existing links. Do not blindly rename or delete every historical upgrade section.

Find versioned upgrade references with:

```sh
rg -n 'upgrade-to-' src/
```

Current install/upgrade links must reach the current procedure. Historical release sections may
link to durable schema-boundary guidance where relevant, but must not advertise an obsolete
install pin as the current upgrade command. Preserve identity-pair, backup, ownership and
platform warnings; never recommend resetting a valid home merely to move the version number.

Move only references describing the **current** release. Leave feature-provenance headings,
"Available in Bazilion X.Y.Z" notes, version-scoped observations and retained release sections'
original limits intact. Update schema-change claims only when the actual schema changed.

## Adding a guide page

New pages under `src/content/docs/docs/` are included in `llms-full.txt` through
`promote: ['docs']`. A new guide needs:

1. `src/content/docs/docs/<slug>.md` with `title:` and `description:` frontmatter.
2. A sidebar entry in `astro.config.mjs` under `Guides` or `Concepts`.
3. Inclusion in the checker's enforced guide list when its navigation and LLM-doc presence should
   be a hard requirement.

Use absolute internal paths with trailing slashes, such as `/docs/<slug>/`. Use actual generated
heading anchors and verify them in the built output.

## Procedure

1. Read the confirmed public GitHub release and relevant product feature/upgrade docs. Match the
   released CLI/API; do not invent behavior, platform parity or build-source provenance.
2. Create a focused website branch, such as `release/X.Y.Z-website`.
3. Consolidate legacy pages if needed; otherwise update `whats-new.md` in place. Keep one page,
   one sidebar entry, no duplicate versions, and at most the newest four published releases.
4. Update current-release references, upgrade guidance, inbound links, guide navigation and
   LLM-doc checks. Keep the homepage free of Pi versions.
5. Run `pnpm check:docs` and fix every failure without bypassing policy checks.
6. Review the rendered homepage announcement, rolling release page and upgrade guidance at desktop
   and phone widths with `pnpm preview` or `pnpm dev`.
7. Review the diff and deliver a pull request. Do not publish without authorization.

## Publishing

**Pushing to `main` publishes the live site.** Cloudflare Workers Builds publishes the assets-only
Worker after a push to `main`; there is no local deploy script or staging buffer. Use a pull request
and never merge an unvalidated change. Observe the Git-driven deployment and verify production
rather than treating a successful merge as proof of deployment.

Each release section links to its own umbrella GitHub release:
`https://github.com/rullopat/bazilion/releases/tag/vX.Y.Z`.

## Checklist

- [ ] Exactly one canonical What's new content page, `/docs/whats-new/`, and one sidebar entry
- [ ] At most four distinct published releases, newest first; oldest removed when adding a fifth
- [ ] No version-specific What's new pages created; legacy pages consolidated and URLs redirected
- [ ] Current version derived from the first release heading; its Pi version recorded in detailed docs
- [ ] Homepage points to the permanent slug, shows the current badge, and never states a Pi version
- [ ] Current-release references agree; historical facts and qualification limits remain intact
- [ ] Upgrade guidance reflects actual schema compatibility; meaningful older anchors preserved
- [ ] Links to removed release sections repaired; older details use GitHub Releases, not new pages
- [ ] Canonical page and release headings included in navigation/LLM-doc validation
- [ ] `pnpm check:docs` passes; rendered desktop/phone pages reviewed
- [ ] Authorized content changes delivered by pull request; production verified after deployment
