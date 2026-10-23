// Pure source policy: publication chronology is reviewed against release facts,
// never guessed by sorting semver labels (including backfilled final versions).
const versionPattern = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?`;
const releaseHeading = new RegExp(`^Bazilion (${versionPattern})$`);

export function releaseNotesPolicy({ announcementSlug, announcement, config, pages }) {
  const failures = [];
  if (announcementSlug !== 'whats-new') failures.push('Homepage must link to /docs/whats-new/.');
  if (!/^title: What's new$/m.test(announcement)) failures.push("Release page title must be What's new.");
  const pi = announcement.match(/^description: .*Pi(?: to)? (\d+\.\d+\.\d+)/m)?.[1];
  if (!pi) failures.push('Release description must declare the current Pi version.');

  // Fenced examples must not be mistaken for release sections.
  const body = announcement.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const versions = headings.map((heading) => heading.match(releaseHeading)?.[1]);
  if (headings.length < 1 || headings.length > 4) failures.push('Keep one to four release sections.');
  if (versions.some((version) => !version)) failures.push('Every level-two heading must be Bazilion X.Y.Z.');
  if (new Set(versions).size !== versions.length) failures.push('Release versions must not be duplicated.');

  const entries = [...config.matchAll(/label:\s*"What's new(?: in [^"]+)?"/g)];
  if (entries.length !== 1 || entries[0]?.[0] !== 'label: "What\'s new"') {
    failures.push("Sidebar must have exactly one What's new entry, without a version label.");
  }
  if ([...config.matchAll(/slug:\s*['"]docs\/whats-new['"]/g)].length !== 1 ||
      /slug:\s*['"]docs\/whats-new-[^'"]+['"]/.test(config)) {
    failures.push('Sidebar must use only the canonical docs/whats-new slug.');
  }
  for (const { name, content } of pages) {
    if (name !== 'whats-new.md' &&
        (/^whats-new.*\.mdx?$/.test(name) || /^title: ["']?What's new\b/m.test(content))) {
      failures.push(`${name}: remove duplicate/version-specific What's new content.`);
    }
  }
  return { version: versions[0], pi, versions, failures };
}
