import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  MessageSquare,
  Presentation,
  ImageIcon,
  Heart,
  Leaf,
  Crown,
  Bot,
  Globe,
  Columns3,
  Cpu,
  Workflow,
  Shield,
  Chrome,
  Sparkles,
  Clapperboard,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png";
import sslcommerzPayWith from "../assets/sslcommerz-paywith.png.asset.json";

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-7 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-1.5 mb-4 sm:mb-6">
              <img src={logo} alt="AI Sorix" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
              <span className="text-xl sm:text-2xl font-bold text-foreground">AI Sorix</span>
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

          {/* Features (mirrors Navbar Features mega-menu) */}
          <div>
            <h4 className="uppercase tracking-wider text-[11px] font-semibold text-foreground mb-4 sm:mb-6">
              Features
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  to="/chat"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> AI Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/chat?multi=1"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Columns3 className="w-3.5 h-3.5" /> Multi-window Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/agent"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" /> AI Agents
                </Link>
              </li>
              <li>
                <Link
                  to="/agent"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" /> Sorix Agent OS
                </Link>
              </li>
              <li>
                <Link
                  to="/deck"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Presentation className="w-3.5 h-3.5" /> Sorix Deck
                </Link>
              </li>
              <li>
                <Link
                  to="/cineshoot"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Clapperboard className="w-3.5 h-3.5" /> Sorix Cineshoot
                </Link>
              </li>
              <li>
                <Link
                  to="/imagine"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Sorix Imagine
                </Link>
              </li>
              <li>
                <Link
                  to="/flowbuilder"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Workflow className="w-3.5 h-3.5" /> Flow Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/health"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5" /> Sorix Health
                </Link>
              </li>
              <li>
                <Link
                  to="/agro"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Leaf className="w-3.5 h-3.5" /> Sorix Agro
                </Link>
              </li>
              <li>
                <Link
                  to="/legends"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" /> Sorix Legends
                </Link>
              </li>
              <li>
                <Link
                  to="/sorix-security"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" /> Sorix Security
                </Link>
              </li>
              <li>
                <Link
                  to="/sorix-for-chrome"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Chrome className="w-3.5 h-3.5" /> Sorix for Chrome
                </Link>
              </li>
              <li>
                <Link
                  to="/skills"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Skills
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="uppercase tracking-wider text-[11px] font-semibold text-foreground mb-4 sm:mb-6">
              Solutions
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  to="/solutions/coding"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Coding
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/customer-support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/financial-services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Financial Services
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/government"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Government
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/healthcare"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/life-sciences"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Life Sciences
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/nonprofits"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Nonprofits
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/security"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/workflow-automation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/ai-for-educators"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Educators
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/ai-for-startups"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Startups
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/ai-for-researchers"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Researchers
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/ai-for-creators"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Creators
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/ai-for-freelancers"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Freelancers
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/ai-for-professionals"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Professionals
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="uppercase tracking-wider text-[11px] font-semibold text-foreground mb-4 sm:mb-6">
              Resources
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog & AI Insights
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/developer-api"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Developer API
                </Link>
              </li>
              <li>
                <Link to="/connectors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Connectors
                </Link>
              </li>
              <li>
                <Link to="/sorixscholars" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sorix Scholars
                </Link>
              </li>
              <li>
                <Link to="/sorixscholars/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/sorixscholars/workshops" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>

              <li>
                <Link
                  to="/inside-sorix-code"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Inside Sorix Code
                </Link>
              </li>
              <li>
                <Link
                  to="/inside-sorix-cowork"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Inside Sorix Cowork
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="uppercase tracking-wider text-[11px] font-semibold text-foreground mb-4 sm:mb-6">Company</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link to="/about-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about-sorix-lab" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About SorixLab
                </Link>
              </li>

              <li>
                <Link to="/press" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/economic-futures"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Economic Futures
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link
                  to="/security-and-compliance"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Security & Compliance
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Transparency
                </Link>
              </li>
              <li>
                <a
                  href="/#contact"
                  onClick={(e) => scrollToSection(e, "contact")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="uppercase tracking-wider text-[11px] font-semibold text-foreground mb-4 sm:mb-6">
              {t("legal")}
            </h4>
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
              <li>
                <Link
                  to="/consumer-health-data-privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Consumer Health Data Privacy
                </Link>
              </li>
              <li>
                <Link to="/usage-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Usage Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SSLCommerz Pay With strip — 40% smaller, centered */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <div className="rounded-2xl bg-white border border-border/60 p-2 sm:p-3 shadow-sm w-full max-w-[60%]">
            <img
              src={sslcommerzPayWith.url}
              alt="Verified by SSLCommerz — accepted payment methods including Visa, Mastercard, American Express, UnionPay, bKash, Nagad, Rocket, Upay, Tap'n Pay, BRAC Bank, Bank Asia, AB Bank, MTB, Dutch-Bangla Bank NEXUS, Islami Wallet, iPay, and more"
              loading="lazy"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-muted-foreground text-xs sm:text-sm">© 2026 AI Sorix. {t("allRightsReserved")}</p>
          {/* Hidden on mobile — shown from sm: upwards */}

          <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <a href="mailto:support@aisorix.com" className="hover:text-primary transition-colors">
              support@aisorix.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
