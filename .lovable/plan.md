

## Add Multi-Model Support & Image Editing to Sorix Imagine

### Overview
Add a model selector to Sorix Imagine so users can pick from 5 image generation models (including the existing Flux one). Also enable image editing — users can upload an image and describe changes, and the selected model will modify it.

### Models

| Model ID | Display Name | Plan Restriction |
|---|---|---|
| `black-forest-labs/flux.2-klein-4b` | Flux AI (existing default) | All plans |
| `google/gemini-2.5-flash-image` | Nano Banana | All plans |
| `google/gemini-3.1-flash-image-preview` | Nano Banana 2 | All plans |
| `google/gemini-3-pro-image-preview` | Nano Banana Pro | Pro & Premium only |
| `openai/gpt-5-image-mini` | GPT-5 Image | All plans |

### Changes

**1. New component: `src/components/imagine/ImagineModelSelector.tsx`**
- Horizontal scrollable chip selector (same style as ImagineStyleCarousel)
- Each chip shows model display name with a small icon/emoji
- "Nano Banana Pro" chip shows a lock icon for free/basic users
- Selecting a locked model triggers the upgrade modal
- Default selection: Flux AI

**2. Update `src/pages/ImaginePage.tsx`**
- Add `selectedModel` state
- Pass `selectedModel` to `handleGenerate` and to the API call
- Add `ImagineModelSelector` between the prompt bar and style carousel
- Pass `showUpgrade` handler for locked models

**3. Update `src/services/imagineApi.ts`**
- Add `model` parameter to `generateImage(prompt, style, model, imageData?)`
- Add `imageData` parameter for image editing (base64 string from uploaded image attachment)
- Send both to the edge function

**4. Update `supabase/functions/imagine/index.ts`**
- Accept `model` field from request body (default: `black-forest-labs/flux.2-klein-4b`)
- Validate model is in the allowed list
- For Gemini/GPT models, construct the message differently:
  - Text-only generation: `[{ role: "user", content: finalPrompt }]`
  - Image editing (when `imageData` is provided): multimodal message with both the image (as `image_url` content part) and the text prompt
- For Gemini image models, add `modalities: ["text", "image"]` instead of just `["image"]`
- Extract image URL from response — handle different response formats per model family:
  - Flux: `message.images[0].image_url.url` or content array
  - Gemini: content array with `image_url` type part, or inline `data:image` in content parts
  - GPT: same content array format
- Validate plan access for `google/gemini-3-pro-image-preview` (pro/premium only)
- Save the `model` used to the `image_generations` table

**5. Update `src/components/imagine/ImaginePromptBar.tsx`**
- Already supports attachments (images) — no changes needed
- The existing `onGenerate(prompt, attachments)` signature already passes image attachments

**6. Update `src/pages/ImaginePage.tsx` `handleGenerate`**
- Extract first image attachment's base64 data URL if present
- Pass it as `imageData` to `imagineApi.generateImage`

**7. Database migration**
- Add `model` column to `image_generations` table:
  ```sql
  ALTER TABLE image_generations ADD COLUMN model text DEFAULT 'black-forest-labs/flux.2-klein-4b';
  ```

### Technical Details

- The OpenRouter API uses the same `/chat/completions` endpoint for all models — only the `model` field changes
- For image editing, the user message becomes multimodal: `[{ type: "image_url", image_url: { url: "data:image/..." } }, { type: "text", text: "change the sky to sunset" }]`
- Gemini image models require `modalities: ["text", "image"]` in the request body
- Plan validation for Nano Banana Pro happens both client-side (lock icon) and server-side (edge function rejects if plan is free/basic)
- Token cost remains 12,000 per image regardless of model

