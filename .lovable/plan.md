## Plan

### 1. Fix video playback (the black player)
The Cineshoot edge function currently returns the raw OpenRouter video URL, which requires auth headers — the browser `<video>` tag cannot play it (loads forever, no controls work).

**Fix:** After OpenRouter finishes rendering, the edge function will:
- Download the finished video server-side (with the OpenRouter auth header).
- Upload it to a public `cineshoot-videos` storage bucket.
- Return that public, browser-playable URL instead.

Videos will play instantly, support Download/Share/Copy, and stay available in history.

### 2. Restore the Cineshoot icon in the page header
Re-add the gradient Film icon badge to `CineshootPage.tsx` header (next to "Sorix Cineshoot / AI Video Generation"), matching the visual style of other tool pages (Sorix Imagine, Sorix Deck, etc.).

### 3. Apply the 7x token pricing (UI display + actual user charge)
Right now the UI shows ~16,800 per render but the backend charges a higher amount — they're out of sync. Both will be aligned to the new 7x pricing so the user is charged exactly what they see.

- **Frontend (`cineshootModels.ts`)**: change `MARKUP` from `2` → `14` so "per render" displays 117,600 for Grok Imagine 4s/720p and scales the same way for every other model (Veo, Sora, Kling, Seedance, Hailuo).
- **Backend (`cineshoot/index.ts`)**: keep `MARKUP = 14` (already set) — this is what actually deducts tokens from the user's subscription balance.

Result: every model's per-render cost displayed in the UI = exactly what's cut from the user's tokens.

### Files to edit
- `supabase/functions/cineshoot/index.ts` — download + upload video to storage bucket, return public URL
- `src/components/cineshoot/cineshootModels.ts` — MARKUP 2 → 14 (display)
- `src/pages/CineshootPage.tsx` — re-add Film icon badge in header
- Storage: ensure `cineshoot-videos` public bucket exists (already created earlier; verify)

No new secrets needed. Uses existing `OPENROUTER_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.