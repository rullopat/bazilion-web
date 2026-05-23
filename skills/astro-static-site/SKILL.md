---
name: astro-static-site
description: Use when editing, reviewing, building, or deploying this Bazilion Astro static marketing site.
metadata:
  short-description: Work on the Bazilion Astro site
  tags:
    - astro
    - static-site
    - cloudflare
    - marketing-site
  version: 1.0.0
---

# Astro Static Site

## Use This Skill For

- Editing copy or markup in `src/pages/index.astro`
- Updating global styles in `src/styles/global.css`
- Changing static assets in `public/`
- Building, previewing, or deploying the site
- Reviewing responsive behavior or visual regressions

## Project Map

- `src/pages/index.astro`: the single rendered page and page-local content data.
- `src/styles/global.css`: design tokens, layout, responsive rules, and animations.
- `public/`: files served as static assets.
- `dist/`: generated build output; do not edit by hand.
- `astro.config.mjs`: static Astro build configuration.
- `wrangler.jsonc`: Cloudflare Workers static assets deployment configuration.

## Workflow

1. Read the relevant page and CSS sections before editing.
2. Keep changes scoped: copy in `index.astro`, visual rules in `global.css`, public files in `public/`.
3. Follow the existing class naming style, such as `hero__wordmark`, `library__item`, and `card-code__head`.
4. Reuse existing CSS custom properties from `:root` before adding new colors, fonts, or shadows.
5. Run `pnpm build` after code or config changes.

## Commands

- `pnpm dev`: run the Astro development server.
- `pnpm build`: generate the static site in `dist/`.
- `pnpm preview`: preview the generated build.
- `pnpm deploy`: build and deploy with Wrangler.
- `pnpm cf:dev`: build and run the Cloudflare local dev server.

## Checks

For visual changes, inspect desktop and mobile widths. Pay particular attention to the hero, feature grid, code cards, dedication section, and footer. Preserve the existing reduced-motion behavior when adding or changing animations.
