import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Cookie,
  Mail,
  MapPin,
  Calendar,
  Settings,
  BarChart3,
  Sparkles,
  CreditCard,
  Home,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png";

const CookiePolicy = () => {
  const { language } = useLanguage();

  const cookieTypes = [
    {
      icon: Settings,
      title: language === "en" ? "Essential Cookies" : "অপরিহার্য কুকি",
      description:
        language === "en"
          ? "Required for the operation of our platform. They enable login and secure access."
          : "আমাদের প্ল্যাটফর্ম পরিচালনার জন্য প্রয়োজনীয়। এগুলো লগইন এবং নিরাপদ অ্যাক্সেস সক্ষম করে।",
      items: [
        {
          bold: language === "en" ? "Authentication:" : "প্রমাণীকরণ:",
          text: language === "en" ? "Identify you when you visit." : "আপনি ভিজিট করলে আপনাকে শনাক্ত করে।",
        },
        {
          bold: language === "en" ? "Security:" : "নিরাপত্তা:",
          text: language === "en" ? "Detect and prevent security risks." : "নিরাপত্তা ঝুঁকি সনাক্ত এবং প্রতিরোধ করে।",
        },
        {
          bold: language === "en" ? "Credit Tracking:" : "ক্রেডিট ট্র্যাকিং:",
          text: language === "en" ? "Track your session usage accurately." : "আপনার সেশন ব্যবহার সঠিকভাবে ট্র্যাক করে।",
        },
      ],
      color: "from-emerald-500/20 to-emerald-600/10",
    },
    {
      icon: BarChart3,
      title: language === "en" ? "Analytics Cookies" : "অ্যানালিটিক্স কুকি",
      description:
        language === "en"
          ? "Help us understand how visitors interact with our website."
          : "দর্শকরা কিভাবে আমাদের ওয়েবসাইটের সাথে ইন্টারঅ্যাক্ট করে তা বুঝতে সাহায্য করে।",
      items: [
        {
          bold: language === "en" ? "Purpose:" : "উদ্দেশ্য:",
          text: language === "en" ? "Improve website functionality." : "ওয়েবসাইট কার্যকারিতা উন্নত করা।",
        },
        {
          bold: language === "en" ? "Tools:" : "টুলস:",
          text: language === "en" ? "Google Analytics, Vercel Analytics." : "Google Analytics, Vercel Analytics।",
        },
      ],
      color: "from-blue-500/20 to-blue-600/10",
    },
    {
      icon: Sparkles,
      title: language === "en" ? "Functionality Cookies" : "কার্যকারিতা কুকি",
      description:
        language === "en"
          ? "Remember your preferences like Dark Mode or default AI model."
          : "আপনার পছন্দ যেমন ডার্ক মোড বা ডিফল্ট AI মডেল মনে রাখে।",
      items: [],
      color: "from-purple-500/20 to-purple-600/10",
    },
    {
      icon: CreditCard,
      title: language === "en" ? "Third-Party Cookies" : "তৃতীয় পক্ষের কুকি",
      description:
        language === "en" ? "Set by trusted third-party services." : "বিশ্বস্ত তৃতীয় পক্ষের সেবা দ্বারা সেট করা হয়।",
      items: [
        {
          bold: language === "en" ? "Payment:" : "পেমেন্ট:",
          text:
            language === "en"
              ? "SSLCommerz, bKash, and Stripe for secure transactions."
              : "নিরাপদ লেনদেনের জন্য SSLCommerz, bKash, এবং Stripe।",
        },
        {
          bold: language === "en" ? "Social Login:" : "সোশ্যাল লগইন:",
          text: language === "en" ? "Google, GitHub authentication." : "Google, GitHub প্রমাণীকরণ।",
        },
      ],
      color: "from-cyan-500/20 to-cyan-600/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:opacity-80"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <img src={logo} alt="AI Sorix" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              <span className="text-base sm:text-lg font-bold text-foreground">AI Sorix</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Updated: Jan 6, 2026" : "আপডেট: ৬ জানুয়ারি, ২০২৬"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Home" : "হোম"}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{language === "en" ? "Cookie Policy" : "কুকি নীতি"}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary mb-5 shadow-glow">
              <Cookie className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {language === "en" ? "Cookie Policy" : "কুকি নীতি"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === "en"
                ? "Learn how we use cookies and similar technologies to enhance your experience on AI Sorix."
                : "AI Sorix-এ আপনার অভিজ্ঞতা উন্নত করতে আমরা কিভাবে কুকি এবং অনুরূপ প্রযুক্তি ব্যবহার করি তা জানুন।"}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 sm:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 sm:space-y-6">
            {/* Introduction */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "1. Introduction" : "১. ভূমিকা"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {language === "en"
                  ? "This Cookie Policy explains how AI Sorix uses cookies and similar tracking technologies when you visit our website aisorix.com. By using our platform, you consent to the use of cookies as described in this policy."
                  : "এই কুকি নীতি ব্যাখ্যা করে কিভাবে AI Sorix আপনি যখন আমাদের ওয়েবসাইট aisorix.com ভিজিট করেন তখন কুকি এবং অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করে।"}
              </p>
            </article>

            {/* What Are Cookies */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "2. What Are Cookies?" : "২. কুকি কী?"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {language === "en"
                  ? "Cookies are small text files stored on your device when you visit a website. They allow the website to recognize your device and remember your preferences."
                  : "কুকি হল ছোট টেক্সট ফাইল যা আপনি কোনো ওয়েবসাইট ভিজিট করলে আপনার ডিভাইসে সংরক্ষিত হয়। এগুলো ওয়েবসাইটকে আপনার ডিভাইস চিনতে এবং আপনার পছন্দ মনে রাখতে সাহায্য করে।"}
              </p>
            </article>

            {/* Cookie Types */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">
                {language === "en" ? "3. How We Use Cookies" : "৩. আমরা কিভাবে কুকি ব্যবহার করি"}
              </h2>

              <div className="grid gap-4">
                {cookieTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-lg border border-border/50 p-4 sm:p-5 bg-gradient-to-br ${type.color}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-background/50 backdrop-blur flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{type.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{type.description}</p>
                          {type.items.length > 0 && (
                            <ul className="space-y-1.5">
                              {type.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span>
                                    <strong className="text-foreground">{item.bold} </strong>
                                    {item.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Managing Cookies */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "4. Managing Your Cookies" : "৪. আপনার কুকি পরিচালনা"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-3">
                {language === "en"
                  ? "You have the right to accept or reject cookies. You can control cookies via your browser settings."
                  : "আপনার কুকি গ্রহণ বা প্রত্যাখ্যান করার অধিকার আছে। আপনি আপনার ব্রাউজার সেটিংসের মাধ্যমে কুকি নিয়ন্ত্রণ করতে পারেন।"}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                {language === "en"
                  ? "Note: Disabling essential cookies may affect some features of AI Sorix."
                  : "দ্রষ্টব্য: অপরিহার্য কুকি নিষ্ক্রিয় করলে AI Sorix-এর কিছু বৈশিষ্ট্য প্রভাবিত হতে পারে।"}
              </p>
            </article>

            {/* Updates */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "5. Updates to This Policy" : "৫. এই নীতিতে আপডেট"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {language === "en"
                  ? "We may update this Cookie Policy from time to time. Please check this page regularly to stay informed."
                  : "আমরা সময়ে সময়ে এই কুকি নীতি আপডেট করতে পারি। অনুগ্রহ করে জানতে নিয়মিত এই পৃষ্ঠাটি দেখুন।"}
              </p>
            </article>

            {/* Contact Section */}
            <article className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background border border-primary/20 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "6. Contact Us" : "৬. যোগাযোগ করুন"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-5">
                {language === "en"
                  ? "If you have any questions about our use of cookies, please contact us:"
                  : "আমাদের কুকি ব্যবহার সম্পর্কে কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:support@aisorix.com"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base">support@aisorix.com</span>
                </a>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base">Ashulia, Savar, Dhaka, Bangladesh</span>
                </div>
              </div>
            </article>
          </div>

          {/* Footer */}
          <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © 2026 AI Sorix. {language === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।"}
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি"}
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "en" ? "Terms of Service" : "সেবার শর্তাবলী"}
              </Link>
              <Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "en" ? "Refund Policy" : "রিফান্ড নীতি"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
