

## Match Imagine Prompt Bar to Deck Prompt Bar Size

### Problem
The Imagine prompt bar uses `TextareaAutosize` with `items-end` alignment and larger padding/send button, making it taller than the Deck bar. The user wants the same compact, single-line look as the Deck prompt bar.

### Changes

**`src/components/imagine/ImaginePromptBar.tsx`**

1. **Line 123**: Replace the gradient glow wrapper with the Deck-style subtle glow:
   - `p-px rounded-2xl bg-gradient-to-r from-primary/40 via-pink-500/20 to-primary/40 shadow-lg shadow-primary/5` → Deck-style: `relative group` with an absolute `-inset-0.5` gradient blur behind

2. **Line 124**: Change inner container from `items-end` to `items-center` (like Deck):
   - `relative flex items-end gap-2 rounded-2xl` → `relative flex items-center gap-2 bg-card border border-border rounded-2xl px-2 py-3`

3. **Line 125**: Remove the extra inner `div` wrapper — flatten to match Deck's single-row layout

4. **Lines 180-188**: Replace `TextareaAutosize` with a simple `<input type="text">` (like Deck) for a single-line compact bar

5. **Lines 190-201**: Replace the square icon send button (`w-10 h-10`) with a Deck-style send icon button (`w-8 h-8 rounded-xl`)

6. **Line 179**: Remove `mb-1` from the Wand2 icon, align with `items-center`

This makes the Imagine bar visually identical in height/style to the Deck bar while keeping its unique wand icon and send button.

