import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function ScholarsFAQ() {
  const { t } = useScholarsLang();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: t("Sorix Scholars কী?", "What is Sorix Scholars?"),
      a: t(
        "Sorix Scholars হলো AI Sorix-এর লার্নিং প্ল্যাটফর্ম, যেখানে কোর্স, লাইভ ওয়ার্কশপ ও ১:১ মেন্টরশিপের মাধ্যমে যেকেউ AI শিখতে পারবেন।",
        "Sorix Scholars is AI Sorix's learning platform — courses, live workshops and 1:1 mentorship to help anyone learn AI."
      ),
    },
    {
      q: t("আমি কি একদম নতুন হিসেবে শুরু করতে পারব?", "Can I start as a complete beginner?"),
      a: t(
        "অবশ্যই। আমাদের সব কোর্স বেসিক থেকে শুরু করে অ্যাডভান্সড পর্যন্ত স্টেপ-বাই-স্টেপ সাজানো।",
        "Absolutely — every course is structured step-by-step from basics to advanced."
      ),
    },
    {
      q: t("এখানে কোন কোন AI টুলস শেখানো হবে?", "Which AI tools will be taught?"),
      a: t(
        "ChatGPT, Claude, Gemini, Midjourney, AI Sorix-এর নিজস্ব টুলস সহ ৩০+ ইন্ডাস্ট্রি-স্ট্যান্ডার্ড AI টুল।",
        "ChatGPT, Claude, Gemini, Midjourney, AI Sorix's own tools and 30+ industry-standard AI tools."
      ),
    },
    {
      q: t("কোর্সগুলোতে কি আজীবন এক্সেস পাওয়া যাবে?", "Do I get lifetime access to courses?"),
      a: t(
        "হ্যাঁ, একবার এনরোল করলে আপনি ভবিষ্যতের সব আপডেট সহ আজীবন এক্সেস পাবেন।",
        "Yes — enrol once and you get lifetime access including all future updates."
      ),
    },
    {
      q: t("মেন্টরশিপ সাপোর্ট কিভাবে পাব?", "How do I get mentorship support?"),
      a: t(
        "ড্যাশবোর্ড থেকে আপনি ১:১ মেন্টরশিপ স্লট বুক করতে পারবেন; Pro ও Premium মেম্বাররা প্রতি মাসে অতিরিক্ত সেশন পান।",
        "From your dashboard you can book 1:1 mentorship slots; Pro and Premium members get extra monthly sessions."
      ),
    },
  ];

  return (
    <section className="bg-background py-14 sm:py-20 relative">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-2xl sm:text-3xl lg:text-[40px] leading-tight font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            {t("সচরাচর জিজ্ঞাসিত প্রশ্নাবলী ও সমাধান ", "Frequently Asked Questions and Solutions. ")}
            <span className="text-primary">(FAQ)</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t(
              "Sorix Scholars এবং আমাদের প্রিমিয়াম কোর্সগুলো নিয়ে মনে কোনো কনফিউশন? সব প্রশ্নের ঝটপট উত্তর পেয়ে যান ঠিক নিচেই!",
              "Any confusion about Sorix Scholars and our premium courses? Find quick answers to all great questions right below!"
            )}
          </p>
        </div>

        <div className="rounded-3xl bg-card border border-border/60 p-3 sm:p-5 space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left rounded-2xl bg-background border border-border/50 px-4 sm:px-5 py-4 hover:border-border transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm sm:text-base font-semibold text-foreground">{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
