
## 1. Imagine — model pricing by tier

Replace the flat 12k/image cost with tier-based pricing. Each model gets a `tier: 'basic' | 'pro' | 'premium'` field; cost per image = 25k / 35k / 45k tokens (multiplied by resolution: 1× / 2× / 4× for 1K/2K/4K, multiplied by `count`).

Tier assignment:
- **Basic (25k)**: Riverflow V2, Nano Banana, Nano Banana 2, GPT-5 Image, Grok Imagine, Seedream-like fallbacks
- **Pro (35k)**: GPT Image 2, ByteDance Seedream 4.5
- **Premium (45k)**: Nano Banana Pro, FLUX.2 Max, FLUX.2 Pro

Updated in both `src/components/imagine/ImagineModelSelector.tsx` (front-end estimate + lock display) and `supabase/functions/imagine/index.ts` (server-truth charge + plan gate). Pro models require pro+ plan; Premium require premium plan.

## 2. Imagine — model order

Move `grok-imagine` directly **after** `riverflow` in the `imageModels` array so it appears as the 2nd option in the dropdown.

## 3. Imagine → Cineshoot handoff

In `ImagineCanvas.tsx`, add a 4th action button next to Download / Share / Copy:
**"Generate Video"** (Clapperboard icon, gradient style matching Cineshoot brand).

On click → `navigate('/cineshoot', { state: { prompt, imageUrl } })`. `CineshootPage` reads `location.state` on mount and feeds both into the prompt bar via the existing `injectPrompt` + a new `injectAttachmentUrl` prop on `CineshootPromptBar` (already supported via prop; wire it up). Textarea is left empty/with prompt seed so the user can adjust before submitting.

## 4. Cineshoot → Imagine handoff

In `CineshootCanvas.tsx`, add a button **"Generate Image"** (ImageIcon, purple-pink gradient).
On click → `navigate('/imagine', { state: { prompt } })`. `ImaginePage` already supports `injectPrompt`; wire `location.state` to call `setInjectPrompt`.

## 5. Cineshoot — fix Download MP4

Current `downloadVideo` uses `fetch(url).blob()` on a Supabase signed URL. When the server doesn't return CORS or the blob conversion fails silently on some browsers, the fallback `<a download>` is cross-origin and ignored by Chrome.

Fix: try fetch → blob → object-URL download (works for signed URLs that allow GET). If fetch throws, open the URL in a new tab with `?download=1` and use `window.open(url, '_blank')` so user can right-click save, plus show a toast guiding them. Also add `crossOrigin="anonymous"` on the video tag isn't needed for download — just ensure the bucket signed URL is fetchable (it already is).

## 6. Refine / edit existing generation with same context

**Imagine**: when an image is currently displayed (`imageUrls[0]` exists) and the user submits another prompt with no new attachment, the page auto-passes the previous image as `imageData` to the edge function so the model edits it in place. A small chip appears above the prompt bar: *"Editing previous image · Clear"* with a clear (×) button to start fresh.

**Cineshoot**: when a video is currently displayed and the user submits a new prompt with no attachment, the page reuses the same model + the previous prompt as conditioning context ("Previous: …\nChanges: <new prompt>"). Chip: *"Refining previous video · Clear"*. (Server change minimal — just sends a combined prompt string.)

## 7. Prominent token-cost highlight for Imagine / Cineshoot / Deck / FlowBuilder

Replace the tiny grey "X tokens left · Y per run" line with a polished **TokenCostChip** component (new shared file `src/components/shared/TokenCostChip.tsx`):

- Pill shape with gradient border matching the tool's accent
- Left: ⚡ icon + `Y` highlighted (bold, primary color) + small "tokens / run" label
- Right: subtle "balance: X" with amber warning style when `Y > remaining`
- Tooltip on hover explaining what affects the cost (model, resolution, duration, slides, etc.)

Wired into:
- `ImaginePage.tsx`
- `CineshootPage.tsx`
- `DeckPage.tsx` (uses existing slide-cost calc)
- `FlowBuilderPage.tsx` (flat per-render cost)

## Technical notes

- No DB migrations needed — token costs computed server-side per request.
- Edge fn `imagine` gets a `MODEL_TIER: Record<string,'basic'|'pro'|'premium'>` map; per-image base = `{basic:25000, pro:35000, premium:45000}[tier]`. Plan-gate adjusted: tier ≤ user plan (free can only use basic; basic plan can use basic; pro can use basic+pro; premium can use all).
- `ImagineCanvas` Action row becomes 4 buttons; on mobile they wrap to 2×2.
- `CineshootPromptBar` already accepts `injectAttachmentUrl` via the existing useEffect on `injectKey` — extend the prop type and the page-level state setter.
- "Refine previous" mode is purely client-side state in each page (`refineMode: boolean` driven by presence of displayed result + no new attachment).

## Files touched

- `src/components/imagine/ImagineModelSelector.tsx` (tier field, reorder)
- `src/components/imagine/ImagineCanvas.tsx` (Generate Video button)
- `src/components/imagine/ImagineActions.tsx` (extend with new action)
- `src/pages/ImaginePage.tsx` (location.state, refine chip, token chip, auto-pass prev image)
- `src/components/cineshoot/CineshootCanvas.tsx` (Generate Image button, download fix)
- `src/components/cineshoot/CineshootPromptBar.tsx` (accept injectAttachmentUrl)
- `src/pages/CineshootPage.tsx` (location.state, refine chip, token chip)
- `src/pages/DeckPage.tsx` + `src/pages/FlowBuilderPage.tsx` (token chip)
- `src/components/shared/TokenCostChip.tsx` (new)
- `supabase/functions/imagine/index.ts` (tier-based cost + plan gate)
