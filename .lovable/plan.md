# Wire Sorix Cineshoot Across the Site

Position Cineshoot **immediately before Sorix Imagine** in every tool list/menu.

## 1. Routing — `src/App.jsx`
- Add lazy import: `const CineshootPage = lazy(() => import("./pages/CineshootPage"))`
- Add protected route `/cineshoot` placed right before the `/imagine` route, mirroring the Imagine route's `ProtectedRoute` wrapper and Suspense fallback.

## 2. Tools Gallery — `src/pages/ToolsPage.tsx`
- Insert a new entry in the `tools` array directly before the Imagine entry:
  - id: `cineshoot`, name: `Sorix Cineshoot`, desc: `AI video generation from text, image & video`, icon: `Clapperboard` (lucide), route: `/cineshoot`, gradient: `from-fuchsia-500 to-pink-500`, free: false.
- Update the JSON-LD `ItemList` automatically (it maps over `tools`).

## 3. Navbar — `src/components/Navbar.jsx`
- In the Tools dropdown/menu (desktop + mobile), insert a Cineshoot link right before the Imagine link, using the same styling, label, and icon convention already used for Imagine.

## 4. Landing page surfaces
- **`src/components/Features.jsx`**: Add a Cineshoot feature card before the Imagine card (same card pattern, gradient, icon `Clapperboard`, copy: "Generate cinematic videos from text, images, or reference clips with 11+ frontier models.").
- **`src/components/Hero.jsx`** "Choose a tool" / quick-launch tool chips section (if present): add Cineshoot chip before Imagine chip, linking to `/cineshoot`. If Hero has no such tool grid, skip — do not add another CTA button.
- **`src/components/Footer.jsx`**: In the Tools/Products column, add `Sorix Cineshoot → /cineshoot` link before the Imagine link.

## 5. SEO — `public/sitemap.xml`
- Add `<url><loc>https://www.aisorix.com/cineshoot</loc><lastmod>2026-06-04</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>` immediately before the existing `/imagine` entry.

## Out of scope
- No copy or styling changes to existing Imagine/other tool entries.
- No backend, pricing, or model changes (already implemented in prior step).
- No new translations beyond the English/Bangla strings already used in surrounding tool entries.

## Technical notes
- Icon choice: `Clapperboard` from `lucide-react` (fallback `Film` if unavailable).
- Keep insertion strictly "before Imagine" everywhere for consistent ordering.
- All edits are presentation-layer only; no schema or types changes required.
