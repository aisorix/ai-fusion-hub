# Match Deck/Imagine/Legends prompt bars exactly to main ChatInput screenshot

The screenshot shows the main `/chat` input bar:
- Rounded soft container, "Ask anything..." placeholder
- Bottom-left: `+` button followed by an outlined pill **Tools** button
- Bottom-right: mic icon (with green dot) and a paper-plane Send icon
- Attach popup opens **downward** (not upward)

The three tool prompt bars (Deck, Imagine, Legends) currently use the unified shell but differ on details: no Tools button, popup opens upward, no mic icon. Per request, make them visually identical to the main ChatInput, and have the `+` attach menu pop **downward**.

## Files to edit

1. `src/components/imagine/ImaginePromptBar.tsx`
2. `src/components/deck/DeckPromptBar.tsx`
3. `src/components/legends/LegendChat.tsx`

(FlowBuilder remains as previously updated — no attach menu needed there.)

## Changes per file (same pattern for all three)

**Attach menu popup direction** — flip from upward to downward:
- Wrapper: `absolute top-full left-0 mt-2 ...` (was `bottom-full ... mb-2`)
- Motion: `initial/exit { y: -10 }` (was `y: 10`)

**Bottom-left cluster** — add a static "Tools" pill next to the `+` button (matches screenshot). It is a non-functional visual marker for tool context (no menu), since these pages already represent a single tool. Use `Settings2` icon from lucide-react:
```tsx
<div className="flex items-center gap-1 pl-2 pr-3 py-1.5 rounded-full border border-border/60 text-muted-foreground text-sm font-medium select-none">
  <Settings2 className="w-4 h-4" />
  <span>Tools</span>
</div>
```
Wrap `+` and Tools together in a `flex items-center gap-1` container so the right side keeps the Send button.

**Bottom-right cluster** — keep only the Send button (paper-plane). No mic in tool bars (mic is voice mode for chat only). Send styling already matches main ChatInput (`bg-foreground text-background`, opacity fallback when empty).

**LegendChat** — same edits inside the input block (lines ~316–390 region).

## Outcome
Deck, Imagine, and Legends prompt bars will visually match the screenshot: same shell, same `+` + Tools pill on the left, same Send icon on the right, and the attach popup will expand **downward** when the `+` button is clicked.
