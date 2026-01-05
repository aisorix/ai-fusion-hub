import React from 'react';
import { Gem, Crown, Stethoscope, Leaf, Sparkles, Brain, Zap, Heart, Shield, Globe, ArrowRight } from 'lucide-react';
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
    <section id="Features" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {language === 'en' ? 'Why Choose Us' : 'আমাদের কেন বেছে নেবেন'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Why Choose' : 'কেন বেছে নেবেন'} <span className="text-gradient-accent">AI Sorix</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? "Not just chat — the entire AI universe in the palm of your hand."
              : 'এখানে শুধু চ্যাট নয় — পুরো AI ইউনিভার্স তোমার হাতের মুঠোয়।'}
          </p>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-14">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`relative group bg-card rounded-2xl p-6 lg:p-8 border border-border overflow-hidden transition-all duration-500 ${
                  feature.comingSoon 
                    ? 'opacity-70' 
                    : 'hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2'
                }`}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {feature.comingSoon && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full">
                      {t('comingSoon')}
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-primary-foreground shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.desc}
                  </p>

                  {!feature.comingSoon && (
                    <div className="mt-4 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      {language === 'en' ? 'Learn more' : 'আরও জানুন'} <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Regular Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regularFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-5 lg:p-6 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-primary-foreground shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
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