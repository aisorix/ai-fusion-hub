import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Calendar,
  Award,
  ListChecks,
  ScrollText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCompetition } from "@/data/academy";
import ContactModal from "@/components/academy/ContactModal";

export default function CompetitionDetailPage() {
  const { slug = "" } = useParams();
  const comp = getCompetition(slug);
  const [open, setOpen] = useState(false);

  if (!comp) return <Navigate to="/competitions" replace />;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${comp.title} · SorixLab Scholars`}
        description={comp.tagline}
        path={`/competitions/${comp.slug}`}
        ogImage={comp.cover}
      />
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/40">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${comp.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20">
          <Link
            to="/competitions"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to competitions
          </Link>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> {comp.status}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground px-2.5 py-1 rounded-full bg-card border border-border">
              <Trophy className="w-3.5 h-3.5 text-primary" /> {comp.prize}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] max-w-4xl font-display">
            {comp.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">{comp.tagline}</p>
          <div className="mt-7">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
            >
              Apply now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">About this competition</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">{comp.overview}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Tracks
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {comp.tracks.map((t) => (
              <div key={t.title} className="p-5 rounded-2xl border border-border bg-card">
                <div className="font-semibold text-foreground">{t.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" /> Judging criteria
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comp.criteria.map((c) => (
              <div key={c.title} className="p-5 rounded-2xl border border-border bg-card">
                <div className="font-semibold text-foreground">{c.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Timeline
          </h2>
          <ol className="space-y-3">
            {comp.timeline.map((t, i) => (
              <li key={t.title} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-primary">{t.date}</div>
                  <div className="font-semibold text-foreground">{t.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Prizes
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {comp.prizes.map((p) => (
              <div key={p.place} className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
                <div className="text-xs uppercase tracking-wider font-bold text-primary">{p.place}</div>
                <div className="font-semibold text-foreground mt-1">{p.reward}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-primary" /> Rules
          </h2>
          <ul className="space-y-3 max-w-3xl">
            {comp.rules.map((r) => (
              <li key={r} className="flex gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-5">FAQ</h2>
          <div className="space-y-3 max-w-3xl">
            {comp.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <div className="font-semibold text-foreground">{f.q}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-12 text-center">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
            <div className="relative">
              <Trophy className="w-10 h-10 mx-auto text-primary mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-foreground">Ready to enter?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Applications take under five minutes. We reply within two business days.
              </p>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
              >
                Apply now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        title={`Apply · ${comp.title}`}
        subtitle="Tell us about you and your project. We reply within two business days."
        subjectPrefix={`Apply: ${comp.title}`}
        extraLabel="Project name / URL (optional)"
      />
    </div>
  );
}
