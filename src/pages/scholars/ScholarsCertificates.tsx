import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Download, Eye, GraduationCap, Trophy, Sparkles, Lock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Certificate {
  id: string;
  kind: "course" | "competition" | "workshop";
  title: string;
  source_slug: string | null;
  issued_at: string;
}

const kindIcon = {
  course: GraduationCap,
  competition: Trophy,
  workshop: Sparkles,
};

const kindLabel = {
  course: "Course",
  competition: "Competition",
  workshop: "Workshop",
};

export default function ScholarsCertificates() {
  const { user, loading: authLoading } = useAuth();
  const { fullName } = useUserProfile();
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
      setItems((data as any) || []);
      setLoading(false);
    })();
  }, [user]);

  const downloadPdf = async (c: Certificate) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, w, h, "F");
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(3);
    doc.rect(24, 24, w - 48, h - 48);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text("SORIX SCHOLARS", w / 2, 90, { align: "center" });
    doc.setFontSize(30);
    doc.setTextColor(15, 23, 42);
    doc.text("Certificate of Completion", w / 2, 150, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139);
    doc.text("This is to certify that", w / 2, 210, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(15, 23, 42);
    doc.text(fullName || user?.email || "Learner", w / 2, 255, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139);
    doc.text(`has successfully completed the ${kindLabel[c.kind].toLowerCase()}`, w / 2, 295, {
      align: "center",
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text(c.title, w / 2, 335, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Issued ${new Date(c.issued_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}  ·  Certificate ID ${c.id.slice(0, 8).toUpperCase()}`,
      w / 2,
      h - 80,
      { align: "center" },
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text("Rakib Eslam  ·  Founder, AI Sorix", w / 2, h - 55, { align: "center" });
    doc.save(`sorix-scholars-${c.id.slice(0, 8)}.pdf`);
  };

  return (
    <>
      <SEOHead
        title="My Certificates — Sorix Scholars"
        description="Your Sorix Scholars certificate collection. Download and share verified certificates from courses, competitions and workshops."
        path="/sorixscholars/certificates"
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center">
            <Award className="w-6 h-6 text-primary-foreground" />
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Certificate Collection
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Every course, competition and workshop you finish at Sorix Scholars earns you a
          verifiable certificate. Download it as a PDF or share the link with your network.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {authLoading || loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Sign in to see your certificates</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              You need a free Sorix account to track your learning and unlock certificates.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90"
            >
              Log in
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
            <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">No certificates yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-md mx-auto">
              Finish your first course, competition, or workshop and your certificate will appear
              here automatically.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link
                to="/sorixscholars/courses"
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90"
              >
                Browse courses
              </Link>
              <Link
                to="/sorixscholars/competitions"
                className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted/40"
              >
                Enter a competition
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {items.map((c) => {
              const Icon = kindIcon[c.kind];
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {kindLabel[c.kind]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(c.issued_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground leading-snug">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/50">
                    <button
                      onClick={() => downloadPdf(c)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                    <button
                      onClick={() => downloadPdf(c)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted/40"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
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
