import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { courses } from "@/data/academy";
import founderAsset from "@/assets/founder-rakib.png.asset.json";

export default function PopularCourses() {
  const { t } = useScholarsLang();
  const featured = courses.slice(0, 3);

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2
            className="text-2xl sm:text-3xl lg:text-[44px] leading-tight font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
          >
            {t("আমাদের জনপ্রিয় কোর্সসমূহ", "Our popular courses")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            {t(
              "আপনার ক্যারিয়ারকে পরবর্তী ধাপে নিয়ে যেতে আমাদের বিশেষায়িত কোর্সগুলো এক্সপ্লোর করুন।",
              "Explore our specialised courses to take your career to the next level."
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {featured.map((c, idx) => (
            <div
              key={c.slug}
              className="rounded-3xl bg-card border border-border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={founderAsset.url}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-bold text-foreground shadow">
                    {t("প্রিমিয়াম", "Premium")}
                  </span>
                )}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold text-foreground shadow">
                  <BookOpen className="w-3 h-3" />
                  {c.duration}
                </span>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <h3
                  className="text-lg sm:text-xl font-bold text-foreground leading-snug"
                  style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
                >
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{c.tagline}</p>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                  <div className="text-lg sm:text-xl font-bold text-foreground">{c.priceLabel}</div>
                  <Link
                    to={`/sorixscholars/courses/${c.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold hover:bg-primary/20 transition-colors whitespace-nowrap"
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
            to="/sorixscholars/courses"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-foreground text-background text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
          >
            {t("সব কোর্স দেখুন", "View all courses")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
