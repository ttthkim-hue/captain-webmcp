# Captain V2 video validation

Date: 2026-08-27

Artifact: `artifacts/video/captain-webmcp-demo-v2.mp4`

Status: **seven-tool V2 local review copy passed; not published**

## Media contract

| Property | Verified value |
| --- | --- |
| Duration | 161.572 seconds |
| Video | H.264, 1920 × 1080, 30 fps |
| Audio | AAC, 48 kHz, stereo |
| Integrated loudness | -16.0 LUFS |
| True peak | -1.5 dBFS |
| File size | 8,008,769 bytes |
| SHA-256 | `f7d32039c4215df2d0a38ecd285a241f24a703d0cea9ecdc39e1bda2ae7f0584` |

## Content provenance

- All page images were captured from the local public-synthetic Captain app.
- The visible state resulted from actual calls to all seven page-defined
  WebMCP tools in ChatGPT's in-app browser.
- The route and packet approvals and JSON download resulted from visible human
  controls, not agent approval or download tools.
- Packet `PKT-T-102-LUNA` passed agent verification, then human packet
  approval. The downloaded packet digest matched the visible digest and
  `release.executed` remained false.
- Narration was generated locally with the installed Microsoft Mark synthetic
  voice at normal rate. No voice API, account, paid service, or private input
  was used.
- The narration explicitly states that this is a bounded interaction pattern,
  not a claim that real workers completed a release.

## Verification

- Full video and audio streams decoded to completion with no errors.
- Eight representative timestamps were extracted and visually inspected.
- Chapter labels, route comparison, staged proposal, approved packet,
  deterministic receipt, human-only activity trace, and WebMCP rationale were
  legible in the 16:9 output.
- Portrait evidence captures use a contained dark presentation so the packet
  and receipt are not cropped.
- Audio measured at -16.0 LUFS with -1.5 dBFS true peak.
- The duration is 18.428 seconds below the challenge's three-minute limit.

## Download readback

- Packet ID: `PKT-T-102-LUNA`
- Packet SHA-256 recorded by the envelope:
  `68f6815d2567f652a2b1c97e0dc638e7682623e8778c5f07d28f86ce9dd2b1c3`
- Downloaded envelope file SHA-256:
  `33e83034264b6e8492305bba7c479daabeb6b95d21ab56a90f10aebe2a0504d7`
- Verification: `pass`
- Human authority: `human_only`
- Release executed: `false`

## Release boundary

The video is a local review artifact. It has not been uploaded to YouTube,
attached to Devpost, committed to Git, or otherwise published. Hosting,
repository visibility, publication, and contest submission require the final
human release action.
