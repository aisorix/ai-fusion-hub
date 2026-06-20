import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Mail, MessageCircle, MessagesSquare } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { SOCIAL_LINKS, SUPPORT_EMAIL, WHATSAPP_URL } from "@/lib/companyInfo";
import { openScholarsChat } from "./scholarsChatRef";

export default function ScholarsFooter() {
  const { t } = useScholarsLang();

  return (
    <footer className="bg-background border-t border-border/60 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
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
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {t(
              "Sorix Scholars হলো AI Sorix-এর আধুনিক অনলাইন লার্নিং প্ল্যাটফর্ম — কোর্স, ওয়ার্কশপ এবং ১:১ মেন্টরশিপ।",
              "Sorix Scholars is AI Sorix's modern learning platform — courses, workshops and 1:1 mentorship."
            )}
          </p>
          <div className="mt-5 flex items-center gap-2">
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Important links */}
        <div>
          <p className="text-sm font-bold text-foreground mb-4">
            {t("গুরুত্বপূর্ণ লিংক", "Important links")}
          </p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/sorixscholars" className="text-muted-foreground hover:text-foreground">{t("হোম", "Home")}</Link></li>
            <li><Link to="/sorixscholars/courses" className="text-muted-foreground hover:text-foreground">{t("কোর্সসমূহ", "Courses")}</Link></li>
            <li><Link to="/sorixscholars/workshops" className="text-muted-foreground hover:text-foreground">{t("লাইভ ওয়ার্কশপ", "Live workshops")}</Link></li>
            <li><Link to="/sorixscholars/competitions" className="text-muted-foreground hover:text-foreground">{t("প্রতিযোগিতা", "Competitions")}</Link></li>
            <li><Link to="/sorixscholars/certificates" className="text-muted-foreground hover:text-foreground">{t("সার্টিফিকেট", "Certificates")}</Link></li>
            <li><Link to="/sorixscholars/verify" className="text-muted-foreground hover:text-foreground">{t("সার্টিফিকেট যাচাই", "Verify certificate")}</Link></li>
            <li><Link to="/sorixscholars/dashboard" className="text-muted-foreground hover:text-foreground">{t("ড্যাশবোর্ড", "Dashboard")}</Link></li>
            <li><Link to="/sorixscholars#testimonials" className="text-muted-foreground hover:text-foreground">{t("শিক্ষার্থীদের মন্তব্য", "Learner stories")}</Link></li>
            <li><Link to="/sorixscholars#faq" className="text-muted-foreground hover:text-foreground">{t("জিজ্ঞাসা", "FAQ")}</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-sm font-bold text-foreground mb-4">
            {t("কোম্পানি", "Company")}
          </p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about-us" className="text-muted-foreground hover:text-foreground">{t("আমাদের সম্পর্কে", "About us")}</Link></li>
            <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">{t("ক্যারিয়ার", "Careers")}</Link></li>
            <li><Link to="/sorixscholars#contact" className="text-muted-foreground hover:text-foreground">{t("যোগাযোগ", "Contact")}</Link></li>
            <li><Link to="/" className="text-muted-foreground hover:text-foreground">AI Sorix ↗</Link></li>
            <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground">{t("প্রাইভেসি পলিসি", "Privacy policy")}</Link></li>
            <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground">{t("শর্তাবলী", "Terms of service")}</Link></li>
            <li><Link to="/refund-policy" className="text-muted-foreground hover:text-foreground">{t("রিফান্ড পলিসি", "Refund policy")}</Link></li>
            <li><Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground">{t("কুকি পলিসি", "Cookie policy")}</Link></li>
          </ul>
        </div>

        {/* Contact / Support */}
        <div>
          <p className="text-sm font-bold text-foreground mb-4">
            {t("সাপোর্ট", "Support")}
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <button
                type="button"
                onClick={openScholarsChat}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <MessagesSquare className="w-4 h-4 text-primary" /> {t("লাইভ চ্যাট", "Live chat")}
              </button>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="w-4 h-4 text-primary" /> {t("হোয়াটসঅ্যাপ", "WhatsApp")}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground break-all"
              >
                <Mail className="w-4 h-4 text-primary" /> {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t("উত্তরা, ঢাকা ১২৩০, বাংলাদেশ", "Uttara, Dhaka 1230, Bangladesh")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sorix Scholars · {t("AI Sorix-এর অংশ", "part of AI Sorix")}
      </div>
    </footer>
  );
}
