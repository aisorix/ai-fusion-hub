import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, GraduationCap, ChevronDown, Sparkles, User } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { courses, getCourse } from "@/data/academy";
import ContactModal from "@/components/academy/ContactModal";

export default function CourseDetailPage() {
  const { slug = "" } = useParams();
  const course = getCourse(slug);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (!course) return <Navigate to="/sorixscholars/courses" replace />;

  const related = courses.filter((c) => c.slug !== course.slug).slice(0, 3);

  return (
    <div className="bg-background">
      <SEOHead
        title={`${course.title} · Sorix Scholars`}
        description={course.tagline}
        path={`/sorixscholars/courses/${course.slug}`}
        ogImage={course.cover}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/sorixscholars/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all courses
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{course.level}</span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1] font-display">{course.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{course.tagline}</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border aspect-[16/9] bg-muted">
            <img src={course.cover} alt="" loading="lazy" width={1024} height={576} className="w-full h-full object-cover" />
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{course.overview}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-5">What you'll learn</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-5">Curriculum</h2>
            <div className="space-y-2">
              {course.curriculum.map((m, i) => (
                <div key={m.title} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/40 transition-colors"
                  >
                    <span className="font-semibold text-foreground text-left">{m.title}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
                  </button>
                  {openIdx === i && (
                    <ul className="px-5 pb-4 space-y-2 border-t border-border/60 pt-4">
                      {m.lessons.map((l) => (
                        <li key={l} className="flex gap-2.5 text-sm text-muted-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-1" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Instructor</h2>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{course.instructor.name}</div>
                <div className="text-sm text-primary">{course.instructor.role}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{course.instructor.bio}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-5">FAQ</h2>
            <div className="space-y-3">
              {course.faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                  <div className="font-semibold text-foreground">{f.q}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT - sticky enroll card */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-3xl font-bold ${course.priceLabel === "Free" ? "text-primary" : "text-foreground"}`}>{course.priceLabel}</span>
                {course.priceLabel !== "Free" && <span className="text-sm text-muted-foreground">one-time</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-5">Lifetime access · Self-paced · Cohort support included</p>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20 mb-3"
              >
                <GraduationCap className="w-4 h-4" />
                {course.priceLabel === "Free" ? "Request access" : "Contact to enroll"}
              </button>
              <p className="text-[11px] text-center text-muted-foreground">Payments open soon. We'll personally reply within 24 hours.</p>

              <ul className="mt-6 pt-6 border-t border-border/60 space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4 text-primary" />{course.duration}</li>
                <li className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="w-4 h-4 text-primary" />Level: {course.level}</li>
                <li className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" />Certificate of completion</li>
                <li className="flex items-center gap-2 text-muted-foreground"><Sparkles className="w-4 h-4 text-primary" />Capstone project review</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <div className="text-sm font-semibold text-foreground mb-1">Team enrollment?</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Discounts for 5+ seats. Custom cohorts available for organizations.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Related courses</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {related.map((r) => (
            <Link key={r.slug} to={`/sorixscholars/courses/${r.slug}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all">
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img src={r.cover} alt="" loading="lazy" width={1024} height={576} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{r.title}</div>
                <div className="mt-2 text-xs text-muted-foreground">{r.duration}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/sorixscholars/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
            See all courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>



      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Enroll · ${course.title}`}
        subtitle="Tell us a little about you and we'll get you set up within 24 hours."
        subjectPrefix={`Enroll: ${course.title}`}
        extraLabel="Company / Role (optional)"
      />
    </div>
  );
}
