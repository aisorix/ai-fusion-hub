import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero, { PageCTA } from "@/components/marketing/PageHero";
import { Newspaper, Download, Mail, Image, FileText, Globe } from "lucide-react";

const pressReleases = [
  {
    date: "2026-04-10",
    title: "AI Sorix Launches Sorix Agro — AI-Powered Agriculture for South Asian Farmers",
    summary: "AI Sorix introduces Sorix Agro, bringing crop disease detection, soil analysis, and yield prediction to smallholder farmers across Bangladesh and Southeast Asia, helping 200+ farms increase yields by 25%.",
  },
  {
    date: "2026-03-25",
    title: "AI Sorix Ranked Among Top 5 AI Platforms in Bangladesh",
    summary: "With over 50,000 users across Asia, AI Sorix has been recognized as one of the leading AI research ecosystems in Bangladesh and the broader South Asian region.",
  },
  {
    date: "2026-03-15",
    title: "Sorix Lab Announces AI Agents — Autonomous Task Execution for Professionals",
    summary: "The new AI Agents feature enables users to delegate complex multi-step tasks to autonomous AI workers, from research to content creation and data analysis.",
  },
  {
    date: "2026-03-01",
    title: "AI Sorix Expands AI Model Access with GPT-5, Gemini 3, and More",
    summary: "Users now have access to 10+ frontier AI models in a single workspace, making AI Sorix the most comprehensive AI platform available in Asia.",
  },
  {
    date: "2026-02-15",
    title: "Sorix Health Reaches 10,000 AI-Assisted Health Assessments in Bangladesh",
    summary: "Community health workers and individuals across Dhaka have used Sorix Health for over 10,000 AI-powered health assessments, improving healthcare access in underserved communities.",
  },
  {
    date: "2026-02-01",
    title: "AI Sorix Launches Full Bangla Language Support Across All Tools",
    summary: "AI Sorix becomes one of the first AI platforms to offer comprehensive Bangla language support, serving 170 million native speakers with localized AI tools.",
  },
];

const PressPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Press & Media | AI Sorix - AI Innovation from Bangladesh"
        description="Latest press releases, media resources, and news about AI Sorix. Headquartered in Dhaka, Bangladesh, AI Sorix is a leading AI platform serving users across Asia."
        path="/press"
      />
      <Navbar />
      <PageHero
        eyebrow="Press & Media"
        title="AI Sorix in the press."
        subtitle="News, press releases, brand assets and media resources from the AI Sorix team — a global, zero-trust AI workspace."
        primaryCta={{ label: "Contact Press Team", to: "/press" }}
        secondaryCta={{ label: "About AI Sorix", to: "/about-us" }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">

        {/* Press Releases */}
        <div className="space-y-6 mb-16">
          {pressReleases.map((pr, i) => (
            <article key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <time className="text-xs text-muted-foreground">{new Date(pr.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                  <h2 className="text-lg font-semibold text-foreground mt-1 mb-2">{pr.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pr.summary}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Brand Assets */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <Image className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Brand Assets</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Download the AI Sorix logo, brand guidelines, product screenshots, and marketing materials for press and media use.
            </p>
            <a
              href="mailto:support@aisorix.com?subject=Brand%20Assets%20Request"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Download className="w-4 h-4" /> Request Brand Kit
            </a>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Company Fact Sheet</h2>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li><strong className="text-foreground">Founded:</strong> 2025, Dhaka, Bangladesh</li>
              <li><strong className="text-foreground">Headquarters:</strong> Dhaka, Bangladesh</li>
              <li><strong className="text-foreground">Users:</strong> 50,000+ across Asia</li>
              <li><strong className="text-foreground">AI Models:</strong> 10+ frontier models</li>
              <li><strong className="text-foreground">Tools:</strong> 8 AI-powered tools</li>
            </ul>
          </div>
        </section>

        {/* About AI Sorix — SEO block */}
        <section className="mb-16 bg-card border border-border rounded-2xl p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">About AI Sorix</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">AI Sorix</strong> is a unified AI research ecosystem giving users worldwide secure, zero-trust access to 10+ frontier AI models — including GPT-5, GPT-5.2, Claude Sonnet 4.5, Gemini 3 Pro, DeepSeek V3.2, Grok 4, and Perplexity — through a single intuitive workspace. Designed for professionals, educators, creators, researchers, and enterprises, AI Sorix combines multi-model chat, AI presentations, image generation, autonomous agents, and specialized tools for health and agriculture under one privacy-first platform.
            </p>
            <p>
              With users across Asia, Europe, and the Americas, AI Sorix is rapidly becoming the go-to AI workspace for teams that demand both flexibility and control. Our mission is to democratize access to frontier AI while protecting user data with strict zero-trust principles — your conversations never train public models.
            </p>
          </div>
        </section>

        {/* In the News */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 text-center">AI Sorix in the News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { source: "Tech in Asia", quote: "One of the most ambitious unified AI platforms emerging from the region." },
              { source: "AI Weekly", quote: "AI Sorix's multi-model approach is exactly what professional teams need in 2026." },
              { source: "Product Hunt", quote: "An impressive end-to-end AI workspace covering chat, decks, images, and agents." },
            ].map((n, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs font-medium text-primary mb-2">{n.source}</p>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"{n.quote}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media Contact */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-3">Media Inquiries</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            For press inquiries, interviews, media kits, executive quotes, or partnership opportunities, please contact our team. We typically respond within 24 hours.
          </p>
          <a href="mailto:support@aisorix.com" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Mail className="w-4 h-4" /> support@aisorix.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PressPage;
