import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..');

const readText = (relativePath) =>
  readFile(path.join(root, relativePath), 'utf8');

const [
  source,
  styles,
  webmcpTypes,
  readme,
  agents,
  submission,
  imagePrompt,
  competitionAssessment,
  videoNarration,
  videoValidation,
  license,
  packageJson,
  socialImage,
] =
  await Promise.all([
    readText('app/captain-console.tsx'),
    readText('app/globals.css'),
    readText('types/webmcp.d.ts'),
    readText('README.md'),
    readText('AGENTS.md'),
    readText('docs/SUBMISSION_DRAFT.md'),
    readText('docs/IMAGE_PROMPT.md'),
    readText('docs/COMPETITION_ASSESSMENT.md'),
    readText('docs/VIDEO_NARRATION.md'),
    readText('docs/VIDEO_VALIDATION.md'),
    readText('LICENSE'),
    readText('package.json'),
    readFile(path.join(root, 'public/og.png')),
  ]);

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

const forbiddenAgentAuthority =
  /name:\s*['"](?:approve|download|execute|publish|release)[^'"]*['"]/;

const releaseText = [
  source,
  readme,
  agents,
  submission,
  imagePrompt,
  competitionAssessment,
  videoNarration,
  videoValidation,
  license,
].join('\n');
const checks = [];

function check(id, pass, detail) {
  checks.push({ id, pass: Boolean(pass), detail });
}

for (const tool of expectedTools) {
  const occurrences = source.match(new RegExp(`name: '${tool}'`, 'g')) ?? [];
  check(`tool:${tool}`, occurrences.length === 1, `${occurrences.length} definition(s)`);
}

