

# Model System Overhaul: New Models, Multipliers, Daily Limits, and Smart Routing

## Overview
Complete rewrite of the model configuration and token calculation system to match the new pricing specification, add daily message limits for premium models, fix multi-window token calculation, and improve smart routing.

---

## 1. Rewrite Model Definitions (`src/stores/chatStore.ts`)

### New Model Architecture
Instead of duplicating models per plan, each model is defined ONCE with:
- The **minimum plan** required to access it
- A single multiplier value
- An optional `dailyLimit` map per plan (for rate-limited models)

### Add to `Model` interface:
```typescript
export interface Model {
  id: string;
  name: string;
  backendId: string;
  description: string;
  category: ModelCategory;
  plans: UserPlan[];       // All plans that can access this model
  multiplier: number;
  dailyLimit?: Partial<Record<UserPlan, number>>; // Optional daily msg limits per plan
  icon?: string;
}
```

### New Model List (Single Source of Truth):

**Free Tier (3 models):**
| Display Name | Backend ID | Multiplier |
|---|---|---|
| GPT-4o | openai/gpt-4o-mini | 1x |
| DeepSeek V3.1 | deepseek/deepseek-chat-v3.1 | 1x |
| Gemini 2.5 Flash | google/gemini-2.5-flash-lite | 1x |

**Basic Tier (12 models) -- also includes all Free models:**
| Display Name | Backend ID | Multiplier |
|---|---|---|
| GPT-5.1 mini | openai/gpt-5-mini | 1x |
| GPT-5 nano | openai/gpt-5-nano | 1x |
| Gemini 3 Flash | google/gemini-3-flash-preview | 1.5x |
| Gemini 3 | google/gemini-3-flash-preview | 1.5x |
| Grok 4 | x-ai/grok-3-mini | 1x |
| Grok 4 Fast | x-ai/grok-4-fast | 1x |
| DeepSeek V3.1 | deepseek/deepseek-chat-v3.1 | 1x |
| DeepSeek V3.2 | deepseek/deepseek-v3.2 | 1x |
| LLaMA 3.1 | meta-llama/llama-3.1-70b-instruct | 1x |
| LLaMA 3.3 | meta-llama/llama-3.3-70b-instruct | 1x |
| Qwen 3 Coder | qwen/qwen3-coder | 1x |
| Qwen 3 VL | qwen/qwen3-vl-235b-a22b-instruct | 1x |

**Pro Tier (8 models) -- also includes all Free + Basic models:**
| Display Name | Backend ID | Multiplier | Daily Limit |
|---|---|---|---|
| Qwen 3 Pro | qwen/qwen3-235b-a22b-2507 | 1x | -- |
| GPT-5.1 | openai/gpt-5.1 | 4x | 20/day (pro), 20/day (premium) |
| GPT-5.2 (Limited) | openai/gpt-5.2 | 6.5x | 10/day (pro), 30/day (premium) |
| Gemini 2.5 Pro (Limited) | google/gemini-2.5-pro | 4x | 20/day (pro), 20/day (premium) |
| Grok 4.1 fast | x-ai/grok-4.1-fast | 1x | -- |
| Perplexity Sonar | perplexity/sonar | 3x | -- |
| Llama 4 Maverick | meta-llama/llama-4-maverick | 1x | -- |
| Llama 4 Scout | meta-llama/llama-4-scout | 1x | -- |

**Premium Tier (7 models) -- also includes all Free + Basic + Pro models:**
| Display Name | Backend ID | Multiplier | Daily Limit |
|---|---|---|---|
| Claude Sonnet 4.5 | anthropic/claude-sonnet-4.5 | 6x | 20/day |
| Claude Opus 4.5 | anthropic/claude-opus-4.5 | 10x | 10/day |
| GPT-5.2 | openai/gpt-5.2 | 6.5x | 30/day |
| Gemini 2.5 Pro | google/gemini-2.5-pro | 4x | 20/day |
| Perplexity Research Pro | perplexity/sonar-deep-research | 6x | -- |
| Kimi-K2.5 | moonshotai/kimi-k2.5 | 1x | -- |
| Mistral Large 3 | mistralai/mistral-large-2512 | 1x | -- |

