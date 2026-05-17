# SEO upgrade plan

Overall SEO health is strong (JSON-LD, sitemap, canonicals, hreflang, robots, OG/Twitter all present). Four targeted fixes will close real gaps — no rewrite needed.

## 1. Fix rebrand inconsistencies (global, not Bangladesh)

Per project memory the brand is now "global / Zero-Trust", but stale Dhaka/Bangladesh signals remain and hurt geo targeting:

- `src/pages/Index.jsx` JSON-LD: `foundingLocation: Dhaka, Bangladesh`, `areaServed: [Bangladesh, Asia]`, `LocalBusiness` with Dhaka address + geo coords, page title "#1 AI Research Ecosystem in Bangladesh & Asia".
- `index.html` `<meta name="keywords">` is fine but JSON-LD pricing is BDT-only — keep BDT (real prices) but description text is good.

Action: rewrite Index.jsx JSON-LD + `<SEOHead title>` to global positioning; drop `LocalBusiness` (or change to global Organization). Remove `geo.region BD` meta from Index.jsx.

## 2. Sync sitemap.xml with current routes

Sitemap still lists removed solution slugs and is missing real routes.

Remove (no longer exist):
- `/solutions/workflow-automation`
- `/solutions/ai-for-educators`, `/ai-for-startups`, `/ai-for-researchers`, `/ai-for-creators`, `/ai-for-professionals`, `/ai-for-freelancers`

Add (live but missing):
- `/multi-window-chat` (or `/chat?multi=1` — confirm canonical form)
- `/tools`
- `/solutions` (index page)
- Any other routes from `src/App.jsx` not yet listed

Also bump `<lastmod>` on the new marketing pages to today's date.

## 3. Dedupe duplicate meta tags in index.html

Lines 301–304 re-declare `og:title`, `twitter:title`, `og:description`, `twitter:description` that already exist earlier in `<head>`. Some crawlers honor the last value, some the first — keep one set only.

## 4. Add per-route Helmet titles where missing

Spot-check: `Index.jsx` uses SEOHead ✓, new InfoPage pages use SEOHead ✓. Verify these still set unique title/description via Helmet (not relying on index.html default):
- `ChatPage`, `ToolsPage`, `SolutionsPage`, `AboutSorixLab`, `AboutUsPage`, `Reviews`, `Login`, `Register`, legal pages.

Any missing → add `<SEOHead>` with route-specific title/description/path.

## 5. Optional polish

- Update `Index.jsx` `<title>` to remove "Bangladesh" — e.g. `"AI Sorix | Global AI Research Ecosystem & Multi-Model Workspace"` (<60 chars target — current proposal is 64, will trim).
- Add `<meta name="theme-color">` to index.html for mobile browser chrome.
- Consider migrating sitemap to a generator script (`scripts/generate-sitemap.ts`) so routes stay in sync automatically — flag only, not required.

## Out of scope

- No new pages, no content rewrites, no design changes.
- Pricing schema (BDT) stays — those are real prices.
- robots.txt is correct as-is.

## Files to edit

- `index.html` — remove duplicate meta tags (lines 301–304), optionally add theme-color.
- `src/pages/Index.jsx` — rewrite Organization/LocalBusiness JSON-LD + SEOHead title to global; remove `geo.*` meta.
- `public/sitemap.xml` — remove dead routes, add `/tools`, `/solutions`, `/multi-window-chat`, refresh lastmod.
- Any page missing `<SEOHead>` (audit pass).
