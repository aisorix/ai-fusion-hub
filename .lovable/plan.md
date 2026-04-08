

## Standardize FlowBuilder Icon & Clean Up More Tools Button

### Problem
1. FlowBuilder uses `Workflow` icon on the landing page but `Sparkles` in the sidebar and Tools page — needs to be `Workflow` everywhere
2. The "More Tools" sidebar button still shows a `ChevronDown` dropdown arrow even though it now navigates to `/tools` — remove it
3. The "More Tools" button uses `Sparkles` icon which conflicts — change to a grid/apps-style icon (e.g., `LayoutGrid` or `Grid3X3`)

### Changes

**`src/components/aichat/ChatSidebar.tsx`**
- Change FlowBuilder icon from `Sparkles` to `Workflow` in the `moreTools` array (line 246)
- Remove `ChevronDown` from the "More Tools" button (lines 466-468)
- Change "More Tools" icon from `Sparkles` to `Grid3X3` or similar (line 463)

**`src/components/aichat/MobileSidebar.tsx`**
- Change FlowBuilder icon from `Sparkles` to `Workflow` in the `moreTools` array (line 185)
- Remove `ChevronDown` from the "More Tools" button if present
- Change "More Tools" icon to match desktop sidebar

**`src/pages/ToolsPage.tsx`**
- Change FlowBuilder icon from `Sparkles` to `Workflow` (line 10)

**No changes to**: `Features.jsx`, `FlowBuilderPage.tsx` — these already use `Workflow` correctly.

