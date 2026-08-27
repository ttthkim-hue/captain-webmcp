# Captain competition assessment

Date: 2026-08-27

Status: honest pre-release assessment based on deterministic application gates,
the completed seven-tool desktop QA, downloaded digest readback, and the local
V2 demo artifact. This is not a prediction of the judges' decision.

## Bottom line

Captain now has a bounded source-level answer to its product-outcome gap: a
human-approved route creates a deterministic packet, an agent verifies it, and
a human approves and downloads the JSON envelope. The least-authority model is
preserved.

The complete bounded flow is now verified in the desktop app: seven-tool
discovery and calls, shared packet state, agent receipt verification,
human-only route and packet approval, JSON download, digest readback, and false
release state. It is still a release candidate, not a finished submission,
because hosting, public visibility, video publication, and the Devpost form
have not been completed.

## Frozen readiness proxy comparison

| Proxy axis | Stable baseline | Seven-tool candidate | Delta |
| --- | ---: | ---: | ---: |
| WebMCP leverage | 19 | 23 | +4 |
| Execution | 20 | 23 | +3 |
| Potential impact | 11 | 18 | +7 |
| Creativity and ambition | 14 | 17 | +3 |
| **Total** | **64/100** | **81/100** | **+17** |

This frozen readiness proxy is only a deterministic comparison aid for the
bounded candidate. It is not an official judge score or a top-ten prediction.
Desktop WebMCP QA passed separately; hosting, publication, and submission have
not passed merely because the proxy improved.

## Persona review

### Hackathon judge

“The packet makes the outcome tangible, and the complete seven-tool flow now
has desktop evidence. I still need a working public URL and concise public
video before treating it as a contest submission.”

### WebMCP implementer

“The seven-tool contract is careful: `document.modelContext`, AbortSignal
cleanup, closed inputs, shared packet state, explicit annotations, and a
receipt-only verification side effect.”

### Product and UX reviewer

“The human-agent boundary is unusually legible. Route approval, verification,
packet approval, and download are now distinct, and the packet gives the user a
clear end artifact.”

### Security skeptic

“Least authority remains the strongest part. No agent approval, download, or
release tool exists; writes are limited to visible session state or a
verification receipt.”

### Novelty skeptic

“Sol, Luna, and Qwen make the system memorable to existing AI power users, but
they can also read as brand-specific model routing. The novelty is the shared
decision surface, not the existence of an AI hierarchy.”

### Demo strategist

“A two-minute story can communicate the interaction cleanly. Do not claim that
real workers executed a release. Show semantic discovery, a visible state
change, and the human-only boundary.”

## Competitive context

The public project gallery was not yet published at assessment time, so no
claim about relative rank is possible. The challenge already listed more than
2,000 participants. The packet improves tangibility, but no relative placement
claim is justified and no internal proxy should be presented as one.

## Bounded improvement implemented in source

The candidate implements one complete mission that produces a visible evidence
packet:

1. a human chooses a synthetic release goal;
2. the agent inspects and routes the work;
3. Captain generates a deterministic handoff contract and evidence packet;
4. the agent verifies the packet through WebMCP;
5. the human approves the packet, not an opaque worker action;
6. the user can download the synthetic evidence artifact.

This preserves the safety model while turning routing into a real deliverable.
The deterministic gates and separate desktop QA listed in `VALIDATION.md` both
passed; external release gates remain separate.

## Release recommendation

- The seven-tool desktop QA and JSON digest readback passed; use only the
  validated V2 artifact for any approved publication.
- Do not market the current version as an autonomous multi-agent production
  system.
- Keep hosting, repository visibility, merge, video publication, and Devpost
  submission behind separate human approval.
