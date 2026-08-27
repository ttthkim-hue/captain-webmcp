# Captain top-10 evidence-packet continuation directive

Status: **WIP candidate; not validated, not accepted, not released**

## Identity

- Repository: `ttthkim-hue/captain-webmcp`
- Stable baseline branch: `main`
- Stable baseline commit: `2f621ca`
- Candidate branch: `agent/top10-evidence-packet-v1`
- Product: public-synthetic OpenAI Sites/WebMCP demonstration
- Release state: private repository, no hosting, no public video, no contest submission

## Objective

Complete one bounded product-outcome improvement: after a human approves a
staged route, Captain creates a deterministic synthetic evidence packet; a
WebMCP agent can inspect and verify that packet; final packet approval and JSON
download remain human-only.

This should turn the current routing-only demo into a complete, tangible
human-agent outcome without adding real model calls, accounts, analytics,
databases, external side effects, or claims that a real release was executed.

## Current WIP state

Only `app/captain-console.tsx` contains the paused implementation candidate.
It adds:

- a stable evidence-packet schema and canonical JSON representation;
- browser-native SHA-256 generation;
- `inspect_evidence_packet` and `verify_evidence_packet` WebMCP tools;
- route approval -> packet draft -> verification -> human packet approval ->
  local JSON download state transitions;
- explicit human-only packet approval, download, publication, and release
  boundaries.

The paused source compiles, but the candidate is deliberately not accepted:

- production build: pass;
- lint: pass;
- unit tests: 3/5 pass, with two expected failures because the frozen tests
  still assert five registrations;
- deterministic validator: 14/17 checks pass, with three expected failures
  because registration, optional-signal, and read-only counts still describe
  the five-tool baseline;
- frozen readiness proxy: 67/100 (+3), below the required +10 threshold.

The following companion work was intentionally paused:

- responsive styles for the evidence-packet surface;
- seven-tool unit-test expectations;
- seven-tool deterministic validator updates;
- README, submission, assessment, and video-story updates;
- actual in-app-browser WebMCP calls and downloaded artifact inspection.

Do not present the current branch as working until every gate below passes.

## Fixed improvement contract

- Editable source: `app/captain-console.tsx`, `app/globals.css`, `README.md`,
  relevant `docs/`, `tests/webmcp-contract.test.mjs`, and
  `scripts/validate-webmcp.mjs`.
- Protected: `main`, baseline commit `2f621ca`, `AGENTS.md`,
  `.openai/hosting.json`, `public/og.png`, `LICENSE`, evaluator and rubric files,
  credentials, private data, Git history outside this branch, deployment,
  public visibility, and submission state.
- Baseline readiness proxy: 64/100.
- Direction: higher is better.
- Minimum meaningful improvement: +10 points.
- Maximum iterations: 3; stop after two non-improvements.
- Time ceiling: 45 minutes for one bounded run.
- Human release gate: hosting, public-repository conversion, video publication,
  PR merge, and Devpost submission remain prohibited without new approval.

The readiness proxy is an internal, frozen comparison aid. It is not a judge
score, a predicted rank, or evidence that the project will place in the top 10.

## Required workflow

1. Read root `AGENTS.md`, this directive, the frozen rubric, and evaluator.
2. Confirm the exact branch, baseline commit, remote, and clean/dirty state.
3. Read `evaluator/candidate-starting-evaluator.json`, then run the frozen
   evaluator against the untouched WIP branch and confirm the same 67/100
   starting result.
4. Diagnose one concrete failure pattern. Do not broaden the product.
5. Complete the existing evidence-packet feature as one coherent candidate.
6. Run exactly these deterministic gates:

   ```text
   pnpm test
   pnpm run validate:webmcp
   pnpm run lint
   pnpm run build
   node reviews/top10-evidence-packet-v1/evaluator/evaluate-competition-readiness.mjs .
   git diff --check
   ```

7. Inspect the generated packet code and authority boundary directly. Verify:

   - seven tools are registered exactly once;
   - every input schema is closed;
   - all seven execution handlers tolerate an omitted signal;
   - no agent tool can approve, download, publish, or release;
   - packet JSON is deterministic and its digest is recomputed;
   - a failed digest or contract does not unlock human packet approval;
   - local download occurs only after a passing receipt and explicit human
     approval;
   - no outbound request primitive, credential, personal path, or private data
     is introduced.

8. KEEP only if the frozen score improves by at least 10, all deterministic
   gates pass, and direct artifact inspection has no regression. Otherwise
   REVERT only the current candidate and report the exact failure.
9. The CLI cannot claim final WebMCP acceptance from source tests alone. Leave
   actual discovery/calls in ChatGPT's in-app browser and downloaded JSON
   readback as an explicit final QA gate for the desktop-app pass.
10. If KEEP, commit and push only to `agent/top10-evidence-packet-v1`. Keep the
    Draft PR open and unmerged. Do not host, publish, submit, or make the
    repository public.

## Acceptance target

The intended flow is:

`inspect mission -> compare/focus/stage -> human approves route -> packet is generated -> agent inspects/verifies -> human approves packet -> human downloads JSON`

The visible interface and WebMCP tools must share the same packet and
verification state. The downloaded envelope must include the packet, digest,
verification receipt, explicit human approval, and `release.executed=false`.

## Final report format

Report:

1. baseline and candidate proxy score, with the caveat above;
2. changed files and exact commit SHA;
3. test/validator/lint/build/diff results;
4. protected surfaces that remained unchanged;
5. whether the candidate is KEEP, REVERT, or BLOCKED;
6. the remaining desktop in-app-browser QA gate;
7. confirmation that no merge, hosting, publication, visibility change, or
   submission occurred.
