import React, { useState } from 'react';
import { Check, X, Sparkles, Gift, Zap, Crown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo, QwenLogo, LlamaLogo, PerplexityLogo, KimiLogo, MistralLogo, SorixLogo } from './AIModelLogos';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { t, language } = useLanguage();

  const sorixHealthLabel = language === 'en' ? 'Sorix Health' : 'সোরিক্স হেলথ';
  const sorixAgroLabel = language === 'en' ? 'Sorix Agro' : 'সোরিক্স অ্যাগ্রো';
  const sorixLegendsLabel = language === 'en' ? 'Sorix Legends' : 'সোরিক্স লিজেন্ডস';
  const freeForAll = language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি';
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
      borderGradient: 'border-slate-200 dark:border-slate-700',
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
      buttonStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    },
    {
      name: 'basic',
      displayName: t('sorixBasic'),
      price: 499,
      yearlyPrice: Math.round(499 * 12 * 0.8),
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-500',
      borderGradient: 'border-cyan-200 dark:border-cyan-800',
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
      buttonStyle: 'border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950',
    },
    {
      name: 'pro',
      displayName: t('sorixPro'),
      price: 999,
      yearlyPrice: Math.round(999 * 12 * 0.8),
      icon: Sparkles,
      gradient: 'from-primary to-blue-600',
      borderGradient: 'border-primary',
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
      buttonStyle: 'gradient-primary text-foreground hover:shadow-xl hover:shadow-primary/25',
    },
    {
      name: 'premium',
      displayName: language === 'en' ? 'Sorix Premium' : 'সোরিক্স প্রিমিয়াম',
      price: 1999,
      yearlyPrice: Math.round(1999 * 12 * 0.8),
      icon: Crown,
      gradient: 'from-amber-500 to-orange-500',
      borderGradient: 'border-amber-300 dark:border-amber-700',
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
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-500/25',
    },
  ];

  const formatPrice = (price) => {
    if (language === 'bn') {
      return `৳${price.toLocaleString('bn-BD')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            {t('pricingLabel')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
            {t('pricingTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricingDesc')}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12 sm:mb-16">
          <span className={`text-sm sm:text-base font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('monthly')}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-16 h-8 rounded-full bg-muted p-1 transition-colors"
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full gradient-primary shadow-lg transition-all duration-300 ${
                isYearly ? 'left-9' : 'left-1'
              }`}
            />
          </button>
          <span className={`text-sm sm:text-base font-medium transition-colors flex items-center gap-2 ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('yearly')}
            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
              {t('save20')}
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-3xl border-2 ${plan.borderGradient} ${
                plan.popular ? 'shadow-2xl shadow-primary/20 md:-translate-y-4' : 'shadow-lg'
              } overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="gradient-primary text-center py-2 text-sm font-bold text-foreground">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={`p-6 sm:p-8 ${plan.badge ? 'pt-12' : ''}`}>
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-6 h-6 text-white" />
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
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
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
                <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">{plan.tokens} {t('tokens')}</span>
                  <span className="text-xs text-muted-foreground">/ {language === 'en' ? 'month' : 'মাস'}</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
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

                {/* CTA Button */}
                <button
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
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
              <div key={model.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/30 transition-colors">
                <model.Logo className="w-4 h-4" />
                <span className="text-xs font-medium text-foreground">{model.name}</span>
              </div>
            ))}
            <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold text-primary">+3 more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
