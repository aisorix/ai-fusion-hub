# Add Image/File Paste Support to All Tool Prompt Bars

## Problem
Only the main chat input (`ChatInput.tsx`) supports pasting images/files from the clipboard. The tool prompt bars (Imagine, Cineshoot, Deck, FlowBuilder, Legends chat) don't accept pasted images — users have to click the attach button.

## Fix
Add an `onPaste` handler to the textarea in each tool prompt bar. Each of these components already has a `processFiles(files: File[])` helper used by the file-input button — the paste handler just needs to extract `File` objects from `e.clipboardData.items` and pass them to that same helper (so existing size limits, image/doc parsing, attachment previews, and toasts all "just work").

## Files to update
1. `src/components/imagine/ImaginePromptBar.tsx`
2. `src/components/cineshoot/CineshootPromptBar.tsx`
3. `src/components/deck/DeckPromptBar.tsx`
4. `src/components/flowbuilder/FlowPromptBar.tsx`
5. `src/components/legends/LegendChat.tsx`

## Handler (mirrors main chat behavior)
```ts
const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
  const items = Array.from(e.clipboardData?.items || []);
  const files: File[] = [];
  for (const item of items) {
    if (item.kind === 'file') {
      const f = item.getAsFile();
      if (f) files.push(f);
    }
  }
  if (files.length) {
    e.preventDefault();
    await processFiles(files);
  }
};
```
Attach via `onPaste={handlePaste}` on the existing textarea. Plain text paste is untouched (default browser behavior).

## Notes
- No backend, no token-logic, no UI restyle changes — purely adds the paste capability.
- Respects each tool's existing file-size limit and accepted-file logic via `processFiles`.
- Works on desktop (Cmd/Ctrl+V) and mobile clipboard paste.
