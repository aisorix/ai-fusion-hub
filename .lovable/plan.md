

# Preserve Perplexity Model — Never Override with Another Model

## Problem
When a user selects a Perplexity model (Perplexity Sonar or Perplexity Research Pro), three places in the code can override it with a different model, which kills the web search and citations functionality:

1. **`src/hooks/useAIChat.ts` line 240**: Attachments force `gpt-4o-mini`
2. **`src/hooks/useAIChat.ts` line 139**: Smart routing downgrades to worker model
3. **`src/components/aichat/MultiWindowChat.tsx` line 171**: Attachments force `gpt-4o-mini`
4. **`src/components/aichat/MultiWindowChat.tsx` line 178**: Smart routing downgrades
5. **`supabase/functions/chat/index.ts` line 152**: Edge function overrides to `gpt-4o-mini`

## Fix

Add a simple Perplexity/sonar check before each override. If the selected model is a Perplexity model, skip the override entirely.

### Files Modified

| File | Change |
|------|--------|
| `src/hooks/useAIChat.ts` | Skip attachment override and smart routing when model is Perplexity |
| `src/components/aichat/MultiWindowChat.tsx` | Skip attachment override and smart routing when model is Perplexity |
| `supabase/functions/chat/index.ts` | Skip attachment override when model is Perplexity |

### What Changes (nothing removed, only guards added)

**useAIChat.ts (line ~139):**
```typescript
// Add check: never downgrade Perplexity models
const isSearchModel = activeBackendId.includes('perplexity') || activeBackendId.includes('sonar');
if (!isSearchModel && activeMultiplier > 1 && shouldApplySmartRouting(...)) {
```

**useAIChat.ts (line ~240):**
```typescript
// Never override Perplexity with attachment model
const isSearchModel = activeBackendId.includes('perplexity') || activeBackendId.includes('sonar');
const backendModel = (hasAttachments && !isSearchModel) ? 'openai/gpt-4o-mini' : activeBackendId;
const finalMultiplier = (hasAttachments && !isSearchModel) ? 1 : activeMultiplier;
```

**MultiWindowChat.tsx (line ~171):**
```typescript
const isSearchModel = model?.backendId?.includes('perplexity') || model?.backendId?.includes('sonar');
let backendModel = (hasAttachments && !isSearchModel) ? "openai/gpt-4o-mini" : model?.backendId || "openai/gpt-4o-mini";
let multiplier = (hasAttachments && !isSearchModel) ? 1 : (model?.multiplier || 1);

// Smart routing: skip for search models
if (!isSearchModel && !hasAttachments && multiplier > 1) {
```

**chat/index.ts (line ~152):**
```typescript
const isSearchModel = selectedModel.includes('perplexity') || selectedModel.includes('sonar');
if (!isSearchModel && (hasImages || hasFiles)) {
  selectedModel = ATTACHMENT_MODEL;
}
```

All existing code stays exactly as-is. Only guard conditions are added to protect Perplexity models from being overridden.
