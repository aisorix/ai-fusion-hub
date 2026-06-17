import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Calendar, Clock, GraduationCap, Sparkles } from "lucide-react";

interface Workshop {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  duration_hours: number | null;
  price_bdt: number | null;
  starts_at: string | null;
  mentor_name: string | null;
}

export default function WorkshopsPage() {
  const [rows, setRows] = useState<Workshop[] | null>(null);

  useEffect(() => {
    supabase
      .from("workshops")
      .select("id, slug, title, summary, cover_url, duration_hours, price_bdt, starts_at, mentor_name")
      .eq("is_published", true)
      .order("starts_at", { ascending: true })
      .then(({ data }) => setRows((data as any) ?? []));
  }, []);

  return (
    <div className="bg-background">
      <SEOHead
        title="Workshops · Sorix Scholars"
        description="Live, hands-on AI workshops mentored by AI Sorix practitioners. Build real projects in days, not months."
        path="/sorixscholars/workshops"
      />

      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Sorix Scholars · Workshops
          </span>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Live, hands-on AI workshops
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Compact, mentor-led sessions. Build a real project end-to-end and earn a certificate.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {rows === null && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        )}

        {rows && rows.length === 0 && (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border">
            <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h2 className="text-xl font-bold text-foreground">No workshops scheduled right now</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              We&apos;re curating the next cohort. Check back soon — or join a course in the meantime.
            </p>
            <Link
              to="/sorixscholars/courses"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90"
            >
              Browse courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {rows && rows.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map((w) => (
              <Link
                key={w.id}
                to={`/sorixscholars/workshops/${w.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  {w.cover_url ? (
                    <img
                      src={w.cover_url}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    {w.duration_hours && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {w.duration_hours}h
                      </span>
                    )}
                    {w.starts_at && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(w.starts_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {w.title}
                  </h3>
                  {w.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{w.summary}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {w.price_bdt && w.price_bdt > 0 ? `৳${w.price_bdt.toLocaleString()}` : "Free"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
