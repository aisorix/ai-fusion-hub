## Add "Apps / Connectors" entry inside the + upload menu (Agent chatbox)

Add a new item inside the `+` attachment popover in the Agent's CommandCenter, mirroring Claude's layout. It opens the existing Connections page so users can connect Gmail, Drive, Calendar, Docs, Sheets, etc.

### Scope
- Single file: `src/components/cowork/CommandCenter.tsx`
- Affects both desktop and mobile (the popover is shared)
- No backend / business-logic changes

### Changes

1. **Imports**
   - Add `LayoutGrid` (or `Blocks`) icon from `lucide-react`
   - Add `useNavigate` from `react-router-dom` (if not already)

2. **Popover structure** (inside `{showAttachMenu && ...}` block, lines ~385–430)
   - Keep the existing "Max file size" header
   - Existing items: Upload Image, Take Photo, Attach File
   - Add a thin divider (`border-t border-border`)
   - Add new item: **"Apps & Connectors"** (BN: "অ্যাপস ও কানেক্টর")
     - Icon: `LayoutGrid` in an indigo tile (`bg-indigo-500/10 text-indigo-500`)
     - Subtle right-side chevron (`ChevronRight`) to mimic Claude's submenu hint
     - On click: `setShowAttachMenu(false)` then `navigate("/agent/connections")`

3. **Bilingual labels** use the existing `language === "bn"` pattern already in the file.

4. **No other UI moved.** The Tools pill, model picker, and Web search remain untouched.

### Verification
- Open `/agent` on desktop (1261px) → click `+` → menu shows 4 items, last is "Apps & Connectors" → click navigates to `/agent/connections`
- Resize to mobile width → same menu opens above the `+` button, item is tappable, label doesn't wrap (uses `whitespace-nowrap`)
- BN language toggle renders Bangla label correctly
