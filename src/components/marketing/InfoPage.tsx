import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface InfoFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface InfoFAQ {
  q: string;
  a: string;
}

export interface InfoPageProps {
  // SEO
  seoTitle: string;
  seoDescription: string;
  path: string;
  schemaType?: "WebPage" | "Article" | "Service" | "AboutPage" | "CollectionPage";
  about?: string;
  // Hero
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  // Content
  intro?: React.ReactNode;
  features?: InfoFeature[];
  sections?: { title: string; body: React.ReactNode }[];
  bullets?: string[];
  faqs?: InfoFAQ[];
  // CTA banner
  ctaTitle?: string;
  ctaDesc?: string;
  ctaButton?: { label: string; to: string };
}

const BASE = "https://www.aisorix.com";

const InfoPage: React.FC<InfoPageProps> = ({
  seoTitle,
  seoDescription,
  path,
  schemaType = "WebPage",
  about,
  eyebrow,
  title,
  subtitle,
  primaryCta = { label: "Try AI Sorix Free", to: "/register" },
  secondaryCta = { label: "Explore Tools", to: "/tools" },
  intro,
  features,
  sections,
  bullets,
  faqs,
  ctaTitle = "Start building with AI Sorix today",
  ctaDesc = "Join thousands of teams using AI Sorix to ship work faster with frontier AI models in one workspace.",
  ctaButton = { label: "Get Started Free", to: "/register" },
}) => {
  const url = `${BASE}${path}`;
  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: title,
      url,
      description: seoDescription,
      about: about || title,
      isPartOf: { "@type": "WebSite", name: "AI Sorix", url: BASE },
      publisher: {
        "@type": "Organization",
        name: "AI Sorix",
        url: BASE,
        logo: `${BASE}/logo.png`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    },
  ];
  if (faqs && faqs.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title={seoTitle} description={seoDescription} path={path} />
      {jsonLd.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-5">
            {eyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl">
            {title}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={primaryCta.to}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              {primaryCta.label} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={secondaryCta.to}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/50 backdrop-blur font-semibold hover:bg-muted/50 transition"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      {intro && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="prose prose-invert max-w-none text-muted-foreground text-base sm:text-lg leading-relaxed space-y-4">
            {intro}
          </div>
        </section>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur hover:border-primary/40 hover:bg-card/70 transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sections */}
      {sections && sections.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
          {sections.map((s) => (
            <article key={s.title}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">{s.title}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">{s.body}</div>
            </article>
          ))}
        </section>
      )}

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card/40"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/40 transition"
              >
                <summary className="cursor-pointer font-semibold text-foreground list-none flex justify-between items-center gap-4">
                  <span>{f.q}</span>
                  <span className="text-primary group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-14 text-center">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">{ctaTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{ctaDesc}</p>
            <Link
              to={ctaButton.to}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
            >
              {ctaButton.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InfoPage;
