import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import founderAsset from "@/assets/founder-rakib.png.asset.json";

interface WorkshopItem {
  slug: string;
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  price: string;
  oldPrice?: string;
  dateBn: string;
  dateEn: string;
  timeBn: string;
  timeEn: string;
  location: string;
}

const items: WorkshopItem[] = [
  {
    slug: "ai-productivity-live",
    badgeBn: "লাইভ ওয়ার্কশপ",
    badgeEn: "Live workshop",
    titleBn: "৩ দিনের AI লাইভ ওয়ার্কশপ",
    titleEn: "3-day live AI workshop",
    descBn: "প্রতিযোগিতায় টিকে থাকতে AI শেখার বিকল্প নেই। আপনার ৫ ঘণ্টার কাজ ৫ মিনিটে নামিয়ে আনতে জয়েন করুন এই প্র্যাকটিক্যাল সেশনে।",
    descEn: "To stay competitive, learning AI is non-negotiable. Join this practical session to shrink 5 hours of work into 5 minutes.",
    price: "$9",
    oldPrice: "$19",
    dateBn: "১৮-২০ জুন",
    dateEn: "Jun 18-20",
    timeBn: "রাত ৯:০০ টা",
    timeEn: "9:00 PM",
    location: "Google Meet",
  },
];

export default function UpcomingWorkshops() {
  const { t, lang } = useScholarsLang();

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24"
      style={{ background: "radial-gradient(ellipse at top, #1A0526 0%, #0B0413 60%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2
            className="text-2xl sm:text-3xl lg:text-[44px] leading-tight font-bold text-white"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            {t("আসন্ন ওয়ার্কশপসমূহ", "Upcoming workshops")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70">
            {t(
              "সরাসরি এক্সপার্টদের কাছ থেকে শিখুন। আমাদের প্র্যাক্টিক্যাল লাইভ ওয়ার্কশপগুলোতে জয়েন করে আপনার স্কিলকে নিয়ে যান নেক্সট লেভেলে।",
              "Learn directly from experts. Join our practical live workshops and take your skill set to the next level."
            )}
          </p>
        </div>

        <div className="space-y-5">
          {items.map((w) => (
            <div
              key={w.slug}
              className="rounded-3xl border border-white/10 overflow-hidden grid lg:grid-cols-2"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}
            >
              <div className="relative aspect-[16/10] lg:aspect-auto bg-black overflow-hidden">
                <img src={founderAsset.url} alt={lang === "bn" ? w.titleBn : w.titleEn} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow">
                  {lang === "bn" ? w.badgeBn : w.badgeEn}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] font-semibold text-white/95">
                    <Calendar className="w-3 h-3" /> {lang === "bn" ? w.dateBn : w.dateEn}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] font-semibold text-white/95">
                    <Clock className="w-3 h-3" /> {lang === "bn" ? w.timeBn : w.timeEn}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-7 lg:p-9 text-white flex flex-col">
                <div className="inline-flex items-center gap-1.5 text-xs text-white/60 mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {w.location}
                </div>
                <h3
                  className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-bold"
                  style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
                >
                  {lang === "bn" ? w.titleBn : w.titleEn}
                </h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed flex-1">
                  {lang === "bn" ? w.descBn : w.descEn}
                </p>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold">{w.price}</span>
                    {w.oldPrice && (
                      <span className="text-sm line-through text-rose-400/80">{w.oldPrice}</span>
                    )}
                  </div>
                  <Link
                    to="/sorixscholars/workshops"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors backdrop-blur"
                  >
                    {t("বিস্তারিত", "Details")} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            to="/sorixscholars/workshops"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm sm:text-base font-semibold transition-colors shadow-lg shadow-rose-500/30"
          >
            {t("সব ওয়ার্কশপ দেখুন", "View all workshops")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
