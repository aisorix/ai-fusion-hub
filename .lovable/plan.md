

# Ensure Perplexity Source Citations Display in Chat and Multi-Window

## Current Status

The citation infrastructure is **already fully built** across all layers:
- Edge function (`chat/index.ts`) detects Perplexity/sonar models and uses a transform stream to extract citations
- API service (`api.ts`) parses `citations` from SSE events and passes them to `onDone`
- Chat store has `setLastMessageCitations` and `setWindowLastMessageCitations`
- `MessageBubble` and `MultiWindowChat` both render `SourcesWidget` when citations exist
- `SourcesWidget` shows numbered source pills with favicons

## Potential Issue

The transform stream in the edge function may have a subtle bug: it splits raw bytes by `\n` per chunk, but an SSE citation event from OpenRouter could be split across multiple chunks, causing the JSON parse to fail silently and citations to be lost.

## Fix

### 1. Edge Function (`supabase/functions/chat/index.ts`) - Improve Citation Extraction

Replace the current transform stream with a more robust line-buffering approach that accumulates partial lines across chunks, ensuring citations are never lost due to chunk boundaries.

Add a `lineBuffer` variable in the transform stream to hold incomplete lines between chunks, similar to how `api.ts` already handles this with `textBuffer`.

### 2. No Changes Needed Elsewhere

Everything else is already correctly implemented:
- **Single Chat**: `MessageBubble.tsx` line 274 renders `SourcesWidget` when `message.citations` exists
- **Multi-Window Chat**: `MultiWindowChat.tsx` line 623 renders `SourcesWidget` when `message.citations` exists
- **Store**: `setLastMessageCitations` and `setWindowLastMessageCitations` both work correctly
- **API Service**: `api.ts` correctly extracts citations from SSE events

### Files Modified
| File | Change |
|------|--------|
| `supabase/functions/chat/index.ts` | Fix transform stream line buffering for reliable citation extraction |

Nothing existing is removed. Only the internal buffering logic of the transform stream is improved.

