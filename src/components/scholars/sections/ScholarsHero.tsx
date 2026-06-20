import { Link } from "react-router-dom";
import { Monitor, BookOpen, Users, ArrowRight, Star } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function ScholarsHero() {
  const { t } = useScholarsLang();

  return (
    <section className="relative overflow-hidden bg-background">
      {/* subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[11px] sm:text-xs font-medium text-primary mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {t(
            "বেসিক থেকে অ্যাডভান্সড AI শেখার বিশ্বস্ত প্ল্যাটফর্ম",
            "From basics to advanced — the trusted AI learning platform"
          )}
        </div>

        <h1
          className="text-[34px] leading-[1.1] sm:text-5xl lg:text-[68px] lg:leading-[1.05] font-bold tracking-tight text-foreground"
          style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
        >
          {t("AI শিখুন,", "Learn AI,")}
          <br />
          <span className="text-primary">
            {t("টাকা ও টাইম সেভ করুন", "save your money & time")}
          </span>
        </h1>

        <p className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
          {t(
            "বাংলায় AI শেখার সবচেয়ে সহজ উপায়। Live workshops, recorded courses, আর hands-on mentoring — সব এক জায়গায়।",
            "The easiest way to learn AI in Bangla. Live workshops, recorded courses, and hands-on mentoring — all in one place."
          )}
        </p>

        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[
            { icon: Monitor, label: t("ওয়ার্কশপ", "Workshops") },
            { icon: BookOpen, label: t("কোর্স", "Courses") },
            { icon: Users, label: t("মেন্টরশিপ", "Mentorship") },
          ].map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-border bg-card text-xs sm:text-sm font-medium text-foreground"
            >
              <c.icon className="w-3.5 h-3.5 text-primary" />
              {c.label}
            </span>
          ))}
        </div>

        <div className="mt-7 sm:mt-9 flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/sorixscholars/workshops"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-primary text-primary-foreground text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
          >
            {t("ওয়ার্কশপে জয়েন করুন", "Join a workshop")} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/sorixscholars/courses"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-border bg-card text-sm sm:text-base font-semibold text-foreground hover:bg-muted/40 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {t("কোর্সগুলো দেখুন", "Browse courses")}
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-card border border-border shadow-sm flex-wrap justify-center">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
            <Users className="w-4 h-4 text-primary" />
            {t("১১৪৯+ লার্নার্স যুক্ত আছেন", "1,149+ learners enrolled")}
          </span>
          <span className="h-4 w-px bg-border hidden sm:block" />
          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-foreground">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1.5">{t("৪.৯/৫ রেটিং", "4.9/5 rating")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
