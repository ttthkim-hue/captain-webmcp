# WebMCP Challenge release gate packet

Checked against the official OpenAI challenge page and Devpost rules on 2026-09-01.

## Deadline

Submission deadline: **2026-09-03 13:00 PDT / 2026-09-04 05:00 KST**.

## Eligibility evidence

Repository history currently contains one baseline commit:

- `2f621cae09efd7367703b4630fa07fd85b456712` — `Establish verified Captain WebMCP baseline`
- commit time: 2026-08-27T02:21:25Z

The official Submission Period opened on August 25, 2026. The repository therefore contains no pre-August-25 Git history and the current project evidence is consistent with a project created during the Submission Period. If any materially equivalent Captain implementation existed outside this repository before August 25, the final submission must disclose it and distinguish the WebMCP extension added during the Submission Period.

## Frozen official requirements

The final submission must provide all of the following:

- a working live URL accessible to judges using ChatGPT's in-app browser or Chrome with WebMCP enabled;
- an English project description explaining why WebMCP fits, the UX improvement, what people and agents can do together, and how WebMCP was implemented;
- a public GitHub/GitLab/Bitbucket repository containing the necessary source, assets, instructions, and a visible open-source license;
- actual `document.modelContext.registerTool(...)` usage in the public repository;
- a public YouTube demo video shorter than three minutes, with audio, showing the project functioning and explaining the WebMCP use;
- free judge access through the end of judging.

Do not mark a public/live/video gate PASS from intent or local evidence.

## Current product contract

Captain exposes exactly five bounded site tools:

1. `get_mission_brief`
2. `inspect_work_item`
3. `compare_worker_routes`
4. `focus_work_item`
5. `stage_assignment`

The first three are read-only. `focus_work_item` changes only shared selection state. `stage_assignment` creates only a reversible page-state proposal. No WebMCP tool can approve an assignment, execute work, release/publish anything, or call an external service. Human **Approve** and **Return** controls remain UI-only.

## Validation commands

Run from the exact release head with Node.js 22.13+ and pnpm:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate:webmcp
pnpm run lint
pnpm run build
```

Record exact command exit status and test counts. The existing 2026-08-27 validation record is useful baseline evidence but is not a substitute for a fresh release-head run.

## Six release gates

### ELIGIBILITY_GATE

**PASS on repository evidence.** Current Git history begins after the official Submission Period opened. Reopen only if contrary pre-period project evidence is discovered.

### LOCAL_VALIDATION_GATE

**BLOCKED pending fresh release-head execution.** Required: exact four validation commands above all PASS.

### LIVE_URL_GATE

**BLOCKED.** Required: one stable free-access URL, then successful WebMCP discovery/invocation in ChatGPT's in-app browser or Chrome with WebMCP enabled. Prefer the simplest existing-compatible free hosting route; do not add a backend, auth, database, telemetry, or paid service solely for the challenge.

### PUBLIC_REPO_GATE

**BLOCKED.** Current repository is private. Before publication require a secret/privacy scan and exact public-head review. `LICENSE` and public setup instructions already exist in the private baseline; confirm GitHub detects the license after publication.

### VIDEO_GATE

**BLOCKED.** Required: public YouTube video <3:00 with audio and no unlicensed music/third-party material.

### DEVPOST_GATE

**BLOCKED.** Required fields may be completed only from observed release artifacts. Final submit is authorized once all other gates PASS and the submission matches the reviewed public artifacts.

## Demo storyboard — target 2:15–2:40

**0:00–0:20 — Problem and shared state**
- Show the Captain page and `5 SITE TOOLS READY`.
- One sentence: multi-agent routing is useful, but hidden delegation makes human accountability difficult.

**0:20–0:55 — Inspect**
- Ask the browser agent to inspect the mission and `T-102`.
- Show returned evidence, acceptance criteria, and explicit human-authority boundary.

**0:55–1:25 — Compare routes**
- Invoke `compare_worker_routes` for `T-102`.
- Show why the bounded routing contract recommends the implementation worker while preserving exact/deterministic alternatives.

**1:25–1:50 — Shared focus**
- Invoke `focus_work_item`.
- Show the same item visibly focused in the human UI. Explain that WebMCP changes semantic shared state instead of guessing DOM selectors.

**1:50–2:15 — Stage, not execute**
- Invoke `stage_assignment` for the selected route.
- Show `STAGED PROPOSAL` and the returned `page_state_only` / no-execution authority statement.

**2:15–2:35 — Human boundary**
- Click **Return** (or **Human approve** if the final script prefers) manually.
- State that approval and release are intentionally not exposed as WebMCP tools.

**2:35–2:45 — Close**
- Show the public repository/live URL briefly and state: five bounded tools, public synthetic data, no model/API/backend dependency.

## Submission copy anchors

Use the existing `docs/SUBMISSION_DRAFT.md` as the canonical long-form source. Final text should emphasize:

- **Usefulness:** makes AI-worker handoffs legible and reviewable.
- **Originality:** WebMCP is used as a shared human-agent decision surface rather than hidden browser automation.
- **Execution:** five narrow tools, closed schemas, cleanup, deterministic validation, responsive UI.
- **Thoughtful WebMCP use:** agent actions operate on the same state the person sees.
- **Human-agent experience:** agents inspect/compare/focus/stage; people approve/return/release.

## Release freeze

After actual Devpost submission, preserve the submitted public repository head, live deployment, and video through judging. Future development must not change the judged artifact unless the rules explicitly permit it.