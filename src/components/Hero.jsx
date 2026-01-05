import React from 'react';
import { ArrowUpRight, Sparkles, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo } from './AIModelLogos';
import logo from '../assets/logo.png';

const Hero = () => {
  const { t } = useLanguage();

  const aiModels = [
    { name: 'ChatGPT', Logo: ChatGPTLogo },
    { name: 'Claude', Logo: ClaudeLogo },
    { name: 'DeepSeek', Logo: DeepSeekLogo },
    { name: 'Gemini', Logo: GeminiLogo },
    { name: 'Grok', Logo: GrokLogo },
  ];

  return (
    <section className="relative py-10 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Logo Display */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <img src={logo} alt="AI Sorix" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight tracking-tight max-w-5xl mx-auto px-2">
          <span className="text-foreground">{t('heroTitle1')}</span>
          <br />
          <span className="text-gradient-primary">{t('heroTitle2')}</span>
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed px-2">
          {t('heroDesc')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <a
            href="/login"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 gradient-primary text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-primary/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 glow-effect"
          >
            {t('startFreeTrial')}
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-border hover:border-primary/50 hover:bg-card transition-all duration-300 text-foreground"
          >
            {t('viewPricing')}
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 sm:mt-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-10 px-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium">{t('tokensMonth')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium">{t('premiumModels')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium">{t('securePrivate')}</span>
          </div>
        </div>

        {/* AI Model Logos */}
        <div className="mt-6 sm:mt-10 flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 px-2">
          {aiModels.map((model, i) => (
            <div
              key={model.name}
              className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <model.Logo className="w-5 h-5 sm:w-7 sm:h-7" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">{model.name}</span>
            </div>
          ))}
          <div className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-xs sm:text-sm font-bold text-primary">+10 more</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;