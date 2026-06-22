import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, Gift, Zap, Crown, ArrowRight, Star, ShieldCheck, CreditCard, Diamond, Rocket, Building2, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import PaymentModal from './PaymentModal';

// Model colors for badges (using colored dots like the reference)
const modelColors = {
  'ChatGPT': 'bg-emerald-500',
  'GPT-4o': 'bg-emerald-500',
  'Claude': 'bg-amber-500',
  'DeepSeek': 'bg-blue-500',
  'Gemini': 'bg-blue-400',
  'Grok': 'bg-rose-500',
  'Qwen': 'bg-violet-500',
  'Llama': 'bg-indigo-500',
  'Perplexity': 'bg-teal-500',
  'Kimi-k1': 'bg-purple-500',
  'Kimi-k2': 'bg-purple-600',
  'Mistral': 'bg-orange-500',
  'Sorix': 'bg-cyan-500',
};

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(2); // Default to Pro (index 2)
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const { currentPlan } = useSubscription();
  const navigate = useNavigate();
  const scrollContainerRef = React.useRef(null);

  const sorixHealthLabel = t('sorixHealth');
  const sorixAgroLabel = language === 'en' ? 'Sorix Agro' : 'সোরিক্স অ্যাগ্রো';
  const sorixLegendsLabel = language === 'en' ? 'Sorix Legends' : 'সোরিক্স লিজেন্ডস';
  const comingSoon = t('comingSoon');

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
      models: ['GPT-4o', 'DeepSeek', 'Gemini'],
      tokens: '15K',
      features: [
        { text: '15K Tokens', subtext: '/month', included: true },
        { text: sorixHealthLabel, included: true },
        { text: sorixAgroLabel, included: true },
        { text: sorixLegendsLabel, included: true },
        { text: 'Sorix Deck', subtext: t('slideFree'), included: true },
        { text: 'Sorix Cineshoot', subtext: language === 'en' ? '2 free renders trial' : '২টি ফ্রি ভিডিও ট্রায়াল', included: true },

        { text: t('webSearch'), included: false },
        { text: t('projects'), included: false },
        { text: t('voiceAI'), included: false },
        { text: t('fileUpload'), included: false },
        { text: t('imageGen'), included: false },
        { text: t('memory'), included: false },
      ],
      buttonText: t('getStartedBtn'),
      buttonStyle: 'bg-muted hover:bg-muted/80 text-foreground',
      isFree: true,
    },
    {
      name: 'basic',
      displayName: t('sorixBasic'),
      price: 499,
      yearlyPrice: Math.round(499 * 12 * 0.8),
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-500',
      cardStyle: 'futuristic-card',
      models: ['ChatGPT', 'Qwen', 'DeepSeek', 'Gemini', 'Llama'],
      tokens: '800K',
      features: [
        { text: '800K Tokens', subtext: '/month', included: true },
        { text: sorixHealthLabel, included: true },
        { text: sorixAgroLabel, included: true },
        { text: sorixLegendsLabel, included: true },
        { text: 'Sorix Deck', included: true },
        { text: 'Sorix Cineshoot', subtext: language === 'en' ? '2 free renders trial' : '২টি ফ্রি ভিডিও ট্রায়াল', included: true },

        { text: t('webSearchBasic'), included: true },
        { text: `${t('voiceAIBasic')}`, subtext: '10 min/day', included: true },
        { text: t('fileUpload') + ': PDF/DOC', subtext: t('maxSize') + ' 5MB', included: true },
        { text: t('imageGen'), included: true },
        { text: t('memory'), included: true },
        { text: `2 ${t('projects')}`, included: true },
      ],
      buttonText: t('getStartedBtn'),
      buttonStyle: 'border-2 border-foreground/20 text-foreground hover:bg-muted',
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
      models: ['ChatGPT', 'Qwen', 'DeepSeek', 'Gemini', 'Llama', 'Claude', 'Grok', 'Perplexity'],
      tokens: '1.5M',
      features: [
        { text: '1.5M Tokens', subtext: '/month', included: true },
        { text: sorixHealthLabel, included: true },
        { text: sorixAgroLabel, included: true },
        { text: sorixLegendsLabel, included: true },
        { text: 'Sorix Deck', included: true },
        { text: t('webSearchPro'), included: true },
        { text: t('voiceAIHigh'), included: true },
        { text: t('fileUpload') + ': PDF/DOC', subtext: t('maxSize') + ' 10MB', included: true },
        { text: t('imageGen'), included: true },
        { text: t('memoryLong'), included: true },
        { text: `5 ${t('projects')}`, included: true },
      ],
      buttonText: t('getPro'),
      buttonStyle: 'bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg',
    },
    {
      name: 'premium',
      displayName: language === 'en' ? 'Sorix Premium' : 'সোরিক্স প্রিমিয়াম',
      price: 1999,
      yearlyPrice: Math.round(1999 * 12 * 0.8),
      icon: Crown,
      gradient: 'from-amber-500 to-orange-500',
      cardStyle: 'futuristic-card',
      models: ['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Grok', 'Qwen', 'Llama', 'Sorix', 'Mistral', 'Perplexity'],
      tokens: '3M',
      features: [
        { text: '3M Tokens', subtext: '/month', included: true },
        { text: sorixHealthLabel, included: true },
        { text: sorixAgroLabel, included: true },
        { text: sorixLegendsLabel, included: true },
        { text: 'Sorix Deck', included: true },
        { text: 'Sorix Agent', included: true },
        { text: t('webSearchPremium'), included: true },
        { text: t('voiceAIUnlimited'), included: true },
        { text: t('fileUpload') + ': PDF/DOC', subtext: t('maxSize') + ' 15MB', included: true },
        { text: t('imageGen'), included: true },
        { text: t('memoryUltra'), included: true },
        { text: `10 ${t('projects')}`, included: true },
      ],
      buttonText: t('goPremium'),
      buttonStyle: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl',
    },
  ];

  // Power-tier plans rendered in a second row below the core 4
  const advancedPlans = [
    {
      name: 'premium_plus',
      displayName: language === 'en' ? 'Sorix Premium Plus' : 'সোরিক্স প্রিমিয়াম প্লাস',
      price: 3999,
      yearlyPrice: Math.round(3999 * 12 * 0.8),
      icon: Diamond,
      gradient: 'from-violet-500 to-fuchsia-600',
      cardStyle: 'futuristic-card',
      badge: language === 'en' ? 'Power' : 'পাওয়ার',
      models: ['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Grok', 'Qwen', 'Llama', 'Sorix', 'Mistral', 'Perplexity'],
      tokens: '7M',
      features: [
        { text: language === 'en' ? 'Everything in Premium' : 'প্রিমিয়ামের সবকিছু', included: true },
        { text: '7M Tokens', subtext: '/month', included: true },
        { text: 'Sorix Cineshoot', subtext: language === 'en' ? 'Premium Plus & above' : 'প্রিমিয়াম প্লাস ও তদূর্ধ্ব', included: true },
        { text: 'Sorix Agent', included: true },
        { text: language === 'en' ? 'More Image Generation' : 'আরও ইমেজ জেনারেশন', included: true },
        { text: language === 'en' ? 'More Memory' : 'আরও মেমোরি', included: true },
        { text: t('voiceAIUnlimited'), included: true },
        { text: t('fileUpload') + ': PDF/DOC', subtext: t('maxSize') + ' 25MB', included: true },
        { text: `25 ${t('projects')}`, included: true },
      ],
      buttonText: language === 'en' ? 'Go Premium Plus' : 'প্রিমিয়াম প্লাস নিন',
      buttonStyle: 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg hover:shadow-xl',
    },
    {
      name: 'max',
      displayName: language === 'en' ? 'Sorix Max' : 'সোরিক্স ম্যাক্স',
      price: 9999,
      yearlyPrice: Math.round(9999 * 12 * 0.8),
      icon: Rocket,
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      cardStyle: 'futuristic-card neon-border',
      badge: language === 'en' ? 'Ultimate' : 'আলটিমেট',
      models: ['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Grok', 'Qwen', 'Llama', 'Sorix', 'Mistral', 'Perplexity'],
      tokens: '17M',
      features: [
        { text: language === 'en' ? 'Everything in Premium Plus' : 'প্রিমিয়াম প্লাসের সবকিছু', included: true },
        { text: '17M Tokens', subtext: '/month', included: true },
        { text: language === 'en' ? 'Extra Cineshoot video generation' : 'অতিরিক্ত সিনেশুট ভিডিও জেনারেশন', included: true },
        { text: language === 'en' ? 'More Image Generation' : 'আরও ইমেজ জেনারেশন', included: true },
        { text: language === 'en' ? 'More Agentic work' : 'আরও এজেন্টিক কাজ', included: true },
        { text: language === 'en' ? 'Max Memory' : 'ম্যাক্স মেমোরি', included: true },
        { text: t('voiceAIUnlimited'), included: true },
        { text: t('fileUpload') + ': PDF/DOC', subtext: t('maxSize') + ' 50MB', included: true },
        { text: `100 ${t('projects')}`, included: true },
      ],
      buttonText: language === 'en' ? 'Go Max' : 'ম্যাক্স নিন',
      buttonStyle: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl',
    },
  ];

  const allPricingPlans = [...plans, ...advancedPlans];

  const formatPrice = (price) => {
    if (language === 'bn') {
      return `৳${price.toLocaleString('bn-BD')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  const handlePlanSelect = (plan) => {
    if (plan.isFree) {
      // Free plan - just go to chat if logged in
      if (isAuthenticated) {
        navigate('/chat');
      } else {
        navigate('/login');
      }
      return;
    }

    // Paid plans - check authentication first
    if (!isAuthenticated) {
      // Store selected plan in sessionStorage and redirect to login
      sessionStorage.setItem('selectedPlan', JSON.stringify({
        name: plan.name,
        displayName: plan.displayName,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        isYearly,
      }));
      navigate('/login', { state: { returnTo: '/#pricing', message: language === 'en' ? 'Please login to continue with your purchase' : 'ক্রয় চালিয়ে যেতে লগইন করুন' } });
      return;
    }

    // User is authenticated - show payment modal
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <section id="pricing" className="py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
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

        {/* Pricing Cards - Mobile: Horizontal Scroll with Indicators */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide"
            onScroll={(e) => {
              const container = e.target;
              const scrollLeft = container.scrollLeft;
              const cardWidth = 280 + 16; // card width + gap
              const newIndex = Math.round(scrollLeft / cardWidth);
              setActiveCardIndex(Math.min(Math.max(newIndex, 0), allPricingPlans.length - 1));
            }}
          >
          {allPricingPlans.map((plan, planIndex) => {
            const isCurrentUserPlan = currentPlan === plan.name;
            return (
            <div
              key={plan.name}
              className={`relative ${plan.cardStyle} rounded-2xl ${
                plan.popular ? 'shadow-glow' : ''
              } ${isCurrentUserPlan ? 'ring-2 ring-primary/50' : ''} overflow-hidden transition-all duration-500 flex-shrink-0 w-[280px] snap-center`}
              style={{ animationDelay: `${planIndex * 100}ms` }}
            >
              {/* Popular Badge or Current Plan Badge */}
              {plan.badge && !isCurrentUserPlan && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="gradient-primary text-center py-2 text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}
              
              {isCurrentUserPlan && (
                <div className="absolute top-0 left-0 right-0">
                   <div className="bg-muted text-center py-2 text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5 border-b border-border">
                    {t('yourCurrentPlan')}
                  </div>
                </div>
              )}

              <div className={`p-5 ${(plan.badge || isCurrentUserPlan) ? 'pt-11' : ''}`}>
                {/* Plan Header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{plan.displayName}</h3>
                    {plan.subtitle && <p className="text-[10px] text-muted-foreground">{plan.subtitle}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black text-foreground">
                      {formatPrice(isYearly ? Math.round((plan.yearlyPrice || plan.price * 12 * 0.8) / 12) : plan.price)}
                    </span>
                    <span className="text-muted-foreground text-xs">{t('perMonth')}</span>
                  </div>
                  {isYearly && plan.price > 0 && (
                    <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
                      {t('billedYearly')}
                    </p>
                  )}
                </div>

                {/* AI Models */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {plan.models.length} {t('aiModels')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plan.models.slice(0, 4).map((model) => (
                      <div key={model} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/50 border border-border/50">
                        <span className={`w-1.5 h-1.5 rounded-full ${modelColors[model] || 'bg-primary'}`} />
                        <span className="text-[10px] font-medium text-foreground">{model}</span>
                      </div>
                    ))}
                    {plan.models.length > 4 && (
                      <div className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                        <span className="text-[10px] font-bold text-primary">+{plan.models.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features - Show first 6 on mobile */}
                <div className="space-y-2 mb-5">
                  {plan.features.slice(0, 6).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-2.5 h-2.5 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={`text-xs ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <p className="text-[10px] text-muted-foreground pl-6">+{plan.features.length - 6} {t('moreFeatures')}</p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={currentPlan === plan.name}
                  className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-500 ${
                    currentPlan === plan.name 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : plan.buttonStyle
                  }`}
                >
                  {currentPlan === plan.name 
                    ? t('currentPlan')
                    : plan.buttonText}
                  {currentPlan !== plan.name && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )})}
          </div>
          
          {/* Scroll Position Indicator Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {allPricingPlans.map((plan, index) => (
              <button
                key={plan.name}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = 280 + 16;
                    container.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeCardIndex === index 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to ${plan.displayName} plan`}
              />
            ))}
          </div>
        </div>

        {/* Tablet & Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {plans.map((plan, planIndex) => {
            const isCurrentUserPlan = currentPlan === plan.name;
            return (
            <div
              key={plan.name}
              className={`relative ${plan.cardStyle} rounded-3xl ${
                plan.popular ? 'md:-translate-y-4 shadow-glow' : ''
              } ${isCurrentUserPlan ? 'ring-2 ring-primary/50' : ''} overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}
              style={{ animationDelay: `${planIndex * 100}ms` }}
            >
              {/* Popular Badge or Current Plan Badge */}
              {plan.badge && !isCurrentUserPlan && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="gradient-primary text-center py-2.5 text-sm font-bold text-foreground flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}
              
              {isCurrentUserPlan && (
                <div className="absolute top-0 left-0 right-0">
                   <div className="bg-muted text-center py-2.5 text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 border-b border-border">
                    {t('yourCurrentPlan')}
                  </div>
                </div>
              )}

              <div className={`p-5 lg:p-8 ${(plan.badge || isCurrentUserPlan) ? 'pt-12 lg:pt-14' : ''}`}>
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-5 lg:mb-6">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                    <plan.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-foreground">{plan.displayName}</h3>
                    {plan.subtitle && <p className="text-xs text-muted-foreground">{plan.subtitle}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5 lg:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-black text-foreground">
                      {formatPrice(isYearly ? Math.round((plan.yearlyPrice || plan.price * 12 * 0.8) / 12) : plan.price)}
                    </span>
                    <span className="text-muted-foreground text-sm">{t('perMonth')}</span>
                  </div>
                  {isYearly && plan.price > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                      {t('billedYearly')}
                    </p>
                  )}
                </div>

                {/* AI Models */}
                <div className="mb-5 lg:mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {plan.models.length} {t('aiModels')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.models.slice(0, 5).map((model) => (
                      <div key={model} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
                        <span className={`w-2 h-2 rounded-full ${modelColors[model] || 'bg-primary'}`} />
                        <span className="text-xs font-medium text-foreground">{model}</span>
                      </div>
                    ))}
                    {plan.models.length > 5 && (
                      <div className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-xs font-bold text-primary">+{plan.models.length - 5}</span>
                      </div>
                    )}
                  </div>
                </div>


                {/* Features */}
                <div className="space-y-3 mb-6 lg:mb-8">
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

                {/* CTA Button - Opens Payment Modal if logged in, otherwise redirects to login */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={currentPlan === plan.name}
                  className={`w-full py-3.5 lg:py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-500 ${
                    currentPlan === plan.name 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : plan.buttonStyle
                  }`}
                >
                  {currentPlan === plan.name 
                    ? (language === 'en' ? 'Current Plan' : 'বর্তমান প্ল্যান')
                    : plan.buttonText}
                  {currentPlan !== plan.name && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
          )})}
        </div>

        {/* Advanced Tier Row (Desktop only) — Premium Plus + Max + Enterprise */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
          {advancedPlans.map((plan, planIndex) => {
            const isCurrentUserPlan = currentPlan === plan.name;
            return (
              <div
                key={plan.name}
                className={`relative ${plan.cardStyle} rounded-3xl ${isCurrentUserPlan ? 'ring-2 ring-primary/50' : ''} overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}
              >
                {plan.badge && !isCurrentUserPlan && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className={`bg-gradient-to-r ${plan.gradient} text-center py-2.5 text-sm font-bold text-white flex items-center justify-center gap-2`}>
                      <Sparkles className="w-4 h-4" />
                      {plan.badge}
                    </div>
                  </div>
                )}
                {isCurrentUserPlan && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-muted text-center py-2.5 text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 border-b border-border">
                      {t('yourCurrentPlan')}
                    </div>
                  </div>
                )}
                <div className={`p-5 lg:p-8 ${(plan.badge || isCurrentUserPlan) ? 'pt-12 lg:pt-14' : ''}`}>
                  <div className="flex items-center gap-3 mb-5 lg:mb-6">
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500`}>
                      <plan.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-foreground">{plan.displayName}</h3>
                    </div>
                  </div>
                  <div className="mb-5 lg:mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl lg:text-5xl font-black text-foreground">
                        {formatPrice(isYearly ? Math.round((plan.yearlyPrice || plan.price * 12 * 0.8) / 12) : plan.price)}
                      </span>
                      <span className="text-muted-foreground text-sm">{t('perMonth')}</span>
                    </div>
                    {isYearly && plan.price > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">{t('billedYearly')}</p>
                    )}
                  </div>
                  <div className="space-y-3 mb-6 lg:mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-foreground">{feature.text}</span>
                          {feature.subtext && (
                            <span className="text-xs text-muted-foreground ml-1">({feature.subtext})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={currentPlan === plan.name}
                    className={`w-full py-3.5 lg:py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-500 ${
                      currentPlan === plan.name ? 'bg-muted text-muted-foreground cursor-not-allowed' : plan.buttonStyle
                    }`}
                  >
                    {currentPlan === plan.name ? (language === 'en' ? 'Current Plan' : 'বর্তমান প্ল্যান') : plan.buttonText}
                    {currentPlan !== plan.name && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Enterprise Card */}
          <div className="relative futuristic-card rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="p-5 lg:p-8">
              <div className="flex items-center gap-3 mb-5 lg:mb-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500">
                  <Building2 className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-foreground">
                    {language === 'en' ? 'Enterprise' : 'এন্টারপ্রাইজ'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Flexible pooled usage' : 'নমনীয় পুলড ব্যবহার'}
                  </p>
                </div>
              </div>
              <div className="mb-5 lg:mb-6 p-4 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {language === 'en' ? 'Custom plan' : 'কাস্টম প্ল্যান'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'en'
                    ? 'Seat price + usage at API rates. Pooled limits, SSO, SLAs and dedicated support.'
                    : 'সিট মূল্য + API রেটে ব্যবহার। পুলড সীমা, SSO, SLA এবং ডেডিকেটেড সাপোর্ট।'}
                </p>
              </div>
              <div className="space-y-3 mb-6 lg:mb-8">
                {[
                  language === 'en' ? 'Everything in Sorix Max' : 'সোরিক্স ম্যাক্সের সবকিছু',
                  language === 'en' ? 'Pooled team-wide token usage' : 'পুরো টিমের পুলড টোকেন ব্যবহার',
                  language === 'en' ? 'SSO, audit logs, custom retention' : 'SSO, অডিট লগ, কাস্টম রিটেনশন',
                  language === 'en' ? 'Dedicated success manager + SLA' : 'ডেডিকেটেড সাকসেস ম্যানেজার + SLA',
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-foreground">{text}</span>
                  </div>
                ))}
              </div>
              <a
                href="mailto:support@aisorix.com?subject=Enterprise%20Demo%20Request"
                className="w-full py-3.5 lg:py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <Mail className="w-4 h-4" />
                {language === 'en' ? 'Book a Demo' : 'ডেমো বুক করুন'}
              </a>
            </div>
          </div>
        </div>


        {/* Footer Note */}
        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            {language === 'en' ? 'Powered by the best AI models' : 'সেরা AI মডেলগুলো দ্বারা চালিত'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Grok'].map((model) => (
              <div key={model} className="flex items-center gap-2 px-3 py-2 rounded-full glass-card hover:border-primary/30 transition-all duration-300">
                <span className={`w-2 h-2 rounded-full ${modelColors[model] || 'bg-primary'}`} />
                <span className="text-xs font-medium text-foreground">{model}</span>
              </div>
            ))}
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold text-primary">+10 more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        isYearly={isYearly}
        language={language}
      />
    </section>
  );
};

export default Pricing;
