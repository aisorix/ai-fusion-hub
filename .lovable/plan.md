## Goal

Refresh the main chat composer (`src/components/aichat/ChatInput.tsx`) so it visually matches the Gemini-style reference: a clean, tall, pill-shaped bar with controls arranged on a bottom row (`+`, `Tools`, mic, send). Add a new **Tools** button that opens a polished popup listing all Sorix tools, and tapping any tool navigates to that tool instantly.

## Scope

- Restyle the input container only inside `src/components/aichat/ChatInput.tsx`. No changes to `MultiWindowChat`, mobile header, sidebar, or other tools' own input bars.
- All existing functionality stays: attachments (+ menu), paste, drag & drop, camera, file chips, parsing progress, voice mic, send/stop, health-mode disclaimer, autosize textarea, Enter-to-send.

## Visual redesign (matches reference image)

```text
┌───────────────────────────────────────────────────────┐
│  Ask AI Sorix                                         │  ← textarea (top, full width)
│                                                       │
│                                                       │
│  [+]  [⚙ Tools]                          [🎤]  [➤]    │  ← controls row (bottom)
└───────────────────────────────────────────────────────┘
```

- Container: large rounded-3xl pill, soft border, `bg-muted/40`, subtle shadow, comfortable padding (`px-4 pt-3 pb-2`), min-height ~96 px.
- Textarea sits at the **top** spanning the full width (autosize 1–6 rows), no inline buttons beside it.
- A second **controls row** at the bottom holds: `+` (left), new `Tools` pill button (left, next to `+`), mic (right), send/stop (right). Spacing and icon sizes mirror the Gemini screenshot.
- Tools button: rounded-full, `px-3 py-1.5`, `Settings2` icon + label "Tools" (translates to "টুলস" in Bangla), hover highlights, active state when popup is open.

## New Tools popup

A new lightweight component `src/components/aichat/ToolsMenu.tsx` (used only by `ChatInput`).

- Trigger: the `Tools` button. Opens upward, anchored to button (similar pattern to existing attach menu — `AnimatePresence` + absolute positioning), width ~280 px on desktop, full-width sheet-style on small screens.
- Header row: title "Sorix Tools" + small subtitle "Jump into any tool".
- List of tools (icon tile + name + 1-line desc), reusing the same metadata as `src/pages/ToolsPage.tsx`:
  - Sorix Imagine → `/imagine`
  - Sorix Health (FREE badge) → `/health`
  - Sorix Agro (FREE badge) → `/agro`
  - Sorix Legends → `/legends`
  - Sorix Deck → `/deck`
  - Sorix FlowBuilder → `/flowbuilder`
- Footer link: "View all tools →" navigates to `/tools` for the full gallery (keeps room for future tools without bloating the popup).
- Click behavior: `navigate(route)` immediately on click (no confirm step) — the requested "very fastly" flow. Popup closes on selection, on outside click, and on `Esc`.
- Styling consistent with existing attach menu: `bg-popover`, `border-border`, `rounded-xl`, `shadow-xl`, `backdrop-blur-xl`, gradient icon tiles matching `ToolsPage`.

## Technical details

File-level changes:

1. **`src/components/aichat/ChatInput.tsx`**
   - Restructure the input container: switch from `flex items-end` (single row) to `flex flex-col` with a top textarea row and a bottom controls row.
   - Move `+` button and add new `Tools` button into the bottom-left cluster; move mic + send into bottom-right cluster.
   - Re-anchor the existing attach menu so it still pops above the `+` button correctly within the new layout.
   - Add `useNavigate` from `react-router-dom`.
   - Add state `showToolsMenu` and render `<ToolsMenu>` when open.
   - Keep all existing handlers untouched.

2. **`src/components/aichat/ToolsMenu.tsx`** (new)
   - Props: `open`, `onClose`, anchor handled by parent positioning.
   - Internal `tools` array (id, name, desc, icon from `lucide-react`, route, gradient, free flag).
   - On select: `navigate(route)` then `onClose()`.
   - Outside-click + `Esc` handlers.
   - Framer-motion enter/exit (matches existing menus).

3. **Translations**: inline ternary for "Tools" / "টুলস" and "View all tools" / "সব টুলস দেখুন" inside the new component (matches the project's i18n pattern noted in memory).

No changes to:
- `chatStore`, edge functions, routing config (all tool routes already exist).
- `MultiWindowChat` (uses its own composer; out of scope unless requested later).
- Other tool pages.

## UX / quality bar

- Layout matches reference at desktop and ≥360 px mobile widths; controls row never wraps (icons shrink, label hides to icon-only on `<sm` if needed for the Tools button — keep "Tools" label visible by default since space allows).
- Bangla label respects existing layout constraint memory (`whitespace-nowrap`, `min-w-0`).
- Popup is keyboard accessible: focus trap not required, but `Esc` closes and clicking outside closes.
- Suppress informational toasts on tool navigation (per memory: silent backend feedback).
- Send/Stop button keeps current dark filled style; mic keeps green-dot indicator.

## Out of scope

- Multi-window chat composer redesign.
- Adding new tools or changing tool routes.
- Changing attach menu contents.
- Mobile bottom sheet variant for the popup (desktop-style anchored popup will be used; can be upgraded later if requested).
