import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero, { PageCTA } from "@/components/marketing/PageHero";
import { Handshake, GraduationCap, Building2, Rocket, Globe, CheckCircle, ArrowRight, Mail, TrendingUp } from "lucide-react";

const partnerTypes = [
  {
    icon: GraduationCap,
    title: "Education Partners",
    desc: "Schools, universities, and ed-tech organizations in Bangladesh and Asia can integrate AI Sorix to enhance learning outcomes with AI-powered tools.",
    benefits: ["Discounted team plans", "Custom AI training materials", "Dedicated support channel"],
  },
  {
    icon: Building2,
    title: "Enterprise Partners",
    desc: "Businesses can leverage AI Sorix's multi-model AI platform to boost team productivity, automate workflows, and accelerate content creation.",
    benefits: ["Volume licensing", "Custom integrations", "Priority feature requests"],
  },
  {
    icon: Rocket,
    title: "Startup Partners",
    desc: "Early-stage startups in Asia get special access to AI Sorix tools and dedicated support to build AI-powered products and services.",
    benefits: ["Free credits for early-stage startups", "Co-marketing opportunities", "API early access"],
  },
  {
    icon: Globe,
    title: "Regional Distributors",
    desc: "Become an AI Sorix distribution partner in your country. Help us bring world-class AI to every corner of Asia and beyond.",
    benefits: ["Revenue sharing", "Local market support", "Exclusive territory rights"],
  },
];

const stats = [
  { value: "50,000+", label: "Users across Asia" },
  { value: "8+", label: "AI-powered tools" },
  { value: "10+", label: "Frontier AI models" },
  { value: "5+", label: "Countries served" },
];

const process = [
  { step: "01", title: "Apply", desc: "Fill out our partnership inquiry form or email us directly." },
  { step: "02", title: "Connect", desc: "Our partnerships team will schedule a call to discuss your goals." },
  { step: "03", title: "Onboard", desc: "Get access to partner resources, training, and dedicated support." },
  { step: "04", title: "Grow", desc: "Launch co-branded initiatives and grow together in the Asian AI market." },
];

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Partners | AI Sorix - AI Partnership Program in Bangladesh & Asia"
        description="Partner with AI Sorix to bring AI-powered solutions to education, enterprise, and startups across Bangladesh and Asia. Join our growing partner ecosystem."
        path="/partners"
      />
      <Navbar />
      <PageHero
        eyebrow="Partners"
        title="Partner with AI Sorix and grow together."
        subtitle="Join the AI Sorix partner ecosystem — for education, enterprise, startups and regional distributors building on a unified, zero-trust multi-model AI workspace."
        primaryCta={{ label: "Become a Partner", to: "/partners" }}
        secondaryCta={{ label: "Explore Tools", to: "/tools" }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Partner Types */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Partnership Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerTypes.map((type, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{type.desc}</p>
                <ul className="space-y-2">
                  {type.benefits.map((b, bi) => (
                    <li key={bi} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-primary">{p.step}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Tiers */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Partner Tiers</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Tier</th>
                  <th className="text-left p-4 font-semibold text-foreground">For</th>
                  <th className="text-left p-4 font-semibold text-foreground">Key Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { tier: "Silver", who: "Small teams & resellers", benefit: "10% revenue share, partner badge" },
                  { tier: "Gold", who: "Established agencies", benefit: "20% revenue share, co-marketing, API early access" },
                  { tier: "Platinum", who: "Enterprise & regional distributors", benefit: "Custom revenue share, dedicated success manager, exclusive territory" },
                ].map((row) => (
                  <tr key={row.tier} className="bg-card">
                    <td className="p-4 font-semibold text-foreground">{row.tier}</td>
                    <td className="p-4 text-muted-foreground">{row.who}</td>
                    <td className="p-4 text-muted-foreground">{row.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <Handshake className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Become a Partner</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            Interested in partnering with AI Sorix? Reach out and let's explore how we can grow together — across education, enterprise, startups, and global distribution.
          </p>
          <a
            href="mailto:support@aisorix.com?subject=Partnership%20Inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" /> Get in Touch
          </a>
          <p className="text-xs text-muted-foreground mt-4">
            Or email us at <a href="mailto:support@aisorix.com" className="text-primary hover:underline">support@aisorix.com</a>
          </p>
        </div>
      </main>

      <PageCTA title="Let's grow together." desc="Apply today and unlock partner pricing, co-marketing and early access to the AI Sorix roadmap." />
      <Footer />
    </div>
  );
};

export default PartnersPage;
