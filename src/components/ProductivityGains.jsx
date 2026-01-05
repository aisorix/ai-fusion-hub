import React from 'react';
import { Clock, Wallet, Rocket, Target, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProductivityGains = () => {
  const { language } = useLanguage();

  const productivityFeatures = [
    {
      icon: Clock,
      title: language === 'en' ? 'Save Hours Every Day' : 'প্রতিদিন ঘণ্টার পর ঘণ্টা বাঁচান',
      desc: language === 'en' 
        ? 'Stop wasting 2+ hours on repetitive tasks. From summarizing reports to drafting updates, AI Sorix handles in minutes what normally takes you all morning.'
        : 'পুনরাবৃত্তিমূলক কাজে ২+ ঘণ্টা নষ্ট করা বন্ধ করুন। রিপোর্ট সংক্ষেপ থেকে আপডেট লেখা পর্যন্ত — AI Sorix মিনিটেই সেরে ফেলে যা আপনার সারা সকাল লাগত।',
      size: 'large'
    },
    {
      icon: Wallet,
      title: language === 'en' ? 'Cut Software Costs' : 'সফটওয়্যার খরচ কমান',
      desc: language === 'en'
        ? 'Why pay for 10+ subscriptions? AI Sorix replaces writing tools, research apps, translation software, image generators, and more — all in one plan starting at just ৳499/month.'
        : '১০+ সাবস্ক্রিপশনে কেন টাকা খরচ করবেন? AI Sorix একাই লেখার টুল, রিসার্চ অ্যাপ, অনুবাদ সফটওয়্যার, ইমেজ জেনারেটর — সব কিছু দেয় মাত্র ৳৪৯৯/মাস থেকে।',
      size: 'large'
    },
    {
      icon: Rocket,
      title: language === 'en' ? 'Boost Work Efficiency' : 'কাজের দক্ষতা বাড়ান',
      desc: language === 'en'
        ? 'No more switching tabs or juggling multiple platforms. With AI Sorix, you keep everything in one seamless workspace — perfect for busy professionals in Bangladesh.'
        : 'আর ট্যাব সুইচ বা একাধিক প্ল্যাটফর্মে ঝামেলা নয়। AI Sorix-এ সব কিছু একটি সিমলেস ওয়ার্কস্পেসে — বাংলাদেশের ব্যস্ত প্রফেশনালদের জন্য পারফেক্ট।',
      size: 'small'
    },
    {
      icon: Target,
      title: language === 'en' ? 'Stay Focused, Stay Productive' : 'ফোকাস থাকুন, উৎপাদনশীল থাকুন',
      desc: language === 'en'
        ? 'Workflows flow without interruptions. Move from chat to research to creation without losing momentum — designed for the way Bangladeshi professionals work.'
        : 'ওয়ার্কফ্লো কোনো বাধা ছাড়াই চলে। চ্যাট থেকে রিসার্চ থেকে তৈরি — কোনো গতি না হারিয়ে — বাংলাদেশি প্রফেশনালদের কাজের ধরনে ডিজাইন করা।',
      size: 'small'
    },
    {
      icon: ShieldCheck,
      title: language === 'en' ? 'Plagiarism-Free & Reliable' : 'প্লেজিয়ারিজম-মুক্ত ও নির্ভরযোগ্য',
      desc: language === 'en'
        ? 'Every output is 100% original, so you can publish, present, and ship with confidence. Perfect for students, researchers, and content creators across Bangladesh.'
        : 'প্রতিটি আউটপুট ১০০% অরিজিনাল, তাই আত্মবিশ্বাসের সাথে পাবলিশ, প্রেজেন্ট এবং শেয়ার করুন। বাংলাদেশের শিক্ষার্থী, গবেষক এবং কন্টেন্ট ক্রিয়েটরদের জন্য পারফেক্ট।',
      size: 'small'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {language === 'en' ? 'Productivity Gains with' : 'উৎপাদনশীলতা বাড়ান'} <span className="text-gradient-accent">AI Sorix</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Do more, spend less, and stay focused with your all-in-one AI workspace built for Bangladesh.'
              : 'বেশি করুন, কম খরচ করুন, এবং বাংলাদেশের জন্য তৈরি আপনার অল-ইন-ওয়ান AI ওয়ার্কস্পেসে ফোকাস থাকুন।'}
          </p>
        </div>

        {/* Productivity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* First row - 2 large cards */}
          {productivityFeatures.slice(0, 2).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 lg:p-10 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-muted text-primary">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground pt-1">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg pl-[52px]">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Second row - 3 smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
          {productivityFeatures.slice(2).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="inline-flex p-2.5 rounded-xl bg-muted text-primary">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-foreground pt-0.5">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-[46px]">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductivityGains;
