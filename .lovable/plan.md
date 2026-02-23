

# Five Fixes: Remove Model, Thinking Preview, Stop Button, Duplicate Response Bug, and Faster Routing

## Overview
Five changes addressing: removing Perplexity Research Pro from model selectors, adding a "Show thinking" collapsible during streaming, fixing the stop button to discard incomplete responses, fixing the duplicate response bug, and optimizing routing for faster paid model responses.

---

## 1. Remove Perplexity Research Pro from Model Selectors

**Problem:** User wants to remove the "Perplexity Research Pro" model from both main chat and multi-window model selectors.

**Fix:** Remove the model entry from the `premiumModels` array in `src/stores/chatStore.ts`.

**File: `src/stores/chatStore.ts`** (line 240)
- Delete the line: `{ id: 'perplexity-research-pro', name: 'Perplexity Research Pro', backendId: 'perplexity/sonar-deep-research', ... }`
- This automatically removes it from both ModelSelector and WindowModelSelector since they both read from the same `models` array in the store.

---

## 2. Add "Show Thinking" Collapsible During Streaming

**Problem:** Currently, when the AI is thinking (streaming with no content yet), it just shows "Thinking 4.4s". User wants a collapsible "Show thinking" button (like the reference image) that reveals a live thinking title/summary.

**Fix:** Replace the current "Thinking" badge with a collapsible section. While the model is thinking (streaming, no content yet), display a "Show thinking" button with a chevron. When expanded, show a brief thinking indicator text. Once content starts streaming, switch to "Writing" badge as before.

**File: `src/components/aichat/MessageBubble.tsx`**
- Replace the `ThinkingTimer` component and the thinking/writing badge section (lines 30-55, 238-252) with a new `ThinkingSection` component that:
  - Shows a dark rounded pill with "Show thinking" text and a dropdown chevron (matching the reference image)
  - Clicking it expands to show a brief "Analyzing your query..." or similar thinking indicator with elapsed time
  - Collapses back when clicked again
  - Timer still shows elapsed time

**File: `src/components/aichat/MultiWindowChat.tsx`** (lines 567-571)
- Apply the same "Show thinking" pattern to multi-window chat's thinking indicator

---

## 3. Stop Button Discards Incomplete Response

**Problem:** When user stops a streaming response, the incomplete content remains in the chat and gets included in context for the next message. User wants stopped responses to be fully discarded.

**Fix (2 files):**

**File: `src/hooks/useAIChat.ts`** (lines 367-373)
- Update `stopStreaming` to not only abort the controller but also remove the last (incomplete) assistant message from the chat using `setMessages`

**File: `src/components/aichat/ChatInput.tsx`** (lines 682-683)
- The stop button currently does nothing (`onClick={isStreaming ? () => {} : handleSend}`). Wire it to actually call `stopStreaming` from the useAIChat hook. This requires passing an `onStop` callback prop from ChatArea.

**File: `src/components/aichat/ChatArea.tsx`**
- Pass `stopStreaming` from useAIChat to ChatInput as an `onStop` prop

**File: `src/components/aichat/MultiWindowChat.tsx`**
- The `stopAllStreaming` function already aborts controllers. Add logic to also remove the last incomplete assistant messages from each window.

---

## 4. Fix Duplicate Response Bug

**Problem:** When sending a second message, the AI sometimes repeats the previous answer alongside the new one. Root cause: In `useAIChat.ts` line 222-224, `apiMessages` is built as `contextMessages.slice(0, -1)` which drops the last assistant response from context. This means the AI sees the previous user question WITHOUT its answer, causing it to re-answer the old question along with the new one.

**Fix:**

**File: `src/hooks/useAIChat.ts`** (lines 182-226)
- Change the context building logic:
  - Remove the `slice(0, -1)` that incorrectly drops the last message
  - Build `apiMessages` as: full `contextMessages` (previous conversation) + new user message
  - This ensures the AI sees the complete conversation history including all previous answers

Before:
```
apiMessages = [...contextMessages.slice(0, -1), { role: 'user', content: userText }]
```

After:
```
apiMessages = [...contextMessages, { role: 'user', content: userText }]
```

---

## 5. Faster Paid Model Response (Reduce Routing Overhead)

**Problem:** Paid models feel slow. Smart routing adds latency by analyzing query complexity before sending.

**Fix:**

**File: `src/lib/smartRouting.ts`**
- Only apply smart routing for models with multiplier >= 3 (instead of > 1). This means models like Gemini 3 Flash (1.5x) skip routing entirely and send immediately
- Simplify the complexity check to be faster: reduce regex operations and keyword matching

**File: `src/hooks/useAIChat.ts`**
- Change the smart routing threshold from `activeMultiplier > 1` to `activeMultiplier >= 3` so lower-tier paid models (1x and 1.5x) bypass routing entirely for faster response

---

## Technical Details

### Thinking Section UI (matching reference image)
```
-- Dark rounded pill button --
[Show thinking v]  (collapsed)

-- When expanded --
[Hide thinking ^]
  Analyzing your query... 4.4s
```
- Uses a `ChevronDown` icon that rotates when expanded
- Dark background pill matching the reference screenshot style
- Elapsed timer continues running inside the expanded section

### Stop Button Wiring
```
ChatArea passes onStop={stopStreaming} to ChatInput
ChatInput onClick={isStreaming ? onStop : handleSend}
stopStreaming removes the last assistant message + last user message from messages
```

### Context Fix (duplicate bug)
The `currentMessages` variable (line 124) captures messages BEFORE `addMessage` is called. So `contextMessages` already excludes the new user message. The `slice(0, -1)` was incorrectly removing the previous assistant response, confusing the AI into re-answering old questions.

### Files Modified

| File | Change |
|------|--------|
| `src/stores/chatStore.ts` | Remove Perplexity Research Pro model definition |
| `src/components/aichat/MessageBubble.tsx` | Replace thinking badge with collapsible "Show thinking" section |
| `src/components/aichat/MultiWindowChat.tsx` | Add "Show thinking" to multi-window; discard messages on stop |
| `src/hooks/useAIChat.ts` | Fix context `slice(0,-1)` bug; update stopStreaming to discard; change routing threshold |
| `src/lib/smartRouting.ts` | Raise routing threshold to multiplier >= 3 |
| `src/components/aichat/ChatInput.tsx` | Wire stop button to onStop callback |
| `src/components/aichat/ChatArea.tsx` | Pass stopStreaming to ChatInput |

**No files deleted. No existing features removed (except Perplexity Research Pro model as requested).**

