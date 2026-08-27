import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..');

const readText = (relativePath) =>
  readFile(path.join(root, relativePath), 'utf8');

const [
  source,
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
];

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
  (source.match(/modelContext\.registerTool\(/g) ?? []).length === 5,
  'exactly five site-tool registrations',
);
check(
  'closed-schemas',
  (source.match(/additionalProperties: false/g) ?? []).length >= 5,
  'every input schema rejects undeclared fields',
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
  (source.match(/options\?\.signal\?\.aborted/g) ?? []).length === 5 &&
    webmcpTypes.includes('options?: { signal?: AbortSignal }'),
  'all tools tolerate runtimes that omit the optional execution signal',
);
check(
  'read-only-annotations',
  (source.match(/readOnlyHint: true/g) ?? []).length === 3,
  'three inspection tools are marked read-only',
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
  'all agent writes are bounded page-state changes',
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
