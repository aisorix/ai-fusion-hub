import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { courses, competitions } from "@/data/academy";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";

const stats = [
  { label: "Learners worldwide", value: "12,400+", icon: Users },
  { label: "Courses & tracks", value: `${courses.length}`, icon: GraduationCap },
  { label: "Active competitions", value: `${competitions.length}`, icon: Trophy },
  { label: "Certificates issued", value: "3,200+", icon: Award },
];


export default function ScholarsHome() {
  const featured = courses.slice(0, 6);

  return (
    <>
      <SEOHead
        title="Sorix Scholars — Learn frontier AI, build, get certified"
        description="Sorix Scholars is the learning arm of AI Sorix. Take free and pro courses, enter global competitions, earn recognised certificates."
        path="/sorixscholars"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Sorix Scholars · 2026 cohort open
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Learn frontier AI.
            <br />
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent">
              Build. Get certified.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A practitioner-led learning track for builders, founders, and researchers. Take
            courses, enter global competitions, and earn certificates that travel with you.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/sorixscholars/courses"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Browse courses <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sorixscholars/competitions"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted/40 transition-colors"
            >
              See competitions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center">
                <s.icon className="w-5 h-5 text-primary" />
              </span>
              <div>
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured courses</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Hands-on tracks built by AI Sorix practitioners.
            </p>
          </div>
          <Link
            to="/sorixscholars/courses"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            All courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((c) => (
            <Link
              key={c.slug}
              to={`/sorixscholars/courses/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={c.cover}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {c.level}
                  </span>
                  <span>·</span>
                  <span>{c.duration}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{c.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{c.priceLabel}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mentor section removed from home — now shown on course/workshop/competition detail pages */}


      {/* Competitions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Live competitions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ship work. Win cash, credits, mentorship, and a launch runway.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {competitions.map((c) => (
            <Link
              key={c.slug}
              to={`/sorixscholars/competitions/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="aspect-[16/8] overflow-hidden bg-muted">
                <img
                  src={c.cover}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                  <Trophy className="w-3.5 h-3.5" /> {c.prize}
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Certificates teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center">
              <Award className="w-7 h-7 text-primary-foreground" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-foreground">Your Certificate Collection</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Every course, competition and workshop you complete adds a verifiable certificate
                to your collection.
              </p>
            </div>
          </div>
          <Link
            to="/sorixscholars/certificates"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
          >
            View my certificates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
