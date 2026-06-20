import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ShieldAlert, Search, Download, Award } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { generateCertificatePdf } from "@/lib/certificateGenerator";

interface VerifyResult {
  valid: boolean;
  certificate_number?: string;
  recipient_name?: string;
  title?: string;
  kind?: "course" | "workshop" | "competition";
  issued_at?: string;
  issuer_name?: string;
  issuer_title?: string;
}

export default function CertificateVerifyPage() {
  const { number } = useParams();
  const nav = useNavigate();
  const { t } = useScholarsLang();
  const [input, setInput] = useState(number || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    if (number) verify(number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const verify = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setResult(null);
    const { data, error } = await supabase.rpc("verify_certificate" as any, { _number: num.trim() });
    setLoading(false);
    if (error) {
      setResult({ valid: false });
      return;
    }
    setResult(data as VerifyResult);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/sorixscholars/verify/${encodeURIComponent(input.trim())}`);
    verify(input);
  };

  return (
    <>
      <SEOHead
        title="Verify Certificate — Sorix Scholars"
        description="Verify the authenticity of a Sorix Scholars certificate by its certificate number."
        path="/sorixscholars/verify"
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            {t("সার্টিফিকেট যাচাই", "Verify a Certificate")}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          {t(
            "সার্টিফিকেট নম্বর লিখে যেকোনো Sorix Scholars সার্টিফিকেটের সত্যতা যাচাই করুন।",
            "Enter a certificate number to confirm any Sorix Scholars certificate.",
          )}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="SS-2026-XXXXXX"
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t("যাচাই হচ্ছে…", "Verifying…") : t("যাচাই করুন", "Verify")}
          </button>
        </form>

        {result && result.valid && (
          <div className="rounded-2xl border-2 border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                {t("যাচাইকৃত সার্টিফিকেট", "Verified Certificate")}
              </span>
            </div>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Item label={t("প্রাপক", "Recipient")} value={result.recipient_name!} />
              <Item label={t("সার্টিফিকেট নং", "Certificate No.")} value={result.certificate_number!} mono />
              <Item label={t("শিরোনাম", "Title")} value={result.title!} />
              <Item label={t("ধরন", "Kind")} value={result.kind!} capitalize />
              <Item
                label={t("ইস্যুর তারিখ", "Issued")}
                value={new Date(result.issued_at!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <Item label={t("ইস্যুকারী", "Issued by")} value={`${result.issuer_name} — ${result.issuer_title}`} />
            </dl>
            <button
              onClick={() => generateCertificatePdf(result as any)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90"
            >
              <Download className="w-4 h-4" /> {t("PDF কপি ডাউনলোড", "Download a copy (PDF)")}
            </button>
          </div>
        )}

        {result && !result.valid && (
          <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6 text-center">
            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground mb-1">
              {t("সার্টিফিকেট খুঁজে পাওয়া যায়নি", "Certificate not found")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("এই নম্বরের কোনো সার্টিফিকেট আমাদের রেকর্ডে নেই।", "We could not find a certificate with this number.")}
            </p>
          </div>
        )}

        {!result && !loading && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("প্রতিটি সার্টিফিকেটের নিচে নম্বর প্রিন্ট করা থাকে।", "Every certificate has its number printed at the bottom.")}
            </p>
            <Link to="/sorixscholars/certificates" className="text-xs font-semibold text-primary hover:underline mt-2 inline-block">
              {t("আমার সার্টিফিকেট দেখুন", "View my certificates")} →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

function Item({ label, value, mono, capitalize }: { label: string; value: string; mono?: boolean; capitalize?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</dt>
      <dd className={`text-sm text-foreground mt-0.5 ${mono ? "font-mono" : ""} ${capitalize ? "capitalize" : ""}`}>{value}</dd>
    </div>
  );
}
