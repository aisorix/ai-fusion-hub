import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  GraduationCap,
  Trophy,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  UserCog,
  ArrowRight,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { toast } from "sonner";
import { generateCertificatePdf } from "@/lib/certificateGenerator";

interface Enrollment {
  id: string;
  kind: "course" | "workshop" | "competition";
  source_slug: string;
  title: string;
  progress: number;
  status: "in_progress" | "completed";
  enrolled_at: string;
  completed_at: string | null;
}
interface Cert {
  id: string;
  kind: "course" | "workshop" | "competition";
  title: string;
  certificate_number: string;
  recipient_name: string;
  issued_at: string;
  issuer_name?: string;
  issuer_title?: string;
}

const kindIcon = { course: GraduationCap, workshop: Sparkles, competition: Trophy };
const kindPath = {
  course: "/sorixscholars/courses",
  workshop: "/sorixscholars/workshops",
  competition: "/sorixscholars/competitions",
};

export default function ScholarsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { fullName } = useUserProfile();
  const { t } = useScholarsLang();
  const nav = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"course" | "workshop" | "competition">("course");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      nav("/login?redirect=/sorixscholars/dashboard");
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const refresh = async () => {
    setLoading(true);
    const [e, c] = await Promise.all([
      supabase.from("user_enrollments" as any).select("*").order("enrolled_at", { ascending: false }),
      supabase
        .from("user_certificates" as any)
        .select("*")
        .order("issued_at", { ascending: false }),
    ]);
    setEnrollments(((e.data as any) || []) as Enrollment[]);
    setCerts(((c.data as any) || []) as Cert[]);
    setLoading(false);
  };

  const markComplete = async (e: Enrollment) => {
    const { data, error } = await supabase.rpc("update_enrollment_progress" as any, {
      _kind: e.kind,
      _slug: e.source_slug,
      _progress: 100,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    const newly = (data as any)?.newly_issued;
    toast.success(newly ? t("🎉 সার্টিফিকেট ইস্যু হয়েছে!", "🎉 Certificate issued!") : t("সম্পন্ন!", "Marked complete!"));
    refresh();
  };

  const stats = [
    {
      label: t("কোর্স", "Courses"),
      value: enrollments.filter((x) => x.kind === "course").length,
      icon: GraduationCap,
    },
    {
      label: t("ওয়ার্কশপ", "Workshops"),
      value: enrollments.filter((x) => x.kind === "workshop").length,
      icon: Sparkles,
    },
    {
      label: t("প্রতিযোগিতা", "Competitions"),
      value: enrollments.filter((x) => x.kind === "competition").length,
      icon: Trophy,
    },
    { label: t("সার্টিফিকেট", "Certificates"), value: certs.length, icon: Award },
  ];

  const items = enrollments.filter((e) => e.kind === tab);
  const firstName = (fullName || user?.email || "Learner").split(" ")[0];

  if (authLoading || loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="My Dashboard — Sorix Scholars" description="Track your enrolled courses, workshops and competitions on Sorix Scholars." path="/sorixscholars/dashboard" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
              {t(`স্বাগতম, ${firstName} 👋`, `Welcome back, ${firstName} 👋`)}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {t("আপনার শেখার যাত্রা এক জায়গায়।", "Your learning journey, all in one place.")}
            </p>
          </div>
          <Link
            to="/sorixscholars/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-sm font-semibold"
          >
            <UserCog className="w-4 h-4" /> {t("প্রোফাইল এডিট", "Edit profile")}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto">
          {(["course", "workshop", "competition"] as const).map((k) => {
            const Icon = kindIcon[k];
            const label = k === "course" ? t("কোর্স", "Courses") : k === "workshop" ? t("ওয়ার্কশপ", "Workshops") : t("প্রতিযোগিতা", "Competitions");
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  active ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t("এখনো কিছুতে এনরোল করেননি।", "You haven't enrolled in anything yet.")}
            </p>
            <Link
              to={kindPath[tab]}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90"
            >
              {t("ব্রাউজ করুন", "Browse")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((e) => {
              const Icon = kindIcon[e.kind];
              const done = e.status === "completed";
              return (
                <div key={e.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {done ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" /> {t("সম্পন্ন", "Completed")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
                            <Clock className="w-3 h-3" /> {t("চলমান", "In progress")}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(e.enrolled_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground leading-snug truncate">{e.title}</h3>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                      <span>{t("অগ্রগতি", "Progress")}</span>
                      <span className="font-semibold text-foreground">{e.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full transition-all"
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`${kindPath[e.kind]}/${e.source_slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted/40"
                    >
                      {t("চালিয়ে যান", "Continue")}
                    </Link>
                    {!done && (
                      <button
                        onClick={() => markComplete(e)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90"
                      >
                        {t("সম্পন্ন চিহ্নিত", "Mark complete")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent certificates */}
        {certs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
                {t("সাম্প্রতিক সার্টিফিকেট", "Recent certificates")}
              </h2>
              <Link to="/sorixscholars/certificates" className="text-xs font-semibold text-primary hover:underline">
                {t("সব দেখুন", "View all")} →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {certs.slice(0, 3).map((c) => (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                  <Award className="w-5 h-5 text-primary mb-2" />
                  <p className="text-[10px] text-muted-foreground font-mono mb-1">{c.certificate_number}</p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 line-clamp-2">{c.title}</h3>
                  <button
                    onClick={() => generateCertificatePdf(c as any)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90"
                  >
                    <Download className="w-3 h-3" /> {t("PDF ডাউনলোড", "Download PDF")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
