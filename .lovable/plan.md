## Goal
1. Make **Sorix Deck** and **Sorix FlowBuilder** prompt bars look exactly like the Imagine prompt bar (full-width unified shell with `+`, Tools pill, Mic with green dot, Send).
2. Make the **Tools** pill in Imagine, Deck, FlowBuilder, and Legends actually functional — clicking it opens the existing `ToolsMenu` so users can jump to other tools.
3. Popup direction:
   - **Imagine, Deck, FlowBuilder** → both `+` attach popup AND Tools menu open **downward** (input sits at top of page).
   - **Legends** → both `+` attach popup AND Tools menu open **upward** (input sits at bottom of chat).

## Changes

### 1. `src/components/imagine/ImaginePromptBar.tsx`
- Convert the static "Tools" `<div>` pill into a `<button>` that toggles `showToolsMenu`.
- Wrap it in `<div className="relative">` and render a downward-opening Tools menu beside it.
- Use a local `ToolsMenuDown` variant (or pass a `direction="down"` prop) so it renders `top-full left-0 mt-2` instead of `bottom-full mb-2`.
- Close the attach menu when opening tools, and vice versa.
- Keep `+` attach popup opening downward (already correct: `top-full mt-2`).

### 2. `src/components/deck/DeckPromptBar.tsx`
- Same Tools-button + downward `ToolsMenu` wiring as Imagine.
- Add a **Mic button** (with green dot) next to Send in a `flex items-center gap-0.5 shrink-0` cluster, only when `!hasContent`.
- Import `Mic` from lucide-react.
- `+` attach popup remains downward.

### 3. `src/components/flowbuilder/FlowPromptBar.tsx`
Rebuild bottom row to match Imagine layout:
- Left cluster: `+` button with downward attach popup (Image / Camera / File) — wire up file inputs and `processFiles` like DeckPromptBar.
  - Since FlowBuilder's `onGenerate` currently only accepts `(prompt: string)`, extend it to `(prompt: string, attachments?: Attachment[])` and forward attachments to `flowbuilderApi.generate` (parsed file content appended to the prompt for now to avoid backend changes).
- Tools pill button wired to downward `ToolsMenu`.
- Right cluster: Mic button (green dot, when `!hasContent`) + existing Send button.
- Update `src/pages/FlowBuilderPage.tsx` `handleGenerate` signature to accept the optional attachments arg and inline them into the prompt string before calling the API.

### 4. `src/components/legends/LegendChat.tsx`
- Convert Tools pill into a functional button that opens `ToolsMenu`.
- Both popups open **upward** (Legends input is at the bottom):
  - `+` attach popup: change positioning from `top-full left-0 mt-2` to `bottom-full left-0 mb-2`, and animation `y` from `-10` to `+10`.
  - Tools menu: use the default upward variant (`bottom-full mb-2`).

### Technical notes
- `ToolsMenu` (`src/components/aichat/ToolsMenu.tsx`) currently hardcodes `absolute bottom-full left-0 mb-2`. Add a `direction?: 'up' | 'down'` prop:
  - `up` (default) → `bottom-full mb-2 origin-bottom-left`
  - `down` → `top-full mt-2 origin-top-left`
  Pass `direction="down"` from Imagine, Deck, FlowBuilder; omit (defaults to `up`) for Legends and main chat.
- Mic button is visual-only (matches existing Imagine implementation).
- Tools menu auto-closes on Esc and outside click — works in both directions.
