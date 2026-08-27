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
const styles = await readFile(path.join(root, 'app/globals.css'), 'utf8');
const competitionAssessment = await readFile(
  path.join(root, 'docs/COMPETITION_ASSESSMENT.md'),
  'utf8',
);
const submissionDraft = await readFile(
  path.join(root, 'docs/SUBMISSION_DRAFT.md'),
  'utf8',
);
const packageData = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);

const expectedTools = [
  'get_mission_brief',
  'inspect_work_item',
  'compare_worker_routes',
  'focus_work_item',
  'stage_assignment',
  'inspect_evidence_packet',
  'verify_evidence_packet',
];

const readOnlyTools = [
  'get_mission_brief',
  'inspect_work_item',
  'compare_worker_routes',
  'inspect_evidence_packet',
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
  assert.equal(
    (source.match(/additionalProperties: false/g) ?? []).length,
    expectedTools.length,
  );
  assert.match(source, /new AbortController\(\)/);
  assert.match(source, /\{ signal: registration\.signal \}/);
  assert.match(source, /registration\.abort\(\)/);
  assert.equal(
    (source.match(/options\?\.signal\?\.aborted/g) ?? []).length,
    expectedTools.length,
  );
  assert.equal(
    (source.match(/readOnlyHint: true/g) ?? []).length,
    readOnlyTools.length,
  );
  assert.match(webmcpTypes, /options\?: \{ signal\?: AbortSignal \}/);
});

test('keeps agent writes reversible and human approval separate', () => {
  assert.match(source, /side_effects: 'page_state_only'/);
  assert.match(source, /side_effects: 'selection_only'/);
  assert.match(source, /side_effects: 'verification_receipt_only'/);
  assert.match(source, /No work was executed and no release was approved\./);
  assert.match(source, /packet approval and download remain human-only/);
  assert.doesNotMatch(
    source,
    /name: '(?:approve|download|execute|publish|release)[^']*'/,
  );
});

test('builds and verifies a deterministic evidence packet contract', () => {
  assert.match(source, /schema_version: 'captain-evidence-packet-v1'/);
  assert.match(source, /envelope_version: 'captain-evidence-envelope-v1'/);
  assert.match(source, /function canonicalPacketJson\(packet: EvidencePacket\)/);
  assert.match(source, /crypto\.subtle\.digest\(/);
  assert.doesNotMatch(source, /packetJson/);
  assert.match(
    source,
    /const computedHash = await sha256Hex\(\s*canonicalPacketJson\(current\.packet\),?\s*\)/,
  );
  assert.equal(
    (source.match(/canonicalPacketJson\(current\.packet\)/g) ?? []).length,
    3,
  );
  assert.match(
    source,
    /const packetSha256 = await sha256Hex\(canonicalPacketJson\(packet\)\)/,
  );
  assert.match(source, /pass: computedHash === current\.packetSha256/);
  assert.match(source, /status: 'packet_changed'/);
  assert.match(source, /current\.status === 'approved'\s*\? 'approved'\s*:\s*'verified'/);
  assert.match(source, /verified_approval_preserved/);
  assert.match(source, /verified_by: 'webmcp_agent'/);
});

test('download stays human-only behind passing verification and explicit approval', () => {
  assert.match(source, /current\.status !== 'verified'/);
  assert.equal(
    (source.match(/current\.verification\.packet_sha256 !== current\.packetSha256/g) ?? [])
      .length,
    2,
  );
  assert.match(
    source,
    /current\.status !== 'approved' \|\|\s*current\.verification\?\.status !== 'pass'/,
  );
  assert.match(source, /human_approval: \{/);
  assert.match(source, /authority: 'human_only'/);
  assert.match(source, /release: \{ executed: false \}/);
  assert.match(source, /new Blob\(\[downloadJson\]/);
  assert.match(
    source,
    /computedHash !== current\.packetSha256 \|\|\s*current\.verification\.packet_sha256 !== computedHash/,
  );
  assert.match(
    source,
    /syncPacketState\(\{ \.\.\.current, status: 'draft', verification: null \}\)/,
  );
  assert.match(source, /approval because packet integrity changed/);
  assert.match(source, /download because packet integrity changed/);
});

test('keeps tool-visible state current across chained calls', () => {
  assert.match(
    source,
    /const syncItems = useCallback\(\(nextItems: WorkItem\[\]\) => \{\s*itemsRef\.current = nextItems;\s*setItems\(nextItems\);/,
  );
  assert.match(
    source,
    /const syncPacketState = useCallback\(\(nextState: PacketState \| null\) => \{\s*packetRef\.current = nextState;\s*setPacketState\(nextState\);/,
  );
  assert.match(source, /syncPacketState\(null\);\s*syncItems\(/);
  assert.match(source, /if \(packetRef\.current !== current\)/);
});

test('documents the implemented artifact and preserves accessible controls', () => {
  assert.doesNotMatch(competitionAssessment, /handoff contract and manifest/);
  assert.doesNotMatch(readme, /release-file presence/);
  assert.match(submissionDraft, /registered WebMCP tool surface/);
  assert.match(
    styles,
    /\.textLink:focus-visible \{[^}]*outline: 3px solid/,
  );
  assert.match(
    styles,
    /\.proposalActions button \{[^}]*min-height: 44px/,
  );
  assert.match(styles, /\.toolSignal \{[^}]*min-height: 44px/);
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
