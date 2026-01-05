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
    <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">{t('heroBadge')}</span>
          </div>
        </div>

        {/* Logo Display */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <img src={logo} alt="AI Sorix" className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-tight tracking-tight max-w-5xl mx-auto">
          <span className="text-foreground">{t('heroTitle1')}</span>
          <br />
          <span className="text-gradient-primary">{t('heroTitle2')}</span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
          {t('heroDesc')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://chat.aifiesta.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 gradient-primary text-foreground px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-primary/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 glow-effect"
          >
            {t('startFreeTrial')}
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg border-2 border-border hover:border-primary/50 hover:bg-card transition-all duration-300 text-foreground"
          >
            {t('viewPricing')}
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{t('tokensMonth')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{t('premiumModels')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{t('securePrivate')}</span>
          </div>
        </div>

        {/* AI Model Logos */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {aiModels.map((model, i) => (
            <div
              key={model.name}
              className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <model.Logo className="w-7 h-7" />
              <span className="text-sm font-semibold text-foreground">{model.name}</span>
            </div>
          ))}
          <div className="px-5 py-3 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-sm font-bold text-primary">+10 more</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;