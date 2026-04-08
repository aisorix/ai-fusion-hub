

## Use Selected Model for Image/File Attachments Instead of Forcing GPT-4o-mini

### Problem
Currently, when a user sends an image or file attachment in both single chat and multi-window chat, the system **overrides** the user's selected model and forces `openai/gpt-4o-mini`. The user wants messages with attachments to be answered by whichever model they selected (or Smart Auto's resolved model).

Additionally, Basic plan users should only use Basic-tier models (this is already enforced by `getModelsForPlan` — no changes needed there).

### Changes

**`src/hooks/useAIChat.ts`** (lines 241-245)
- Remove the forced override that sets `backendModel = 'openai/gpt-4o-mini'` when attachments are present
- Remove the forced `finalMultiplier = 1` override for attachments
- Keep the user's selected model and multiplier for all messages, with or without attachments
- The backend (edge function) already forwards the model to OpenRouter, which handles multimodal support per model

**`src/components/aichat/MultiWindowChat.tsx`** (lines 177-180)
- Same fix: remove the `hasAttachments ? "openai/gpt-4o-mini"` override
- Use `model?.backendId` directly regardless of attachments
- Keep the model's actual multiplier instead of forcing `1`

### What stays the same
- Smart Auto routing logic (unchanged)
- Smart routing downgrade for simple queries on premium models (unchanged)
- Perplexity/Sonar model protection (unchanged)
- Plan-based model filtering (already works correctly — Basic users only see Basic models)
- Token usage tracking and daily limits (unchanged)

