import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import founderAsset from "@/assets/founder-rakib.jpg.asset.json";

interface Workshop {
  slug: string;
  badge: string;
  title: string;
  desc: string;
  price: string;
  oldPrice?: string;
  date: string;
  time: string;
  location: string;
  cover: string;
}

const WORKSHOPS: Workshop[] = [
  {
    slug: "ai-private-batch-2month",
    badge: "লাইভ ওয়ার্কশপ",
    title: "২ মাসের AI প্রাইভেট ব্যাচ",
    desc: "আপনার লক্ষ্য অনুযায়ী AI শেখার জন্য জয়েন করুন আমাদের প্রাইভেট ব্যাচে।",
    price: "৳5000",
    date: "১ জুলাই – ৩১ আগস্ট",
    time: "রাত ৯ টা",
    location: "Google Meet",
    cover: founderAsset.url,
  },
  {
    slug: "ai-smart-productivity-3day",
    badge: "লাইভ ওয়ার্কশপ",
    title: "৩ দিনের AI লাইভ ওয়ার্কশপ",
    desc: "প্রতিযোগিতায় টিকে থাকতে AI শেখার বিকল্প নেই। আপনার ৫ ঘণ্টার কাজ ৫ মিনিটে নামিয়ে আনতে জয়েন করুন এই প্র্যাক্টিক্যাল সেশনে।",
    price: "৳470",
    oldPrice: "৳999",
    date: "১৬, ১৭, ১৮ জুলাই",
    time: "রাত ৯ টা",
    location: "Google Meet",
    cover: founderAsset.url,
  },
];

export default function WorkshopsPage() {
  return (
    <div className="bg-background min-h-screen">
      <SEOHead
        title="Sorix Scholars — আমাদের ওয়ার্কশপসমূহ"
        description="সরাসরি এক্সপার্টদের কাছ থেকে শিখুন। প্র্যাক্টিক্যাল লাইভ AI ওয়ার্কশপে জয়েন করে নিজের স্কিল নেক্সট লেভেলে নিয়ে যান।"
        path="/sorixscholars/workshops"
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h1
            className="text-3xl sm:text-4xl lg:text-[52px] leading-tight font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            আমাদের ওয়ার্কশপসমূহ
          </h1>
          <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
            সরাসরি এক্সপার্টদের কাছ থেকে শিখুন। আমাদের প্র্যাক্টিক্যাল লাইভ ওয়ার্কশপগুলোতে জয়েন করে আপনার স্কিলকে নিয়ে যান নেক্সট লেভেলে।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {WORKSHOPS.map((w) => (
            <div
              key={w.slug}
              className="rounded-3xl bg-card border border-border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img src={w.cover} alt={w.title} className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow">
                  {w.badge}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[11px] font-semibold text-white">
                    <Calendar className="w-3 h-3" /> {w.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[11px] font-semibold text-white">
                    <Clock className="w-3 h-3" /> {w.time}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5" /> {w.location}
                </div>
                <h2
                  className="text-lg sm:text-xl font-bold text-foreground leading-snug"
                  style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
                >
                  {w.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{w.desc}</p>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-bold text-foreground">{w.price}</span>
                    {w.oldPrice && (
                      <span className="text-sm line-through text-rose-500/80">{w.oldPrice}</span>
                    )}
                  </div>
                  <Link
                    to={`/sorixscholars/workshops/${w.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold hover:bg-primary/20 transition-colors whitespace-nowrap"
                  >
                    বিস্তারিত <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
