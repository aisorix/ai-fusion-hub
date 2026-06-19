import { X, Check } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function WhyLearnAI() {
  const { t } = useScholarsLang();

  const losses = [
    {
      title: t("আপনার চাকুরী চলে যেতে পারে", "Your job could disappear"),
      body: t(
        "যিনি AI জানেন জব মার্কেটে অলরেডি তার চাহিদা বেড়েছে বহুগুণ।",
        "AI-literate professionals are already in massively higher demand."
      ),
    },
    {
      title: t("ব্যবসার মুনাফা কমে যেতে পারে", "Your business profit may shrink"),
      body: t(
        "AI-এর সুবিধা না নিলে কম্পিটিটররা আপনার চেয়ে কম খরচে বেশি কাজ করবে।",
        "Without AI leverage, competitors will out-produce you at lower cost."
      ),
    },
    {
      title: t("সময় থেকে পিছিয়ে পড়বেন", "You'll fall behind your peers"),
      body: t(
        "AI ব্যবহারকারী ১০ জন মানুষ থেকে অন্তত ২০ বছর পিছিয়ে পড়বেন।",
        "You'll be 20 years behind colleagues who use AI every day."
      ),
    },
    {
      title: t("সময়ের বরকত হারাতে পারেন", "You'll lose the gift of time"),
      body: t(
        "যে কাজ ৫ মিনিটে করা যেত, সেটা করতে আপনাকে ব্যয় করতে হবে ৫ ঘণ্টা।",
        "A 5-minute task with AI will keep costing you 5 hours."
      ),
    },
  ];

  const gains = [
    {
      title: t("জব মার্কেটে চাহিদা বেশি", "Higher demand in the job market"),
      body: t(
        "আপনি AI জানলে যেকোনো কোম্পানি আপনাকে নিয়োগের ক্ষেত্রে প্রাধান্য দেবে।",
        "AI-skilled candidates are prioritised by hiring teams everywhere."
      ),
    },
    {
      title: t("ব্যবসার কস্ট কমে আসবে", "Your operating cost drops"),
      body: t(
        "AI ব্যবহারের ফলে ১০ জনের কাজ ২ জন করে দিতে পারায় আপনার ব্যবসার খরচ কমে আসবে বহুগুণ।",
        "Work that needed 10 people now needs 2 — slashing your operating cost."
      ),
    },
    {
      title: t("প্রাসঙ্গিক থাকবেন সবসময়", "Stay relevant for the long run"),
      body: t(
        "যুগের চাহিদাসম্পন্ন এই AI শেখার ফলে আপনি সবসময় প্রাসঙ্গিক থাকবেন। কালের গহ্বরে হারাবেন না।",
        "Learning today's most-demanded skill keeps you future-relevant — you won't be left behind."
      ),
    },
    {
      title: t("সময়ের বরকত আসবে", "Time becomes your superpower"),
      body: t(
        "৫ ঘণ্টার কাজ মাত্র ৫ মিনিটে করতে পারায় সময়ের বরকত পাবেন হিউজ পরিমাণে।",
        "Compressing 5 hours of work into 5 minutes gives you a massive time multiplier."
      ),
    },
  ];

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2
            className="text-2xl sm:text-3xl lg:text-[44px] leading-tight font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            {t("AI শেখা কেন ", "Why is learning AI ")}
            <span className="text-primary">{t("জরুরী?", "essential?")}</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t(
              "AI না জানলে আপনি কতটা পিছিয়ে পড়বেন আর জানলে কতটা এগিয়ে যাবেন — তার একটি তুলনামূলক চিত্র নিচে দেওয়া হলো।",
              "Here's a simple side-by-side of what you lose without AI vs. what you gain with it."
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Loss card */}
          <div className="rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-br from-rose-50 to-rose-100/40 dark:from-rose-950/30 dark:to-rose-900/10 border border-rose-200/60 dark:border-rose-900/40">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 grid place-items-center">
                <X className="w-5 h-5 text-rose-500" strokeWidth={3} />
              </span>
              <h3
                className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
              >
                {t("AI না শিখলে কী লস?", "What you lose without AI?")}
              </h3>
            </div>
            <ul className="space-y-5">
              {losses.map((it) => (
                <li key={it.title} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 grid place-items-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-bold text-foreground">{it.title}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                      {it.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Gain card */}
          <div className="rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-br from-emerald-50 to-emerald-100/40 dark:from-emerald-950/30 dark:to-emerald-900/10 border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 grid place-items-center">
                <Check className="w-5 h-5 text-emerald-600" strokeWidth={3} />
              </span>
              <h3
                className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
              >
                {t("AI শিখলে কী লাভ?", "What you gain with AI?")}
              </h3>
            </div>
            <ul className="space-y-5">
              {gains.map((it) => (
                <li key={it.title} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 grid place-items-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-bold text-foreground">{it.title}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                      {it.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
