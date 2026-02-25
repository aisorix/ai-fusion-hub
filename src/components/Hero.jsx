import React, { useState, useEffect } from "react";
import { ArrowUpRight, Sparkles, Zap, Shield, Play } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  ChatGPTLogo,
  ClaudeLogo,
  GeminiLogo,
  DeepSeekLogo,
  GrokLogo,
  QwenLogo,
  LlamaLogo,
  PerplexityLogo,
  MistralLogo,
} from "./AIModelLogos";
import logo from "../assets/logo.png";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const rotatingWords = {
  en: ["Platform", "Workspace", "Hub", "Engine", "Suite"],
  bn: ["প্ল্যাটফর্ম", "ওয়ার্কস্পেস", "হাব", "ইঞ্জিন", "স্যুট"],
};

const Hero = () => {
  const { t, language } = useLanguage();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState(rotatingWords.en[0]);
  const [animClass, setAnimClass] = useState("hero-word-visible");

  useEffect(() => {
    const words = language === "en" ? rotatingWords.en : rotatingWords.bn;
    setDisplayWord(words[wordIndex]);
  }, [language, wordIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimClass("hero-word-exit");
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.en.length);
        setAnimClass("hero-word-enter");
        setTimeout(() => {
          setAnimClass("hero-word-visible");
        }, 400);
      }, 350);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // All 10+ models available across plans - displayed in serial format
  const aiModels = [
    { name: "ChatGPT", Logo: ChatGPTLogo },
    { name: "Claude", Logo: ClaudeLogo },
    { name: "DeepSeek", Logo: DeepSeekLogo },
    { name: "Gemini", Logo: GeminiLogo },
    { name: "Grok", Logo: GrokLogo },
    { name: "Qwen", Logo: QwenLogo },
    { name: "Llama", Logo: LlamaLogo },
    { name: "Perplexity", Logo: PerplexityLogo },
    { name: "Mistral", Logo: MistralLogo },
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-6 sm:pt-10 md:pt-16 pb-10 sm:pb-16 md:pb-24 overflow-hidden">
      <AnnouncementBanner />
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Logo with Glow Effect */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative group">
            <div className="absolute inset-0 gradient-primary blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-150" />
            <img
              src={logo}
              alt="AI Sorix"
              className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl animate-float-slow"
            />
          </div>
        </div>

        {/* Main Title with Animation */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight tracking-tight max-w-5xl mx-auto px-2 font-display">
          <span className="text-foreground block mb-2">{t("heroTitle1")}</span>
          <span className="animated-gradient-text">
            {language === "en" ? "Ecosystem — One " : "ইকোসিস্টেম — এক "}
          </span>
          <span className={`animated-gradient-text ${animClass}`}>
            {displayWord}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed px-2">
          {t("heroDesc")}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <a
            href="/login"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 gradient-primary text-foreground px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-glow hover:shadow-glow-lg transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative">{t("startFreeTrial")}</span>
            <ArrowUpRight className="relative w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <a
            href="#pricing"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg glass-card hover:border-primary/30 transition-all duration-500 text-foreground hover-lift"
          >
            <Play className="w-4 h-4 text-primary" />
            {t("viewPricing")}
          </a>
        </div>

        {/* Trust Indicators with Glass Effect */}
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 px-4">
          {[
            { icon: Sparkles, text: t("tokensMonth") },
            { icon: Zap, text: language === "en" ? "10+ Frontier AI Models" : "১০+ ফ্রন্টিয়ার AI মডেল" },
            { icon: Shield, text: t("securePrivate") },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* AI Model Showcase */}
        <div className="mt-8 sm:mt-12">
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-4">
            Powered by the world's most advanced AI models
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-2">
            {aiModels.map((model, i) => (
              <div
                key={model.name}
                className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <model.Logo className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium text-foreground">{model.name}</span>
              </div>
            ))}
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-xs sm:text-sm font-bold text-primary">+3 more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
