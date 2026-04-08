

## Make FlowBuilder Prompt Bar Expandable Like Main Chat Box

### Problem
The FlowBuilder prompt bar uses a single-line `<input type="text">` that cannot expand for multi-line input. The user wants it to behave like the main chat box with an auto-expanding textarea.

### Changes

**`src/components/flowbuilder/FlowPromptBar.tsx`**

1. Replace `<input type="text">` with `TextareaAutosize` (already installed as `react-textarea-autosize`)
2. Set `minRows={1}` and `maxRows={5}` to match main chat behavior
3. Add `onKeyDown` handler: Enter submits, Shift+Enter adds new line
4. Keep the same rounded-2xl styling and violet gradient send button
5. Add `resize-none` and `focus:outline-none` classes to match chat textarea styling

### Result
- Users can type multi-line prompts (e.g., detailed diagram descriptions)
- Enter sends, Shift+Enter adds a new line
- Bar auto-expands up to 5 rows, stays compact for short prompts
- Visual style remains consistent with the slim prompt bar aesthetic

