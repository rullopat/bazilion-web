import assert from 'node:assert/strict';
import { test } from 'node:test';
import { releaseNotesPolicy } from './release-notes-policy.mjs';

const page = (versions) => `---\ntitle: What's new\ndescription: Recent releases with Pi 1.4.0.\n---\n${versions.map((version) => `## Bazilion ${version}\n\nRelease facts.\n`).join('\n')}`;
const fixture = (versions = ['0.24.0', '0.23.0', '0.22.0', '0.21.0']) => ({
  announcementSlug: 'whats-new',
  announcement: page(versions),
  config: `{ label: "What's new", slug: 'docs/whats-new' }`,
  pages: [{ name: 'whats-new.md', content: page(versions) }],
});
const rejected = (input, message) => assert.ok(releaseNotesPolicy(input).failures.some((failure) => failure.includes(message)));

test('one permanent page accepts one through four releases', () => {
  for (let count = 1; count <= 4; count++) {
    const input = fixture(['0.24.0', '0.23.0', '0.22.0', '0.21.0'].slice(0, count));
    assert.deepEqual(releaseNotesPolicy(input).failures, []);
  }
});
test('current version comes from the first heading, independent of Pi', () => {
  const result = releaseNotesPolicy(fixture(['9.8.7-rc.1', '9.8.6']));
  assert.deepEqual(result.failures, []);
  assert.equal(result.version, '9.8.7-rc.1');
  assert.equal(result.pi, '1.4.0');
});
test('empty and fifth release sections are refused', () => {
  for (const versions of [[], ['5.0.0', '4.0.0', '3.0.0', '2.0.0', '1.0.0']]) rejected(fixture(versions), 'one to four');
});
test('duplicate versions are refused', () => rejected(fixture(['0.24.0', '0.24.0']), 'duplicated'));
test('non-release level-two headings are refused', () => {
  const input = fixture();
  input.announcement = input.announcement.replace('## Bazilion 0.23.0', '## Features');
  rejected(input, 'Every level-two');
});
test('fenced example headings are not release sections', () => {
  const input = fixture();
  input.announcement += '\n```md\n## Example heading\n```\n';
  assert.deepEqual(releaseNotesPolicy(input).failures, []);
});
test('a historical Pi version in body does not select the current engine', () => {
  const input = fixture();
  input.announcement += '\nPreviously bundled Pi 0.87.1.\n';
  assert.equal(releaseNotesPolicy(input).pi, '1.4.0');
});
test('homepage must use the permanent slug', () => rejected({ ...fixture(), announcementSlug: 'whats-new-0-24' }, 'Homepage'));
test('legacy frontmatter title and missing engine version are refused', () => {
  const input = fixture();
  input.announcement = input.announcement.replace("title: What's new", "title: What's new in 0.24.0").replace('Pi 1.4.0', 'an engine');
  rejected(input, 'title');
  rejected(input, 'Pi version');
});
test('duplicate or versioned sidebar entries are refused', () => {
  const input = fixture();
  rejected({ ...input, config: input.config + input.config }, 'exactly one');
  rejected({ ...input, config: input.config + `{ label: "What's new in 0.23.0", slug: 'docs/whats-new-0-23' }` }, 'canonical');
  rejected({ ...input, config: input.config.replace("What's new", "What's new in 0.24.0") }, 'without a version');
});
test('legacy source pages cannot survive under another extension or filename', () => {
  for (const name of ['whats-new-0-23.md', 'whats-new-0-23.mdx', 'old-release.md']) {
    const input = fixture();
    input.pages.push({ name, content: "---\ntitle: What's new in 0.23.0\n---\n" });
    rejected(input, 'duplicate/version-specific');
  }
});
