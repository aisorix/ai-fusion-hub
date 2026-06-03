
## Part 1 — Hero CTA Reorder & Restyle

In `src/components/Hero.jsx`:
- Move the `SorixLab Project` button to the **right** of `View Pricing` (order: Start Free Trial → View Pricing → SorixLab Project).
- Restyle to match the existing outlined CTA family (same pill, border, padding, height, font weight as `View Pricing`) instead of the current primary-tinted variant. Keep the FlaskConical icon for identity.

## Part 2 — New Tool: Sorix Cineshoot (text/image/video → video)

Build a full text/image/video-to-video generator using the **Imagine tool's exact layout, motion, history, templates, and "Your Creations" tabs** — re-skinned for video.

### Routes & Navigation
- New page `/cineshoot` (lazy-loaded in `src/App.jsx`).
- Add Cineshoot card to `ToolsPage.tsx` and a link in Navbar's Tools menu.
- Sitemap entry.

### File Structure (mirrors `src/components/imagine/`)
```
src/pages/CineshootPage.tsx
src/components/cineshoot/
  CineshootPromptBar.tsx           // textarea + attach image/video + generate
  CineshootModelSelector.tsx       // 11 models, tier-gated badges
  CineshootOptionsPanel.tsx        // Aspect Ratio / Duration / Resolution / Sound
  CineshootCanvas.tsx              // <video> player with loading shimmer
  CineshootActions.tsx             // Download (MP4) / Share / Copy link
  CineshootHistoryFeed.tsx         // grid of past clips w/ hover preview
  CineshootTemplates.tsx           // curated prompts (cinematic, anime, product, etc.)
  CineshootExplorer.tsx            // Templates | Your Creations tabs
  index.tsx
src/services/cineshootApi.ts
supabase/functions/cineshoot/index.ts
```

### Model Catalog (OpenRouter, existing `OPENROUTER_API_KEY`)

| Model ID | Display | Min tier | Max res | Durations |
|---|---|---|---|---|
| `x-ai/grok-imagine-video` | Grok Imagine Video | basic | 720p | 4–10s |
| `kwaivgi/kling-video-o1` | Kling Video O1 | basic | 1080p | 5,10s |
| `kwaivgi/kling-v3.0-std` | Kling v3.0 Standard | pro | 1080p | 4–15s |
| `kwaivgi/kling-v3.0-pro` | Kling v3.0 Pro | premium | 1080p | 4–15s |
| `bytedance/seedance-2.0-fast` | Seedance 2.0 Fast | basic | 1080p | 4–12s |
| `bytedance/seedance-2.0` | Seedance 2.0 | basic | 1080p | 4–12s |
| `bytedance/seedance-1-5-pro` | Seedance 1.5 Pro | pro | 1080p | 4–12s |
| `google/veo-3.1-lite` | Veo 3.1 Lite | basic | 1080p | 4–8s |
| `google/veo-3.1-fast` | Veo 3.1 Fast | basic | 1080p | 4–10s |
| `google/veo-3.1` | Veo 3.1 | pro | 4K | 4–10s |
| `openai/sora-2-pro` | Sora 2 Pro | pro | 4K | 4–12s |
| `minimax/hailuo-2.3` | Hailuo 2.3 | basic | 1080p | 4–10s |

OptionsPanel dynamically filters Resolution (720p/1080p/2K/4K) and Duration (4–15s) based on selected model's `caps`. Aspect Ratio: 16:9, 9:16, 1:1 (same UX as Imagine). Include Sound toggle for models that support audio (Veo/Sora/Seedance/Kling).

### Pricing & Token Charge (2× markup)
Per-second USD base cost lives in a `MODEL_PRICING` map (matches the list above). Charge formula:
```
tokensToCharge = ceil(basePerSecondUSD * durationSec * 2 * TOKEN_PER_USD)
```
A live cost chip in the prompt bar shows **"~N tokens"** as user changes model/duration/resolution (same component as Imagine's token estimate). 4K applies 1.5×, 2K 1.25× multiplier. Pro/Premium models stay tier-gated.

### Edge Function `cineshoot/index.ts`
- JWT-verified, CORS, Zod body validation (`prompt`, `model`, `durationSec`, `aspectRatio`, `resolution`, `sound`, optional `imageDataUrl`, optional `videoUrl`).
- Server re-validates pricing + tier + token balance; deducts via existing `useSubscription` RPC pattern.
- Calls OpenRouter video endpoint with the model id; polls job until `completed`, returns final `videoUrl`.
- Inserts row into new `video_generations` table (mirror of `image_generations` schema) — **DB migration with GRANTs + RLS** (owner-only SELECT/INSERT/DELETE, service_role ALL).

### UI Parity with Imagine
- Same `framer-motion` stagger entrance, same rounded-2xl glass cards, same explorer tabs, same hover-zoom history grid (but `<video muted loop>` on hover).
- Mobile: same `h-[100dvh]`, fixed z-index, horizontal scroll for model chips.
- Auto-focus via `useAutoFocusInput`. Sonner toasts suppressed for routine info per project rules.
- Empty state, skeleton loaders, and error states all mirror Imagine.

### Templates (10 seed entries)
"Cinematic product shot", "Anime fight scene", "Drone over mountains", "Slow-mo coffee pour", "Cyberpunk street", "Studio Ghibli forest", "Lo-fi study room", "Sci-fi spaceship interior", "Vintage VHS commercial", "Macro nature shot" — each with default model/aspect/duration/resolution.

### Out of Scope
- No translations beyond reusing existing keys / inline EN/BN ternaries for primary labels.
- No payment changes (uses existing token deduction).
- No realtime job streaming UI beyond the polling spinner already used in Imagine for slow generations.

### Files Created
12 new files (page, 9 components, service, edge function) + 1 migration + asset thumbnails for templates.

### Files Edited
`src/components/Hero.jsx`, `src/App.jsx`, `src/components/Navbar.jsx`, `src/pages/ToolsPage.tsx`, `public/sitemap.xml`.
