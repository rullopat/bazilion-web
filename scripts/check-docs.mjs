import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
if (!announcementSlug) throw new Error('Homepage must link to the current release page.');
const announcement = read(`src/content/docs/docs/${announcementSlug}.md`);
const version = announcement.match(/^title: What's new in (\d+\.\d+\.\d+)$/m)?.[1];
const pi = announcement.match(/^description: .*Pi to (\d+\.\d+\.\d+)/m)?.[1];
if (!version || !pi) throw new Error('Current release page must declare Bazilion and Pi versions.');

requireText('astro.config.mjs', `What's new in ${version}`);
requireText('src/pages/index.astro', `v${version}`);
requireText('src/pages/index.astro', `Pi ${pi}`);
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
for (const slug of ['operations', 'backup-recovery', 'private-access']) {
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
