import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Sparkles, Globe, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { competitions } from "@/data/academy";

const why = [
  { icon: Sparkles, title: "Real prizes, real launches", desc: "Cash, credits, mentorship, and a featured spotlight in the AI Sorix ecosystem." },
  { icon: Globe, title: "Open worldwide", desc: "Online-first. Open to individuals and teams in any country, any timezone." },
  { icon: Users, title: "Hands-on mentorship", desc: "Direct office hours with the SorixLab engineering and product team." },
];

export default function CompetitionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Competitions · SorixLab Project — AI Build Challenge & Startup Funding"
        description="Two worldwide competitions from the SorixLab Project: the AI Sorix Build Challenge and the SorixLab Startup Funding Competition. Cash, credits, mentorship, and a launch runway."
        path="/competitions"
      />
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-20">
          <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">← SorixLab Project</Link>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-5">
            <Trophy className="w-3.5 h-3.5" /> Competitions
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-4xl font-display">
            Build with us. <br className="hidden sm:block" />Win cash, credits, and a launch runway.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Two worldwide competitions from the SorixLab Project — for individual builders, indie teams, and early-stage founders.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid md:grid-cols-3 gap-5">
        {why.map((w) => (
          <div key={w.title} className="p-6 rounded-2xl border border-border bg-card">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <w.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground">{w.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid md:grid-cols-2 gap-5">
        {competitions.map((c) => (
          <Link
            key={c.slug}
            to={`/competitions/${c.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              <img src={c.cover} alt="" loading="lazy" width={1024} height={576} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {c.status}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{c.prize}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.tagline}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                Read the brief <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <Footer />
    </div>
  );
}
