import React, { createContext, useContext, useState, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';

// Bidirectional sync component
const LanguageSyncBridge = ({ language, setLanguage }) => {
  const { language: storeLanguage, setLanguage: setStoreLanguage } = useChatStore();
  
  // Sync LanguageContext -> chatStore
  useEffect(() => {
    if (language !== storeLanguage) {
      setStoreLanguage(language);
    }
  }, [language]);
  
  // Sync chatStore -> LanguageContext
  useEffect(() => {
    if (storeLanguage !== language) {
      setLanguage(storeLanguage);
    }
  }, [storeLanguage]);
  
  return null;
};

const translations = {
  en: {
    login: 'Login',
    register: 'Register',
    getStarted: 'Get Started',
    
    // Hero
    heroBadge: 'New: Now with Grok 4 & Claude Sonnet 4',
    heroTitle1: 'The Ultimate AI Research',
    heroTitle2: 'Ecosystem — One Platform',
    heroDesc: 'One workspace. 10+ frontier AI models. Sub-second responses. Enterprise-grade encryption. Engineered for researchers, professionals & high-performance teams across the globe.',
    startFreeTrial: 'Start Free Trial',
    viewPricing: 'View Pricing',
    tokensMonth: '3M+ Tokens/Month',
    premiumModels: '15+ Premium AI Models',
    securePrivate: 'Enterprise-Grade Security',
    
    // Features
    featuresLabel: 'Premium Features',
    featuresTitle1: 'Powerful Features for',
    featuresTitle2: 'AI Excellence',
    featuresDesc: 'Experience the next generation of AI with our comprehensive suite of premium features.',
    sorixChat: 'Sorix Chat',
    sorixChatDesc: 'Chat with all premium AI models in one unified interface.',
    sorixAvatar: 'Sorix Avatar',
    sorixAvatarDesc: 'Create personalized AI avatars for different use cases.',
    sorixHealth: 'Sorix Health',
    sorixHealthDesc: 'AI-powered health insights and wellness tracking.',
    comingSoon: 'Coming Soon',
    funEmotional: 'Adaptive & Context-Aware',
    funEmotionalDesc: 'AI that understands nuance, tone, and context.',
    superIntelligent: 'Multi-Modal Intelligence',
    superIntelligentDesc: 'From code to creative writing — one platform, limitless capability.',
    instantReplies: 'Ultra-Fast Responses',
    instantRepliesDesc: 'Sub-second latency with optimized inference.',
    
    // Workflow / AI Models
    aiModelsLabel: 'AI Models',
    aiModelsTitle1: 'Pick the Best of',
    aiModelsTitle2: 'Each AI Model',
    aiModelsDesc: 'Every AI has its superpower. Combine them all for unstoppable results.',
    chatgptSubtitle: 'All Rounder Explainer',
    chatgptDesc: 'Great for questions, brainstorming, and clear step-by-step explanations.',
    claudeSubtitle: 'Co-Writing Master',
    claudeDesc: 'Refines polished emails, essays, and scripts while keeping your style.',
    geminiSubtitle: 'Long Context Master',
    geminiDesc: 'Handles long documents and images, tracking full context and details.',
    deepseekSubtitle: 'Reasoning Specialist',
    deepseekDesc: 'Excels at logic, math, and coding with clear, detailed solutions.',
    grokSubtitle: 'Creative Powerhouse',
    grokDesc: 'Bold, unconventional ideas and punchy copy for trend-focused content.',
    
    // Pricing
    pricingLabel: 'Unlock Premium Features',
    pricingTitle: 'Choose Your Plan',
    pricingDesc: 'Select the perfect plan for your AI needs',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save20: 'Save 20%',
    yourCurrentPlan: 'Your Current Plan',
    mostPopular: 'Most Popular',
    upgrade: 'Upgrade',
    currentPlan: 'Current Plan',
    perMonth: '/mo',
    
    // Plan names
    free: 'Free',
    foreverFree: 'Forever free',
    sorixBasic: 'Sorix Basic',
    sorixPro: 'Sorix Pro',
    sorixUltra: 'Sorix Ultra',
    
    // Features
    aiModels: 'AI Models',
    tokens: 'Tokens',
    voiceAI: 'Voice AI',
    voiceAIBasic: 'Voice AI Basic',
    voiceAIHigh: 'Voice AI High',
    voiceAIUnlimited: 'Voice AI Unlimited',
    memory: 'Memory',
    memoryLong: 'Memory Long',
    memoryUltra: 'Memory Ultra',
    projects: 'Projects',
    teamAccess: 'Team Access',
    avatars: 'Avatars',
    allAvatars: 'All Avatars',
    multiWindowChat: 'Multi-Window Chat',
    upToMembers: 'Up to 3 members',
    
    // FAQs
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Find answers to common questions about AI Sorix.',
    
    // Footer
    footerDesc: 'The ultimate AI research ecosystem — 10+ frontier models unified in one intelligent workspace for professionals & teams worldwide.',
    product: 'Product',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
    refundPolicy: 'Refund Policy',
    changelog: 'Changelog',
    allRightsReserved: 'All rights reserved.',
  },
  bn: {
    // Navbar
    features: 'ফিচার',
    pricing: 'মূল্য',
    faqs: 'প্রশ্নোত্তর',
    aboutUs: 'আমাদের সম্পর্কে',
    login: 'লগইন',
    register: 'রেজিস্টার',
    getStarted: 'শুরু করুন',
    
    // Hero
    heroBadge: 'নতুন: এখন Grok 4 এবং Claude Sonnet 4 সহ',
    heroTitle1: 'চূড়ান্ত AI রিসার্চ',
    heroTitle2: 'ইকোসিস্টেম — এক প্ল্যাটফর্ম',
    heroDesc: 'একটি ওয়ার্কস্পেস। ১০+ ফ্রন্টিয়ার AI মডেল। সাব-সেকেন্ড রেসপন্স। এন্টারপ্রাইজ-গ্রেড এনক্রিপশন। বিশ্বজুড়ে গবেষক, পেশাদার ও হাই-পারফরম্যান্স টিমদের জন্য ইঞ্জিনিয়ার করা।',
    startFreeTrial: 'ফ্রি ট্রায়াল শুরু',
    viewPricing: 'মূল্য দেখুন',
    tokensMonth: '৩০ লক্ষ+ টোকেন/মাস',
    premiumModels: '১৫+ প্রিমিয়াম AI মডেল',
    securePrivate: 'এন্টারপ্রাইজ-গ্রেড সিকিউরিটি',
    
    // Features
    featuresLabel: 'প্রিমিয়াম ফিচার',
    featuresTitle1: 'AI উৎকর্ষতার জন্য',
    featuresTitle2: 'শক্তিশালী ফিচার',
    featuresDesc: 'আমাদের প্রিমিয়াম ফিচারের সম্পূর্ণ স্যুট সহ পরবর্তী প্রজন্মের AI অভিজ্ঞতা নিন।',
    sorixChat: 'সোরিক্স চ্যাট',
    sorixChatDesc: 'একটি একীভূত ইন্টারফেসে সব প্রিমিয়াম AI মডেলের সাথে চ্যাট করুন।',
    sorixAvatar: 'সোরিক্স অবতার',
    sorixAvatarDesc: 'বিভিন্ন ব্যবহারের জন্য ব্যক্তিগতকৃত AI অবতার তৈরি করুন।',
    sorixHealth: 'সোরিক্স হেলথ',
    sorixHealthDesc: 'AI-চালিত স্বাস্থ্য অন্তর্দৃষ্টি এবং সুস্থতা ট্র্যাকিং।',
    comingSoon: 'শীঘ্রই আসছে',
    funEmotional: 'অভিযোজিত ও প্রসঙ্গ-সচেতন',
    funEmotionalDesc: 'AI যা সূক্ষ্মতা, টোন এবং প্রসঙ্গ বোঝে।',
    superIntelligent: 'মাল্টি-মোডাল ইন্টেলিজেন্স',
    superIntelligentDesc: 'কোড থেকে সৃজনশীল লেখা — এক প্ল্যাটফর্ম, সীমাহীন সক্ষমতা।',
    instantReplies: 'অতি-দ্রুত রেসপন্স',
    instantRepliesDesc: 'অপটিমাইজড ইনফারেন্স সহ সাব-সেকেন্ড লেটেন্সি।',
    
    // Workflow / AI Models
    aiModelsLabel: 'AI মডেল',
    aiModelsTitle1: 'প্রতিটি AI মডেলের',
    aiModelsTitle2: 'সেরাটি বেছে নিন',
    aiModelsDesc: 'প্রতিটি AI-এর নিজস্ব বিশেষত্ব আছে। অপ্রতিরোধ্য ফলাফলের জন্য সব একত্রিত করুন।',
    chatgptSubtitle: 'সর্বক্ষেত্রে ব্যাখ্যাকারী',
    chatgptDesc: 'প্রশ্ন, মতবিনিময় এবং স্পষ্ট ধাপে ধাপে ব্যাখ্যার জন্য দুর্দান্ত।',
    claudeSubtitle: 'সহ-লেখক মাস্টার',
    claudeDesc: 'আপনার স্টাইল বজায় রেখে ইমেইল, প্রবন্ধ এবং স্ক্রিপ্ট পরিমার্জন করে।',
    geminiSubtitle: 'দীর্ঘ প্রসঙ্গ মাস্টার',
    geminiDesc: 'দীর্ঘ নথি এবং ছবি হ্যান্ডেল করে, সম্পূর্ণ প্রসঙ্গ ট্র্যাক করে।',
    deepseekSubtitle: 'যুক্তি বিশেষজ্ঞ',
    deepseekDesc: 'যুক্তি, গণিত এবং কোডিংয়ে স্পষ্ট সমাধান সহ উৎকৃষ্ট।',
    grokSubtitle: 'সৃজনশীল পাওয়ারহাউস',
    grokDesc: 'ট্রেন্ড-ফোকাসড কন্টেন্টের জন্য সাহসী, অপ্রচলিত ধারণা।',
    
    // Pricing
    pricingLabel: 'প্রিমিয়াম ফিচার আনলক করুন',
    pricingTitle: 'আপনার প্ল্যান বেছে নিন',
    pricingDesc: 'আপনার AI প্রয়োজনের জন্য নিখুঁত প্ল্যান নির্বাচন করুন',
    monthly: 'মাসিক',
    yearly: 'বার্ষিক',
    save20: '২০% সাশ্রয়',
    yourCurrentPlan: 'আপনার বর্তমান প্ল্যান',
    mostPopular: 'সবচেয়ে জনপ্রিয়',
    upgrade: 'আপগ্রেড',
    currentPlan: 'বর্তমান প্ল্যান',
    perMonth: '/মাস',
    
    // Plan names
    free: 'ফ্রি',
    foreverFree: 'চিরকাল ফ্রি',
    sorixBasic: 'সোরিক্স বেসিক',
    sorixPro: 'সোরিক্স প্রো',
    sorixUltra: 'সোরিক্স আল্ট্রা',
    
    // Features
    aiModels: 'AI মডেল',
    tokens: 'টোকেন',
    voiceAI: 'ভয়েস AI',
    voiceAIBasic: 'ভয়েস AI বেসিক',
    voiceAIHigh: 'ভয়েস AI হাই',
    voiceAIUnlimited: 'ভয়েস AI আনলিমিটেড',
    memory: 'মেমোরি',
    memoryLong: 'মেমোরি লং',
    memoryUltra: 'মেমোরি আল্ট্রা',
    projects: 'প্রজেক্ট',
    teamAccess: 'টিম অ্যাক্সেস',
    avatars: 'অবতার',
    allAvatars: 'সব অবতার',
    multiWindowChat: 'মাল্টি-উইন্ডো চ্যাট',
    upToMembers: '৩ সদস্য পর্যন্ত',
    
    // FAQs
    faqTitle: 'সাধারণ জিজ্ঞাসা',
    faqDesc: 'AI Sorix সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন।',
    
    // Footer
    footerDesc: 'চূড়ান্ত AI রিসার্চ ইকোসিস্টেম — ১০+ ফ্রন্টিয়ার মডেল একটি বুদ্ধিমান ওয়ার্কস্পেসে বিশ্বব্যাপী পেশাদার ও টিমদের জন্য।',
    product: 'পণ্য',
    legal: 'আইনি',
    privacyPolicy: 'গোপনীয়তা নীতি',
    termsOfService: 'সেবার শর্তাবলী',
    cookiePolicy: 'কুকি নীতি',
    refundPolicy: 'রিফান্ড নীতি',
    changelog: 'পরিবর্তন লগ',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  
  const t = (key) => translations[language][key] || key;
  
  const toggleLanguage = (lang) => {
    setLanguageState(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: toggleLanguage, t }}>
      <LanguageSyncBridge language={language} setLanguage={setLanguageState} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};