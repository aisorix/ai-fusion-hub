

# Smart Cost Optimization: Model Routing + Response Caching for Premium Models

## Overview

When users select models with multiplier above 1x (e.g., 1.5x, 3x, 4x, 6x, 10x), apply two professional cost-saving strategies silently in the background:

1. **Smart Routing** (already partially exists): Downgrade simple queries to a 1x worker model -- already implemented but needs to be added to MultiWindowChat
2. **Response Caching**: Cache identical/similar queries to avoid duplicate API calls, especially useful in multi-window mode

All of this is completely invisible to the user -- no messages, no toasts, no badges.

---

## 1. Add Response Cache System (`src/lib/responseCache.ts` -- NEW FILE)

Create an in-memory LRU cache that stores recent responses keyed by a hash of the prompt + model backend ID:

- **Cache key**: hash of `(prompt + backendModelId)` -- so the same question to the same backend returns instantly
- **TTL**: 5 minutes (responses go stale after that)
- **Max entries**: 50 (evict oldest when full)
- **Only cache for multiplier > 1 models** -- no point caching 1x models since they're cheap
- **Skip cache for**: streaming still active, attachments present, health mode

```text
Cache Flow:
  User sends "hello" on Claude Sonnet 4.5 (6x)
  --> Smart routing detects simple query --> routes to gpt-5-nano (1x)
  --> No cache hit --> call API --> store response in cache

  User sends "hello" again on same model
  --> Smart routing --> gpt-5-nano
  --> Cache HIT --> return cached response instantly (no API call)
  --> Token deduction: 1x (worker model)

  User sends "hello" in multi-window on GPT-5.2 (6.5x)
  --> Smart routing --> gpt-5-nano (same backend)
  --> Cache HIT from previous call --> instant response
```

### Cache Structure:
```typescript
interface CacheEntry {
  response: string;
  citations?: string[];
  timestamp: number;
  inputTokens: number;
  outputTokens: number;
}

// Map<cacheKey, CacheEntry>
const cache = new Map();
```

---

## 2. Apply Smart Routing to MultiWindowChat (`src/components/aichat/MultiWindowChat.tsx`)

Currently, multi-window chat does NOT apply smart routing -- it always uses the selected model's backend directly. Fix this:

- Import `shouldApplySmartRouting` and `getWorkerModelForPlan` 
- Before each window's API call, check if the query is simple and the model is >1x
- If so, route to the worker model with 1x multiplier
- This saves significant cost when comparing premium models on simple queries

---

## 3. Integrate Cache into Main Chat (`src/hooks/useAIChat.ts`)

Before making an API call:
1. Generate cache key from `(finalPrompt + backendModel)`
2. Check cache -- if hit, use cached response instantly (simulate streaming by typing it out character by character for natural feel)
3. If miss, proceed with normal API call, then store response in cache
4. Only apply caching when resolved multiplier > 1 (no cache overhead for cheap models)

---

## 4. Integrate Cache into Multi-Window Chat (`src/components/aichat/MultiWindowChat.tsx`)

Same cache integration -- especially powerful here because:
- Multiple windows may route to the same backend model after smart routing
- Same prompt sent to all windows, so cache hits are very likely
- First window calls API, subsequent windows get cached response

---

## 5. Context-Aware Cache Keys

The cache key includes a hash of the last 3 conversation messages to ensure context-sensitive caching:
- `key = simpleHash(prompt + backendModel + last3MessagesHash)`
- This prevents returning "hello" responses for follow-up questions in an ongoing conversation

---

## Files to Create/Modify

| File | Action | Changes |
|---|---|---|
| `src/lib/responseCache.ts` | CREATE | LRU cache with TTL, hash function, get/set/clear methods |
| `src/hooks/useAIChat.ts` | MODIFY | Add cache check before API call, store response after API call |
| `src/components/aichat/MultiWindowChat.tsx` | MODIFY | Add smart routing + cache check before each window's API call |

---

## Technical Notes

- Cache is in-memory only (resets on page refresh) -- no persistence needed since it's a session optimization
- The "simulated streaming" for cached responses types out at ~50 chars per frame for a natural feel
- Smart routing in multi-window uses the same `shouldApplySmartRouting` logic from `smartRouting.ts`
- No new dependencies required -- pure TypeScript implementation
- Zero user-facing UI changes -- everything is silent backend optimization

