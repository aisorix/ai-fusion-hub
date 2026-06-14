import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Trophy,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Globe,
  Zap,
  Award,
  Clock,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { courses, competitions } from "@/data/academy";
import heroBg from "@/assets/academy-hero.jpg";

const stats = [
  { value: "12k+", label: "Active learners" },
  { value: "60+", label: "Countries" },
  { value: "180+", label: "Hours of content" },
  { value: "98%", label: "Would recommend" },
];

const losses = [
  { title: "Career stalls", desc: "Roles that don't use AI are being restructured across every industry." },
  { title: "Output gap widens", desc: "AI-fluent peers ship 3–5x more in the same hours, every week." },
  { title: "Decisions get slower", desc: "Without AI, research, analysis, and writing eat your whole calendar." },
  {
    title: "Skills compound elsewhere",
    desc: "Every month you wait, the people who started already get further ahead.",
  },
];

const gains = [
  {
    title: "Compounding leverage",
    desc: "AI gives back hours every day. Those hours become the highest-leverage work you do.",
  },
  {
    title: "Stronger market position",
    desc: "AI-fluent professionals are the most-recruited segment of the global workforce.",
  },
  { title: "Better decisions, faster", desc: "Research, synthesis, and writing happen in minutes, not afternoons." },
  {
    title: "Frontier-ready",
    desc: "You stay current as models change instead of falling another generation behind each quarter.",
  },
];

const offerings = [
  {
    num: "01",
    icon: GraduationCap,
    title: "Self-paced Courses",
    desc: "Six structured courses from prompt fundamentals to LLM Ops, taught by the AI Sorix team.",
    to: "#courses",
    active: true,
  },
  {
    num: "02",
    icon: Trophy,
    title: "AI & Funding Competitions",
    desc: "Quarterly Build Challenge and Sorix Scholars Startup Funding Competition — cash, credits, and mentorship.",
    to: "/sorixscholars/competitions",
    active: true,
  },
  {
    num: "03",
    icon: Users,
    title: "1:1 Mentorship",
    desc: "Hand-matched mentors from the AI Sorix engineering and product team.",
    to: null,
    active: false,
    soon: "Coming soon",
  },
  {
    num: "04",
    icon: BookOpen,
    title: "eBooks & Resources",
    desc: "Field-tested playbooks, prompt libraries, and reference architectures.",
    to: null,
    active: false,
    soon: "Coming soon",
  },
];

const promises = [
  {
    icon: Sparkles,
    title: "Practitioner-built",
    desc: "Every lesson is drawn from real production work shipping AI features used worldwide.",
  },
  {
    icon: Globe,
    title: "Globally accessible",
    desc: "Online-first, English with growing Bangla support, designed for any timezone.",
  },
  {
    icon: Zap,
    title: "Ship-by-day-three",
    desc: "Every course ends with a real, shippable artifact — not a certificate of attendance.",
  },
];

export default function CoursesPage() {
  return (
    <div className="bg-background">
      <SEOHead
        title="Sorix Scholars — Learn, Build, Win"
        description="Self-paced AI courses, the Sorix Scholars Build Challenge, and the Sorix Scholars Startup Funding Competition. Practitioner-built lessons from the team behind AI Sorix."
        path="/sorixscholars/courses"
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Sorix Scholars
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-4xl font-display">
            Master frontier AI. <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
              Build what's next.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Practitioner-built courses, a worldwide Build Challenge, and a Sorix Scholars Funding Competition — everything you
            need to go from your first prompt to shipping an AI-native company.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
            >
              Browse courses <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/sorixscholars/competitions"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/50 backdrop-blur font-semibold hover:bg-muted/60 transition text-foreground"
            >
              <Trophy className="w-4 h-4 text-primary" /> Join a competition
            </Link>
          </div>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-card/60 backdrop-blur border border-border/60">
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Why learn AI, and why now?</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            The gap between AI-fluent and non-fluent professionals is compounding weekly. Here's what it looks like in
            numbers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground">If you don't learn AI</h3>
            </div>
            <ul className="space-y-4">
              {losses.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">If you do</h3>
            </div>
            <ul className="space-y-4">
              {gains.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OFFERINGS BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            What Sorix Scholars offers
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Four pillars of a complete AI education. Two are live today; two are landing soon.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {offerings.map((o) => {
            const Card = (
              <div
                className={`group h-full relative overflow-hidden rounded-3xl border p-7 sm:p-9 transition-all ${o.active ? "border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl" : "border-border/60 bg-card/50"}`}
              >
                <div className="absolute right-6 top-5 text-5xl font-black text-foreground/[0.04] tracking-tighter">
                  {o.num}
                </div>
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${o.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <o.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{o.title}</h3>
                    {o.soon && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                        {o.soon}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
                  {o.active && (
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
            if (o.active && o.to?.startsWith("/")) {
              return (
                <Link key={o.num} to={o.to}>
                  {Card}
                </Link>
              );
            }
            if (o.active && o.to?.startsWith("#")) {
              return (
                <a key={o.num} href={o.to}>
                  {Card}
                </a>
              );
            }
            return <div key={o.num}>{Card}</div>;
          })}
        </div>
      </section>

      {/* COURSE CATALOG */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 scroll-mt-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">All courses</h2>
            <p className="mt-2 text-muted-foreground">Six self-paced courses, beginner to advanced.</p>
          </div>
          <div className="text-sm text-muted-foreground">{courses.length} courses · updated 2026</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <Link
              key={c.slug}
              to={`/sorixscholars/courses/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={c.cover}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={576}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-foreground border border-border/60">
                  {c.level}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {c.duration}
                  </span>
                </div>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between">
                  <span
                    className={`text-base font-bold ${c.priceLabel === "Free" ? "text-primary" : "text-foreground"}`}
                  >
                    {c.priceLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View course <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMPETITIONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Competitions</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Build with us. Cash, credits, mentorship, and a launch runway for the best teams worldwide.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {competitions.map((comp) => (
            <Link
              key={comp.slug}
              to={`/sorixscholars/competitions/${comp.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={comp.cover}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={576}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {comp.status}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{comp.prize}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {comp.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{comp.tagline}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Read the brief <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMISES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {promises.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl border border-border bg-card">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-14 text-center">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
          <div className="relative">
            <Award className="w-10 h-10 mx-auto text-primary mb-4" />
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">
              Start with one course this week
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-7">
              Pick a free course, finish a module tonight, ship something on day three. That's how every AI-fluent
              professional you know started.
            </p>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
            >
              Pick a course <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
