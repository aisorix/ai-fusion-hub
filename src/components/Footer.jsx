import React from "react";
import { Link } from "react-router-dom";
import { Mail, Twitter, Linkedin, Youtube, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/profile.php?id=61586687081259", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/aisorix_", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@aisorix", label: "YouTube" },
    { icon: Twitter, href: "https://twitter.com/aisorix_", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/aisorix", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <img src={logo} alt="AI Sorix" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
              <span className="text-xl sm:text-2xl font-bold text-gradient-primary">AI Sorix</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mb-4 sm:mb-6">
              {t("footerDesc")}
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted hover:gradient-primary hover:text-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4 sm:mb-6 text-sm sm:text-base">{t("product")}</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="#Features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("features")}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("pricing")}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("faqs")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("changelog")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-4 sm:mb-6 text-sm sm:text-base">{t("legal")}</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("cookiePolicy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("refundPolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <a href="mailto:support@aisorix.com" className="hover:text-primary transition-colors">
              support@aisorix.com
            </a>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            © 2026 AI Sorix. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
