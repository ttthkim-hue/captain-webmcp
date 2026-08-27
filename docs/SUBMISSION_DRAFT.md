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
activity trace. A compatible browser agent sees the same state through seven
imperative WebMCP tools.

The agent can inspect the mission, inspect a work item, compare worker routes,
focus shared page state, stage a reversible assignment proposal, and inspect
and verify the deterministic evidence packet created after human route
approval. The registered WebMCP tool surface cannot execute the task, approve a
route or packet, download the JSON, publish a release, or contact an external
service. Those decisions stay visibly human.

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
6. `inspect_evidence_packet`
7. `verify_evidence_packet`

Inputs use enumerated task, worker, and reason identifiers with
`additionalProperties: false`. Read-only tools are explicitly annotated. All
registrations share an `AbortController`, so the page unregisters them during
cleanup. The visible interface and agent tools call the same state and routing
logic. Packet verification recomputes the canonical JSON SHA-256 digest and
records a receipt without granting approval or download authority.

## Human-agent division of work

| Agent | Human |
| --- | --- |
| Reads structured live state | Defines and reviews the mission |
| Compares bounded routes | Resolves ambiguity and risk |
| Focuses the shared item | Sees every state change |
| Stages a reversible proposal | Approves or returns the route |
| Inspects and verifies the packet | Approves the passing packet |
| Records a verification receipt | Downloads JSON or decides whether to release |

## Safety and privacy

The entry uses public synthetic data only. It has no login, analytics,
telemetry, cookies, model API, database, or outbound request. Agent write tools
change visible session state or record a verification receipt only. No agent
tool can approve, download, execute, publish, or release.

## How it was built

- React and TypeScript on the OpenAI Sites scaffold
- Imperative WebMCP registration in the client page
- Shared in-memory state for human and agent interaction
- Canonical packet JSON, browser-native SHA-256, and a downloadable envelope
- Deterministic contract tests for tool names, schemas, cleanup, side-effect
  boundaries, packet gates, protected language, and social assets
- Responsive original interface and custom social preview artwork

## Judging-criteria map

- **Usefulness:** clarifies handoffs and preserves authority in multi-agent work.
- **Originality:** combines model routing with a shared human-agent decision
  surface rather than a hidden autonomous chain.
- **Execution:** polished responsive UI, seven bounded tools, deterministic
  tests, open-source package, and a complete packet lifecycle.
- **WebMCP use:** site-owned semantic tools read and update the same live state
  shown to the person.
- **Human-agent UX:** agents inspect, stage, and verify; people approve routes
  and packets, download the artifact, and retain release authority.

The seven-tool desktop QA passed in ChatGPT's in-app browser. All seven tools
were called against the public-synthetic mission, the visible human controls
approved the route and packet, and the downloaded envelope matched the visible
packet digest with `release.executed=false`. Hosting, public repository
visibility, video publication, and form submission remain unperformed.

## Repository and license

The complete application source, validation scripts, setup instructions, and
MIT license are included in the release-candidate repository. Public
visibility is enabled only at the approved release step.
