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

// Execute only the installer's pure version predicate; never run installation, curl or Volta.
const installer = readFileSync(new URL('../public/install.sh', import.meta.url), 'utf8');
const predicate = installer.match(/node -e '([^']+)' 2>\/dev\/null/)?.[1];
assert.ok(predicate, 'published installer must expose its tested runtime predicate');
for (const [version, allowed] of [['24.20.0', false], ['24.21.99', false], ['24.22.0', true], ['24.22.1', true], ['24.23.0', true], ['26.3.9', false], ['26.4.0', true], ['26.5.0', true], ['25.0.0', false], ['28.0.0', false], ['24.22.0-rc.1', false]]) {
  test(`installer runtime ${version}: ${allowed}`, () => {
    const result = spawnSync(process.execPath, ['-e', predicate.replace('process.versions.node', JSON.stringify(version))], { env: {}, stdio: 'ignore', timeout: 2000 });
    assert.equal(result.error, undefined);
    assert.equal(result.signal, null);
    assert.equal(result.status, allowed ? 0 : 1);
  });
}
