import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Instagram, Youtube, Twitter, Linkedin, MapPin } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

const SOCIALS = [
  { Icon: Facebook, href: "https://facebook.com/profile.php?id=61586687081259", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com/aisorix_", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@aisorix", label: "YouTube" },
  { Icon: Twitter, href: "https://twitter.com/aisorix_", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com/company/aisorix", label: "LinkedIn" },
];

export default function ScholarsFooter() {
  const { t } = useScholarsLang();

  return (
    <footer className="bg-background border-t border-border/60 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/sorixscholars" className="flex items-center gap-1.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </span>
            <span
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans Bengali', system-ui, sans-serif" }}
            >
              Sorix Scholars
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
            {t(
              "Sorix Scholars হলো AI Sorix-এর আধুনিক অনলাইন লার্নিং প্ল্যাটফর্ম, যেখানে আমরা আর্টিফিশিয়াল ইন্টেলিজেন্স বা AI-কে আপনার দৈনন্দিন কাজ ও প্রফেশনাল লাইফে ব্যবহার করার সহজ উপায় শেখাই।",
              "Sorix Scholars is AI Sorix's modern online learning platform — we teach you the simple ways to use AI in your everyday work and professional life."
            )}
          </p>
          <div className="mt-5 flex items-center gap-2">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-foreground mb-4">
            {t("গুরুত্বপূর্ণ লিংক", "Important links")}
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/sorixscholars/courses" className="text-muted-foreground hover:text-foreground">
                {t("কোর্সসমূহ", "Courses")}
              </Link>
            </li>
            <li>
              <Link to="/sorixscholars/workshops" className="text-muted-foreground hover:text-foreground">
                {t("লাইভ ওয়ার্কশপ", "Live workshops")}
              </Link>
            </li>
            <li>
              <Link to="/sorixscholars/competitions" className="text-muted-foreground hover:text-foreground">
                {t("মেন্টরশিপ", "Mentorship")}
              </Link>
            </li>
            <li>
              <Link to="/sorixscholars/certificates" className="text-muted-foreground hover:text-foreground">
                {t("সার্টিফিকেট", "Certificates")}
              </Link>
            </li>
            <li>
              <Link to="/sorixscholars#testimonials" className="text-muted-foreground hover:text-foreground">
                {t("শিক্ষার্থীদের মন্তব্য", "Learner stories")}
              </Link>
            </li>
            <li>
              <Link to="/sorixscholars#faq" className="text-muted-foreground hover:text-foreground">
                {t("জিজ্ঞাসা", "FAQ")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold text-foreground mb-4">
            {t("আইনি ও যোগাযোগ", "Legal & contact")}
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                {t("প্রাইভেসি পলিসি", "Privacy policy")}
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                {t("শর্তাবলী", "Terms of service")}
              </Link>
            </li>
          </ul>
          <div className="mt-5 flex gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t(
                "১ম তলা, এ-১, ডমিন্যান্ট বিল্ডিংস, হাউজ ৩০/৩২, রোড ৫, সেক্টর ১, ব্লক ই, আফতাবনগর, ঢাকা।",
                "1st Floor, A-1, Dominant Buildings, House 30/32, Road 5, Sector 1, Block E, Aftabnagar, Dhaka."
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sorix Scholars ·{" "}
        {t("AI Sorix-এর অংশ", "part of AI Sorix")}
      </div>
    </footer>
  );
}
