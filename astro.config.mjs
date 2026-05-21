import { defineConfig } from 'astro/config';

// Static build. Deployed to Cloudflare Workers via the Assets-only worker
// pattern (no adapter required) — see wrangler.jsonc.
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
});
