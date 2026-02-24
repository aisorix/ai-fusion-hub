
# Sorix Deck — AI-Powered Presentation Builder

## Overview
Build "Sorix Deck" as a new tool (like Health, Agro, Imagine) at `/deck`. Users enter a prompt, the AI generates a structured JSON presentation, images are generated per-slide via FLUX.2, and users can edit text/regenerate images inline. Includes history panel, token deduction, themes, and skeleton streaming.

---

## Architecture

```text
User Prompt
    |
    v
Edge Function: deck-generate
    |
    +---> LLM (GPT-4o-mini via OpenRouter) --> JSON slides
    |
    +---> For each slide with image_prompt:
    |       FLUX.2 Klein (via OpenRouter) --> image URLs
    |
    +---> Save to DB (presentations table)
    +---> Deduct tokens from subscription
    |
    v
Frontend renders slides progressively
```

---

## 1. Database Migration

### New table: `presentations`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | NOT NULL |
| title | text | Extracted from LLM response |
| prompt | text | Original user prompt |
| slide_count | int | Number of slides |
| slides_data | jsonb | Full slide JSON array |
| theme | text | 'dark', 'cyan-blue', 'minimalist', 'gradient' |
| tokens_used | int | Total tokens deducted |
| created_at | timestamptz | default now() |

RLS: Users can only CRUD their own rows (`user_id = auth.uid()`).

Also save to existing `analysis_history` table (tool='deck') for the shared history pattern.

---

## 2. Edge Function: `supabase/functions/deck-generate/index.ts`

### Workflow:
1. Authenticate user via Bearer token
2. Parse request: `{ prompt, slideCount (default 5), theme, generateImages (default true) }`
3. Check token balance: `slideCount * 2000 + imageCount * 12000`
   - If insufficient, return 403 with `insufficient_tokens` error
4. Call OpenRouter with GPT-4o-mini and system prompt:
   - System prompt instructs strict JSON array output with: `slide_number`, `heading`, `bullet_points[]`, `image_prompt`, `layout` ('text-only' | 'split' | 'full-image')
5. Parse JSON from LLM response
6. For each slide with `image_prompt` and `generateImages=true`:
   - Call FLUX.2 Klein via OpenRouter (same pattern as imagine function)
   - Attach `image_url` to slide object
7. Save to `presentations` table
8. Save to `analysis_history` (tool='deck')
9. Deduct tokens from subscription
10. Return full slides payload

### Token costs:
- Text generation: 2,000 tokens per slide
- Image generation: 12,000 tokens per image
- Formula: `Total = (S x 2000) + (I x 12000)`

### Config addition to `supabase/config.toml`:
```toml
[functions.deck-generate]
verify_jwt = false
```

---

## 3. Frontend Files

### New Files to Create:

| File | Purpose |
|------|---------|
| `src/pages/DeckPage.tsx` | Main page (follows HealthPage/ImaginePage pattern) |
| `src/components/deck/DeckPromptBar.tsx` | Prompt input + slide count selector + theme picker |
| `src/components/deck/DeckSlideViewer.tsx` | Main slide renderer with skeleton loading |
| `src/components/deck/DeckSlideCard.tsx` | Individual slide card (editable text, image, regenerate) |
| `src/components/deck/DeckThemePicker.tsx` | Theme selection chips (4 presets) |
| `src/components/deck/DeckHistory.tsx` | History panel (right slide-out, same pattern as Imagine/Health) |
| `src/components/deck/DeckActions.tsx` | Download/share actions |
| `src/components/deck/index.tsx` | Barrel exports |
| `src/services/deckApi.ts` | API service layer |

### Modified Files:

| File | Change |
|------|--------|
| `src/App.jsx` | Add `/deck` route with ProtectedRoute |
| `supabase/config.toml` | Add `[functions.deck-generate]` entry |

---

## 4. Page Layout (`DeckPage.tsx`)

Follows exact same pattern as HealthPage/ImaginePage:

