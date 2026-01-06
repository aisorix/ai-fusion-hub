import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Sparkles, Gift, Zap, Crown, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo, QwenLogo, LlamaLogo, PerplexityLogo, KimiLogo, MistralLogo, SorixLogo } from './AIModelLogos';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { t, language } = useLanguage();

  const sorixHealthLabel = language === 'en' ? 'Sorix Health' : 'সোরিক্স হেলথ';
  const sorixAgroLabel = language === 'en' ? 'Sorix Agro' : 'সোরিক্স অ্যাগ্রো';
  const sorixLegendsLabel = language === 'en' ? 'Sorix Legends' : 'সোরিক্স লিজেন্ডস';
  const comingSoon = language === 'en' ? 'Coming Soon' : 'শীঘ্রই আসছে';

  const plans = [
    {
      name: 'free',
      displayName: t('free'),
      subtitle: t('foreverFree'),
      price: 0,
      yearlyPrice: 0,
      icon: Gift,
      gradient: 'from-slate-500 to-slate-600',
      cardStyle: 'glass-card',
      models: [
        { name: 'DeepSeek', Logo: DeepSeekLogo },
        { name: 'Gemini', Logo: GeminiLogo },
        { name: 'Sorix', Logo: SorixLogo },
      ],
      tokens: '50K',
      features: [
        { text: language === 'en' ? 'Web Search (Limited)' : 'ওয়েব সার্চ (সীমিত)', included: true },
        { text: t('voiceAI'), included: false },
        { text: language === 'en' ? 'File Upload' : 'ফাইল আপলোড', included: false },
        { text: language === 'en' ? 'Image Gen' : 'ইমেজ জেন', included: false },
        { text: t('memory'), included: false },
        { text: t('projects'), included: false },
        { text: sorixLegendsLabel, included: false },
        { text: sorixHealthLabel, subtext: comingSoon, included: true },
        { text: sorixAgroLabel, subtext: comingSoon, included: true },
      ],
      buttonText: language === 'en' ? 'Start Free' : 'ফ্রি শুরু করুন',
      buttonStyle: 'bg-muted hover:bg-muted/80 text-foreground',
    },
    {
      name: 'basic',
      displayName: t('sorixBasic'),
      price: 499,
      yearlyPrice: Math.round(499 * 12 * 0.8),
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-500',
      cardStyle: 'futuristic-card',
      models: [
        { name: 'ChatGPT', Logo: ChatGPTLogo },
        { name: 'Qwen', Logo: QwenLogo },
        { name: 'DeepSeek', Logo: DeepSeekLogo },
        { name: 'Gemini', Logo: GeminiLogo },
        { name: 'Llama', Logo: LlamaLogo },
      ],
      tokens: '700K',
      features: [
        { text: language === 'en' ? 'Web Search (Basic)' : 'ওয়েব সার্চ (বেসিক)', included: true },
        { text: `${t('voiceAIBasic')}`, subtext: '10 min/day', included: true },
        { text: language === 'en' ? 'File Upload: PDF/DOC' : 'ফাইল আপলোড: PDF/DOC', subtext: language === 'en' ? 'Max 5mb' : 'সর্বোচ্চ ৫MB', included: true },
        { text: language === 'en' ? 'Image Gen' : 'ইমেজ জেন', subtext: language === 'en' ? '20 imgs/month' : '২০টি ছবি/মাস', included: true },
        { text: t('memory'), included: true },
        { text: `2 ${t('projects')}`, included: true },
        { text: `2 ${sorixLegendsLabel}`, included: true },
        { text: sorixHealthLabel, subtext: comingSoon, included: true },
        { text: sorixAgroLabel, subtext: comingSoon, included: true },
      ],
      buttonText: language === 'en' ? 'Get Started' : 'শুরু করুন',
      buttonStyle: 'border-2 border-primary/50 text-primary hover:bg-primary/10',
    },
    {
      name: 'pro',
      displayName: t('sorixPro'),
      price: 999,
      yearlyPrice: Math.round(999 * 12 * 0.8),
      icon: Sparkles,
      gradient: 'from-primary to-blue-600',
      cardStyle: 'futuristic-card neon-border',
      badge: t('mostPopular'),
      popular: true,
      models: [
        { name: 'ChatGPT', Logo: ChatGPTLogo },
        { name: 'Qwen', Logo: QwenLogo },
        { name: 'DeepSeek', Logo: DeepSeekLogo },
        { name: 'Gemini', Logo: GeminiLogo },
        { name: 'Llama', Logo: LlamaLogo },
        { name: 'Perplexity', Logo: PerplexityLogo },
        { name: 'Kimi-k1', Logo: KimiLogo },
      ],
      tokens: '1.5M',
      features: [
        { text: language === 'en' ? 'Web Search (Pro)' : 'ওয়েব সার্চ (প্রো)', included: true },
        { text: t('voiceAIHigh'), included: true },
        { text: language === 'en' ? 'File Upload: PDF/DOC' : 'ফাইল আপলোড: PDF/DOC', subtext: language === 'en' ? 'Max 10mb' : 'সর্বোচ্চ ১০MB', included: true },
        { text: language === 'en' ? 'Image Gen' : 'ইমেজ জেন', subtext: language === 'en' ? '50 imgs/month' : '৫০টি ছবি/মাস', included: true },
        { text: t('memoryLong'), included: true },
        { text: `5 ${t('projects')}`, included: true },
        { text: `5 ${sorixLegendsLabel}`, included: true },
        { text: sorixHealthLabel, subtext: comingSoon, included: true },
        { text: sorixAgroLabel, subtext: comingSoon, included: true },
      ],
      buttonText: language === 'en' ? 'Get Pro' : 'প্রো নিন',
      buttonStyle: 'gradient-primary text-foreground shadow-glow hover:shadow-glow-lg',
    },
    {
      name: 'premium',
      displayName: language === 'en' ? 'Sorix Premium' : 'সোরিক্স প্রিমিয়াম',
      price: 1999,
      yearlyPrice: Math.round(1999 * 12 * 0.8),
      icon: Crown,
      gradient: 'from-amber-500 to-orange-500',
      cardStyle: 'futuristic-card',
      models: [
        { name: 'ChatGPT', Logo: ChatGPTLogo },
        { name: 'Claude', Logo: ClaudeLogo },
        { name: 'DeepSeek', Logo: DeepSeekLogo },
        { name: 'Gemini', Logo: GeminiLogo },
        { name: 'Grok', Logo: GrokLogo },
        { name: 'Qwen', Logo: QwenLogo },
        { name: 'Llama', Logo: LlamaLogo },
        { name: 'Perplexity', Logo: PerplexityLogo },
        { name: 'Kimi-k2', Logo: KimiLogo },
        { name: 'Mistral', Logo: MistralLogo },
      ],
      tokens: '3M',
      features: [
        { text: language === 'en' ? 'Web Search (Pro)' : 'ওয়েব সার্চ (প্রো)', included: true },
        { text: t('voiceAIUnlimited'), included: true },
        { text: language === 'en' ? 'File Upload: PDF/DOC' : 'ফাইল আপলোড: PDF/DOC', subtext: language === 'en' ? 'Max 15mb' : 'সর্বোচ্চ ১৫MB', included: true },
        { text: language === 'en' ? 'Image Gen' : 'ইমেজ জেন', subtext: language === 'en' ? '100 imgs/month' : '১০০টি ছবি/মাস', included: true },
        { text: t('memoryUltra'), included: true },
        { text: `10 ${t('projects')}`, included: true },
        { text: t('teamAccess'), subtext: language === 'en' ? 'Up to 3 members' : '৩ জন পর্যন্ত', included: true },
        { text: language === 'en' ? `All ${sorixLegendsLabel}` : `সব ${sorixLegendsLabel}`, included: true },
        { text: sorixHealthLabel, subtext: comingSoon, included: true },
        { text: sorixAgroLabel, subtext: comingSoon, included: true },
      ],
      buttonText: language === 'en' ? 'Go Premium' : 'প্রিমিয়াম নিন',
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl',
    },
  ];

  const formatPrice = (price) => {
    if (language === 'bn') {
      return `৳${price.toLocaleString('bn-BD')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 md:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            {t('pricingLabel')}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6 font-display">
            {t('pricingTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricingDesc')}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-20">
          <span className={`text-sm sm:text-base font-semibold transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('monthly')}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-20 h-10 rounded-full glass-card p-1.5 transition-all duration-300 hover:shadow-glow"
          >
            <div
              className={`absolute top-1.5 w-7 h-7 rounded-full gradient-primary shadow-lg transition-all duration-500 ease-out ${
                isYearly ? 'left-[calc(100%-30px)]' : 'left-1.5'
              }`}
            />
          </button>
          <span className={`text-sm sm:text-base font-semibold transition-colors flex items-center gap-2 ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('yearly')}
            <span className="px-2.5 py-1 bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-500/20">
              {t('save20')}
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, planIndex) => (
            <div
              key={plan.name}
              className={`relative ${plan.cardStyle} rounded-3xl ${
                plan.popular ? 'md:-translate-y-4 shadow-glow' : ''
              } overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}
              style={{ animationDelay: `${planIndex * 100}ms` }}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="gradient-primary text-center py-2.5 text-sm font-bold text-foreground flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={`p-6 sm:p-8 ${plan.badge ? 'pt-14' : ''}`}>
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.displayName}</h3>
                    {plan.subtitle && <p className="text-xs text-muted-foreground">{plan.subtitle}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-foreground">
                      {formatPrice(isYearly ? Math.round((plan.yearlyPrice || plan.price * 12 * 0.8) / 12) : plan.price)}
                    </span>
                    <span className="text-muted-foreground text-sm">{t('perMonth')}</span>
                  </div>
                  {isYearly && plan.price > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                      {language === 'en' ? 'Billed yearly' : 'বাৎসরিক বিল'}
                    </p>
                  )}
                </div>

                {/* AI Models */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {plan.models.length} {t('aiModels')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.models.slice(0, 5).map((model) => (
                      <div key={model.name} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
                        <model.Logo className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium text-foreground">{model.name}</span>
                      </div>
                    ))}
                    {plan.models.length > 5 && (
                      <div className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-xs font-bold text-primary">+{plan.models.length - 5}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tokens */}
                <div className="flex items-center gap-2 mb-6 p-3.5 rounded-xl glass-card">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground">{plan.tokens} {t('tokens')}</span>
                  <span className="text-xs text-muted-foreground">/ {language === 'en' ? 'month' : 'মাস'}</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                          {feature.text}
                        </span>
                        {feature.subtext && feature.included && (
                          <span className="text-xs text-muted-foreground ml-1">({feature.subtext})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button - Links to Login */}
                <Link
                  to="/login"
                  className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-500 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            {language === 'en' ? 'All plans include access to Sorix Health & Sorix Agro (Coming Soon)' : 'সব প্ল্যানে সোরিক্স হেলথ ও সোরিক্স অ্যাগ্রো অন্তর্ভুক্ত (শীঘ্রই আসছে)'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'ChatGPT', Logo: ChatGPTLogo },
              { name: 'Claude', Logo: ClaudeLogo },
              { name: 'DeepSeek', Logo: DeepSeekLogo },
              { name: 'Gemini', Logo: GeminiLogo },
              { name: 'Grok', Logo: GrokLogo },
              { name: 'Qwen', Logo: QwenLogo },
              { name: 'Llama', Logo: LlamaLogo },
              { name: 'Perplexity', Logo: PerplexityLogo },
              { name: 'Mistral', Logo: MistralLogo },
            ].map((model) => (
              <div key={model.name} className="flex items-center gap-2 px-3 py-2 rounded-full glass-card hover:border-primary/30 transition-all duration-300">
                <model.Logo className="w-4 h-4" />
                <span className="text-xs font-medium text-foreground">{model.name}</span>
              </div>
            ))}
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold text-primary">+3 more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;