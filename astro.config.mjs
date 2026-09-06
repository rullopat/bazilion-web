import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

// Static build. Deployed to Cloudflare Workers via the Assets-only worker
// pattern (no adapter required) — see wrangler.jsonc.
//
// Two surfaces live here:
//   /        marketing landing page (src/pages/index.astro)
//   /docs/*  Starlight documentation (src/content/docs/docs/**)
// Starlight maps content-collection paths to URLs, so nesting the docs in a
// `docs/` folder gives the /docs/ prefix while index.astro keeps owning the root.
export default defineConfig({
  site: 'https://bazilion.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  trailingSlash: 'ignore',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    starlight({
      title: 'Bazilion',
      description:
        "Documentation for Bazilion — an MIT-licensed, local-first multi-agent runtime built on Pi's coding agent.",
      favicon: '/baziu.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/rullopat/bazilion',
        },
      ],
      customCss: ['./src/styles/docs.css'],
      // Agent-readable docs: emits /llms.txt, /llms-full.txt, /llms-small.txt
      // so an LLM can ingest the whole corpus in one fetch. Slugs are prefixed
      // with `docs/` because the content is nested under src/content/docs/docs/.
      plugins: [
        starlightLlmsTxt({
          projectName: 'Bazilion',
          description:
            "Bazilion is an MIT-licensed, local-first multi-agent runtime built on Pi's coding agent as its core engine. It runs as a daemon on your own machine, owns a workspace under ~/.bazilion, and lets you build Agent templates, revisioned Team Templates, one effective live Team Policy per Team, shared files, qmd-indexed memory, and a mailbox.",
          promote: ['docs'],
        }),
      ],
      head: [
        // Match the marketing site's typefaces so docs feel like one site.
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap',
          },
        },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'Getting started', slug: 'docs/getting-started' },
            { label: "What's new in 0.14.2", slug: 'docs/whats-new-0-14' },
            { label: "What's new in 0.13", slug: 'docs/whats-new-0-13' },
            { label: 'How Bazilion is different', slug: 'docs/why-bazilion' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'The web interface', slug: 'docs/web-interface' },
            { label: 'Tools & integrations', slug: 'docs/tools' },
            { label: 'Connecting Telegram', slug: 'docs/telegram' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Core concepts', slug: 'docs/concepts' },
            { label: 'Configuration', slug: 'docs/configuration' },
          ],
        },
      ],
    }),
  ],
});
