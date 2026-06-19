import { Star, Quote } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

interface Review {
  quoteBn: string;
  quoteEn: string;
  name: string;
  location: string;
}

const reviews: Review[] = [
  {
    quoteBn: "AI না শিখলে আমি সত্যিই সময়ের থেকে অনেক পিছিয়ে পড়তাম। সময়োপযোগী এক প্ল্যাটফর্ম হচ্ছে Sorix Scholars।",
    quoteEn: "Without learning AI I'd be way behind. Sorix Scholars is the platform of the moment.",
    name: "Sara Akhter",
    location: "Dhaka, Bangladesh",
  },
  {
    quoteBn: "AI শিখে আমার কাজের গতি এখন ১০ গুণ বেড়ে গেছে। Sorix Scholars-এর গাইডলাইন ছাড়া এটা সম্ভব হতো না।",
    quoteEn: "After learning AI my work speed is 10× faster. Wouldn't have happened without Sorix Scholars' guidance.",
    name: "Muhammad Sharif",
    location: "Dhaka, Bangladesh",
  },
  {
    quoteBn: "Learning AI at Sorix Scholars was the best decision for my career. Now I automate my daily tasks easily and stay ahead.",
    quoteEn: "Learning AI at Sorix Scholars was the best decision for my career. Now I automate my daily tasks easily and stay ahead.",
    name: "Samsul Baten",
    location: "New York, USA",
  },
  {
    quoteBn: "আগে AI নিয়ে ভয় ছিল, এখন আমি সাবলীলভাবে ChatGPT সহ অন্যান্য টুলস ব্যবহার করতে পারি।",
    quoteEn: "I used to fear AI; now I confidently use ChatGPT and many other tools.",
    name: "Nazimul Haque",
    location: "Mumbai, India",
  },
  {
    quoteBn: "মেন্টরশিপ সেশনগুলো অসাধারণ ছিল। ক্যারিয়ারে সরাসরি একটা পথ পেয়েছি।",
    quoteEn: "The mentorship sessions were exceptional. I got a clear path for my career.",
    name: "Tahmid Rahman",
    location: "London, UK",
  },
];

export default function ScholarsTestimonials() {
  const { t, lang } = useScholarsLang();

  return (
    <section className="bg-background py-14 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-[44px] leading-tight font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            {t("আমাদের লার্নাররা কী বলছেন?", "What our learners say")}
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1">{t("৫০০+ হ্যাপি লার্নারস", "500+ happy learners")}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 scrollbar-none">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="relative snap-start flex-shrink-0 w-[85%] sm:w-[360px] rounded-2xl bg-card border border-border p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="w-9 h-9 rounded-full bg-primary/10 grid place-items-center">
                  <Quote className="w-4 h-4 text-primary" />
                </span>
              </div>
              <p className="italic text-sm sm:text-base text-foreground leading-relaxed">
                "{lang === "bn" ? r.quoteBn : r.quoteEn}"
              </p>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary/15 text-primary text-sm font-bold grid place-items-center">
                  {r.name[0]}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.location}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
