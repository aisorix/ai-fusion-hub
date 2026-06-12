import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Globe,
  Sparkles,
  Shield,
  Users,
  Rocket,
  Heart,
  Bot,
  MessageSquare,
  Presentation,
  ImageIcon,
  Leaf,
  Crown,
  Workflow,
  ArrowRight,
  FlaskConical,
  CheckCircle2,
  ScrollText,
} from "lucide-react";

const tools = [
  { icon: MessageSquare, name: "AI Chat", desc: "Multi-model conversations" },
  { icon: Bot, name: "AI Agents", desc: "Autonomous task execution" },
  { icon: Presentation, name: "Sorix Deck", desc: "AI presentations" },
  { icon: ImageIcon, name: "Sorix Imagine", desc: "AI image generation" },
  { icon: Workflow, name: "FlowBuilder", desc: "AI diagrams & flowcharts" },
  { icon: Heart, name: "Sorix Health", desc: "AI health analysis" },
  { icon: Leaf, name: "Sorix Agro", desc: "AI agriculture insights" },
  { icon: Crown, name: "Sorix Legends", desc: "Chat with historical figures" },
];

const values = [
  {
    icon: Globe,
    title: "Globally Accessible",
    desc: "Built to serve users in Bangladesh, Asia, and across the world — in English and Bengali.",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    desc: "Your chats and data stay private with enterprise-grade security and zero-trust architecture.",
  },
  {
    icon: Sparkles,
    title: "Frontier AI for Everyone",
    desc: "Access GPT-5, Claude, Gemini, DeepSeek, Grok and more — no juggling subscriptions.",
  },
  {
    icon: Heart,
    title: "Built with Care",
    desc: "Tools like Sorix Health and Sorix Agro are free for everyone — because access matters.",
  },
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About AI Sorix — The Global AI Workspace"
        description="AI Sorix is a global AI research ecosystem providing unified access to GPT-5, Claude, Gemini, DeepSeek and 10+ frontier models. Built in Bangladesh, made for the world."
        path="/about-us"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AI Sorix",
          "url": "https://www.aisorix.com",
          "logo": "https://www.aisorix.com/og-image.png",
          "sameAs": [
            "https://facebook.com/profile.php?id=61586687081259",
            "https://instagram.com/aisorix_",
            "https://twitter.com/aisorix_",
            "https://linkedin.com/company/aisorix",
            "https://youtube.com/@aisorix",
          ],
          "description": "Global AI workspace providing unified access to 10+ frontier AI models including GPT-5, Claude, Gemini, DeepSeek, and Grok.",
          "foundingLocation": "Bangladesh",
          "areaServed": "Worldwide",
          "email": "support@aisorix.com",
        })}</script>
      </Helmet>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero */}
        <section className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">About AI Sorix</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
            The Global AI Workspace
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI Sorix unifies the world's most powerful AI models into a single, secure, beautifully-designed
            workspace — so anyone, anywhere can think, create, and ship faster.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                We believe frontier AI shouldn't be locked behind multiple expensive subscriptions or limited to
                Silicon Valley. AI Sorix gives every student, freelancer, founder, researcher, and creator
                worldwide unified access to GPT-5, Claude, Gemini, DeepSeek, Grok, and more — in one place.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Our vision: a zero-trust, multilingual, globally-accessible AI ecosystem that just works.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
              {values.slice(0, 2).map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              AI Sorix was born inside <Link to="/about-sorix-lab" className="text-primary hover:underline font-medium">SorixLab</Link>,
              our parent R&D laboratory, with a single observation: developers and creators in emerging markets
              were paying 5–7 different AI subscriptions just to access the tools their global counterparts used
              casually.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              We built AI Sorix to fix that. One workspace. Ten frontier models. Real tools — not toys.
              Multilingual by default. Affordable for individuals. Powerful enough for teams.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Today, AI Sorix powers thousands of professionals, students, freelancers, and small teams across
              Bangladesh, South Asia, and beyond — and we're just getting started.
            </p>
          </div>
        </section>

        {/* What We Build */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">What We Build</h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            10+ AI tools. One unified workspace. Built to replace your stack.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.name} className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Global Reach */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">Global Reach</h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Bangladesh → Asia → World.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "10+", label: "Frontier AI models" },
              { num: "5,000+", label: "Active users worldwide" },
              { num: "2", label: "Languages — English & বাংলা" },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-foreground">{s.num}</p>
                <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Security */}
        <section className="mb-16 sm:mb-24">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Trust & Security</h2>
                <p className="text-sm text-muted-foreground mt-1">Your data, your control.</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Zero-trust architecture — your chats are isolated and private",
                "Row-level security on all stored data",
                "Encrypted transport (TLS) and encrypted at rest",
                "No selling, no sharing, no surveillance — ever",
                "Account deletion available on request, instantly",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Legal & Compliance */}
        <section className="mb-16 sm:mb-24">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ScrollText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Legal & Compliance</h2>
                <p className="text-sm text-muted-foreground mt-1">Registration & regulatory details.</p>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {[
                { label: "Registered Entity", value: "AI Sorix (SorixLab)" },
                { label: "Trade License No.", value: "TRAD/DNCC/000000/2025" },
                { label: "Issuing Authority", value: "Dhaka North City Corporation" },
                { label: "BIN / TIN", value: "000000000-0000" },
                { label: "Registered Address", value: "House 00, Road 00, Gulshan, Dhaka 1212" },
                { label: "Support Email", value: "support@aisorix.com" },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{row.label}</dt>
                  <dd className="text-sm font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-muted-foreground mt-6 italic">
              Placeholder values shown for layout. Official numbers will be updated after final registration.
            </p>
          </div>
        </section>


        <section className="mb-16 sm:mb-24">
          <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-border rounded-2xl p-6 sm:p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Meet the Team</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
              AI Sorix is built by the engineers and researchers at <strong>SorixLab</strong> — our parent R&D
              laboratory. Get to know our people, our research, and what we're building next.
            </p>
            <Link
              to="/about-sorix-lab"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Visit SorixLab <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to try AI Sorix?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Get started free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity text-base"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:support@aisorix.com"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Or email support@aisorix.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
