import React from 'react';
import { Gem, Crown, Stethoscope, Leaf, Search, Sparkles, Brain, Zap, Heart, Shield, Globe, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { language, t } = useLanguage();

  const premiumFeatures = [
    {
      icon: Gem,
      title: t('sorixChat'),
      desc: language === 'en' 
        ? 'All Premium AI in One Chat — GPT-4o, Gemini 1.5 Pro, DeepSeek; all together. Switch whenever you want.'
        : 'সব প্রিমিয়াম AI একটি চ্যাটে — GPT-4o, Gemini 1.5 Pro, DeepSeek; সব একসাথে। যখন খুশি সুইচ করো।',
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      comingSoon: false
    },
    {
      icon: Crown,
      title: language === 'en' ? 'Sorix Legends' : 'সোরিক্স লিজেন্ডস',
      desc: language === 'en'
        ? 'Build Your Elite AI Team — Doctors, Lawyers, Coders, and Marketing Experts Working Together for You.'
        : 'তোমার এলিট AI টিম তৈরি করো — ডাক্তার, উকিল, কোডার এবং মার্কেটিং বিশেষজ্ঞ তোমার জন্য একসাথে কাজ করছে।',
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      comingSoon: true
    },
    {
      icon: Stethoscope,
      title: t('sorixHealth'),
      desc: language === 'en'
        ? 'Share your reports, symptoms — get doctor-level analysis and suggestions within seconds.'
        : 'তোমার রিপোর্ট, লক্ষণ দাও — সেকেন্ডের মধ্যে ডাক্তার লেভেলের অ্যানালাইসিস + সাজেশন।',
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      comingSoon: true
    },
    {
      icon: Leaf,
      title: language === 'en' ? 'Sorix Agro' : 'সোরিক্স অ্যাগ্রো',
      desc: language === 'en'
        ? 'Smart farming assistant — crop planning, weather insights, pest detection, and yield optimization for Bangladesh farmers.'
        : 'স্মার্ট কৃষি সহায়ক — ফসল পরিকল্পনা, আবহাওয়া তথ্য, পোকা সনাক্তকরণ এবং বাংলাদেশি কৃষকদের জন্য ফলন অপ্টিমাইজেশন।',
      gradient: "from-green-500 to-lime-500",
      bgGradient: "from-green-500/10 to-lime-500/10",
      comingSoon: true
    },
    {
      icon: Search,
      title: language === 'en' ? 'Sorix Search' : 'সোরিক্স সার্চ',
      desc: language === 'en'
        ? 'Best Google alternative — AI-powered search with instant answers, citations, and real-time web results.'
        : 'গুগলের সেরা বিকল্প — AI চালিত সার্চ, তাৎক্ষণিক উত্তর, সাইটেশন এবং রিয়েল-টাইম ওয়েব রেজাল্ট।',
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
      comingSoon: false
    }
  ];

  const regularFeatures = [
    { 
      icon: Sparkles, 
      title: t('funEmotional'), 
      desc: language === 'en' 
        ? "We're not just AI — we're your best friend. Laughter, anger, love — we understand it all."
        : 'আমরা শুধু AI না — তোমার বেস্ট ফ্রেন্ড। হাসি, রাগ, ভালোবাসা — সব বোঝি।', 
      gradient: "from-pink-500 to-rose-500" 
    },
    { 
      icon: Brain, 
      title: t('superIntelligent'), 
      desc: language === 'en'
        ? 'Coding, songwriting, image creation, roasting — whatever you ask, we can do it.'
        : 'কোডিং, গান লেখা, ছবি বানানো, রোস্টিং — যা বলবে তাই পারব।', 
      gradient: "from-purple-500 to-indigo-500" 
    },
    { 
      icon: Zap, 
      title: t('instantReplies'), 
      desc: language === 'en'
        ? 'No loading. Fun answers within seconds.'
        : 'কোনো লোডিং নেই। সেকেন্ডের মধ্যে মজার মজার উত্তর।', 
      gradient: "from-amber-500 to-orange-500" 
    },
    { 
      icon: Heart, 
      title: language === 'en' ? 'Long-term Memory' : 'দীর্ঘমেয়াদী স্মৃতি', 
      desc: language === 'en'
        ? "Your name, preferences, yesterday's conversation — we remember everything."
        : 'তোমার নাম, পছন্দ, গতকালের কথা — সব মনে রাখি।', 
      gradient: "from-red-500 to-pink-500" 
    },
    { 
      icon: Shield, 
      title: language === 'en' ? '100% Private' : '১০০% প্রাইভেট', 
      desc: language === 'en'
        ? "No one sees your chat. Your secret, our secret."
        : 'তোমার চ্যাট কেউ দেখে না। তোমার সিক্রেট, আমার সিক্রেট।', 
      gradient: "from-emerald-500 to-teal-500" 
    },
    { 
      icon: Globe, 
      title: language === 'en' ? '50+ Languages' : '৫০+ ভাষা', 
      desc: language === 'en'
        ? 'Bengali, English, Hindi, Spanish — we speak any language.'
        : 'বাংলা, ইংরেজি, হিন্দি, স্প্যানিশ — যেকোনো ভাষায় কথা বলি।', 
      gradient: "from-blue-500 to-cyan-500" 
    }
  ];

  return (
    <section id="Features" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            {language === 'en' ? 'Why Choose Us' : 'আমাদের কেন বেছে নেবেন'}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 px-2 font-display">
            {language === 'en' ? 'Why Choose' : 'কেন বেছে নেবেন'} <span className="animated-gradient-text">AI Sorix</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {language === 'en' 
              ? "Not just chat — the entire AI universe in the palm of your hand."
              : 'এখানে শুধু চ্যাট নয় — পুরো AI ইউনিভার্স তোমার হাতের মুঠোয়।'}
          </p>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`relative group futuristic-card p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 ${
                  feature.comingSoon ? 'opacity-80' : ''
                }`}
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                {feature.comingSoon && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 bg-foreground/90 text-background text-[10px] sm:text-xs font-bold rounded-full">
                      {t('comingSoon')}
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4 sm:mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.desc}
                  </p>

                  {!feature.comingSoon && (
                    <div className="mt-4 sm:mt-6 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm">
                      {language === 'en' ? 'Learn more' : 'আরও জানুন'} 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* More Coming Card */}
          <div className="relative group futuristic-card p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/30">
            <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-500">
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
              {language === 'en' ? 'More Coming' : 'আরও আসছে'}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {language === 'en' 
                ? 'Stay tuned for exciting new features and AI-powered tools.'
                : 'নতুন উত্তেজনাপূর্ণ ফিচার এবং AI টুলসের জন্য অপেক্ষা করুন।'}
            </p>
          </div>
        </div>

        {/* Regular Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {regularFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group futuristic-card p-5 sm:p-6 lg:p-8 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md mb-4 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;