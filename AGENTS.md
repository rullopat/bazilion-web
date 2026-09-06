# Repository Guidelines

## Project Structure & Module Organization

This is a small static Astro marketing site. The main page lives in `src/pages/index.astro`; shared styling lives in `src/styles/global.css`. Static assets belong in `public/`. Build output goes to `dist/` and should not be edited by hand.

Agent skills live in `skills/<skill-name>/SKILL.md`; `skills/index.json` is the searchable catalog. Claude Code discovers them through `.claude/skills/`. Operational guides live in `src/content/docs/docs/`; `scripts/check-docs.mjs` validates the generated documentation.

## Build, Test, and Development Commands

- `pnpm dev`: start the Astro development server.
- `pnpm start`: alias for `pnpm dev`.
- `pnpm build`: create the static production build in `dist/` and validate documentation (also enforced during deployment).
- `pnpm check:docs`: build, then verify internal links, anchors, current release references, navigation, and LLM-readable guides.
- `pnpm preview`: preview the built site locally.

Production deployment is Git-driven: Cloudflare Workers Builds publishes the
assets-only Worker after a push to `main`. There is no local deploy script.

Run `pnpm check:docs` for documentation changes. There is no application test framework.

## Coding Style & Naming Conventions

Use two-space indentation for Astro, JSON, CSS, and config files. Keep semantic section classes in the existing BEM-like pattern, such as `hero__wordmark`, `library__item`, and `card-code__head`.

Prefer CSS custom properties from `:root` before adding raw colors, fonts, spacing, or shadows. Keep copy edits in `src/pages/index.astro` and visual changes in `src/styles/global.css`.

## Testing Guidelines

For documentation changes, run `pnpm check:docs` and inspect the affected pages with `pnpm preview` or `pnpm dev`. For visual edits, check desktop and mobile widths. Match command examples to the released CLI and distinguish local operator tools from protected turns.

## Commit & Pull Request Guidelines

Recent commits use short, sentence-cased summaries, for example `Update site copy for bazilion 0.1.0 npm release.` Keep commits focused and describe the visible or deployment-relevant change.

Pull requests should include a summary, screenshots for visual changes, relevant issue links, and verification commands. Note deployment/config changes explicitly.

## Security & Configuration Tips

Do not commit `.env`; use `.env.example` for documented variables. Keep public assets free of secrets because everything under `public/` is served directly.

## Agent Skills

Use `skills/` as the source of truth for portable agent skills. Each skill must include `SKILL.md` with YAML frontmatter containing `name` and `description`; add neutral metadata such as `metadata.tags` when useful. Keep tool-specific discovery paths as symlinks or thin adapters.