### Plan Hierarchy Logic
Update `getModelsForPlan` to be cumulative:
- Free: only free models
- Basic: free + basic models
- Pro: free + basic + pro models
- Premium: all models

---

## 2. Add "Smart Auto" Model Option

Add a virtual "Smart Auto" model as the first option in the selector:
- ID: `smart-auto`
- Behavior: Analyzes the user's query complexity and routes to the best model within their plan
- Simple queries (greetings, factual QnA): Use a 1x model (GPT-4o for free, GPT-5 nano for paid)
- Complex queries: Use the highest-tier model available in the user's plan
- Token deduction follows the model actually used

---

## 3. Daily Message Limit Enforcement

### New State in Store
Add daily usage tracking:
```typescript
dailyModelUsage: Record<string, { count: number; date: string }>;
```

### Enforcement Logic
- Before sending a message, check if the model has a `dailyLimit` for the user's plan
- If daily limit is reached, show a toast and block the message
- Reset counter when the date changes
- Display remaining daily messages in the model selector UI

---

## 4. Fix Multi-Window Token Calculation (`src/components/aichat/MultiWindowChat.tsx`)

Currently the `updateTokenUsage` function in MultiWindowChat does NOT apply the model multiplier. Fix:
```typescript
const updateTokenUsage = (inputTokens, outputTokens, multiplier, modelName) => {
  const baseTokens = inputTokens + outputTokens;
  const totalTokens = Math.ceil(baseTokens * multiplier);
  // ... rest of logic
};
```

Also apply attachment model override (1x multiplier for file/image analysis) same as single chat.

---

## 5. Update Smart Routing (`src/lib/smartRouting.ts`)

- When "Smart Auto" is selected, route based on query complexity:
  - Simple: cheapest 1x model for the plan
  - Complex: best available model for the plan
- When a specific premium model is selected, still downgrade simple queries to 1x model
- Update `WORKER_MODEL_ID` to match plan: `openai/gpt-4o-mini` for free, `openai/gpt-5-nano` for paid

---

## 6. Update UI Components

### ModelSelector (`src/components/aichat/ModelSelector.tsx`)
- Add "Smart Auto" as first option with special styling (gradient/sparkle icon)
- Show daily limit badge (e.g., "10/day") next to rate-limited models
- Show remaining daily uses for limited models
- Update grouping logic for cumulative plan access

### WindowModelSelector (`src/components/aichat/WindowModelSelector.tsx`)
- Same updates as ModelSelector for consistency
- Show multiplier badges and daily limits

### EmptyState (`src/components/aichat/EmptyState.tsx`)
- No changes needed (uses current model from store)

---

## 7. Files to Modify

| File | Changes |
|---|---|
| `src/stores/chatStore.ts` | Rewrite model definitions, add dailyLimit, add dailyModelUsage state, update getModelsForPlan for hierarchy, add Smart Auto model, update default models |
| `src/lib/smartRouting.ts` | Update WORKER_MODEL_ID per plan, add Smart Auto routing logic |
| `src/hooks/useAIChat.ts` | Add daily limit check before sending, pass multiplier correctly, handle Smart Auto model selection |
| `src/components/aichat/MultiWindowChat.tsx` | Fix token calculation to include multiplier, add daily limit checks |
| `src/components/aichat/ModelSelector.tsx` | Add Smart Auto option, show daily limits, update grouping for cumulative access |
| `src/components/aichat/WindowModelSelector.tsx` | Same updates as ModelSelector |

---

## Technical Notes

- Models like GPT-5.2 and Gemini 2.5 Pro appear in both Pro and Premium tiers with different daily limits. These will have separate model entries (e.g., `gpt52-pro` with 10/day and `gpt52-premium` with 30/day) but share the same backend ID.
- The "Smart Auto" model won't have a real backend ID -- the routing logic determines which actual model to use at send time.
- Daily usage is tracked in Zustand persisted state and resets based on date comparison.
- All multiplier values are updated to exactly match the user's specification.

