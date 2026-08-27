# Validation record

Date: 2026-08-27

Status: **CLI candidate verified; seven-tool desktop QA pending; external release not performed**

## Automated verification

| Check | Result |
| --- | --- |
| WebMCP contract tests | 7 passed, 0 failed |
| Deterministic WebMCP checks | 22 passed, 0 failed |
| ESLint | Passed |
| Production build | Passed |

The contract suite verifies the exact seven-tool surface, seven closed input
schemas, registration cleanup, optional execution-signal compatibility, four
read-only tools, reversible routing writes, receipt-only verification,
deterministic packet and digest gates, human-only approval and download,
documentation coverage, and absence of outbound request primitives.

## Historical built-in browser smoke test

The stable five-tool baseline was previously opened in a WebMCP-capable in-app
browser. The browser discovered these page-defined tools:

1. `get_mission_brief`
2. `inspect_work_item`
3. `compare_worker_routes`
4. `focus_work_item`
5. `stage_assignment`

Each tool was invoked once against synthetic item `T-102`.

- Mission read returned `public_synthetic_only` and the human authority rule.
- Item inspection returned the expected evidence and acceptance criteria.
- Route comparison selected Luna and returned all four route assessments.
- Focus changed the visible shared selection only.
- Stage returned `staged_for_human_review` with `page_state_only` and explicitly
  reported that no work or release was approved.
- The page displayed `5 SITE TOOLS READY` and `STAGED PROPOSAL`.
- The human **Return** action removed the staged proposal.

That historical smoke test remains valid for the five named tools, but it is not
evidence that the expanded seven-tool packet flow works in the desktop app.

## Compatibility repair captured during smoke testing

The browser's tool executor may omit the optional callback options object. The
first smoke call exposed that mismatch. The implementation now checks an abort
signal only when supplied, and the behavior is locked by both the TypeScript
declaration and deterministic tests.

## Seven-tool desktop QA not yet performed

The following remain required before final WebMCP acceptance:

1. Discover all seven registered tools in ChatGPT's in-app browser.
2. Invoke each tool against the shared synthetic mission state.
3. Confirm that human route approval creates the same packet the agent inspects.
4. Confirm that verification records a passing receipt but cannot approve or
   download.
5. Confirm that digest or contract failure keeps packet approval and download
   locked.
6. Use the visible controls for human packet approval and JSON download.
7. Read back the downloaded JSON envelope and match its SHA-256 digest to the
   packet shown in the interface.

## Release gates not exercised

- No public repository was created or updated.
- No deployment was performed.
- No demo video was recorded or published.
- No contest form was submitted.
