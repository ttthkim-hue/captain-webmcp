# Validation record

Date: 2026-08-27

Status: **CLI and seven-tool desktop QA passed; external release not performed**

## Automated verification

| Check | Result |
| --- | --- |
| WebMCP contract tests | 9 passed, 0 failed |
| Deterministic WebMCP checks | 25 passed, 0 failed |
| ESLint | Passed |
| Production build | Passed |

The contract suite verifies the exact seven-tool surface, seven closed input
schemas, registration cleanup, optional execution-signal compatibility, four
read-only tools, reversible routing writes, receipt-only verification,
deterministic packet and digest gates, human-only approval and download,
documentation coverage, and absence of outbound request primitives.

Packet verification now recomputes the digest from the current packet object,
keeps tool-visible refs synchronized before a tool returns, preserves an
existing human approval after a passing re-verification, and rechecks the
receipt digest before approval or download.
The approval and download paths also recompute the current packet digest and
return the packet to draft if integrity changed after verification.

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

That historical smoke test remains valid for the five named tools. The expanded
flow was validated separately as recorded below.

## Compatibility repair captured during smoke testing

The browser's tool executor may omit the optional callback options object. The
first smoke call exposed that mismatch. The implementation now checks an abort
signal only when supplied, and the behavior is locked by both the TypeScript
declaration and deterministic tests.

## Seven-tool desktop QA

The expanded flow passed in ChatGPT's WebMCP-capable in-app browser against the
public-synthetic mission:

1. The browser discovered the exact seven registered tools.
2. Each tool was called against the shared synthetic state.
3. The agent inspected T-102, compared routes, focused it, and staged Luna.
4. Only the visible **Human approve route** control created packet
   `PKT-T-102-LUNA`.
5. `inspect_evidence_packet` returned the same packet and
   `verify_evidence_packet` recorded a passing agent receipt without approval
   or download authority.
6. Only the visible **Human approve packet** and **Download JSON evidence
   packet** controls approved and downloaded the envelope.
7. The downloaded envelope reported verification `pass`, human authority
   `human_only`, `release.executed=false`, and packet digest
   `68f6815d2567f652a2b1c97e0dc638e7682623e8778c5f07d28f86ce9dd2b1c3`.

The download file's own SHA-256 was
`33e83034264b6e8492305bba7c479daabeb6b95d21ab56a90f10aebe2a0504d7`.
This desktop QA is interaction evidence for the synthetic workflow, not a
claim that a real worker executed or released software.

## Release gates not exercised

- No public repository was created or updated.
- No deployment was performed.
- A local V2 demo video was recorded and verified; it was not published.
- No contest form was submitted.
