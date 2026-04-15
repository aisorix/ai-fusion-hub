

## SEO/GEO-Optimized Footer Expansion + New Content Pages

### Overview
Expand the footer from 5 columns to 8 columns (Brand[2] + Product + Tools + Solutions + Resources + Company + Legal), create 7 new SEO-rich content pages, update routing, sitemap, and add comprehensive JSON-LD structured data to position AI Sorix as a top AI tool in Bangladesh and Asia.

### Part 1: Footer Redesign (`src/components/Footer.jsx`)

**Keep unchanged:** Brand column (col-span-2), Product column, Tools column, Legal column, Bottom bar.

**Layout change:** `lg:grid-cols-5` becomes `xl:grid-cols-8 lg:grid-cols-4` with the brand taking `lg:col-span-2 xl:col-span-2`. On mobile stays `grid-cols-2`. This gives breathing room for all 7 columns (brand counts as 2).

**New Column A - Solutions:**
- Workflow Automation → `/solutions/workflow-automation`
- AI for Educators → `/solutions/ai-for-educators`
- AI Agents → `/agent`
- AI for Startups → `/solutions/ai-for-startups`
- AI for Researchers → `/solutions/ai-for-researchers`

**New Column B - Resources:**
- Blog & AI Insights → `/blog`
- Case Studies → `/case-studies`
- Documentation → `/docs`
- Developer API → `#` (with "Coming Soon" badge)
- Community → `/reviews`

**New Column C - Company:**
- About Us → `/about-sorix-lab`
- Press & Media → `/press`
- Careers → `/careers`
- Contact Us → scroll to `#contact` section
- Partners → `/partners`

**Bottom bar enhancement:** Add GEO-targeting tagline: "Built in Bangladesh. Powering AI across Asia." with a small globe icon.

### Part 2: New Content Pages (7 pages)

Each page will have full SEO metadata via `SEOHead`, proper H1/H2 semantic structure, Navbar, Footer, and keyword-rich content targeting Bangladesh/Asia AI searches.

1. **`/blog`** - `src/pages/BlogPage.jsx` - AI insights hub with articles derived from the Facebook posts (AI in Bangladesh education, agriculture, healthcare use cases, Sorix product announcements)
2. **`/case-studies`** - `src/pages/CaseStudiesPage.jsx` - Real-world impact stories (education, agriculture, health sectors in Bangladesh)
3. **`/docs`** - `src/pages/DocsPage.jsx` - Getting started guide and feature documentation
4. **`/press`** - `src/pages/PressPage.jsx` - Press releases and media kit
5. **`/careers`** - `src/pages/CareersPage.jsx` - Open positions at AI Sorix
6. **`/partners`** - `src/pages/PartnersPage.jsx` - Partnership program info
7. **`/solutions/workflow-automation`**, **`/solutions/ai-for-educators`**, **`/solutions/ai-for-startups`**, **`/solutions/ai-for-researchers`** - `src/pages/SolutionsPage.jsx` - A single component with route param to render different solution content

### Part 3: App.jsx Route Updates
Add routes for all new pages (lazy-loaded).

### Part 4: Sitemap Update (`public/sitemap.xml`)
Add all new page URLs with appropriate priority and changefreq.

### Part 5: Enhanced JSON-LD in Index.jsx
Add/update structured data blocks:
- **Organization** schema with `areaServed: ["Bangladesh", "Asia"]`, `foundingLocation: "Dhaka, Bangladesh"`
- **WebApplication** schema listing all tools
- **FAQPage** and **BreadcrumbList** for sitelinks
- **LocalBusiness** with Bangladesh address for GEO signals
- Add `hreflang` and geo meta tags (`geo.region: BD`, `geo.placename: Dhaka`)

### Part 6: SEO Meta Tags per Page
Every new page gets targeted titles like:
- Blog: "AI Insights & Blog | AI Sorix - Top AI Platform in Bangladesh"
- Case Studies: "AI Case Studies | How AI Sorix Transforms Education & Agriculture in Asia"
- etc.

### Technical Notes
- All new pages use existing `SEOHead`, `Navbar`, `Footer` components
- Dark/light mode works automatically via existing Tailwind `text-foreground`/`text-muted-foreground` classes
- Footer grid uses responsive breakpoints: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8`
- "Coming Soon" badge uses a small `<span>` with `text-[10px] bg-primary/10 text-primary rounded px-1.5`