check(
  'registration-count',
  (source.match(/modelContext\.registerTool\(/g) ?? []).length ===
    expectedTools.length,
  'exactly seven site-tool registrations',
);
check(
  'closed-schemas',
  (source.match(/additionalProperties: false/g) ?? []).length ===
    expectedTools.length,
  'all seven input schemas reject undeclared fields',
);
check(
  'registration-cleanup',
  source.includes('new AbortController()') &&
    source.includes('{ signal: registration.signal }') &&
    source.includes('registration.abort()'),
  'AbortController registration lifecycle present',
);
check(
  'optional-execution-signal',
  (source.match(/options\?\.signal\?\.aborted/g) ?? []).length ===
    expectedTools.length &&
    webmcpTypes.includes('options?: { signal?: AbortSignal }'),
  'all seven tools tolerate runtimes that omit the optional execution signal',
);
check(
  'read-only-annotations',
  (source.match(/readOnlyHint: true/g) ?? []).length === readOnlyTools.length &&
    readOnlyTools.every((tool) => {
      const start = source.indexOf(`name: '${tool}'`);
      const annotation = source.indexOf('readOnlyHint: true', start);
      const nextTool = source.indexOf('name: ', start + 1);
      return start >= 0 && annotation > start &&
        (nextTool === -1 || annotation < nextTool);
    }),
  'four inspection tools are marked read-only',
);
check(
  'human-authority',
  source.includes('human approval required') &&
    source.includes('No work was executed and no release was approved.'),
  'staging remains visibly distinct from approval and execution',
);
check(
  'page-state-only',
  source.includes("side_effects: 'page_state_only'") &&
    source.includes("side_effects: 'selection_only'"),
  'agent routing writes are bounded page-state changes',
);
check(
  'verification-receipt-side-effect',
  source.includes("name: 'verify_evidence_packet'") &&
    source.includes("verified_by: 'webmcp_agent'") &&
    source.includes("side_effects: 'verification_receipt_only'"),
  'packet verification records a receipt without approval authority',
);
check(
  'evidence-packet-contract',
  source.includes("schema_version: 'captain-evidence-packet-v1'") &&
    source.includes("envelope_version: 'captain-evidence-envelope-v1'") &&
    source.includes('function canonicalPacketJson(packet: EvidencePacket)') &&
    source.includes('crypto.subtle.digest') &&
    !source.includes('packetJson') &&
    (source.match(/canonicalPacketJson\(current\.packet\)/g) ?? []).length === 3 &&
    source.includes('sha256Hex(canonicalPacketJson(packet))') &&
    source.includes('pass: computedHash === current.packetSha256') &&
    source.includes("status: 'packet_changed'") &&
    source.includes("? 'approved'") &&
    source.includes("verified_approval_preserved") &&
    source.includes("current.status !== 'approved'") &&
    source.includes("current.verification?.status !== 'pass'") &&
    (source.match(/current\.verification\.packet_sha256 !== current\.packetSha256/g) ?? [])
      .length === 2 &&
    source.includes('computedHash !== current.packetSha256') &&
    source.includes("status: 'draft', verification: null") &&
    source.includes('approval because packet integrity changed') &&
    source.includes('download because packet integrity changed') &&
    source.includes('new Blob([downloadJson]'),
  'deterministic packet, digest, receipt, and download gates are present',
);
check(
  'shared-state-freshness',
  source.includes('itemsRef.current = nextItems') &&
    source.includes('setItems(nextItems)') &&
    source.includes('packetRef.current = nextState') &&
    source.includes('setPacketState(nextState)') &&
    source.includes('if (packetRef.current !== current)'),
  'tool-visible item and packet refs update synchronously and reject stale verification',
);
check(
  'interaction-accessibility',
  /\.textLink:focus-visible \{[^}]*outline: 3px solid/s.test(styles) &&
    /\.proposalActions button \{[^}]*min-height: 44px/s.test(styles) &&
    /\.toolSignal \{[^}]*min-height: 44px/s.test(styles) &&
    styles.includes('@media (max-width: 620px)'),
  'keyboard focus, touch targets, and narrow-screen controls are declared',
);
check(
  'claim-fidelity',
  !competitionAssessment.includes('handoff contract and manifest') &&
    !readme.includes('release-file presence') &&
    submission.includes('registered WebMCP tool surface'),
  'release text describes the implemented packet and bounds authority to site tools',
);
check(
  'forbidden-agent-authority',
  !forbiddenAgentAuthority.test(source) &&
    source.includes('packet approval and download remain human-only') &&
    source.includes("authority: 'human_only'") &&
    source.includes('release: { executed: false }'),
  'no agent tool can approve, download, execute, publish, or release',
);

const outboundPatterns = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\s*\(/,
  /\bsendBeacon\s*\(/,
];
check(
  'no-outbound-runtime',
  outboundPatterns.every((pattern) => !pattern.test(source)),
  'no outbound request primitive in the interactive client',
);

const sensitivePatterns = [
  /AKIA[0-9A-Z]{16}/,
  /github_pat_[A-Za-z0-9_]+/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /C:\\Users\\/i,
];
check(
  'sanitized-release-text',
  sensitivePatterns.every((pattern) => !pattern.test(releaseText)),
  'no credential signature or private Windows path in release text',
);

const packageData = JSON.parse(packageJson);
check(
  'verification-scripts',
  Boolean(packageData.scripts?.test && packageData.scripts?.['validate:webmcp']),
  'test and WebMCP validation scripts are declared',
);
check(
  'open-source-license',
  license.startsWith('MIT License'),
  'MIT license is present',
);

const pngSignature = socialImage.subarray(1, 4).toString('ascii') === 'PNG';
const imageWidth = pngSignature ? socialImage.readUInt32BE(16) : 0;
const imageHeight = pngSignature ? socialImage.readUInt32BE(20) : 0;
check(
  'social-card',
  pngSignature &&
    imageWidth >= 1200 &&
    imageHeight >= 600 &&
    imageWidth / imageHeight >= 1.8 &&
    imageWidth / imageHeight <= 2,
  `${imageWidth}x${imageHeight} PNG`,
);

const failed = checks.filter((item) => !item.pass);
console.log(
  JSON.stringify(
    {
      status: failed.length === 0 ? 'pass' : 'fail',
      checks_total: checks.length,
      checks_failed: failed.length,
      checks,
    },
    null,
    2,
  ),
);

if (failed.length > 0) process.exitCode = 1;
