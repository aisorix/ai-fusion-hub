
# Sorix Imagine - AI Image Generation Tool

## Overview
Add a new "Sorix Imagine" tool to the sidebar (alongside Agro, Health, Legends) that lets users generate images using the `black-forest-labs/flux.2-klein-4b` model via OpenRouter. Each generation costs 12,000 tokens. Users can download in multiple formats, share images, browse history, and get trending style suggestions.

## Architecture

### 1. Database Table: `image_generations`
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL)
- `prompt` (text)
- `style` (text, nullable)
- `image_url` (text) -- stored as base64 data URL or uploaded to storage
- `width` (int, default 1024)
- `height` (int, default 1024)
- `tokens_used` (int, default 12000)
- `created_at` (timestamptz)
- RLS: users can only read/insert their own rows

### 2. Edge Function: `imagine`
- Receives: `{ prompt, style, width?, height? }`
- Authenticates user via JWT
- Checks user token balance (reads from `subscriptions` + `user_token_usage` or uses the existing token system)
- Calls OpenRouter with model `black-forest-labs/flux.2-klein-4b`
- Saves result to `image_generations` table
- Deducts 12,000 tokens from the user
- Returns the generated image URL

### 3. Frontend Components

**New Page: `/imagine` (`src/pages/ImaginePage.tsx`)**
- Full-page tool like HealthPage/AgroPage
- Header with back button to /chat
- Main prompt input bar (like the reference image - clean input with mic + send button)
- Trending styles carousel (Caricature, Flower Petals, Gold, Crayon, Paparazzi, Clouds, etc.)
- Image generation area with gradient loading animation (like reference image 1)
- Generated image display with action buttons

**Components (`src/components/imagine/`):**
- `ImaginePromptBar.tsx` - Main prompt input with style chips
- `ImagineStyleCarousel.tsx` - Horizontal scrollable trending styles with preview thumbnails
- `ImagineCanvas.tsx` - Shows loading animation during generation + final image
- `ImagineHistory.tsx` - Grid of past generations (from DB)
- `ImagineActions.tsx` - Download (PNG/JPG/WEBP), Share, Copy link buttons
- `index.tsx` - Barrel export

**Service: `src/services/imagineApi.ts`**
- `generateImage(prompt, style?)` - calls the edge function
- Handles auth headers like other services

### 4. Sidebar Integration
- Add "Sorix Imagine" entry to the `moreTools` array in both `ChatSidebar.tsx` and `MobileSidebar.tsx`
- Icon: `ImageIcon` (from lucide-react) or `Wand2`
- Color: purple theme (`bg-purple-100 text-purple-600`)
- Navigates to `/imagine`

### 5. Token Deduction
- Each image costs 12,000 tokens
- Check `user.tokensUsed + 12000 <= user.tokensLimit` before generating
- If insufficient tokens, show the UpgradePlanModal
- Deduct tokens in the edge function after successful generation
- Update local store after successful generation

### 6. Download & Share
- Download: Convert image to canvas, export as PNG/JPG/WEBP using `file-saver`
- Share: Generate a shareable link or copy image to clipboard

### 7. Trending Styles
Pre-defined style suggestions with example prompts:
- Caricature Trend, Flower Petals, Gold, Crayon, Paparazzi, Clouds, Anime, Cyberpunk, Watercolor, Oil Painting, Pixel Art, Neon Glow

Each style appends a style modifier to the user's prompt (e.g., "in caricature style", "with flower petal aesthetic").

## Technical Details

### Edge Function (`supabase/functions/imagine/index.ts`)
```text
POST /imagine
Body: { prompt: string, style?: string }
Auth: Bearer token (required)

Flow:
1. Verify user auth
2. Check token balance via chatStore logic (or DB query)
3. Build final prompt = user prompt + style modifier
4. POST to OpenRouter:
   - model: "black-forest-labs/flux.2-klein-4b"
   - Messages format for image gen
5. Get image URL from response
6. Insert into image_generations table
7. Update user token usage
8. Return { imageUrl, id, tokensUsed }
```

### UI Design (Futuristic)
- Dark gradient background with glass-morphism cards
- Gradient border glow on the prompt input
- Animated gradient loading placeholder (soft pink/purple like reference)
- Style cards with rounded corners, hover scale effects
- Image display with subtle shadow and rounded corners
- Action buttons with icon + tooltip
- Responsive: single column on mobile, wider layout on desktop

### Files to Create
1. `supabase/functions/imagine/index.ts`
2. `src/pages/ImaginePage.tsx`
3. `src/components/imagine/ImaginePromptBar.tsx`
4. `src/components/imagine/ImagineStyleCarousel.tsx`
5. `src/components/imagine/ImagineCanvas.tsx`
6. `src/components/imagine/ImagineHistory.tsx`
7. `src/components/imagine/ImagineActions.tsx`
8. `src/components/imagine/index.tsx`
9. `src/services/imagineApi.ts`

### Files to Edit
1. `src/App.jsx` - Add `/imagine` route
2. `src/components/aichat/ChatSidebar.tsx` - Add Sorix Imagine to moreTools + collapsed dropdown
3. `src/components/aichat/MobileSidebar.tsx` - Add Sorix Imagine to moreTools

### Database Migration
- Create `image_generations` table with RLS policies (user can read/insert own rows)
