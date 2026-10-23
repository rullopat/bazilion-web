import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasPiVersion } from './homepage-policy.mjs';
import { releaseNotesPolicy } from './release-notes-policy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const failures = new Set();
const read = (path) => readFileSync(join(root, path), 'utf8');
const requireText = (path, text) => {
  if (!read(path).includes(text)) failures.add(`${path}: missing ${text}`);
};

if (!existsSync(dist)) throw new Error('Build the website before checking documentation.');
const announcementSlug = read('src/pages/index.astro')
  .match(/class="release-note" href="\/docs\/([^/]+)\//)?.[1];
const { version, pi, versions, failures: releaseFailures } = releaseNotesPolicy({
  announcementSlug,
  announcement: read('src/content/docs/docs/whats-new.md'),
  config: read('astro.config.mjs'),
  pages: readdirSync(join(root, 'src/content/docs/docs')).filter((name) => /\.mdx?$/.test(name))
    .map((name) => ({ name, content: read(`src/content/docs/docs/${name}`) })),
});
for (const failure of releaseFailures) failures.add(failure);
if (!version || !pi) throw new Error([...failures].join('\n'));

requireText('dist/llms-full.txt', '/docs/whats-new');
requireText('dist/llms-full.txt', "# What's new");
for (const release of versions) requireText('dist/llms-full.txt', `## Bazilion ${release}`);
requireText('src/pages/index.astro', `v${version}`);
// Engine versions belong in documentation, never on the marketing homepage.
for (const path of ['src/pages/index.astro', 'dist/index.html']) {
  if (hasPiVersion(read(path))) failures.add(`${path}: homepage must not state the Pi version`);
}
requireText('src/content/docs/docs/index.mdx', `Bazilion ${version}`);
requireText('src/content/docs/docs/concepts.md', `Version ${version} bundles Pi ${pi}`);
requireText('src/content/docs/docs/configuration.md', `Bazilion ${version} bundles Pi ${pi}`);
requireText('src/content/docs/docs/getting-started.md', `bazilion@${version}`);

const files = readdirSync(dist, { recursive: true })
  .filter((path) => path.endsWith('.html') && path !== '404.html');
let links = 0;
for (const file of files) {
  const html = readFileSync(join(dist, file), 'utf8');
  const base = new URL(file.replace(/index\.html$/, ''), 'https://bazilion.com/');
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), base);
    if (url.origin !== base.origin) continue;
    let path = decodeURIComponent(url.pathname).replace(/^\//, '');
    if (!path || path.endsWith('/')) path += 'index.html';
    else if (!existsSync(join(dist, path))) path += '/index.html';
    links++;
    if (!existsSync(join(dist, path))) {
      failures.add(`${file}: missing ${url.pathname}`);
      continue;
    }
    if (url.hash && path.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!readFileSync(join(dist, path), 'utf8').includes(`id="${id}"`)) {
        failures.add(`${file}: missing ${url.pathname}${url.hash}`);
      }
    }
  }
}

requireText('dist/llms.txt', 'https://bazilion.com/llms-full.txt');
for (const slug of ['operations', 'growth-and-retention', 'backup-recovery', 'private-access', 'results', 'conversations', 'follow-up-queue', 'questions', 'attention-notifications', 'coding-environment', 'coding-review', 'coding-verification', 'coding-review-packets', 'previous-changes', 'publication']) {
  requireText('astro.config.mjs', `slug: 'docs/${slug}'`);
  requireText('dist/llms-full.txt', `/docs/${slug}`);
  const title = read(`src/content/docs/docs/${slug}.md`).match(/^title: (.+)$/m)?.[1];
  if (!title) failures.add(`${slug}: missing title`);
  else requireText('dist/llms-full.txt', `# ${title}`);
}

if (failures.size) {
  console.error([...failures].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${files.length} pages; ${links} local links and anchors pass.`);
  console.log(`Release ${version}, Pi ${pi}, navigation, and LLM docs agree.`);
}
