# Captain demo script — target 2 minutes 25 seconds

## Recording setup

- Use the deployed public URL in ChatGPT's built-in browser.
- Record at 1440p or 1080p with audible narration.
- Show only the synthetic mission. Close unrelated tabs and notifications.
- Keep the final video public and under three minutes.

## Script

### 0:00–0:18 — The problem

**Narration:**

“AI teams are becoming more capable, but their handoffs are often invisible.
People either micromanage every click or give an agent too much authority.
Captain is a shared control room where both sides see the same mission and the
human keeps the final decision.”

**On screen:** Show the hero, mission health, and four-worker hierarchy.

### 0:18–0:42 — The page works for people

**Narration:**

“This is a fully synthetic public-release mission. I can inspect each work
item, its risk, evidence gate, and recommended route. Sol owns judgment, Luna
implements, Qwen handles bounded mechanical work, and exact tools provide
objective evidence.”

**On screen:** Select T-101, T-103, and T-104; point out route changes.

### 0:42–1:12 — WebMCP, not screen guessing

**Narration:**

“Captain registers five site tools directly in the page. The agent can read the
mission, inspect an item, compare worker routes, focus shared state, and stage a
proposal. The schemas use exact item and worker identifiers, so the agent does
not need to guess at buttons or DOM selectors.”

**On screen:** Open the agent briefing and paste:

“Inspect the mission, compare routes for T-102, focus it in the shared
interface, then stage the safest assignment. Do not approve or execute the
work.”

### 1:12–1:42 — Shared state

**Narration:**

“The agent focuses T-102 in the same interface I am watching. It compares all
four routes and stages Luna because this is scoped implementation with clear
tests. The activity trace records the handoff, while the proposal remains
reversible.”

**On screen:** Show T-102 focused, the route cards, activity entry, and staged
proposal.

### 1:42–2:05 — Human authority

**Narration:**

“There is deliberately no WebMCP tool for approval or release. The agent cannot
execute work, contact an outside service, or publish anything. I can return the
proposal, or explicitly approve it here.”

**On screen:** Click **Return**, ask the agent to stage again, then click
**Human approve**.

### 2:05–2:25 — Close

**Narration:**

“Captain shows the human-agent experience I want: semantic tools instead of
screen guessing, the smallest capable worker for each job, visible evidence,
and human authority at the boundary. The application and WebMCP contract are
open source.”

**On screen:** Scroll through Why WebMCP, then finish on the Captain hero.

## Final checks

- Duration is below 3:00.
- Audio is clear and the video is publicly viewable.
- The live URL, public repository, and tool interaction are all visible.
- No private tab, account identity, local path, or operational dataset appears.
