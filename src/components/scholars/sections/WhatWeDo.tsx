import { Link } from "react-router-dom";
import { Users, BookOpen, Video, Book, ArrowRight } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function WhatWeDo() {
  const { t } = useScholarsLang();
  const items = [
    {
      icon: Users,
      num: t("০১", "01"),
      title: t("১:১ AI মেন্টরশিপস", "1:1 AI Mentorships"),
      body: t(
        "বিশেষজ্ঞ মেন্টরদের সাথে সরাসরি বসে আপনার ক্যারিয়ার ও ব্যবসার জন্য AI-এর সঠিক গাইডলাইন নিন।",
        "Sit down 1:1 with expert mentors to get the right AI guidance for your career and business."
      ),
      href: "/sorixscholars/workshops",
    },
    {
      icon: BookOpen,
      num: t("০২", "02"),
      title: t("অনলাইন কোর্সেস", "Online Courses"),
      body: t(
        "আপনার সুবিধামতো সময়ে শেখার জন্য আমাদের রয়েছে বিশেষায়িত সব কোর্স, যা আপনাকে দেবে পরিপূর্ণ লার্নিং অভিজ্ঞতা।",
        "Curated specialised courses you can take on your schedule — for a complete hands-on learning experience."
      ),
      href: "/sorixscholars/courses",
    },
    {
      icon: Video,
      num: t("০৩", "03"),
      title: t("লাইভ ওয়ার্কশপস", "Live Workshops"),
      body: t(
        "সরাসরি অংশগ্রহণমূলক প্রশিক্ষণ, যেখানে আপনি হাতে-কলমে AI টুলস ব্যবহার শিখে নিজের দক্ষতা বাড়াবেন।",
        "Live, participatory training where you practice with real AI tools and grow your skill stack."
      ),
      href: "/sorixscholars/workshops",
    },
    {
      icon: Book,
      num: t("০৪", "04"),
      title: t("ইবুক ও রিসোর্সেস", "eBooks & Resources"),
      body: t(
        "প্রয়োজনীয় জ্ঞান ও প্র্যাকটিক্যাল AI রিসোর্স এখন ডিজিটাল ফরম্যাটে আপনার হাতের মুঠোয়, যা আপনাকে সমৃদ্ধ করবে।",
        "All the essential knowledge and practical AI resources in digital format — right in your pocket."
      ),
      href: "/sorixscholars/courses",
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24" style={{ backgroundColor: "#FAF7EE" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2
            className="text-2xl sm:text-3xl lg:text-[44px] leading-tight font-bold"
            style={{
              fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif",
              color: "#0F1B3D",
            }}
          >
            {t("আমরা যা করি", "What we do")}
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed" style={{ color: "#475569" }}>
            {t(
              "আপনার পার্সোনাল ও প্রফেশনাল এক্সেলেন্স নিশ্চিত করতে আমরা কাজ করি। AI-এর সঠিক ব্যবহার শিখে ক্যারিয়ারে এগিয়ে যাওয়ার জন্য আমরা প্রদান করছি সর্বাধুনিক লার্নিং এক্সপেরিয়েন্স।",
              "We work to ensure your personal and professional excellence — delivering a modern learning experience so you master AI and move ahead in your career."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((it) => (
            <Link
              key={it.title}
              to={it.href}
              className="relative overflow-hidden rounded-2xl bg-white border-l-4 p-5 sm:p-7 group hover:shadow-lg transition-shadow"
              style={{ borderLeftColor: "#0F1B3D" }}
            >
              <span
                aria-hidden
                className="absolute right-3 bottom-1 text-[120px] sm:text-[140px] font-bold leading-none opacity-[0.05] select-none"
                style={{ color: "#0F1B3D", fontFamily: "'Playfair Display', 'Noto Serif Bengali', serif" }}
              >
                {it.num}
              </span>
              <div className="relative flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{ backgroundColor: "#EEF2FF" }}
                >
                  <it.icon className="w-5 h-5" style={{ color: "#0F1B3D" }} />
                </span>
                <h3
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "#0F1B3D", fontFamily: "'Playfair Display', 'Noto Serif Bengali', serif" }}
                >
                  {it.title}
                </h3>
              </div>
              <p className="relative text-sm leading-relaxed" style={{ color: "#475569" }}>
                {it.body}
              </p>
              <span
                className="relative inline-flex items-center gap-1 text-xs sm:text-sm font-semibold mt-4 group-hover:gap-2 transition-all"
                style={{ color: "#0F1B3D" }}
              >
                {t("বিস্তারিত দেখুন", "Learn more")} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
