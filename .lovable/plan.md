

# Perplexity Model Protection and Per-Message Export Redesign

## Two Changes

---

## 1. Protect Perplexity Models from Routing Overrides

**Problem:** When a user selects a Perplexity model (Perplexity Sonar or Perplexity Research Pro), two things can override it:
- **Smart routing** downgrades it to a cheap worker model for "simple" queries (because multiplier > 1)
- **Attachment override** forces `openai/gpt-4o-mini` when files/images are attached

Both break web search functionality since only Perplexity models return citations and real-time data.

**Fix (2 files):**

### `src/hooks/useAIChat.ts`
- Add a check: if the selected model's backendId contains `perplexity` or `sonar`, skip smart routing entirely
- Also skip the attachment model override for perplexity models (keep the real perplexity backendId)

### `src/lib/smartRouting.ts`
- Add perplexity protection in `shouldApplySmartRouting()`: return `false` if the model backendId contains `perplexity` or `sonar`

---

## 2. Per-Message Export (Not Full Chat)

**Problem:** Currently the export button on each assistant message exports the ENTIRE conversation. The user wants to export only that specific assistant answer, with a clean design matching the reference image (title, formatted content with headings, code blocks, citation links at bottom).

### Design (matching the reference image):
- **Title**: The model name + timestamp at the top
- **Content body**: The assistant's answer with proper formatting -- headings bold, code blocks in monospace with background, bullet points, etc.
- **Citations**: If the message has citations, list them at the bottom as numbered links
- Clean, readable document styling across all export formats (PDF, Markdown, DOCX, ZIP)

### Changes:

### `src/components/aichat/ExportDropdown.tsx`
- Change the prop from `messages: Message[]` to `message: Message` (single message)
- Update all export calls to pass a single message instead of an array

### `src/components/aichat/MessageBubble.tsx`
- Change line 364 from `<ExportDropdown messages={currentMessages} theme={theme} />` to `<ExportDropdown message={message} theme={theme} />`
- This also fixes the performance issue where every MessageBubble subscribed to all chats just for the export

### `src/lib/exportUtils.ts` (major rewrite of export formatting)
- All functions now accept a single `Message` instead of `Message[]`
- **PDF**: Clean document with model name as header, formatted body text with proper paragraph spacing, code blocks in Consolas font with light gray background, and citations listed at the bottom with numbered links
- **Markdown**: Model name header, full markdown content preserved as-is (since it's already markdown), citations as numbered links
- **DOCX**: Model name header (bold, large), body paragraphs with proper formatting, code blocks in Consolas, citations section at bottom
- **ZIP**: Contains all three formats plus a plain text version of the single answer

### File naming changes:
- From: `conversation-2026-02-22.pdf`
- To: `sorix-answer-2026-02-22.pdf`

---

## Technical Details

### Perplexity Protection in `useAIChat.ts` (around lines 138-144):
```typescript
// Check if model is perplexity/search - never override these
const isPerplexityModel = activeBackendId.includes('perplexity') || activeBackendId.includes('sonar');

// Smart routing: skip for perplexity
if (!isPerplexityModel && activeMultiplier > 1 && shouldApplySmartRouting(...)) {
  // downgrade...
}

// Attachment override: skip for perplexity
const backendModel = (hasAttachments && !isPerplexityModel) ? 'openai/gpt-4o-mini' : activeBackendId;
```

### Export PDF Design (matching reference image):
- Title section: Model name in 14pt bold, timestamp in 9pt gray
- Body: 11pt text, 1.5x line spacing, proper paragraph breaks
- Code blocks: Consolas font, light gray background rectangle, slightly indented
- Citations footer: "Sources" heading, numbered list of URLs
- Page numbers at bottom right

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useAIChat.ts` | Add perplexity model protection (skip smart routing + skip attachment override) |
| `src/lib/smartRouting.ts` | Add perplexity check in `shouldApplySmartRouting` |
| `src/components/aichat/ExportDropdown.tsx` | Change prop from `messages[]` to single `message` |
| `src/components/aichat/MessageBubble.tsx` | Pass `message` instead of `currentMessages` to ExportDropdown |
| `src/lib/exportUtils.ts` | Rewrite all export functions for single-message with clean formatting (title, code blocks, citations) |

**No files deleted. No existing features removed.**

