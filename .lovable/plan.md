

## Comprehensive Pro Polish: Navbar + AI Support Chat + Hash Routing + Billing Fix + Performance

### 1. Navbar updates (`src/components/Navbar.jsx`)
- **Products column** — reorder so **AI Agents is FIRST**; add a **Features** entry that scrolls to `/#features`
- **Resources column** — add **FAQs** entry (scrolls to `/#faq`)
- **Solutions column** — add new entries: **AI for Creators**, **AI for Professionals** (and reuse RolesSection roles where applicable)
- Mobile accordion mirrors all the same items

### 2. Footer updates (`src/components/Footer.jsx`)
- Add **Sorix Agents** link (→ `/agent`) inside the **Tools** column
- Add **AI for Creators** & **AI for Professionals** under **Solutions**

### 3. Fix hash navigation from any page (CRITICAL bug)
Currently, clicking `#pricing` / `#features` / `#faq` / `#contact` from `/blog`, `/docs`, etc. silently fails because `getElementById` runs on a page that doesn't contain those sections.

**Fix:** Update Navbar + Footer hash links to use `react-router` navigation:
- If on `/`, smooth-scroll directly
- If on any other page, `navigate('/', { state: { scrollTo: 'pricing' } })`, then `Index.jsx` reads `location.state.scrollTo` on mount and scrolls smoothly

This makes Pricing/Features/FAQs/Contact links work from EVERY page, every time.

### 4. New pages for Solutions (`src/pages/SolutionsPage.jsx`)
Add slug support for:
- `/solutions/ai-for-creators`
- `/solutions/ai-for-professionals`

Each rendered with full SEO metadata, hero, benefits, and CTAs — matching existing solution page pattern.

### 5. Developer API page polish (`src/pages/DeveloperApiPage.jsx`)
"Coming Soon" label is already on the page. Confirm prominence at the hero (badge + heading), and remove any duplicate "Coming Soon" text from Navbar/Footer descriptors so the source of truth is the page itself.

### 6. AI Support Chat — replace human-employee model with DeepSeek AI (CRITICAL FEATURE)

**Problem:** Current `ChatWidget` waits for a human employee. User wants instant AI replies.

**Solution:** Create a new edge function `support-chat` (deployed via Lovable AI Gateway, no API key required) using model **`deepseek/deepseek-chat-v3.1`** (closest available DeepSeek v3.x via OpenRouter through gateway). Falls back to `openai/gpt-5-mini` if DeepSeek unavailable.

**System prompt (senior 30-yr Sorix Support persona):**
> You are AI Sorix Support — a senior customer support specialist with 30+ years of experience helping users worldwide. Greet warmly, sign as "Sorix Support Team". Help every user (registered or guest) with: product features (AI Chat, Deck, Imagine, Health, Agro, Legends, Agents, FlowBuilder), how-tos, account/login issues, plans/tiers, troubleshooting. **For ANY payment-related question** (refunds, billing, failed transactions, plan upgrades, invoices, currency), reply: *"For payment & billing matters, please email our team at support@aisorix.com — they'll resolve it personally and quickly."* Be concise, warm, professional. Use markdown.

**Frontend changes (`src/components/chat/ChatWidget.tsx` + `useChat.ts`):**
- After user sends a message, call the `support-chat` edge function with full conversation history
- Stream/insert AI reply into the conversation as `sender_type: 'employee'` (so existing UI works unchanged)
- Allow widget to open without auth (guest users) — store guest convo in `chat_conversations` with `guest_email` (optional, prompt at first message) or skip persistence and keep purely in local state for guests
- Header subtitle changes to "● Online — AI Support" 
- Keep human handoff path intact (admins can still take over via `/admin/chat`)

### 7. Fix billing cycle for manually-activated Premium/Pro accounts
Inspection of `subscriptions` table: every row (including `monthly`) has `current_period_end = current_period_start + 1 YEAR`. The webhook code is correct — these are **manually-inserted rows** that incorrectly used the `+1 year` interval.

**Fix via migration:**
```sql
UPDATE public.subscriptions
SET current_period_end = current_period_start + INTERVAL '1 month'
WHERE billing_cycle = 'monthly'
  AND current_period_end > current_period_start + INTERVAL '2 months';
```
Also alter the table default to align with cycle (no-op for new rows since webhook computes it):
```sql
ALTER TABLE public.subscriptions
ALTER COLUMN current_period_end SET DEFAULT now() + INTERVAL '1 month';
```

### 8. Performance — make all pages open faster
Current bottlenecks:
- All 28 lazy chunks share one `LoadingScreen`; first paint of new pages is delayed by translation/auth context init
- New content pages (Blog, Docs, Press, etc.) don't need `AuthProvider` heavy work but still wait

**Fixes:**
- Add **route prefetch on hover** in Navbar/Footer: `onMouseEnter` triggers the lazy `import()` for the destination page so by the time the user clicks, the chunk is cached
- Add `<link rel="prefetch">` hints in `index.html` for the most common pages (`/blog`, `/docs`, `/chat`)
- Wrap `LoadingScreen` to show a tiny top-of-page progress bar instead of full-screen spinner — perceived speed boost
- Ensure `ScrollToTop` uses `behavior: 'instant'` (already does) — keep
- Code-split heavy `Index.jsx` JSON-LD into a deferred component (already small, low priority)

### Files to edit / create

| File | Change |
|------|--------|
| `src/components/Navbar.jsx` | Reorder Products, add Features/FAQs/Creators/Professionals; switch hash links to navigate-with-state; add hover prefetch |
| `src/components/Footer.jsx` | Add Sorix Agents in Tools; add new Solutions; navigate-with-state for hash links |
| `src/pages/Index.jsx` | Read `location.state.scrollTo` on mount → smooth scroll to that section |
| `src/pages/SolutionsPage.jsx` | Add `ai-for-creators` and `ai-for-professionals` slug content |
| `src/pages/DeveloperApiPage.jsx` | Verify Coming Soon hero, no changes needed if prominent |
| `src/components/chat/ChatWidget.tsx` | Allow guest, AI subtitle, call new edge fn, friendly empty state |
| `src/hooks/useChat.ts` | After user message → invoke `support-chat` fn → insert AI reply as employee |
| `supabase/functions/support-chat/index.ts` | **NEW** — DeepSeek-powered Sorix Support AI via Lovable AI Gateway |
| `supabase/config.toml` | Register `support-chat` (verify_jwt = false to allow guests) |
| `public/sitemap.xml` | Add 2 new solution slugs |
| Migration | Fix monthly billing rows + default |

