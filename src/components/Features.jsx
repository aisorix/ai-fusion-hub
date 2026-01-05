import React from 'react';
import { Gem, Users, Stethoscope, Sparkles, Brain, Zap, Heart, Shield, Globe, ArrowRight } from 'lucide-react';

const Features = () => {
  const premiumFeatures = [
    {
      icon: Gem,
      title: "Sorix Chat",
      desc: "All Premium AI in One Chat — GPT-4o, Gemini 1.5 Pro, DeepSeek; সব একসাথে। যখন খুশি সুইচ করো",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      comingSoon: false
    },
    {
      icon: Users,
      title: "Sorix Avatar",
      desc: "Build Your Elite AI Team — Doctors, Lawyers, Coders, and Marketing Experts Working Together for You",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      comingSoon: true
    },
    {
      icon: Stethoscope,
      title: "Sorix Health",
      desc: "তোমার রিপোর্ট, লক্ষণ দাও — সেকেন্ডের মধ্যে ডাক্তার লেভেলের অ্যানালাইসিস + সাজেশন",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
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
    <section id="Features" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Why Choose <span className="text-gradient-accent">AI Sorix</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            এখানে শুধু চ্যাট নয় — পুরো AI ইউনিভার্স তোমার হাতের মুঠোয়
          </p>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`relative group bg-card rounded-3xl p-8 lg:p-10 border border-border overflow-hidden transition-all duration-500 ${
                  feature.comingSoon 
                    ? 'opacity-70' 
                    : 'hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2'
                }`}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-primary-foreground shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.desc}
                  </p>

                  {!feature.comingSoon && (
                    <div className="mt-6 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Regular Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-primary-foreground shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
