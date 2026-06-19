import { CheckCircle2, PlayCircle } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import founderAsset from "@/assets/founder-rakib.png.asset.json";

export default function WhyScholars() {
  const { t } = useScholarsLang();
  const items = [
    t("১:১ AI মেন্টরশিপ", "1:1 AI Mentorship"),
    t("অনলাইন কোর্সেস", "Online Courses"),
    t("লাইভ ওয়ার্কশপস", "Live Workshops"),
    t("ইবুক ও রিসোর্সেস", "eBooks & Resources"),
  ];

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-muted/40 border border-border/60 p-5 sm:p-8 lg:p-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2
              className="text-2xl sm:text-3xl lg:text-[40px] leading-tight font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
            >
              {t("কেন ", "Why ")}
              <span className="text-primary">{t("Sorix Scholars", "Sorix Scholars")}</span>
              {t(" আপনার জন্য?", " is for you?")}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t(
                "আমরা আপনার জন্য নিয়ে এসেছি এমন এক লার্নিং প্ল্যাটফর্ম, যেখানে আপনি খুব সহজে ও হাতে-কলমে AI-এর ব্যবহার শিখে নিজের পার্সোনাল ও প্রফেশনাল লাইফে আরও গ্রোথ আনতে পারবেন।",
                "We've built a learning platform where you can quickly and practically master AI — and use it to grow your personal and professional life."
              )}
            </p>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t(
                "তাতে করে আপনার বিদ্যমান জব ও বিজনেস সবকিছু থাকবে ফিউচার প্রুফ ও রিস্ক ফ্রি।",
                "That way your current job and business stay future-proof and risk-free."
              )}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border/60"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/30 to-cyan-500/20 blur-2xl opacity-50" />
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-video">
              <img
                src={founderAsset.url}
                alt={t("Sorix Scholars পরিচিতি", "About Sorix Scholars")}
                className="w-full h-full object-cover"
              />
              <button
                aria-label="Play"
                className="absolute inset-0 grid place-items-center group"
              >
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background/85 backdrop-blur grid place-items-center shadow-2xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
