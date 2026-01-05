import React, { useState } from 'react';
import { Check, X, Sparkles, Gift, Zap, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, PerplexityLogo, DeepSeekLogo, GrokLogo } from './AIModelLogos';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { t, language } = useLanguage();

  const plans = [
    {
      name: 'free',
      displayName: t('free'),
      subtitle: t('foreverFree'),
      price: 0,
      yearlyPrice: 0,
      icon: Gift,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      badge: t('yourCurrentPlan'),
      badgeStyle: 'bg-amber-100 text-amber-700',
      features: [
        { text: `3 ${t('aiModels')}`, subtext: 'DeepSeek, Gemini Flash, Qwen', included: true },
        { text: `20K ${t('tokens')}`, included: true },
        { text: t('voiceAI'), included: false },
        { text: t('memory'), included: false },
        { text: t('projects'), included: false },
        { text: t('teamAccess'), included: false },
        { text: t('avatars'), included: false },
        { text: t('multiWindowChat'), included: false },
      ],
      buttonText: t('currentPlan'),
      buttonStyle: 'bg-primary text-primary-foreground',
      isCurrentPlan: true,
    },
    {
      name: 'basic',
      displayName: t('sorixBasic'),
      price: 499,
      yearlyPrice: Math.round(499 * 12 * 0.8),
      icon: Zap,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      features: [
        { text: `5 ${t('aiModels')}`, subtext: 'ChatGPT, Claude, DeepSeek, Gemini, Grok', included: true },
        { text: `3M ${t('tokens')}`, included: true },
        { text: `${t('voiceAIBasic')}`, subtext: '10 min/day', included: true },
        { text: t('memory'), included: true },
        { text: `4 ${t('projects')}`, included: true },
        { text: t('teamAccess'), included: false },
        { text: `3 ${t('avatars')}`, included: true },
        { text: t('multiWindowChat'), included: true },
      ],
      buttonText: t('upgrade'),
      buttonStyle: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
    {
      name: 'pro',
      displayName: t('sorixPro'),
      price: 999,
      yearlyPrice: Math.round(999 * 12 * 0.8),
      icon: Sparkles,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badge: t('mostPopular'),
      badgeStyle: 'bg-primary text-primary-foreground',
      popular: true,
      features: [
        { text: `10 ${t('aiModels')}`, subtext: 'ChatGPT, Claude, DeepSeek, Gemini, Grok +5 more', included: true },
        { text: `6M ${t('tokens')}`, included: true },
        { text: t('voiceAIHigh'), included: true },
        { text: t('memoryLong'), included: true },
        { text: `10 ${t('projects')}`, included: true },
        { text: t('teamAccess'), included: false },
        { text: `10 ${t('avatars')}`, included: true },
        { text: t('multiWindowChat'), included: true },
      ],
      buttonText: t('upgrade'),
      buttonStyle: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
    {
      name: 'ultra',
      displayName: t('sorixUltra'),
      price: 1999,
      yearlyPrice: Math.round(1999 * 12 * 0.8),
      icon: Crown,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      features: [
        { text: `15+ ${t('aiModels')}`, subtext: 'ChatGPT, Claude, DeepSeek, Gemini, Grok +10 more', included: true },
        { text: `15M ${t('tokens')}`, included: true },
        { text: t('voiceAIUnlimited'), included: true },
        { text: t('memoryUltra'), included: true },
        { text: `30 ${t('projects')}`, included: true },
        { text: t('teamAccess'), subtext: t('upToMembers'), included: true },
        { text: t('allAvatars'), included: true },
        { text: t('multiWindowChat'), included: true },
      ],
      buttonText: t('upgrade'),
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600',
    },
  ];

  const formatPrice = (price) => {
    if (language === 'bn') {
      return `৳${price.toLocaleString('bn-BD')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            {t('pricingLabel')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
            {t('pricingTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricingDesc')}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('monthly')}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-16 h-8 rounded-full bg-muted p-1 transition-colors"
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full gradient-primary shadow-md transition-all duration-300 ${
                isYearly ? 'left-9' : 'left-1'
              }`}
            />
          </button>
          <span className={`font-medium transition-colors flex items-center gap-2 ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('yearly')}
            <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full">
              {t('save20')}
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border ${
                plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border'
              } overflow-hidden transition-all duration-300 hover:shadow-lg`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-0 left-0 right-0 py-2 text-center text-xs font-bold ${plan.badgeStyle}`}>
                  {plan.badge}
                </div>
              )}

              <div className={`p-6 ${plan.badge ? 'pt-12' : ''}`}>
                {/* Plan Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center`}>
                    <plan.icon className={`w-5 h-5 ${plan.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.displayName}</h3>
                    {plan.subtitle && <p className="text-sm text-muted-foreground">{plan.subtitle}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black text-foreground">
                    {formatPrice(isYearly ? Math.round((plan.yearlyPrice || plan.price * 12 * 0.8) / 12) : plan.price)}
                  </span>
                  <span className="text-muted-foreground">{t('perMonth')}</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                          {feature.text}
                        </span>
                        {feature.subtext && feature.included && (
                          <p className="text-xs text-muted-foreground">{feature.subtext}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                  disabled={plan.isCurrentPlan}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Models Showcase */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">{language === 'en' ? 'Powered by the best AI models' : 'সেরা AI মডেল দ্বারা চালিত'}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'ChatGPT', Logo: ChatGPTLogo },
              { name: 'Claude', Logo: ClaudeLogo },
              { name: 'Gemini', Logo: GeminiLogo },
              { name: 'DeepSeek', Logo: DeepSeekLogo },
              { name: 'Grok', Logo: GrokLogo },
              { name: 'Perplexity', Logo: PerplexityLogo },
            ].map((model) => (
              <div key={model.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
                <model.Logo className="w-5 h-5" />
                <span className="text-sm font-medium text-foreground">{model.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
