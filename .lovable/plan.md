# Unify Tool Prompt Bars to Match Main ChatInput

The main chat (`src/components/aichat/ChatInput.tsx`) uses a **Gemini-style stacked layout**:
- `rounded-3xl` container, `bg-muted/40` with `border-border/50`
- `focus-within:border-primary/40 focus-within:bg-muted/60`
- TextareaAutosize on top row (full width, no inline icons)
- Bottom row: left = `+` (attach) button; right = Send button (`bg-foreground text-background`, rounded-full)

Currently the four tool prompt bars use a **different "card with gradient glow" layout**: gradient glow ring, `bg-card border-border rounded-2xl`, inline icon (Wand2/Sparkles) next to textarea, colored gradient send button. They look inconsistent with the main chat.

## Goal
Refactor these four prompt bars to use the same visual shell as `ChatInput` while keeping each tool's existing functionality (attachments, generate logic, model passthrough).

## Files to update

1. **`src/components/imagine/ImaginePromptBar.tsx`**
2. **`src/components/deck/DeckPromptBar.tsx`**
3. **`src/components/flowbuilder/FlowPromptBar.tsx`**
4. **`src/components/legends/LegendChat.tsx`** (replace inline Textarea+Plus block, lines ~265–358)

## Shared styling spec (applied to all four)

Container shell:
```
rounded-3xl border bg-muted/40 border-border/50
focus-within:border-primary/40 focus-within:bg-muted/60
shadow-sm px-2 sm:px-3 pt-1 pb-1.5 flex flex-col
```

Layout:
- Row 1: `<TextareaAutosize minRows={1} maxRows={6}>` full width, transparent bg, `text-[15px] sm:text-base placeholder:text-muted-foreground/70`, no inline tool icon.
- Row 2 (`flex items-center justify-between mt-1`):
  - Left: `+` attach button (`p-2 rounded-full hover:bg-background`) opening the existing attach menu **above** the bar (`bottom-full mb-2`) — keep existing menu items.
  - Right: Send button — `p-2 sm:p-2.5 rounded-full bg-foreground text-background hover:opacity-90`, falls back to `bg-muted text-muted-foreground opacity-50` when empty. Loader/Send icon swap as today.

Remove:
- Gradient glow wrapper divs (`absolute -inset-0.5 bg-gradient-to-r ...`)
- Inline accent icons (Wand2 in Imagine, Sparkles in Deck) — keep them only as the page header's brand icon, not inside the input.
- Custom colored send buttons (gradient violet/purple, amber/orange, pink). Use the unified neutral foreground send.

Keep:
- Each component's existing state, `onGenerate`/`sendMessage` handlers, attachment processing, hidden file inputs, FileChip previews, parsing indicator, toasts, and Enter-to-submit behaviour.
- Per-tool placeholder strings (e.g., "Describe the image…", "Describe your presentation…", "Describe your diagram…", `Ask ${persona.name}...`).

## Notes
- `FlowPromptBar` currently has no attach menu — that's fine, it'll just have the `+` button omitted (Send-only right cluster) OR we can skip the bottom row entirely. Decision: omit bottom row for FlowBuilder and place a small Send button absolutely positioned to keep look consistent — actually simpler: keep bottom row with no `+` button, just the Send on the right (matches main chat when no tools available).
- `ChatInput` also has a "Tools" button — do **not** add this to the four tool bars (they're already inside a tool).
- `LegendChat`: only the input block (lines ~265–358) is rewritten; chat history and persona logic unchanged.

## Outcome
All four tool prompt bars will have an identical visual shell to the main chat input — same rounded-3xl muted container, stacked textarea + bottom controls, same neutral Send button — while preserving per-tool behaviour and placeholders.
