# Captain V1 video validation

Date: 2026-08-27

Artifact: `artifacts/video/captain-webmcp-demo-v1.mp4`

Status: **local review copy passed; not published**

## Media contract

| Property | Verified value |
| --- | --- |
| Duration | 144.224 seconds |
| Video | H.264, 1920 × 1080, 30 fps |
| Audio | AAC, 48 kHz, stereo |
| Integrated loudness | -16.0 LUFS |
| True peak | -1.5 dBFS |
| File size | 6,946,302 bytes |
| SHA-256 | `08ab9a622405c9d4c50c72dbedf89f44c3ef5e1c0f297a210dbd9ae8958ae96e` |

## Content provenance

- All page images were captured from the local public-synthetic Captain app.
- The staged state resulted from actual calls to the five page-defined WebMCP
  tools in the in-app browser.
- The human-activity frame resulted from the visible **Human approve** control,
  not an agent approval tool.
- Narration was generated locally with the installed Microsoft Mark synthetic
  voice. No voice API, account, paid service, or private input was used.
- The narration explicitly states that the app is a bounded interaction pattern
  and does not claim that real workers completed a release.

## Verification

- Full video and audio streams decoded to completion with no errors.
- Four representative timestamps were extracted and visually inspected.
- Chapter labels, shared-state changes, proposal controls, human activity, and
  WebMCP rationale remained legible in the 16:9 output.
- Audio measured at the target -16 LUFS with -1.5 dBFS true peak.
- The duration is below the challenge's three-minute limit.

## Release boundary

The video is a local review artifact. It has not been uploaded to YouTube,
attached to Devpost, committed to Git, or otherwise published.
