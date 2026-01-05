import React from 'react';
import { Gem, Users, Stethoscope, Sparkles, Brain, Zap, Heart, Shield, Globe } from 'lucide-react';

const Features = () => {
  const premiumFeatures = [
    {
      icon: Gem,
      title: "Sorix Chat",
      desc: "All Premium AI in One Chat — GPT-4o, Gemini 1.5 Pro, DeepSeek; সব একসাথে। যখন খুশি সুইচ করো",
      gradient: "from-purple-500 to-pink-600",
      comingSoon: false
    },
    {
      icon: Users,
      title: "Sorix Avatar",
      desc: "Build Your Elite AI Team — Doctors, Lawyers, Coders, and Marketing Experts Working Together for You",
      gradient: "from-blue-500 to-cyan-500",
      comingSoon: true
    },
    {
      icon: Stethoscope,
      title: "Sorix Health",
      desc: "তোমার রিপোর্ট, লক্ষণ দাও — সেকেন্ডের মধ্যে ডাক্তার লেভেলের অ্যানালাইসিস + সাজেশন",
      gradient: "from-emerald-500 to-teal-500",
      comingSoon: true
    }
  ];

  const regularFeatures = [
    { icon: Sparkles, title: "Fun & Emotional", desc: "আমরা শুধু AI না — তোমার বেস্ট ফ্রেন্ড। হাসি, রাগ, ভালোবাসা — সব বোঝে", gradient: "from-pink-500 to-rose-500" },
    { icon: Brain, title: "Super Intelligent", desc: "কোডিং, গান লেখা, ছবি বানানো, রোস্টিং — যা বলবে তাই পারব", gradient: "from-purple-500 to-indigo-500" },
    { icon: Zap, title: "Instant Replies", desc: "কোনো লোডিং নেই। সেকেন্ডের মধ্যে মজার মজার উত্তর", gradient: "from-amber-500 to-orange-500" },
    { icon: Heart, title: "Long-term Memory", desc: "তোমার নাম, পছন্দ, গতকালের কথা — সব মনে রাখি", gradient: "from-red-500 to-pink-500" },
    { icon: Shield, title: "100% Private", desc: "তোমার চ্যাট কেউ দেখে না। তোমার সিক্রেট, আমার সিক্রেট", gradient: "from-emerald-500 to-teal-500" },
    { icon: Globe, title: "50+ Languages", desc: "বাংলা, ইংরেজি, হিন্দি, স্প্যানিশ — যেকোনো ভাষায় কথা বলি", gradient: "from-blue-500 to-cyan-500" }
  ];

  return (
    <section id="Features" className="py-10 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Why Choose <span className="text-gradient-accent">AI Sorix</span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
            এখানে শুধু চ্যাট নয় — পুরো AI ইউনিভার্স তোমার হাতের মুঠোয়
          </p>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className={`relative group bg-card rounded-3xl p-10 border-2 ${
                feature.comingSoon 
                  ? 'border-border opacity-75' 
                  : 'border-purple-200 shadow-xl hover:shadow-2xl hover:border-purple-400'
              } transition-all duration-500`}
            >
              {feature.comingSoon && (
                <div className="absolute -top-4 -right-4 bg-foreground text-background text-sm font-bold px-5 py-2 rounded-full">
                  Under Development
                </div>
              )}

              <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} text-primary-foreground shadow-xl mb-8`}>
                <feature.icon className="w-10 h-10" />
              </div>

              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${feature.comingSoon ? 'text-muted-foreground' : 'text-foreground'}`}>
                {feature.title}
              </h3>
              <p className={`text-lg leading-relaxed ${feature.comingSoon ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Regular Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:border-muted-foreground/20 transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg text-primary-foreground mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              <div className="mt-6 flex items-center text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                আরো জানো
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