```text
+--------------------------------------------+
| [<-] Sorix Deck | AI Presentations | [History] |
+--------------------------------------------+
|                                            |
|  [Prompt Bar - hero element]               |
|  "Create a 5-slide pitch deck for..."      |
|                                            |
|  [Slide Count: 3|5|8|10] [Theme chips]     |
|                                            |
|  Token info: "X tokens remaining"          |
|                                            |
|  --- Generated Slides (card grid) ---      |
|  +----------+  +----------+               |
|  | Slide 1  |  | Slide 2  |               |
|  | [heading]|  | [heading]|               |
|  | [bullets]|  | [bullets]|               |
|  | [image]  |  | [image]  |               |
|  +----------+  +----------+               |
|                                            |
+--------------------------------------------+
```

---

## 5. Slide Card Design (`DeckSlideCard.tsx`)

Each slide card is a responsive card with:
- **Slide number badge** (top-left corner)
- **Layout variants**:
  - `split`: Left half = heading + bullets, Right half = AI image
  - `text-only`: Full-width text content
  - `full-image`: Large image with heading overlay
- **Editable text**: Click any heading or bullet to edit inline (contentEditable or controlled input)
- **Image actions**: Click image to show "Regenerate Image" button
- **Skeleton loading**: While generating, show shimmer placeholders for text lines and image area

### Themes (CSS classes applied to slide cards):
- **Dark Mode**: Dark bg, white text, cyan accents
- **Sorix Cyan-Blue**: Gradient from cyan-500 to blue-600, white text
- **Minimalist White**: White bg, dark text, subtle borders
- **Sunset Gradient**: Warm orange-to-purple gradient, white text

---

## 6. Streaming/Progressive Rendering

Since the LLM call is NOT streamed (we need complete JSON), the UX flow is:
1. User submits prompt -> show skeleton slides (shimmer cards based on selected slide count)
2. Timer shows "Generating... 4.2s" (using existing `AnalysisTimer` component)
3. Once LLM returns JSON -> render text content immediately, show image skeleton placeholders
4. As each image loads (they're URLs) -> fade in the image replacing the skeleton
5. All done -> enable edit/download actions

---

## 7. History Panel (`DeckHistory.tsx`)

Same slide-out panel pattern as Imagine/Health:
- Lists previous presentations with title, slide count, date
- Click to reload a presentation
- Delete button per entry
- Uses `analysis_history` table filtered by `tool='deck'`

---

## 8. API Service (`src/services/deckApi.ts`)

```typescript
export const deckApi = {
  generate: async (prompt, slideCount, theme, generateImages) => { ... },
  getHistory: async () => { ... },  // from analysis_history where tool='deck'
  deletePresentation: async (id) => { ... },
  regenerateImage: async (presentationId, slideIndex, imagePrompt) => { ... },
};
```

---

## 9. Token Economy Display

Show before generation:
- "Estimated cost: 5 slides x 2,000 = 10,000 + 5 images x 12,000 = 60,000 = **70,000 tokens**"
- If insufficient: show UpgradePlanModal (reuse existing component)

---

## 10. Routing

Add to `src/App.jsx`:
```jsx
const DeckPage = React.lazy(() => import("./pages/DeckPage"));
// ...
<Route path="/deck" element={<ProtectedRoute><DeckPage /></ProtectedRoute>} />
```

---

## Implementation Order

1. Database migration (presentations table + RLS)
2. Edge function (`deck-generate`)
3. API service (`deckApi.ts`)
4. UI components (DeckPromptBar, DeckThemePicker, DeckSlideCard, DeckSlideViewer, DeckHistory, DeckActions)
5. Main page (DeckPage.tsx)
6. Route registration (App.jsx)
7. Config update (config.toml)

---

## Technical Notes

- **LLM Model**: `openai/gpt-4o-mini` via OpenRouter (cheap, fast, good at structured JSON output)
- **Image Model**: `black-forest-labs/flux.2-klein-4b` via OpenRouter (same as Imagine tool)
- **Image generation is parallel**: All slide images are generated concurrently using `Promise.allSettled()` in the edge function
- **No new dependencies needed**: Uses existing framer-motion, lucide-react, tailwind, sonner
- **Reuses existing components**: AnalysisTimer, UpgradePlanModal, Skeleton
- **Theme is stored per-presentation** so history recalls preserve the look
- **Files created**: 9 new files (1 page, 7 components, 1 service, 1 edge function)
- **Files modified**: 2 files (App.jsx route, config.toml)
