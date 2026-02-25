import React from "react";
import { Users, Target, Lightbulb, Globe, Rocket, Heart, Code, Briefcase, Star } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/logo.png";

const AboutUs = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Lightbulb,
      title: language === "en" ? "Innovation First" : "উদ্ভাবন প্রথম",
      description:
        language === "en"
          ? "Pushing the boundaries of AI research to deliver cutting-edge intelligence to every user."
          : "প্রতিটি ব্যবহারকারীর কাছে অত্যাধুনিক ইন্টেলিজেন্স পৌঁছাতে AI গবেষণার সীমানা ভাঙি।",
    },
    {
      icon: Users,
      title: language === "en" ? "User Centric" : "ব্যবহারকারী কেন্দ্রিক",
      description:
        language === "en"
          ? "Every feature is designed around real user workflows — built for researchers, professionals, and teams."
          : "প্রতিটি ফিচার বাস্তব ব্যবহারকারীর ওয়ার্কফ্লো ঘিরে ডিজাইন করা — গবেষক, পেশাদার ও টিমদের জন্য।",
    },
    {
      icon: Globe,
      title: language === "en" ? "Global Scale" : "বৈশ্বিক পরিসর",
      description:
        language === "en"
          ? "Serving users across 100+ countries with localized payment options and multi-language support."
          : "১০০+ দেশে ব্যবহারকারীদের সেবা দিচ্ছি স্থানীয় পেমেন্ট অপশন এবং বহুভাষিক সাপোর্ট সহ।",
    },
    {
      icon: Heart,
      title: language === "en" ? "Accessibility" : "সহজলভ্যতা",
      description:
        language === "en"
          ? "Enterprise-grade AI made accessible and affordable — democratizing intelligence for everyone."
          : "এন্টারপ্রাইজ-গ্রেড AI সহজলভ্য ও সাশ্রয়ী — সবার জন্য ইন্টেলিজেন্স গণতান্ত্রিক করা।",
    },
  ];

  const stats = [
    { value: "10+", label: language === "en" ? "AI Models" : "AI মডেল" },
    { value: "10K+", label: language === "en" ? "Active Users" : "সক্রিয় ব্যবহারকারী" },
    { value: "1M+", label: language === "en" ? "Queries Processed" : "কোয়েরি প্রসেসড" },
    { value: "24/7", label: language === "en" ? "Support" : "সাপোর্ট" },
  ];

  const teamMembers = [
    {
      name: "Rakib Eslam",
      role: language === "en" ? "Founder & CEO" : "প্রতিষ্ঠাতা এবং সিইও",
      icon: Star,
    },
    {
      name: "Shahadat Hossain",
      role: language === "en" ? "Supporting Developer" : "সহায়ক ডেভেলপার",
      icon: Code,
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div
          className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-semibold mb-6">
            <Target className="w-4 h-4" />
            {language === "en" ? "About Us" : "আমাদের সম্পর্কে"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4 font-display">
            {language === "en" ? "Pioneering the Future" : "ভবিষ্যৎ গড়ছি"}
            <br />
            <span className="animated-gradient-text">
              {language === "en" ? "Of AI Research" : "AI গবেষণার"}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === "en"
              ? "AI Sorix is a next-generation AI research ecosystem, unifying the world's most powerful AI models into a single, intelligent workspace for professionals, researchers, and teams globally."
              : "AI Sorix একটি পরবর্তী প্রজন্মের AI রিসার্চ ইকোসিস্টেম, বিশ্বের সবচেয়ে শক্তিশালী AI মডেলগুলোকে একটি একক, বুদ্ধিমান ওয়ার্কস্পেসে একত্রিত করে — বিশ্বব্যাপী পেশাদার, গবেষক ও টিমদের জন্য।"}
          </p>
        </div>

        {/* Logo and Mission */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12">
          <div className="relative group">
            <div className="absolute inset-0 gradient-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-150" />
            <div className="relative futuristic-card p-8 sm:p-12 rounded-3xl">
              <img src={logo} alt="AI Sorix" className="w-32 h-32 sm:w-40 sm:h-40 object-contain animate-float-slow" />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <Rocket className="w-6 h-6 text-primary" />
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                {language === "en" ? "Our Mission" : "আমাদের মিশন"}
              </h3>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              {language === "en"
                ? "We believe breakthrough AI should be accessible to everyone. AI Sorix was built to eliminate the friction of managing multiple AI subscriptions — delivering enterprise-grade intelligence at a fraction of the cost."
                : "আমরা বিশ্বাস করি যুগান্তকারী AI সবার কাছে পৌঁছানো উচিত। AI Sorix তৈরি হয়েছে একাধিক AI সাবস্ক্রিপশন পরিচালনার ঝামেলা দূর করতে — অল্প খরচে এন্টারপ্রাইজ-গ্রেড ইন্টেলিজেন্স প্রদান করতে।"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="futuristic-card p-6 sm:p-8 rounded-2xl text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Our Core Values" : "আমাদের মূল মূল্যবোধ"}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {language === "en"
              ? "The principles that guide everything we do at AI Sorix"
              : "যে নীতিগুলো AI Sorix-এ আমাদের সব কাজ পরিচালনা করে"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {values.map((value, index) => (
            <div
              key={index}
              className="futuristic-card p-6 rounded-2xl group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <value.icon className="w-7 h-7 text-foreground" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">{value.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
