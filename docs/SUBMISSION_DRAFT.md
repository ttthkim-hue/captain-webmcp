# OpenAI WebMCP Challenge — submission draft

Status: **prepared locally; not submitted**

## Project

**Name:** Captain — Human-Agent Operations

**Tagline:** A shared control room where people and browser agents route work
across an AI team without giving up human authority.

**Live app:** [LIVE URL]

**Public repository:** [PUBLIC REPOSITORY URL]

**Public demo video:** [PUBLIC VIDEO URL]

## What it does

Captain makes a mixed AI workforce legible. A person sees a synthetic mission,
worker roles, risk, acceptance criteria, route comparisons, and a session-only
activity trace. A compatible browser agent sees the same state through five
imperative WebMCP tools.

The agent can inspect the mission, inspect a work item, compare worker routes,
focus shared page state, and stage a reversible assignment proposal. It cannot
execute the task, approve an assignment, publish a release, or contact an
external service. Those decisions stay visibly human.

## Why it is useful

Multi-agent systems often optimize model routing but make the handoff opaque to
the person responsible for the result. Captain turns routing into a shared
decision surface. The agent gets semantic, bounded actions; the person gets
context, evidence, and a real approval boundary.

The pattern applies beyond the demo: software releases, research QA, document
production, and any workflow where specialized automation is useful but final
authority cannot be implicit.

## Why WebMCP

Without WebMCP, an agent must infer meaning from page text and reproduce a
fragile click sequence. Captain instead registers a small site-owned contract
with `document.modelContext.registerTool`:

1. `get_mission_brief`
2. `inspect_work_item`
3. `compare_worker_routes`
4. `focus_work_item`
5. `stage_assignment`

Inputs use enumerated task, worker, and reason identifiers with
`additionalProperties: false`. Read-only tools are explicitly annotated. All
registrations share an `AbortController`, so the page unregisters them during
cleanup. The visible interface and agent tools call the same state and routing
logic.

## Human-agent division of work

| Agent | Human |
| --- | --- |
| Reads structured live state | Defines and reviews the mission |
| Compares bounded routes | Resolves ambiguity and risk |
| Focuses the shared item | Sees every state change |
| Stages a reversible proposal | Approves, returns, or releases |

## Safety and privacy

The entry uses public synthetic data only. It has no login, analytics,
telemetry, cookies, model API, database, or outbound request. Agent write tools
change visible session state only. No tool can approve, execute, publish, or
release.

## How it was built

- React and TypeScript on the OpenAI Sites scaffold
- Imperative WebMCP registration in the client page
- Shared in-memory state for human and agent interaction
- Deterministic contract tests for tool names, schemas, cleanup, side-effect
  boundaries, protected language, and social assets
- Responsive original interface and custom social preview artwork

## Judging-criteria map

- **Usefulness:** clarifies handoffs and preserves authority in multi-agent work.
- **Originality:** combines model routing with a shared human-agent decision
  surface rather than a hidden autonomous chain.
- **Execution:** polished responsive UI, five bounded tools, deterministic tests,
  open-source package, and a complete demo path.
- **WebMCP use:** site-owned semantic tools read and update the same live state
  shown to the person.
- **Human-agent UX:** agents inspect and stage; people understand, approve, and
  release.

## Repository and license

The complete application source, validation scripts, setup instructions, and
MIT license are included in the public repository.
