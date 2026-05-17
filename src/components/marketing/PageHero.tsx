import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
}

/**
 * Drop-in gradient hero matching the new InfoPage look.
 * Use directly under <Navbar /> in legacy pages without changing their existing body.
 */
const PageHero: React.FC<PageHeroProps> = ({
  eyebrow = "AI Sorix",
  title,
  subtitle,
  primaryCta = { label: "Try AI Sorix Free", to: "/register" },
  secondaryCta = { label: "Explore Tools", to: "/tools" },
}) => {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-5">
          {eyebrow}
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl">
          {title}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {primaryCta && (
              <Link
                to={primaryCta.to}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                {primaryCta.label} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.to}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/50 backdrop-blur font-semibold hover:bg-muted/50 transition"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export const PageCTA: React.FC<{
  title?: string;
  desc?: string;
  button?: { label: string; to: string };
}> = ({
  title = "Start building with AI Sorix today",
  desc = "Join thousands of teams using AI Sorix to ship work faster with frontier AI models in one unified, zero-trust workspace.",
  button = { label: "Get Started Free", to: "/register" },
}) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-14 text-center">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
      <div className="relative">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{desc}</p>
        <Link
          to={button.to}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
        >
          {button.label} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default PageHero;
