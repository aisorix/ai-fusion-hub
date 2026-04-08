import React from 'react';
import { Gem, Crown, Stethoscope, Leaf, Search, Sparkles, Brain, Zap, Heart, Shield, Globe, ArrowRight, Plus, Palette, Presentation, Workflow, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { language, t } = useLanguage();

  const premiumFeatures = [
    {
      icon: Bot,
      title: language === 'en' ? 'Sorix Agent' : 'সোরিক্স এজেন্ট',
      desc: language === 'en'
        ? 'Your virtual AI OS — delegate complex multi-step tasks to an intelligent agent that plans, executes, and delivers results autonomously.'
        : 'আপনার ভার্চুয়াল AI OS — জটিল মাল্টি-স্টেপ কাজ একটি বুদ্ধিমান এজেন্টকে দিন যে পরিকল্পনা করে, সম্পাদন করে এবং স্বয়ংক্রিয়ভাবে ফলাফল দেয়।',
      gradient: "from-cyan-500 to-teal-500",
      bgGradient: "from-cyan-500/10 to-teal-500/10",
      comingSoon: false
    },
    {
      icon: Leaf,
      title: language === 'en' ? 'Sorix Agro' : 'সোরিক্স অ্যাগ্রো',
      desc: language === 'en'
        ? 'Smart agricultural AI — crop planning, climate analytics, pest detection, and yield optimization for modern farming.'
        : 'স্মার্ট কৃষি AI — ফসল পরিকল্পনা, জলবায়ু বিশ্লেষণ, পোকা সনাক্তকরণ এবং আধুনিক কৃষির জন্য ফলন অপ্টিমাইজেশন।',
      gradient: "from-green-500 to-lime-500",
      bgGradient: "from-green-500/10 to-lime-500/10",
      comingSoon: false
    },
    {
      icon: Stethoscope,
      title: t('Sorix Health'),
      desc: language === 'en'
        ? 'Upload reports and symptoms — receive clinical-grade analysis and actionable health insights within seconds.'
        : 'রিপোর্ট ও লক্ষণ আপলোড করুন — সেকেন্ডের মধ্যে ক্লিনিক্যাল-গ্রেড বিশ্লেষণ ও কার্যকর স্বাস্থ্য ইনসাইট পান।',
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      comingSoon: false
    },
    {
      icon: Presentation,
      title: language === 'en' ? 'Sorix Deck' : 'সোরিক্স ডেক',
      desc: language === 'en'
        ? 'AI-powered presentation builder — generate stunning slide decks from a single prompt with auto-generated visuals.'
        : 'AI চালিত প্রেজেন্টেশন বিল্ডার — একটি প্রম্পট থেকে অটো-জেনারেটেড ভিজ্যুয়াল সহ চমৎকার স্লাইড ডেক তৈরি করুন।',
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/10 to-blue-600/10",
      comingSoon: false
    },
    {
      icon: Palette,
      title: t('Sorix Imagine'),
      desc: language === 'en'
        ? 'Transform your ideas into stunning visuals. Generate high-quality images from text using advanced AI models like Flux.2.'
        : 'আপনার ভাবনাকে বাস্তবে রূপ দিন। উন্নত AI মডেল (যেমন Flux.2) ব্যবহার করে টেক্সট থেকে তৈরি করুন অত্যাশ্চর্য সব ছবি।',
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      comingSoon: false
    },
    {
      icon: Crown,
      title: language === 'en' ? 'Sorix Legends' : 'সোরিক্স লিজেন্ডস',
      desc: language === 'en'
        ? 'Assemble your elite AI team — domain-specific experts in medicine, law, engineering, and strategy working in concert.'
        : 'আপনার এলিট AI টিম তৈরি করুন — চিকিৎসা, আইন, প্রকৌশল ও কৌশলে ডোমেইন-নির্দিষ্ট বিশেষজ্ঞরা একসাথে কাজ করছে।',
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      comingSoon: false
    },
    {
      icon: Workflow,
      title: language === 'en' ? 'Sorix FlowBuilder' : 'সোরিক্স ফ্লোবিল্ডার',
      desc: language === 'en'
        ? 'AI-powered diagram and flowchart generator — create professional diagrams from text prompts with export to PNG, SVG, PDF.'
        : 'AI চালিত ডায়াগ্রাম ও ফ্লোচার্ট জেনারেটর — টেক্সট প্রম্পট থেকে পেশাদার ডায়াগ্রাম তৈরি করুন, PNG, SVG, PDF এ এক্সপোর্ট করুন।',
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10",
      comingSoon: false
    },
    {
      icon: Search,
      title: language === 'en' ? 'Sorix Search' : 'সোরিক্স সার্চ',
      desc: language === 'en'
        ? 'Next-generation AI search — instant answers with verified citations, source attribution, and real-time web intelligence.'
        : 'পরবর্তী প্রজন্মের AI সার্চ — যাচাইকৃত সাইটেশন, সোর্স অ্যাট্রিবিউশন এবং রিয়েল-টাইম ওয়েব ইন্টেলিজেন্স সহ তাৎক্ষণিক উত্তর।',
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
      comingSoon: false
    },
    {
      icon: Gem,
      title: t('Sorix Chat'),
      desc: language === 'en' 
        ? 'Unified AI interface — access ChatGPT, Gemini, DeepSeek, and 10+ models seamlessly. Switch models mid-conversation.'
        : 'ইউনিফাইড AI ইন্টারফেস — ChatGPT, Gemini, DeepSeek এবং ১০+ মডেল নির্বিঘ্নে অ্যাক্সেস করুন। কথোপকথনের মাঝে মডেল সুইচ করুন।',
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      comingSoon: false
    }
  ];

  const regularFeatures = [
    { 
      icon: Sparkles, 
      title: t('funEmotional'), 
      desc: language === 'en' 
        ? "AI that understands nuance, tone, and context — delivering responses that feel natural and intuitive."
        : 'AI যা সূক্ষ্মতা, টোন এবং প্রসঙ্গ বোঝে — স্বাভাবিক ও স্বজ্ঞাত রেসপন্স দেয়।', 
      gradient: "from-pink-500 to-rose-500" 
    },
    { 
      icon: Brain, 
      title: t('superIntelligent'), 
      desc: language === 'en'
        ? 'From code generation to creative writing, image analysis to deep research — one platform, limitless capability.'
        : 'কোড জেনারেশন থেকে সৃজনশীল লেখা, ইমেজ বিশ্লেষণ থেকে গভীর গবেষণা — এক প্ল্যাটফর্ম, সীমাহীন সক্ষমতা।', 
      gradient: "from-purple-500 to-indigo-500" 
    },
    { 
      icon: Zap, 
      title: t('instantReplies'), 
      desc: language === 'en'
        ? 'Sub-second latency with optimized inference. No waiting, no buffering — just instant results.'
        : 'অপটিমাইজড ইনফারেন্স সহ সাব-সেকেন্ড লেটেন্সি। কোনো অপেক্ষা নেই — শুধু তাৎক্ষণিক ফলাফল।', 
      gradient: "from-amber-500 to-orange-500" 
    },
    { 
      icon: Heart, 
      title: language === 'en' ? 'Persistent Memory' : 'স্থায়ী মেমোরি', 
      desc: language === 'en'
        ? "Context-aware conversations that remember your preferences, past interactions, and project details across sessions."
        : 'প্রসঙ্গ-সচেতন কথোপকথন যা সেশন জুড়ে আপনার পছন্দ, পূর্ববর্তী ইন্টারঅ্যাকশন এবং প্রজেক্টের বিবরণ মনে রাখে।', 
      gradient: "from-red-500 to-pink-500" 
    },
    { 
      icon: Shield, 
      title: language === 'en' ? 'Zero-Trust Security' : 'জিরো-ট্রাস্ট সিকিউরিটি', 
      desc: language === 'en'
        ? "End-to-end encrypted conversations. Your data is never stored, shared, or used for training."
        : 'এন্ড-টু-এন্ড এনক্রিপ্টেড কথোপকথন। আপনার ডেটা কখনো সংরক্ষণ, শেয়ার বা ট্রেনিংয়ে ব্যবহার হয় না।', 
      gradient: "from-emerald-500 to-teal-500" 
    },
    { 
      icon: Globe, 
      title: language === 'en' ? '50+ Languages' : '৫০+ ভাষা', 
      desc: language === 'en'
        ? 'Native-quality output in 50+ languages — seamless multilingual support for global teams and research.'
        : '৫০+ ভাষায় নেটিভ-কোয়ালিটি আউটপুট — গ্লোবাল টিম ও গবেষণার জন্য নির্বিঘ্ন বহুভাষিক সাপোর্ট।', 
      gradient: "from-blue-500 to-cyan-500" 
    }
  ];

  return (
    <section id="features" className="py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            {language === 'en' ? 'The AI Research Ecosystem' : 'AI রিসার্চ ইকোসিস্টেম'}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 px-2 font-display">
            {language === 'en' ? 'Why Choose' : 'কেন বেছে নেবেন'} <span className="animated-gradient-text">AI Sorix</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {language === 'en' 
              ? "Not just a chatbot — a complete AI-powered research and productivity ecosystem."
              : 'শুধু চ্যাটবট নয় — একটি সম্পূর্ণ AI-চালিত গবেষণা ও উৎপাদনশীলতা ইকোসিস্টেম।'}
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
                className="group p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4 sm:mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
