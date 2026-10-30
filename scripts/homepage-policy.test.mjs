import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { hasPiVersion } from './homepage-policy.mjs';

for (const text of ['Pi 1.0.0', 'PI v1.0', 'Pi engine version 1.0.0', "Pi’s coding agent 1.0.0", 'Pi <strong>1.0.0</strong>', 'Pi&nbsp;1.0.0', 'Pi &#49;.0.0', '<meta content="Powered by Pi 1.0.0">']) {
  test(`reject homepage engine version: ${text}`, () => assert.equal(hasPiVersion(text), true));
}
for (const text of ['built on Pi · your machine, your keys', 'Bazilion v0.23.0', 'Node 24.22.0 or26.4.0', 'Pi handles the loop. Bazilion 0.23.0 adds Teams.']) {
  test(`allow unversioned engine attribution: ${text}`, () => assert.equal(hasPiVersion(text), false));
}

// Execute only pure version predicates; never run either installer, curl, Volta or npm.
// Predicate checks do not qualify Windows/PowerShell installation or execution.
const predicates = ['install.sh', 'install.ps1'].map((file) => {
  const installer = readFileSync(new URL(`../public/${file}`, import.meta.url), 'utf8');
  const predicate = installer.match(/node -e '([^']+)' 2>/)?.[1];
  assert.ok(predicate, `${file} must expose its tested runtime predicate`);
  const pin = file === 'install.sh'
    ? /^INSTALL_NODE_VERSION=26\.12\.1$/m
    : /^\$InstallNodeVersion = "26\.12\.1"$/m;
  assert.match(installer, pin, `${file} must pin the admitted runtime baseline`);
  return [file, predicate];
});
test('installer runtime predicates agree', () => assert.equal(predicates[0][1], predicates[1][1]));
const versions = [
  ['24.20.0', false], ['24.21.99', false], ['24.22.0', false], ['24.22.1', false],
  ['24.23.0', false], ['24.99.0', false], ['26.3.9', false], ['26.4.0', false],
  ['26.5.0', false], ['26.11.99', false],
  ['26.12.0', false], ['26.12.1', true], ['26.12.2', true], ['26.13.0', true],
  ['26.99.0', true], ['25.0.0', false], ['27.0.0', false], ['28.0.0', false],
  ['24.22.0-rc.1', false], ['26.12.1-rc.1', false], ['26.12.1+build.1', false],
  ['026.12.1', false], ['26.012.1', false],
  ['26.12.01', false], ['26.12', false], ['v26.12.1', false], ['26.12.1\n', false],
  [' 26.12.1', false], ['26.9007199254740992.1', false],
];
for (const [file, predicate] of predicates) {
  for (const [version, allowed] of versions) {
    test(`${file} runtime ${JSON.stringify(version)}: ${allowed}`, () => {
      const result = spawnSync(
        process.execPath,
        ['-e', predicate.replace('process.versions.node', JSON.stringify(version))],
        { env: {}, stdio: 'ignore', timeout: 2000 },
      );
      assert.equal(result.error, undefined);
      assert.equal(result.signal, null);
      assert.equal(result.status, allowed ? 0 : 1);
    });
  }
}
