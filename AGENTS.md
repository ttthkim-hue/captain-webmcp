# Captain repository rules

This project is a public, synthetic WebMCP demonstration. Keep every change
compatible with that boundary.

## Product contract

- The visible page and registered WebMCP tools must share the same in-memory
  mission state.
- Agent-facing inputs must use narrow schemas, enumerated identifiers, and
  `additionalProperties: false`.
- Agent writes may only focus page state or stage a reversible proposal.
- Assignment approval, release, publication, and every external side effect
  remain explicit human actions.
- Sol, Luna, Qwen, and deterministic tools are product metaphors in this demo;
  the app does not call real workers or claim measured model performance.

## Protected boundaries

- Use public synthetic content only. Do not add real prompts, responses,
  telemetry, SQLite data, research material, project names, session IDs,
  credentials, personal identifiers, or private paths.
- Do not add outbound model calls, analytics, tracking, account access, billing,
  or hidden network side effects.
- Do not weaken the human approval gate or make a staged proposal look like
  executed work.
- Keep the social image and screenshots free of third-party logos and private
  information.

## Verification

Before proposing release, run:

```text
pnpm test
pnpm run validate:webmcp
pnpm run lint
pnpm run build
```

Hosting, repository publication, demo-video publication, and contest submission
require separate human approval.
