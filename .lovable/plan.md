## Plan: Rebrand Landing Page Text — Global AI Research Ecosystem

This plan rewrites all landing page copy to position AI Sorix as a **global AI Research Ecosystem** with professional, futuristic messaging. All Bangladesh-specific and casual/informal text will be removed or replaced.

---

### Summary of Changes

**Files to modify:** 8 files

1. `**src/contexts/LanguageContext.jsx**` — Update all English translation strings (hero, features, footer, pricing, workflow, FAQs)
2. `**src/components/Hero.jsx**` — Update hardcoded text ("Powered by world's leading AI models", trust indicators)
3. `**src/components/Features.jsx**` — Rewrite all feature descriptions to be professional/global, remove casual tone ("best friend", "roasting", "secret")
4. `**src/components/AboutUs.jsx**` — Complete rewrite: remove all Bangladesh references, "Proudly Made in Bangladesh" badge, change to global AI research ecosystem messaging
5. `**src/components/RolesSection.jsx**` — Remove Bangladesh/South Asian references from all role descriptions, make global
6. `**src/components/ProductivityGains.jsx**` — Remove Bangladesh references, rewrite for global audience
7. `**src/components/Testimonials.jsx**` — Update testimonial text to remove Bangladesh-specific references

---

### Detailed Text Changes

#### Hero Section (`LanguageContext.jsx` + `Hero.jsx`)

- **heroTitle1**: "All Premium AI in" → "The Ultimate AI Research"
- **heroTitle2**: "One Powerful Platform" → "Ecosystem — One Platform"
- **heroDesc**: Remove "fraction of the cost" casual tone → "Access 10+ frontier AI models in a single, secure workspace. Faster responses. Enterprise-grade privacy. Built for researchers, professionals & teams worldwide."
- **Trust indicators**: "100% Secure & Private" → "Enterprise-Grade Security"
- **Hardcoded**: "Powered by world's leading AI models" → "Powered by the world's most advanced AI models"

#### Features Section (`Features.jsx`)

- Remove "Bangladesh farmers" from Agro → "Smart agricultural AI — crop planning, climate analytics, pest detection, and yield optimization for modern farming."
- Remove casual tone from regular features:
  - "Fun & Emotional" → "Adaptive & Context-Aware" — "AI that understands nuance, tone, and context — delivering responses that feel natural and intuitive."
  - "Super Intelligent" → "Multi-Modal Intelligence" — "From code generation to creative writing, image analysis to deep research — one platform, limitless capability."
  - "Instant Replies" → "Ultra-Fast Responses" — "Sub-second latency with optimized inference. No waiting, no buffering — just instant results."
  - "Long-term Memory" → rewrite professionally
  - "100% Private" → "Zero-Trust Security" — "End-to-end encrypted conversations. Your data is never stored, shared, or used for training."
  - "50+ Languages" stays but description becomes professional
- "Not just chat — the entire AI universe in the palm of your hand" → "Not just a chatbot — a complete AI-powered research and productivity ecosystem."

#### About Us Section (`AboutUs.jsx`)

- Header: "Empowering Bangladesh With AI Innovation" → "Pioneering the Future of AI Research"
- Description: Remove "Bangladesh's first unified AI platform" → "AI Sorix is a next-generation AI research ecosystem, unifying the world's most powerful AI models into a single, intelligent workspace for professionals, researchers, and teams globally."
- Mission: Remove all Bangladesh references → "We believe breakthrough AI should be accessible to everyone. AI Sorix was built to eliminate the friction of managing multiple AI subscriptions — delivering enterprise-grade intelligence at a fraction of the cost."
- **Remove** "Proudly Made in Bangladesh" badge entirely
- Values: "Local Focus" → "Global Scale" — "Serving users across 100+ countries with localized payment options and multi-language support."

#### Roles Section (`RolesSection.jsx`)

- Remove "Bangladesh" from all descriptions (entrepreneurs, creators, students, consultants, HR)
- Make all copy globally relevant

#### Productivity Gains (`ProductivityGains.jsx`)

- Remove "built for Bangladesh", "Bangladeshi professionals" references
- "all-in-one AI workspace built for Bangladesh" → "your all-in-one AI research workspace"



#### Testimonials (`Testimonials.jsx`)

- Remove "local payment options make it perfect for Bangladesh" from Nusrat's review
- Update to globally relevant testimonial text

#### Footer & Translations

- **footerDesc**: Keep model list, just ensure professional tone
- Bangla translations will also be updated to match the new global messaging