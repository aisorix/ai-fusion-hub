import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Rocket, Code, Star, Lightbulb, Globe, Target, Home, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png";

const AboutSorixLab = () => {
  const { language } = useLanguage();

  const teamMembers = [
    {
      name: "Rakib Eslam",
      role: language === "en" ? "Founder & CEO" : "প্রতিষ্ঠাতা এবং সিইও",
      icon: Star,
      description:
        language === "en"
          ? "Visionary leader driving AI innovation in Bangladesh"
          : "বাংলাদেশে AI উদ্ভাবন চালিত দূরদর্শী নেতা",
    },
    {
      name: "Shahadat Hossain",
      role: language === "en" ? "Supporting Developer" : "সহায়ক ডেভেলপার",
      icon: Code,
      description: language === "en" ? "" : "",
    },
  ];

  const focusAreas = [
    {
      icon: Lightbulb,
      title: language === "en" ? "Artificial Intelligence" : "আর্টিফিশিয়াল ইন্টেলিজেন্স",
      description:
        language === "en"
          ? "Building accessible AI tools that empower individuals and businesses across Bangladesh."
          : "বাংলাদেশ জুড়ে ব্যক্তি এবং ব্যবসাকে শক্তিশালী করে এমন অ্যাক্সেসযোগ্য AI টুলস তৈরি করা।",
    },
    {
      icon: Target,
      title: language === "en" ? "Education Technology" : "শিক্ষা প্রযুক্তি",
      description:
        language === "en"
          ? "Revolutionizing learning experiences through innovative educational platforms."
          : "উদ্ভাবনী শিক্ষামূলক প্ল্যাটফর্মের মাধ্যমে শেখার অভিজ্ঞতায় বিপ্লব ঘটানো।",
    },
    {
      icon: Globe,
      title: language === "en" ? "Social Innovation" : "সামাজিক উদ্ভাবন",
      description:
        language === "en"
          ? "Creating technology solutions that address real-world challenges in our community."
          : "আমাদের সম্প্রদায়ের বাস্তব-বিশ্ব চ্যালেঞ্জ মোকাবেলা করে এমন প্রযুক্তি সমাধান তৈরি করা।",
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
              <Rocket className="w-3.5 h-3.5" />
              <span>{language === "en" ? "R&D Hub" : "R&D হাব"}</span>
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
            <span className="text-foreground font-medium">
              {language === "en" ? "About Sorixlab" : "সোরিক্সল্যাব সম্পর্কে"}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[80px] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary mb-5 shadow-glow">
              <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {language === "en" ? "About " : ""}
              <span className="animated-gradient-text">Sorixlab</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === "en"
                ? "A Bangladesh-based R&D hub dedicated to shaping the future of AI, Education, and Social Innovation. Our mission is to build impactful technology that empowers the next generation."
                : "বাংলাদেশ-ভিত্তিক একটি R&D হাব যা AI, শিক্ষা এবং সামাজিক উদ্ভাবনের ভবিষ্যৎ গঠনে নিবেদিত। আমাদের মিশন হল পরবর্তী প্রজন্মকে শক্তিশালী করে এমন প্রভাবশালী প্রযুক্তি তৈরি করা।"}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 sm:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 sm:space-y-6">
            {/* AI Sorix - Flagship Product */}
            <article className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background border border-primary/20 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                  <img src={logo} alt="AI Sorix" className="w-12 h-12 object-contain" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {language === "en" ? "AI Sorix — Our Flagship Product" : "AI Sorix — আমাদের ফ্ল্যাগশিপ পণ্য"}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {language === "en"
                      ? "Bangladesh's first unified AI platform, bringing together 10+ premium AI models including ChatGPT, Claude, Gemini, and more. A first step toward a comprehensive ecosystem designed to revolutionize how students, professionals, and researchers interact with artificial intelligence."
                      : "বাংলাদেশের প্রথম ইউনিফাইড AI প্ল্যাটফর্ম, ChatGPT, Claude, Gemini এবং আরও অনেক সহ ১০+ প্রিমিয়াম AI মডেল একত্রিত করে। শিক্ষার্থী, পেশাদার এবং গবেষকরা কৃত্রিম বুদ্ধিমত্তার সাথে কীভাবে যোগাযোগ করে তা বিপ্লব করার জন্য ডিজাইন করা একটি সমগ্র ইকোসিস্টেমের দিকে প্রথম পদক্ষেপ।"}
                  </p>
                </div>
              </div>
            </article>

            {/* Our Vision */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "Our Vision" : "আমাদের দৃষ্টিভঙ্গি"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {language === "en"
                  ? "We envision a future where cutting-edge technology is accessible to everyone, regardless of their location or economic background. Sorixlab is committed to bridging the digital divide and bringing world-class AI tools to Bangladesh and beyond."
                  : "আমরা এমন একটি ভবিষ্যতের কল্পনা করি যেখানে অত্যাধুনিক প্রযুক্তি সবার কাছে অ্যাক্সেসযোগ্য, তাদের অবস্থান বা অর্থনৈতিক পটভূমি নির্বিশেষে। সোরিক্সল্যাব ডিজিটাল বিভাজন দূর করতে এবং বাংলাদেশ এবং এর বাইরে বিশ্বমানের AI টুলস আনতে প্রতিশ্রুতিবদ্ধ।"}
              </p>
            </article>

            {/* Focus Areas */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">
                {language === "en" ? "Our Focus Areas" : "আমাদের ফোকাস এরিয়া"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {focusAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <area.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{area.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Team Section */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 text-center">
                {language === "en" ? "Meet the Team" : "টিমের সাথে পরিচিত হন"}
              </h2>
              <p className="text-muted-foreground text-sm text-center mb-6">
                {language === "en" ? "The minds behind Sorixlab" : "সোরিক্সল্যাবের পেছনের মস্তিষ্করা"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group relative bg-muted/30 rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <member.icon className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground text-center mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-medium text-center mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">{member.description}</p>
                  </div>
                ))}
              </div>

              {/* University Info */}
              <div className="relative mt-6 pt-6 border-t border-border/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-card">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">
                    {language === "en" ? "Academic Background" : "শিক্ষাগত পটভূমি"}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-primary/5 via-cyan-500/10 to-primary/5 rounded-xl p-5 sm:p-6 border border-primary/20">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 4 6 4s6-2 6-4v-5" />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground">
                      {language === "en"
                        ? "Daffodil International University"
                        : "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি"}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base text-center text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    {language === "en"
                      ? "Rakib Eslam & Shahadat Hossain are currently pursuing their studies at Daffodil International University, Department of Software Engineering — transforming academic knowledge into innovative solutions that shape the future of AI in Bangladesh."
                      : "রাকিব ইসলাম এবং শাহাদাত হোসেন বর্তমানে ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির সফটওয়্যার ইঞ্জিনিয়ারিং বিভাগে অধ্যয়নরত — তারা একাডেমিক জ্ঞানকে উদ্ভাবনী সমাধানে রূপান্তরিত করছেন যা বাংলাদেশে AI-এর ভবিষ্যৎ গঠন করছে।"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Code className="w-3 h-3" />
                      {language === "en" ? "Software Engineering" : "সফটওয়্যার ইঞ্জিনিয়ারিং"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-xs font-medium">
                      <Star className="w-3 h-3" />
                      {language === "en" ? "Student Innovators" : "ছাত্র উদ্ভাবক"}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Location */}
            <article className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === "en" ? "Our Location" : "আমাদের অবস্থান"}
              </h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">Sorixlab HQ</p>
                  <p className="text-muted-foreground text-sm">Ashulia, Savar, Dhaka, Bangladesh</p>
                  <p className="text-sm text-primary mt-2">
                    📍 {language === "en" ? "Proudly Made in Bangladesh" : "গর্বের সাথে বাংলাদেশে তৈরি"}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Footer */}
          <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © 2026 Sorixlab. {language === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।"}
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি"}
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                {language === "en" ? "Terms of Service" : "সেবার শর্তাবলী"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSorixLab;
