import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const evaluatorRoot = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(.:)/, '$1'),
);
const rubric = JSON.parse(
  await readFile(path.join(evaluatorRoot, 'competition-rubric-v1.json'), 'utf8'),
);

const candidateRoot = path.resolve(process.argv[2] ?? '.');
const read = (relativePath) =>
  readFile(path.join(candidateRoot, relativePath), 'utf8');
const [source, styles, tests, validator, readme] = await Promise.all([
  read('app/captain-console.tsx'),
  read('app/globals.css'),
  read('tests/webmcp-contract.test.mjs'),
  read('scripts/validate-webmcp.mjs'),
  read('README.md'),
]);

const occurrences = (text, literal) => text.split(literal).length - 1;
const forbiddenAgentAuthority =
  /name:\s*['"](?:approve|download|publish|release)[^'"]*['"]/;

const facts = {
  webmcp_artifact_tools:
    occurrences(source, "name: 'inspect_evidence_packet'") === 1 &&
    occurrences(source, "name: 'verify_evidence_packet'") === 1 &&
    source.includes("side_effects: 'verification_receipt_only'") &&
    source.includes('agent verifies the packet') &&
    !forbiddenAgentAuthority.test(source) &&
    tests.includes("'inspect_evidence_packet'") &&
    tests.includes("'verify_evidence_packet'") &&
    validator.includes("'inspect_evidence_packet'") &&
    validator.includes("'verify_evidence_packet'"),
  coherent_artifact_ui:
    source.includes('EVIDENCE PACKET') &&
    source.includes('Human approve packet') &&
    source.includes('Download JSON evidence packet') &&
    source.includes('Waiting for agent verification') &&
    styles.includes('.evidencePacket') &&
    styles.includes('.packetActions'),
  tangible_verified_output:
    source.includes("schema_version: 'captain-evidence-packet-v1'") &&
    source.includes("envelope_version: 'captain-evidence-envelope-v1'") &&
    source.includes('crypto.subtle.digest') &&
    source.includes('new Blob([downloadJson]') &&
    source.includes('packet_sha256') &&
    tests.includes('download stays human-only') &&
    validator.includes('evidence-packet-contract') &&
    readme.includes('downloadable evidence packet'),
  human_agent_artifact_collaboration:
    source.includes("verified_by: 'webmcp_agent'") &&
    source.includes('packet_approval_required: true') &&
    source.includes('packet approval and download remain human-only') &&
    !forbiddenAgentAuthority.test(source),
};

const axes = { ...rubric.baseline };
delete axes.total;
const criteria = rubric.candidate_bonuses.map((criterion) => {
  const pass = Boolean(facts[criterion.id]);
  if (pass) axes[criterion.axis] += criterion.points;
  return { ...criterion, pass, awarded: pass ? criterion.points : 0 };
});
const score = Object.values(axes).reduce((sum, value) => sum + value, 0);
const delta = score - rubric.baseline.total;

console.log(
  JSON.stringify(
    {
      schema_version: 1,
      evaluator: rubric.name,
      candidate_root: candidateRoot,
      score,
      baseline_score: rubric.baseline.total,
      delta,
      direction: 'higher_is_better',
      minimum_meaningful_delta: rubric.minimum_meaningful_delta,
      threshold_met: delta >= rubric.minimum_meaningful_delta,
      axes,
      criteria,
      caveat: rubric.purpose,
    },
    null,
    2,
  ),
);
