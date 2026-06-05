## What's wrong

1. **404 on every model.** The Cineshoot edge function calls OpenRouter's `/chat/completions` with `modalities: ['text','video']`. OpenRouter returns `"No endpoints found that support the requested output modalities: text, video"` for all video models. OpenRouter video models are NOT served via chat completions — they have a dedicated async API at `POST /api/v1/videos`.

2. **Duplicate Film icon in the Cineshoot header.** The page shows the rose→violet gradient square + Film icon next to the title, which feels redundant.

3. **Sidebar missing the Cineshoot entry** under "Sorix Agent".

## Plan

### 1. Rewrite `supabase/functions/cineshoot/index.ts` to use OpenRouter's async Video API

Keep auth, pricing, token-deduction, plan-tier checks, and DB persistence exactly as-is. Replace only the OpenRouter call with the correct flow:

- **Submit job:** `POST https://openrouter.ai/api/v1/videos`
  - Body: `{ model, prompt, duration, resolution, aspect_ratio, generate_audio, frame_images? }`
  - For image-to-video, pass the uploaded image as:
    ```
    frame_images: [{ type: 'image_url', image_url: { url: imageData }, frame_type: 'first_frame' }]
    ```
- **Poll** the returned `polling_url` every 5s, up to ~140s (well under Supabase edge timeout). Statuses: `pending` / `in_progress` / `completed` / `failed`.
- On `completed`, take `unsigned_urls[0]` (or `signed_urls[0]` if present) as `videoUrl` and continue with existing persistence + token logic.
- On `failed` or timeout, return a clear error and **do not** deduct tokens.
- Keep the existing model whitelist (`x-ai/grok-imagine-video`, `kwaivgi/kling-*`, `bytedance/seedance-*`, `google/veo-3.1*`, `openai/sora-2-pro`, `minimax/hailuo-2.3`).
- Drop `modalities` and the chat-style `messages` array entirely.

Note: the OpenRouter video API may not list every model the user wants today (e.g. `x-ai/grok-imagine-video` may not be in `/api/v1/videos/models`). For any model OpenRouter rejects, surface the actual error message back to the UI instead of a generic 404 — this lets you see which models are live without further code changes.

### 2. Clean up `src/pages/CineshootPage.tsx` header

Remove the small rose→violet gradient square with the `Film` icon next to the title; keep only the back arrow + "Sorix Cineshoot" / "AI Video Generation" text (matches the cleaner pattern the user wants).

### 3. Add Sorix Cineshoot to the chat sidebar

In `src/components/aichat/ChatSidebar.tsx`, add a new entry directly below the existing **Sorix Agent** row (around line 456) using the same row styling/spacing as Agent and More Tools. Use the `Clapperboard` lucide icon, label "Sorix Cineshoot", and route to `/cineshoot`. Mirror the same change in `src/components/aichat/MobileSidebar.tsx` if it has the matching list, so mobile parity holds.

### Files touched

- `supabase/functions/cineshoot/index.ts` — switch to async `/api/v1/videos` + polling
- `src/pages/CineshootPage.tsx` — remove duplicate Film icon from header
- `src/components/aichat/ChatSidebar.tsx` — add "Sorix Cineshoot" row under Sorix Agent
- `src/components/aichat/MobileSidebar.tsx` — same row for mobile (only if list exists there)

No DB migration, no new secrets — the existing `OPENROUTER_API_KEY` is reused.