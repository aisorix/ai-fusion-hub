import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Download, GraduationCap, Trophy, Sparkles, Lock, ShieldCheck, Copy } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { toast } from "sonner";
import { generateCertificatePdf } from "@/lib/certificateGenerator";

interface Certificate {
  id: string;
  kind: "course" | "competition" | "workshop";
  title: string;
  source_slug: string | null;
  issued_at: string;
  certificate_number: string;
  recipient_name: string;
  issuer_name?: string;
  issuer_title?: string;
}

const kindIcon = { course: GraduationCap, competition: Trophy, workshop: Sparkles };

export default function ScholarsCertificates() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useScholarsLang();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_certificates" as any)
        .select("*")
        .order("issued_at", { ascending: false });
      setItems(((data as any) || []) as Certificate[]);
      setLoading(false);
    })();
  }, [user]);

  const kindLabel = {
    course: t("কোর্স", "Course"),
    competition: t("প্রতিযোগিতা", "Competition"),
    workshop: t("ওয়ার্কশপ", "Workshop"),
  };

  const copyLink = (num: string) => {
    const url = `${window.location.origin}/sorixscholars/verify/${num}`;
    navigator.clipboard.writeText(url);
    toast.success(t("ভেরিফাই লিংক কপি হয়েছে", "Verify link copied"));
  };

  const isNew = (iso: string) => Date.now() - new Date(iso).getTime() < 7 * 86400 * 1000;

  return (
    <>
      <SEOHead
        title="My Certificates — Sorix Scholars"
        description="Your Sorix Scholars certificate collection. Download verifiable certificates from courses, competitions and workshops."
        path="/sorixscholars/certificates"
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center">
                <Award className="w-6 h-6 text-primary-foreground" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
                {t("আমার সার্টিফিকেট", "Certificate Collection")}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              {t(
                "প্রতিটি কোর্স, ওয়ার্কশপ ও প্রতিযোগিতা সম্পন্ন করলে আপনি পান একটি যাচাইযোগ্য সার্টিফিকেট — যখন ইচ্ছা PDF ডাউনলোড করুন।",
                "Every course, competition and workshop you finish earns a verifiable certificate. Download or share it any time.",
              )}
            </p>
          </div>
          <Link
            to="/sorixscholars/verify"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-sm font-semibold"
          >
            <ShieldCheck className="w-4 h-4" /> {t("যাচাই করুন", "Verify a certificate")}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {authLoading || loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">{t("লগইন করুন", "Sign in to see your certificates")}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              {t("ফ্রি একাউন্ট তৈরি করুন এবং সার্টিফিকেট আনলক করুন।", "Create a free account to track your learning and unlock certificates.")}
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90">
              {t("লগইন", "Log in")}
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
            <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">{t("এখনো সার্টিফিকেট নেই", "No certificates yet")}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-md mx-auto">
              {t(
                "প্রথম কোর্স, ওয়ার্কশপ বা প্রতিযোগিতা সম্পন্ন করুন — আপনার সার্টিফিকেট স্বয়ংক্রিয়ভাবে এখানে চলে আসবে।",
                "Finish your first course, competition or workshop and your certificate will appear here automatically.",
              )}
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link to="/sorixscholars/courses" className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90">
                {t("কোর্স দেখুন", "Browse courses")}
              </Link>
              <Link to="/sorixscholars/competitions" className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted/40">
                {t("প্রতিযোগিতা", "Enter a competition")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {items.map((c) => {
              const Icon = kindIcon[c.kind];
              return (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col">
                  <div className="flex items-start gap-3">
                    <span className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {kindLabel[c.kind]}
                        </span>
                        {isNew(c.issued_at) && (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                            NEW
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{new Date(c.issued_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground leading-snug">{c.title}</h3>
                      <p className="text-[11px] text-muted-foreground font-mono mt-1">{c.certificate_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/50">
                    <button
                      onClick={() => generateCertificatePdf(c)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90"
                    >
                      <Download className="w-3.5 h-3.5" /> {t("PDF", "Download PDF")}
                    </button>
                    <Link
                      to={`/sorixscholars/verify/${c.certificate_number}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted/40"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> {t("যাচাই", "Verify")}
                    </Link>
                    <button
                      onClick={() => copyLink(c.certificate_number)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted/40"
                      aria-label="Copy verify link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
