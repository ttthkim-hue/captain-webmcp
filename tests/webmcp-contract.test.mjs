import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDirectory, '..');

const source = await readFile(
  path.join(root, 'app/captain-console.tsx'),
  'utf8',
);
const webmcpTypes = await readFile(
  path.join(root, 'types/webmcp.d.ts'),
  'utf8',
);
const readme = await readFile(path.join(root, 'README.md'), 'utf8');
const packageData = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);

const expectedTools = [
  'get_mission_brief',
  'inspect_work_item',
  'compare_worker_routes',
  'focus_work_item',
  'stage_assignment',
];

test('registers the exact public WebMCP tool surface once', () => {
  for (const tool of expectedTools) {
    const matches = source.match(new RegExp(`name: '${tool}'`, 'g')) ?? [];
    assert.equal(matches.length, 1, `${tool} must be defined once`);
  }
  assert.equal(
    (source.match(/modelContext\.registerTool\(/g) ?? []).length,
    expectedTools.length,
  );
});

test('uses bounded schemas and registration lifecycle cleanup', () => {
  assert.ok((source.match(/additionalProperties: false/g) ?? []).length >= 5);
  assert.match(source, /new AbortController\(\)/);
  assert.match(source, /\{ signal: registration\.signal \}/);
  assert.match(source, /registration\.abort\(\)/);
  assert.equal((source.match(/options\?\.signal\?\.aborted/g) ?? []).length, 5);
  assert.match(webmcpTypes, /options\?: \{ signal\?: AbortSignal \}/);
});

test('keeps agent writes reversible and human approval separate', () => {
  assert.match(source, /side_effects: 'page_state_only'/);
  assert.match(source, /side_effects: 'selection_only'/);
  assert.match(source, /No work was executed and no release was approved\./);
  assert.match(source, /Human approve/);
  assert.doesNotMatch(source, /name: '(?:approve|execute|publish|release)[^']*'/);
});

test('does not contain an outbound request primitive', () => {
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(source, /\bWebSocket\s*\(/);
  assert.doesNotMatch(source, /\bsendBeacon\s*\(/);
});

test('documents every tool and exposes reproducible verification', () => {
  for (const tool of expectedTools) {
    assert.ok(readme.includes('`' + tool + '`'), `${tool} must be documented`);
  }
  assert.equal(packageData.scripts.test, 'node --test tests/webmcp-contract.test.mjs');
  assert.equal(
    packageData.scripts['validate:webmcp'],
    'node scripts/validate-webmcp.mjs',
  );
});
