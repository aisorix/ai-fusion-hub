

# Add Timers, Fix AI Repeat Answers, and Optimize Long Chat Performance

**Important: Nothing existing will be removed. All current code stays exactly as it is. Only new code will be added.**

## 1. Add Elapsed Timer to Agro, Health, and Imagine Pages

### What's added:
- A reusable `AnalysisTimer` component (new file: `src/components/shared/AnalysisTimer.tsx`)
- Shows elapsed seconds (e.g., "12.3s") during analysis/generation

### Where it appears:
- **AgroPage.tsx**: Timer shown next to the loading spinner inside `AgroIntakeForm` while `isAnalyzing` is true
- **HealthPage.tsx**: Same timer shown during health analysis while `isAnalyzing` is true  
- **ImagineCanvas.tsx**: Timer added below "Creating your image..." text while `isGenerating` is true

The timer component mirrors the existing `ThinkingTimer` pattern already used in `MessageBubble.tsx`.

## 2. Fix AI Repeating Answers for Simple Acknowledgments (e.g., "thanks", "ok")

### What's added:
- A new paragraph added to the **existing** system prompt in `supabase/functions/chat/index.ts`:

```
IMPORTANT: When the user sends a simple acknowledgment like "thanks", "thank you", 
"ok", "bye", "got it", "nice", "great", "cool", etc., respond briefly and naturally 
(1-2 sentences max). Do NOT repeat, re-explain, or re-generate your previous answer. 
Just acknowledge their message concisely and ask if they need anything else.
```

This is appended to the existing `getSystemPrompt` function. Nothing else in the edge function changes.

## 3. Optimize `updateLastMessage` in Chat Store (Performance)

### What's changed (keeps all existing logic, just optimizes the inner implementation):
- **`src/stores/chatStore.ts`** - The `updateLastMessage` function currently maps over ALL chats on every streaming chunk. The optimization changes it to only create a new reference for the active chat using `findIndex` + direct array splice, instead of `.map()` over every chat. The function signature and behavior remain identical.

Current:
```typescript
updateLastMessage: (content) => set((state) => ({
  chats: state.chats.map(c => {
    if (c.id !== state.activeChatId) return c;
    // ...
  })
}))
```

Optimized (same result, less work):
```typescript
updateLastMessage: (content) => set((state) => {
  const idx = state.chats.findIndex(c => c.id === state.activeChatId);
  if (idx === -1) return state;
  const chat = state.chats[idx];
  const newMessages = [...chat.messages];
  if (newMessages.length > 0) {
    const last = newMessages[newMessages.length - 1];
    newMessages[newMessages.length - 1] = { ...last, content: last.content + content };
  }
  const newChats = [...state.chats];
  newChats[idx] = { ...chat, messages: newMessages, updatedAt: new Date().toISOString() };
  return { chats: newChats };
})
```

## 4. Memoize Sidebar Chat Lists (Performance)

### What's added:
- Wrap `filteredChats`, `todayChats`, `thisWeekChats`, `olderChats` computations in `useMemo` in `ChatSidebar.tsx`
- This prevents recalculating these lists on every re-render during streaming

Nothing is removed from the sidebar. The same data, same UI, same behavior -- just wrapped in `useMemo`.

## 5. Memoize MessageList Messages (Performance)

### What's added:
- Wrap the `messages` derivation in `MessageList.tsx` with `useMemo` so it doesn't recompute on every render

## Files Modified (additions only)

| File | Change |
|------|--------|
| `src/components/shared/AnalysisTimer.tsx` | **NEW** - Reusable timer component |
| `src/pages/AgroPage.tsx` | Add timer prop pass-through to intake form |
| `src/pages/HealthPage.tsx` | Add timer prop pass-through to intake form |
| `src/components/imagine/ImagineCanvas.tsx` | Add timer below "Creating..." text |
| `supabase/functions/chat/index.ts` | Add acknowledgment instruction to system prompt |
| `src/stores/chatStore.ts` | Optimize `updateLastMessage` inner logic |
| `src/components/aichat/ChatSidebar.tsx` | Add `useMemo` wraps |
| `src/components/aichat/MessageList.tsx` | Add `useMemo` wrap |

**No files deleted. No existing code removed. All existing features preserved.**

