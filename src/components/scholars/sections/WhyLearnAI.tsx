import { X, Check } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function WhyLearnAI() {
  const { t } = useScholarsLang();

  const losses = [
    {
      title: t("আপনার চাকরির সুযোগ কমে যেতে পারে", "Your career opportunities could shrink"),
      body: t(
        "AI দক্ষতাসম্পন্ন পেশাজীবীদের চাহিদা দ্রুত বাড়ছে। তাই বর্তমান ও ভবিষ্যতের কর্মবাজারে প্রতিযোগিতামূলক থাকতে AI দক্ষতা অর্জন এখন আগের চেয়ে অনেক বেশি গুরুত্বপূর্ণ।",
        "Demand for professionals with AI skills is growing rapidly. To stay competitive in today's and tomorrow's job market, developing AI skills is becoming increasingly important."
      ),
    },
    {
      title: t("ব্যবসার প্রবৃদ্ধি ও মুনাফা কমে যেতে পারে", "Your business growth and profits could slow down"),
      body: t(
        "AI ব্যবহারকারী ব্যবসাগুলো কম সময়ে, কম খরচে এবং আরও দক্ষতার সঙ্গে কাজ করতে পারে। AI-এর কার্যকর ব্যবহার না করলে প্রতিযোগিতায় পিছিয়ে পড়ার ঝুঁকি বাড়তে পারে।",
        "Businesses that adopt AI can often work faster, reduce costs, and improve efficiency. Without leveraging AI effectively, staying competitive can become more challenging."
      ),
    },
    {
      title: t("আপনি সহকর্মীদের তুলনায় পিছিয়ে পড়তে পারেন", "You may fall behind your peers"),
      body: t(
        "যারা AI ব্যবহার করে তাদের দক্ষতা ও কাজের গতি দ্রুত বাড়ছে। AI না শিখলে পরিবর্তনশীল কর্মপরিবেশে তাদের তুলনায় পিছিয়ে পড়ার ঝুঁকি তৈরি হতে পারে।",
        "Those who use AI are rapidly improving their skills and productivity. Without learning AI, there is a risk of falling behind in an evolving work environment."
      ),
    },
    {
      title: t("আপনার সময়ের দক্ষতা কমে যেতে পারে", "You may lose efficiency with your time"),
      body: t(
        "AI ব্যবহার করলে অনেক কাজ খুব অল্প সময়ে সম্পন্ন করা যায়। AI না জানলে একই কাজ করতে অনেক বেশি সময় ও পরিশ্রম ব্যয় হতে পারে, যা আপনার উৎপাদনশীলতাকে কমিয়ে দেয়।",
        "With AI, many tasks can be completed in a fraction of the time. Without it, the same work may require significantly more time and effort, reducing overall productivity."
      ),
    },
  ];

  const gains = [
    {
      title: t("জব মার্কেটে AI দক্ষতার উচ্চ চাহিদা", "High demand for AI skills in the job market"),
      body: t(
        "AI দক্ষতা থাকা প্রার্থীরা নিয়োগ প্রক্রিয়ায় দ্রুত অগ্রাধিকার পান। বর্তমান চাকরির বাজারে AI জানা একটি গুরুত্বপূর্ণ প্রতিযোগিতামূলক সুবিধা হিসেবে বিবেচিত হচ্ছে।",
        "Candidates with AI skills are increasingly prioritized in hiring processes. In today’s job market, AI knowledge is considered a strong competitive advantage."
      ),
    },
    {
      title: t("আপনার ব্যবসার অপারেটিং কস্ট কমতে পারে", "Your operating costs can decrease"),
      body: t(
        "AI ব্যবহারের মাধ্যমে অনেক কাজ আরও দ্রুত ও দক্ষভাবে সম্পন্ন করা যায়, ফলে প্রক্রিয়াগুলো সহজ হয় এবং সামগ্রিক অপারেটিং খরচ কমাতে সহায়তা করে।",
        "AI can help streamline workflows by automating and accelerating many tasks, which may lead to lower overall operational costs and improved efficiency."
      ),
    },
    {
      title: t("দীর্ঘমেয়াদে প্রাসঙ্গিক থাকতে পারবেন", "Stay relevant in the long run"),
      body: t(
        "AI-এর মতো চাহিদাসম্পন্ন দক্ষতা শিখলে পরিবর্তনশীল প্রযুক্তি ও কর্মবাজারে নিজেকে আপডেটেড রাখা সহজ হয়, যা দীর্ঘমেয়াদে আপনার প্রাসঙ্গিকতা বজায় রাখতে সাহায্য করে।",
        "Learning in-demand skills like AI helps you stay updated with evolving technology and job markets, supporting your long-term relevance in your field."
      ),
    },
    {
      title: t("আপনার সময় হবে আরও উৎপাদনশীল", "Your time becomes far more productive"),
      body: t(
        "AI ব্যবহার করলে অনেক কাজ অনেক দ্রুত সম্পন্ন করা সম্ভব হয়, ফলে আপনি একই সময়ে আরও বেশি কাজ শেষ করতে পারেন এবং আপনার সামগ্রিক উৎপাদনশীলতা বৃদ্ধি পায়।",
        "With AI, many tasks can be completed much faster, allowing you to accomplish more in the same amount of time and significantly increase your overall productivity."
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
              "AI না জানলে আপনি কতটা পিছিয়ে পড়তে পারেন এবং AI জানলে কতটা এগিয়ে যেতে পারেন—তার একটি সহজ তুলনামূলক চিত্র নিচে দেওয়া হলো।",
              "Here's a simple comparison of how far you might fall behind without AI—and how much you can gain by learning it."
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
                {t("AI না শিখলে কী কী সুযোগ হারাচ্ছেন?", "What opportunities are you missing without AI?")}
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
                {t("AI শিখে কী কী অর্জন করতে পারবেন?", "What can you achieve with AI?")}
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
