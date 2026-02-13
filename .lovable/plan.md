
# Fix Smart Auto to Only Use Models From User's Available Model List

## Problem
Smart Auto hardcodes `BEST_MODELS` in `smartRouting.ts` with specific backend IDs (e.g., `anthropic/claude-sonnet-4.5` for premium, `openai/gpt-5.1` for pro). These may not match actual model definitions in the store, causing the AI to identify itself with a wrong model name.

## Solution
Update `resolveSmartAutoModel` to dynamically pick the best model from the user's actual available models defined in `chatStore.ts`, instead of using a hardcoded lookup table.

## Changes

### `src/lib/smartRouting.ts`
- Remove the hardcoded `BEST_MODELS` map entirely
- Update `resolveSmartAutoModel` to accept the user's available `Model[]` array as a parameter
- For **simple queries**: pick the cheapest 1x model from user's available models (same as current worker logic)
- For **complex queries**: pick the model with the highest multiplier from user's available models (excluding `smart-auto` itself)
- This guarantees Smart Auto only ever routes to models the user actually has access to

### `src/hooks/useAIChat.ts`
- Update the call to `resolveSmartAutoModel` to pass the user's available models from the store (via `getAvailableModels()` or by filtering `models` by plan)

### `src/components/aichat/MultiWindowChat.tsx`
- If Smart Auto logic is used here, update similarly to pass available models

## Technical Detail
The new `resolveSmartAutoModel` signature:
```typescript
resolveSmartAutoModel(
  plan: UserPlan,
  prompt: string,
  availableModels: Model[],
  conversationHistory?: ...
): { backendId: string; modelId: string; multiplier: number }
```

For complex queries, it sorts available models by multiplier descending and picks the first one. For simple queries, it picks the first 1x multiplier model.
