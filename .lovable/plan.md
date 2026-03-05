

## Enhanced SEO for Google Sitelinks

The current SEO setup is already strong (JSON-LD schemas, OG tags, sitemap, robots.txt all in place). What's missing to achieve Google Sitelinks like Perplexity/ChatGPT/OneBrain (shown in your screenshots) is **per-page SEO metadata** and **more crawlable internal links**.

### What Google Sitelinks Need
Google generates sitelinks algorithmically based on: (1) unique page titles, (2) clear internal link structure, and (3) distinct page descriptions. Currently, every page shares the same `<title>` from `index.html` — Google can't differentiate subpages.

### Plan

**1. Install `react-helmet-async` and create a reusable `<SEOHead>` component**
- New file: `src/components/SEOHead.tsx`
- Sets per-page `<title>`, `<meta description>`, `<link canonical>`, and OG tags dynamically
- Wrap `App.jsx` with `<HelmetProvider>`

**2. Add `<SEOHead>` to every major page (12 pages)**

| Page | Title | Description |
|------|-------|-------------|
| `/` (Index) | AI Sorix \| Global AI Research Ecosystem | Welcome to the ultimate AI Research Ecosystem... |
| `/chat` | AI Chat \| AI Sorix | Chat with 15+ premium AI models including GPT-5, Claude, Gemini... |
| `/deck` | Sorix Deck \| AI Presentations \| AI Sorix | Create stunning AI-powered presentations instantly... |
| `/imagine` | Sorix Imagine \| AI Image Generation \| AI Sorix | Generate beautiful AI images with multiple styles... |
| `/health` | Sorix Health \| AI Health Analysis \| AI Sorix | Get AI-powered health insights and analysis... |
| `/agro` | Sorix Agro \| AI Agriculture \| AI Sorix | AI-powered agricultural analysis and insights... |
| `/legends` | Sorix Legends \| AI Historical Conversations \| AI Sorix | Chat with history's greatest minds powered by AI... |
| `/login` | Login \| AI Sorix | Sign in to your AI Sorix account... |
| `/register` | Register \| AI Sorix | Create your free AI Sorix account... |
| `/about-sorix-lab` | About Sorix Lab \| AI Sorix | Meet the team behind AI Sorix... |
| `/reviews` | Reviews \| AI Sorix | See what users say about AI Sorix... |
| `/privacy-policy` | Privacy Policy \| AI Sorix | AI Sorix privacy policy... |

**3. Expand Footer with product page links (critical for sitelinks)**
- Add a new "Tools" column with crawlable `<Link>` elements to: `/chat`, `/deck`, `/imagine`, `/health`, `/agro`, `/legends`
- These internal links tell Google which subpages are important — exactly what drives sitelinks

**4. Update `sitemap.xml`** with `lastmod` dates refreshed to today

### Technical Details
- `react-helmet-async` package will be added
- `App.jsx` wrapped with `<HelmetProvider>`
- Each page file gets a `<SEOHead>` call at the top of its JSX
- Footer gets a 3rd column ("Tools") with 6 product links
- ~14 files modified total

