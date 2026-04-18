
Let me check the chat widget current state and register page quickly.

Plan recap based on prior approved scope + this confirmation:

## Final Polish: Chat Fix + Mobile Footer + Register Validation + SEO Expansion

### 1. Fix AI Support Chat (Critical)
**File:** `supabase/functions/support-chat/index.ts`
- Switch primary model to `openai/gpt-5-mini` (per user request, reliable)
- Replace `max_tokens` with `max_completion_tokens` (GPT-5 family requirement)
- Remove `temperature` param (not supported on GPT-5)
- Keep DeepSeek as secondary fallback with correct params
- Add better error logging

### 2. Mobile Footer Cleanup
**File:** `src/components/Footer.jsx`
- Bottom bar: hide GEO tagline + email on mobile (`hidden sm:flex`)
- Mobile shows ONLY: `© 2026 AI Sorix. All rights reserved.` (centered)
- Desktop unchanged (all 3 items visible)

### 3. Register Email Validation
**File:** `src/pages/Register.jsx`
- Add zod-style email regex check before signup call
- Detect `User already registered` / `already exists` errors from Supabase response → show "An account with this email already exists. Please sign in instead."
- Show "Please enter a valid email address" for invalid format
- Use sonner toast for all messages

### 4. SEO/GEO Content Expansion
Add deeper Bangladesh + Asia AI keyword-rich content blocks to:
- **`src/pages/BlogPage.jsx`** — add 3 more posts (AI in Bangladesh fintech, Bengali NLP advances, Asia AI adoption stats), expand existing excerpts, add author bylines
- **`src/pages/CaseStudiesPage.jsx`** — add 2 more case studies (Dhaka startup, Asian university), add measurable outcome stats sections
- **`src/pages/PressPage.jsx`** — add 2 more press releases, add "AI Sorix in the News" section with Asia tech outlets, expand media kit description
- **`src/pages/DocsPage.jsx`** — add Quick Start, API overview teaser, Tool-by-tool guides section
- **`src/pages/CareersPage.jsx`** — add "Our Mission" + "Why Bangladesh/Asia" section
- **`src/pages/PartnersPage.jsx`** — add partner tier table, regional partner spotlight

All new content uses semantic H2/H3 headings, keyword-dense paragraphs targeting "AI Bangladesh", "AI Asia", "Bengali AI", "Sorix AI", etc.

### 5. Mobile View Audit (all new pages)
Quick pass on Blog, Press, CaseStudies, Docs, Careers, Partners, Solutions, DeveloperApi:
- Tighten hero padding on mobile (`py-12 sm:py-20`)
- Ensure cards stack cleanly (`grid-cols-1 md:grid-cols-2`)
- Headlines responsive sizing (`text-3xl sm:text-5xl`)
- Add `px-4 sm:px-6` consistently

### Files to edit
| File | Change |
|------|--------|
| `supabase/functions/support-chat/index.ts` | gpt-5-mini primary, max_completion_tokens, no temperature |
| `src/components/Footer.jsx` | Hide tagline+email on mobile |
| `src/pages/Register.jsx` | Email format + duplicate detection |
| `src/pages/BlogPage.jsx` | +3 posts, deeper SEO content |
| `src/pages/CaseStudiesPage.jsx` | +2 studies, stats |
| `src/pages/PressPage.jsx` | +2 releases, news section |
| `src/pages/DocsPage.jsx` | Quick start + tool guides |
| `src/pages/CareersPage.jsx` | Mission + region section |
| `src/pages/PartnersPage.jsx` | Tier table + spotlight |
| All new pages | Mobile responsive padding/typography audit |
