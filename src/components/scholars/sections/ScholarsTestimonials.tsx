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
    quoteEn: "My work speed is 10× faster after learning AI. Couldn't have done it without Sorix Scholars.",
    name: "Muhammad Sharif",
    location: "Chattogram, Bangladesh",
  },
  {
    quoteBn: "এই কোর্সটি করে আমি ফ্রিল্যান্সিং-এ মাসে $1,200 ইনকাম শুরু করেছি — AI দিয়ে কনটেন্ট ও অটোমেশন সার্ভিস বিক্রি করি।",
    quoteEn: "After this course I started earning $1,200/mo freelancing — selling AI content and automation services.",
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
  {
    quoteBn: "আমার এজেন্সিতে রিপোর্ট জেনারেশনে দিনে ৪ ঘণ্টা সময় বাঁচছে। ROI প্রথম সপ্তাহেই পেয়েছি।",
    quoteEn: "Our agency saves 4 hours a day on report generation. ROI in the very first week.",
    name: "Farah Chowdhury",
    location: "Dubai, UAE",
  },
  {
    quoteBn: "ইউনিভার্সিটির থিসিস রিসার্চে AI ওয়ার্কফ্লো শিখে আমি ৩ মাসের কাজ ৩ সপ্তাহে শেষ করেছি।",
    quoteEn: "AI research workflows let me finish 3 months of thesis work in 3 weeks.",
    name: "Arif Mahmud",
    location: "Toronto, Canada",
  },
  {
    quoteBn: "প্রম্পট ইঞ্জিনিয়ারিং মডিউলটাই গেম-চেঞ্জার। এখন প্রতিটা মডেল থেকে ঠিক যা চাই সেটাই বের করি।",
    quoteEn: "The prompt engineering module is a game-changer — I now pull exactly what I want out of any model.",
    name: "Priya Sharma",
    location: "Bengaluru, India",
  },
  {
    quoteBn: "একজন স্কুল টিচার হিসেবে আমি ক্লাস প্ল্যান ও কুইজ ৫ মিনিটে তৈরি করি। শিক্ষার্থীরাও মুগ্ধ।",
    quoteEn: "As a teacher I now build lesson plans and quizzes in 5 minutes. Students are amazed.",
    name: "Rumana Sultana",
    location: "Sylhet, Bangladesh",
  },
  {
    quoteBn: "Sorix Agent দিয়ে আমি একটা পুরো সেলস আউটরিচ অটোমেশন বানিয়েছি — কোডিং ব্যাকগ্রাউন্ড নেই, তবুও।",
    quoteEn: "I built a full sales outreach automation with Sorix Agent — no coding background, still shipped it.",
    name: "Hasan Iqbal",
    location: "Singapore",
  },
  {
    quoteBn: "ক্লাসগুলো প্র্যাক্টিক্যাল আর সাপোর্ট কমিউনিটি দারুণ অ্যাক্টিভ। প্রশ্ন করলে দ্রুত উত্তর পাই।",
    quoteEn: "Classes are practical and the support community is super active — questions get answered fast.",
    name: "Lubna Karim",
    location: "Berlin, Germany",
  },
  {
    quoteBn: "ফাইনালি একটা বাংলা ভাষার AI লার্নিং প্ল্যাটফর্ম যেটা সিরিয়াসলি ক্যারিয়ার ফোকাসড।",
    quoteEn: "Finally a Bangla-first AI learning platform that's seriously career-focused.",
    name: "Sadia Noor",
    location: "Rajshahi, Bangladesh",
  },
  {
    quoteBn: "আমি একজন ডাক্তার — পেশেন্ট নোট এবং রিসার্চ সামারি AI দিয়ে করছি, এক ঘন্টার কাজ এখন ১০ মিনিটে।",
    quoteEn: "I'm a doctor — patient notes and research summaries with AI take 10 minutes instead of an hour.",
    name: "Dr. Imran Hossain",
    location: "Kuala Lumpur, Malaysia",
  },
  {
    quoteBn: "সার্টিফিকেটটা LinkedIn-এ অ্যাড করার পর ৩টা ইন্টারভিউ কল পেয়েছি। এক মাসেই জব সুইচ করেছি।",
    quoteEn: "After adding the certificate to LinkedIn I got 3 interview calls — switched jobs within a month.",
    name: "Niloy Saha",
    location: "Dhaka, Bangladesh",
  },
];

export default function ScholarsTestimonials() {
  const { t, lang } = useScholarsLang();

  return (
    <section className="bg-background py-14 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-[40px] leading-tight font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            {t("আমাদের প্রশিক্ষণার্থীদের মূল্যায়ন ও অভিজ্ঞতা।", "Evaluation and experiences of our trainees.")}
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1">{t("১০০+ লার্নার স্টোরি", "100+ learner stories")}</span>
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
