import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, Calendar, Clock, GraduationCap, Sparkles } from "lucide-react";
import MentorCard from "@/components/scholars/MentorCard";

interface Workshop {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  duration_hours: number | null;
  price_bdt: number | null;
  starts_at: string | null;
  mentor_name: string | null;
  mentor_role: string | null;
  mentor_bio: string | null;
  mentor_avatar_url: string | null;
}

export default function WorkshopDetailPage() {
  const { slug = "" } = useParams();
  const [workshop, setWorkshop] = useState<Workshop | null | undefined>(undefined);

  useEffect(() => {
    supabase
      .from("workshops")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => setWorkshop((data as any) ?? null));
  }, [slug]);

  if (workshop === undefined) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (workshop === null) return <Navigate to="/sorixscholars/workshops" replace />;

  return (
    <div className="bg-background">
      <SEOHead
        title={`${workshop.title} · Sorix Scholars Workshop`}
        description={workshop.summary ?? "Live hands-on AI workshop with AI Sorix mentors."}
        path={`/sorixscholars/workshops/${workshop.slug}`}
        ogImage={workshop.cover_url ?? undefined}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/sorixscholars/workshops"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to workshops
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted-foreground">
              {workshop.duration_hours && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {workshop.duration_hours} hours
                </span>
              )}
              {workshop.starts_at && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(workshop.starts_at).toLocaleString()}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                <Sparkles className="w-3 h-3" /> Live workshop
              </span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              {workshop.title}
            </h1>
            {workshop.summary && (
              <p className="mt-4 text-lg text-muted-foreground">{workshop.summary}</p>
            )}
          </div>

          {workshop.cover_url && (
            <div className="rounded-2xl overflow-hidden border border-border aspect-[16/9] bg-muted">
              <img src={workshop.cover_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {workshop.description && (
            <section className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-3">About this workshop</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {workshop.description}
              </p>
            </section>
          )}

          <MentorCard
            mentor={{
              name: workshop.mentor_name ?? undefined,
              role: workshop.mentor_role ?? undefined,
              bio: workshop.mentor_bio ?? undefined,
              avatarUrl: workshop.mentor_avatar_url ?? undefined,
            }}
          />
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className={`text-3xl font-bold ${
                    !workshop.price_bdt ? "text-primary" : "text-foreground"
                  }`}
                >
                  {workshop.price_bdt && workshop.price_bdt > 0
                    ? `৳${workshop.price_bdt.toLocaleString()}`
                    : "Free"}
                </span>
                {workshop.price_bdt && workshop.price_bdt > 0 && (
                  <span className="text-sm text-muted-foreground">one-time</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                Includes live mentorship, project review and certificate.
              </p>
              <Link
                to="/sorixscholars/courses"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                <GraduationCap className="w-4 h-4" /> Reserve a seat
              </Link>
              <p className="mt-3 text-[11px] text-center text-muted-foreground">
                Payment opens 7 days before the workshop date.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
