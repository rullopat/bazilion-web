import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

// One warm-dark code theme for both colour schemes, built only from the Neva
// Masquerade palette, so docs code blocks match the homepage terminal.
const bazilionNight = {
  name: 'bazilion-night',
  type: 'dark',
  colors: {
    'editor.background': '#2A1F16',
    'editor.foreground': '#E8E2D8',
    'editorLineNumber.foreground': '#7A6555',
    'editor.selectionBackground': '#3A658066',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#9E8E7E', fontStyle: 'italic' } },
    { scope: ['string', 'string.quoted', 'markup.inline.raw'], settings: { foreground: '#6BA3C2' } },
    { scope: ['constant', 'constant.numeric', 'constant.language', 'support.constant'], settings: { foreground: '#D4CAB8' } },
    { scope: ['keyword', 'storage', 'keyword.control', 'keyword.operator'], settings: { foreground: '#C4878A' } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.command'], settings: { foreground: '#FFFFFF' } },
    { scope: ['variable', 'variable.other', 'entity.name.tag'], settings: { foreground: '#FAF8F4' } },
    { scope: ['entity.other.attribute-name', 'support.type.property-name', 'meta.object-literal.key'], settings: { foreground: '#6BA3C2' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#D4CAB8' } },
    { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: '#FFFFFF', fontStyle: 'bold' } },
  ],
};

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
  // One rolling release page; retired URLs retain useful destinations without
  // keeping duplicate content. Releases outside the window live on GitHub.
  // trailingSlash: 'ignore' serves both forms; duplicate keys collide in Astro.
  redirects: {
    '/docs/whats-new-0-24/': '/docs/whats-new/#bazilion-0240',
    '/docs/whats-new-0-23/': '/docs/whats-new/#bazilion-0230',
    '/docs/whats-new-0-22/': 'https://github.com/rullopat/bazilion/releases/tag/v0.22.0',
    // The plain 0.21 npm final has no umbrella GitHub release; use its final published checkpoint.
    '/docs/whats-new-0-21/': 'https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.5',
    '/docs/whats-new-0-21-beta-1/': 'https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.5',
    '/docs/whats-new-0-21-beta/': 'https://github.com/rullopat/bazilion/releases/tag/v0.21.0-beta.5',
    '/docs/whats-new-0-20/': 'https://github.com/rullopat/bazilion/releases/tag/v0.20.0',
    '/docs/whats-new-0-19-1/': 'https://github.com/rullopat/bazilion/releases/tag/v0.19.1',
    '/docs/whats-new-0-19/': 'https://github.com/rullopat/bazilion/releases/tag/v0.19.0',
    // Guides for features removed in 0.26.0 point at the surviving change review page.
    '/docs/coding-verification/': '/docs/coding-review/',
    '/docs/coding-review-packets/': '/docs/coding-review/',
    '/docs/publication/': '/docs/coding-review/',
  },
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
      expressiveCode: {
        themes: [bazilionNight],
        useStarlightDarkModeSwitch: false,
        useStarlightUiThemeColors: false,
        styleOverrides: {
          borderRadius: '12px',
          borderColor: '#3D2B1F',
          codeFontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
          codeFontSize: '0.84rem',
          codeLineHeight: '1.75',
          codePaddingBlock: '1.1rem',
          codePaddingInline: '1.35rem',
          uiFontFamily: "'DM Sans', 'Helvetica Neue', system-ui, sans-serif",
          frames: {
            shadowColor: 'transparent',
            editorTabBarBackground: '#3D2B1F',
            editorActiveTabBackground: '#2A1F16',
            editorActiveTabIndicatorTopColor: '#6BA3C2',
            editorTabBarBorderBottomColor: '#3D2B1F',
            terminalTitlebarBackground: '#3D2B1F',
            terminalTitlebarForeground: '#D4CAB8',
            terminalTitlebarDotsForeground: '#7A6555',
            terminalTitlebarBorderBottomColor: '#3D2B1F',
            terminalBackground: '#2A1F16',
            inlineButtonBackground: '#FAF8F4',
            inlineButtonForeground: '#FAF8F4',
            inlineButtonBorder: '#9E8E7E',
            tooltipSuccessBackground: '#3A6580',
          },
        },
      },
      // Agent-readable docs: emits /llms.txt, /llms-full.txt, /llms-small.txt
      // so an LLM can ingest the whole corpus in one fetch. Slugs are prefixed
      // with `docs/` because the content is nested under src/content/docs/docs/.
      plugins: [
        starlightLlmsTxt({
          projectName: 'Bazilion',
          description:
            "Bazilion is an MIT-licensed, local multi-agent runtime for one person, built on Pi's coding agent. One daemon on your machine owns all state in ~/.bazilion; Agents work in Teams that share a workspace, qmd-indexed memory and a mailbox, run on schedules, and are reachable from a web UI, a CLI and Telegram.",
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
            { label: "What's new", slug: 'docs/whats-new' },
            { label: 'Previous changes', slug: 'docs/previous-changes' },
            { label: 'How Bazilion is different', slug: 'docs/why-bazilion' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'The web interface', slug: 'docs/web-interface' },
            { label: 'Tools & integrations', slug: 'docs/tools' },
            { label: 'Coding with Agents', slug: 'docs/coding-environment' },
            { label: 'Reviewing what changed', slug: 'docs/coding-review' },
            { label: 'Connecting Telegram', slug: 'docs/telegram' },
            { label: 'Saved Agent results', slug: 'docs/results' },
            { label: 'Conversations', slug: 'docs/conversations' },
            { label: 'Follow-up queue', slug: 'docs/follow-up-queue' },
            { label: 'Agent questions', slug: 'docs/questions' },
            { label: 'Attention notifications', slug: 'docs/attention-notifications' },
            { label: 'Daily operations', slug: 'docs/operations' },
            { label: 'Growth and retention', slug: 'docs/growth-and-retention' },
            { label: 'Backup and recovery', slug: 'docs/backup-recovery' },
            { label: 'Private access & mobile', slug: 'docs/private-access' },
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
