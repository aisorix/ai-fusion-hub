

## Fix FlowBuilder Header Alignment & Tool Back Navigation

### Problem 1: FlowBuilder Header Buttons
The FlowBuilder header on desktop has export buttons + New + History grouped together next to the title instead of pushed to the far right corner like Imagine and Deck (which use `justify-between` to push the history button to the right edge).

**Looking at the images**: Image 217 (mobile) shows history button right next to title. Image 218 (desktop) shows PNG/SVG/PDF/New/History all inline next to title. In Imagine and Deck, the history button sits at the far right corner.

### Problem 2: Back Navigation Flow
All tool pages (`/imagine`, `/deck`, `/flowbuilder`, etc.) hardcode `to="/chat"` on their back button. When a user navigates from sidebar → More Tools (`/tools`) → a tool, pressing back should return to `/tools` first, then `/chat`. Currently it skips `/tools` entirely.

---

### Changes

**Issue 1 - FlowBuilder header** (`src/pages/FlowBuilderPage.tsx`)
- Restructure the desktop header to match Imagine/Deck pattern: left side = back + icon + title, right side = export buttons + New + History
- Move the `FlowExportActions`, "New" button, and History button into a right-aligned group using `justify-between` on the header container (same as Deck/Imagine)
- On mobile, keep the two-row layout but ensure the history button stays top-right

**Issue 2 - Back navigation** (all tool pages)
- In all 6 tool pages + ToolsPage, replace hardcoded `to="/chat"` with `useNavigate(-1)` (browser back) so navigation respects the actual history stack
- Files to update: `FlowBuilderPage.tsx`, `ImaginePage.tsx`, `DeckPage.tsx`, `HealthPage.tsx`, `AgroPage.tsx`, `LegendsPage.tsx`, `ToolsPage.tsx`
- This way: if user came from `/tools`, back goes to `/tools`; if from `/chat` sidebar, back goes to `/chat`

### Result
- FlowBuilder header matches Imagine/Deck with buttons aligned to the right corner
- Back button respects navigation history, creating proper flow: Tool → Tools → Chat

