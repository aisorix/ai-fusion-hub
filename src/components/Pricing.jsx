import React, { useState } from 'react';
import { Check, X, Sparkles, Gift, Zap, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo } from './AIModelLogos';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { t, language } = useLanguage();

  const sorixHealthLabel = language === 'en' ? 'Sorix Health' : 'সোরিক্স হেলথ';
  const sorixAgroLabel = language === 'en' ? 'Sorix Agro' : 'সোরিক্স অ্যাগ্রো';
  const sorixLegendsLabel = language === 'en' ? 'Sorix Legends' : 'সোরিক্স লিজেন্ডস';

  const plans = [
    {
      name: 'free',
      displayName: t('free'),
      subtitle: t('foreverFree'),
      price: 0,
      yearlyPrice: 0,
      icon: Gift,
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
      badge: t('yourCurrentPlan'),
      badgeStyle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      features: [
        { text: `3 ${t('aiModels')}`, subtext: 'DeepSeek, Gemini Flash, Qwen', included: true },
        { text: `20K ${t('tokens')}`, included: true },
        { text: t('voiceAI'), included: false },
        { text: t('memory'), included: false },
        { text: t('projects'), included: false },
        { text: t('teamAccess'), included: false },
        { text: sorixLegendsLabel, included: false },
        { text: t('multiWindowChat'), included: false },
        { text: sorixHealthLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
        { text: sorixAgroLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
      ],
      buttonText: t('currentPlan'),
      buttonStyle: 'border-2 border-primary/30 text-primary bg-primary/5 cursor-default',
      isCurrentPlan: true,
    },
    {
      name: 'basic',
      displayName: t('sorixBasic'),
      price: 499,
      yearlyPrice: Math.round(499 * 12 * 0.8),
      icon: Zap,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      features: [
        { text: `5 ${t('aiModels')}`, subtext: 'ChatGPT, Claude, DeepSeek, Gemini, Grok', included: true },
        { text: `3M ${t('tokens')}`, included: true },
        { text: `${t('voiceAIBasic')}`, subtext: '10 min/day', included: true },
        { text: t('memory'), included: true },
        { text: `4 ${t('projects')}`, included: true },
        { text: t('teamAccess'), included: false },
        { text: `3 ${sorixLegendsLabel}`, included: true },
        { text: t('multiWindowChat'), included: true },
        { text: sorixHealthLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
        { text: sorixAgroLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
      ],
      buttonText: t('upgrade'),
      buttonStyle: 'gradient-primary text-foreground hover:shadow-lg hover:scale-105',
    },
    {
      name: 'pro',
      displayName: t('sorixPro'),
      price: 999,
      yearlyPrice: Math.round(999 * 12 * 0.8),
      icon: Sparkles,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      badge: t('mostPopular'),
      badgeStyle: 'bg-primary/10 text-primary border-b border-primary/20',
      popular: true,
      features: [
        { text: `10 ${t('aiModels')}`, subtext: 'ChatGPT, Claude, DeepSeek, Gemini, Grok +5 more', included: true },
        { text: `6M ${t('tokens')}`, included: true },
        { text: t('voiceAIHigh'), included: true },
        { text: t('memoryLong'), included: true },
        { text: `10 ${t('projects')}`, included: true },
        { text: t('teamAccess'), included: false },
        { text: `10 ${sorixLegendsLabel}`, included: true },
        { text: t('multiWindowChat'), included: true },
        { text: sorixHealthLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
        { text: sorixAgroLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
      ],
      buttonText: t('upgrade'),
      buttonStyle: 'gradient-primary text-foreground hover:shadow-lg hover:scale-105',
    },
    {
      name: 'ultra',
      displayName: t('sorixUltra'),
      price: 1999,
      yearlyPrice: Math.round(1999 * 12 * 0.8),
      icon: Crown,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      features: [
        { text: `15+ ${t('aiModels')}`, subtext: 'ChatGPT, Claude, DeepSeek, Gemini, Grok +10 more', included: true },
        { text: `15M ${t('tokens')}`, included: true },
        { text: t('voiceAIUnlimited'), included: true },
        { text: t('memoryUltra'), included: true },
        { text: `30 ${t('projects')}`, included: true },
        { text: t('teamAccess'), subtext: t('upToMembers'), included: true },
        { text: language === 'en' ? `All ${sorixLegendsLabel}` : `সব ${sorixLegendsLabel}`, included: true },
        { text: t('multiWindowChat'), included: true },
        { text: sorixHealthLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
        { text: sorixAgroLabel, subtext: language === 'en' ? 'Free for all' : 'সবার জন্য ফ্রি', included: true },
      ],
      buttonText: t('upgrade'),
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-foreground hover:shadow-lg hover:scale-105',
    },
  ];

  const formatPrice = (price) => {
    if (language === 'bn') {
      return `৳${price.toLocaleString('bn-BD')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  return (
    <section id="pricing" className="py-10 sm:py-16 md:py-24 bg-muted/20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t('pricingLabel')}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-2 sm:mb-3 px-2">
            {t('pricingTitle')}
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('pricingDesc')}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <span className={`text-sm sm:text-base font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('monthly')}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 sm:w-16 h-7 sm:h-8 rounded-full bg-muted p-1 transition-colors"
          >
            <div
              className={`absolute top-1 w-5 sm:w-6 h-5 sm:h-6 rounded-full gradient-primary shadow-md transition-all duration-300 ${
                isYearly ? 'left-8 sm:left-9' : 'left-1'
              }`}
            />
          </button>
          <span className={`text-sm sm:text-base font-medium transition-colors flex items-center gap-1.5 sm:gap-2 ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('yearly')}
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold rounded-full">
              {t('save20')}
            </span>
          </span>
        </div>

        {/* Pricing Cards - Horizontal scroll on mobile */}
        <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border flex-shrink-0 w-[280px] sm:w-[300px] lg:w-auto snap-center ${
                plan.popular ? 'border-primary shadow-2xl shadow-primary/10 lg:scale-105' : 'border-border'
              } overflow-hidden transition-all duration-300 hover:shadow-xl`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-0 left-0 right-0 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-bold ${plan.badgeStyle}`}>
                  {plan.badge}
                </div>
              )}

              <div className={`p-4 sm:p-5 ${plan.badge ? 'pt-8 sm:pt-10' : ''}`}>
                {/* Plan Icon & Name */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${plan.iconBg} flex items-center justify-center`}>
                    <plan.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${plan.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{plan.displayName}</h3>
                    {plan.subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground">{plan.subtitle}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-foreground">
                    {formatPrice(isYearly ? Math.round((plan.yearlyPrice || plan.price * 12 * 0.8) / 12) : plan.price)}
                  </span>
                  <span className="text-muted-foreground text-xs sm:text-sm">{t('perMonth')}</span>
                </div>

                {/* Features */}
                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 sm:gap-2">
                      {feature.included ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`text-[10px] sm:text-xs ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                          {feature.text}
                        </span>
                        {feature.subtext && feature.included && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{feature.subtext}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${plan.buttonStyle}`}
                  disabled={plan.isCurrentPlan}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Models Showcase */}
        <div className="mt-10 sm:mt-14 text-center">
          <p className="text-muted-foreground mb-4 sm:mb-5 text-xs sm:text-sm">{language === 'en' ? 'Powered by the best AI models' : 'সেরা AI মডেল দ্বারা চালিত'}</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { name: 'ChatGPT', Logo: ChatGPTLogo },
              { name: 'Claude', Logo: ClaudeLogo },
              { name: 'DeepSeek', Logo: DeepSeekLogo },
              { name: 'Gemini', Logo: GeminiLogo },
              { name: 'Grok', Logo: GrokLogo },
            ].map((model) => (
              <div key={model.name} className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-card border border-border">
                <model.Logo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium text-foreground">{model.name}</span>
              </div>
            ))}
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-[10px] sm:text-xs font-bold text-primary">+10 more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;