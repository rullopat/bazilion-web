---
name: release-notes
description: Use when publishing a new Bazilion release on the Bazilion website — writing the "What's new" page, moving current-release version stamps, repointing the versioned upgrade anchor, and syncing navigation and LLM-readable docs.
metadata:
  short-description: Publish Bazilion release notes and site docs
  tags:
    - bazilion
    - release
    - documentation
    - starlight
  version: 1.0.0
---

# Release notes and site docs

## Use This Skill For

- Publishing a new `src/content/docs/docs/whats-new-0-XY.md` page for a Bazilion release
- Moving the site's **current release** version stamps from the previous version
- Repointing the versioned upgrade anchor in `getting-started.md`
- Adding or renaming guide pages, including their navigation and LLM-doc entries
- Verifying the documentation gate before the change reaches `main`

This skill edits copy and documentation. For layout, styling, or marketing-page visual work see
`astro-static-site`.

## The gate is the authority

```sh
pnpm check:docs   # astro build && node scripts/check-docs.mjs
```

`pnpm build` runs the same check, so a broken doc set cannot be built. `scripts/check-docs.mjs`
**derives the current release from the homepage**, then enforces that version everywhere else. Do
not hardcode the version in the checker; change the homepage and follow the failures.

### How the current release is derived

1. Reads `class="release-note" href="/docs/<slug>/"` from `src/pages/index.astro` → announcement slug.
2. Parses that page's frontmatter with anchored regexes:
   - `title: What's new in X.Y.Z` — the whole title line must match, so no extra words.
   - `description: ... ` must contain `Pi X.Y.Z` (regex `Pi(?: to)? (\d+\.\d+\.\d+)`).
3. Requires the derived strings to appear literally in seven places (see table below).
4. Walks every built HTML page and verifies **every internal link and `#anchor` resolves**.
5. Requires `dist/llms.txt` to reference `llms-full.txt`, and for each slug in the checker's list
   requires a sidebar entry plus `/docs/<slug>` and `# <title>` in `dist/llms-full.txt`.

### Version-stamped files

| File | Required string |
| --- | --- |
| `astro.config.mjs` | `What's new in X.Y.Z` (sidebar label) |
| `src/pages/index.astro` | `vX.Y.Z` (release-note badge) **and** `Pi X.Y.Z` |
| `src/content/docs/docs/index.mdx` | `Bazilion X.Y.Z` |
| `src/content/docs/docs/concepts.md` | `Version X.Y.Z bundles Pi X.Y.Z` |
| `src/content/docs/docs/configuration.md` | `Bazilion X.Y.Z bundles Pi X.Y.Z` |
| `src/content/docs/docs/getting-started.md` | `bazilion@X.Y.Z` |

The Pi version is independent of the Bazilion version. Most releases keep the same Pi version, so
change the Bazilion number and **leave the Pi number alone** unless the engine actually moved.

## Upgrade anchor policy

`getting-started.md` has exactly one versioned upgrade section, and its heading produces the anchor
that other pages link to:

```md
## Upgrade to X.Y.Z        →  #upgrade-to-XYZ   (dots dropped: 0.16.0 → upgrade-to-0160)
```

Every release: rename the heading, then repoint **all** inbound references. Do not keep a second
upgrade section for the old version — the alpha is clean-install-only, so the current procedure is
the only correct guidance, including from historical pages. Find the references with:

```sh
grep -rn 'upgrade-to-0' src/
```

Historical "What's new" pages must point at the *current* upgrade anchor, not their own.

## Historical vs current references

Move only what describes the **current** release. Leave provenance alone.

**Update:**
- The homepage release-note block (slug, badge, blurb)
- The sidebar's newest "What's new in …" entry — keep older entries below it
- `index.mdx` release paragraph, `concepts.md` / `configuration.md` bundle statements
- "Upgrade to Bazilion X.Y.Z" instructions, `getting-started.md` install pin, "the current
  schema-changing release" pointers in older `whats-new-*` pages
- "Version X.Y.Z changes the schema" claims in `backup-recovery.md`, `operations.md`

**Leave:**
- Feature-provenance headings such as `## Durable files and live clarification in 0.15.0`
- "Available in Bazilion X.Y.Z" notes recording when a feature landed
- Behavior notes scoped to a version ("In 0.15.0, mobile sends …")
- Older `whats-new-*` pages' own content and their version-specific claims

## Adding a guide page

New pages under `src/content/docs/docs/` are automatically included in `llms-full.txt` because
the LLM plugin is configured with `promote: ['docs']`. A new guide needs:

1. `src/content/docs/docs/<slug>.md` with `title:` and `description:` frontmatter.
2. A sidebar entry in `astro.config.mjs` under `Guides` (or `Concepts`).
3. Optionally add the slug to the checker's enforced list in `scripts/check-docs.mjs` to make its
   navigation and LLM-doc presence a hard failure rather than an untested detail.

Link to a new guide by its absolute path with a trailing slash: `/docs/<slug>/`. Anchors are
generated from headings, so reference `[text](/docs/page/#heading-anchor)`.

## Procedure

1. Read the source release facts — the GitHub release for `vX.Y.Z` and, for coding work, the
   feature docs in the Bazilion repo (`docs/coding-environments.md`, `docs/repository-context.md`).
   Do not invent behavior; the site must match the released CLI and API.
2. Create the branch: `codex/vX.Y.Z-website`.
3. Write `whats-new-0-XY.md` using the previous release page as the template. Keep the frontmatter
   title exact and include `Pi X.Y.Z` in the description.
4. Move every current-release reference from the table above, plus the upgrade heading and its
   inbound anchors.
5. Add or update guide pages, sidebar entries, and the checker's slug list.
6. Run `pnpm check:docs` and fix every failure. It reports missing files, missing anchors, and
   version disagreements explicitly.
7. Review the rendered pages with `pnpm preview` or `pnpm dev` — check the homepage release note,
   the new page, and the getting-started upgrade section.

## Publishing

**Pushing to `main` publishes the live site.** `wrangler.jsonc` deploys an assets-only Worker and
Cloudflare Workers Builds publishes after a push to `main`; there is no local deploy script and no
staging buffer. Prefer a pull request so the rendered site can be reviewed before it goes public,
and never push an unvalidated doc change to `main`.

Release notes should link the umbrella GitHub release
`https://github.com/rullopat/bazilion/releases/tag/vX.Y.Z` for publication and validation details,
matching the previous page's closing line.

## Checklist

- [ ] Frontmatter title matches `What's new in X.Y.Z` exactly; description contains `Pi X.Y.Z`
- [ ] Homepage release note points at the new slug and shows `vX.Y.Z`
- [ ] All seven version-stamped strings updated; Pi number unchanged unless the engine moved
- [ ] Upgrade heading renamed and every `#upgrade-to-*` reference repointed
- [ ] Historical provenance references deliberately left alone
- [ ] New guide pages have sidebar entries and are linked from the release page
- [ ] `pnpm check:docs` passes
- [ ] Rendered pages reviewed; change delivered by pull request
