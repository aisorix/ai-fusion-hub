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
        ? 'No more switching tabs or juggling multiple platforms. With AI Sorix, you keep everything in one seamless workspace — designed for maximum productivity.'
        : 'আর ট্যাব সুইচ বা একাধিক প্ল্যাটফর্মে ঝামেলা নয়। AI Sorix-এ সব কিছু একটি সিমলেস ওয়ার্কস্পেসে — সর্বোচ্চ উৎপাদনশীলতার জন্য ডিজাইন করা।',
      size: 'small'
    },
    {
      icon: Target,
      title: language === 'en' ? 'Stay Focused, Stay Productive' : 'ফোকাস থাকুন, উৎপাদনশীল থাকুন',
      desc: language === 'en'
        ? 'Workflows flow without interruptions. Move from chat to research to creation without losing momentum — engineered for modern professionals.'
        : 'ওয়ার্কফ্লো কোনো বাধা ছাড়াই চলে। চ্যাট থেকে রিসার্চ থেকে তৈরি — কোনো গতি না হারিয়ে — আধুনিক পেশাদারদের জন্য ইঞ্জিনিয়ার করা।',
      size: 'small'
    },
    {
      icon: ShieldCheck,
      title: language === 'en' ? 'Plagiarism-Free & Reliable' : 'প্লেজিয়ারিজম-মুক্ত ও নির্ভরযোগ্য',
      desc: language === 'en'
        ? 'Every output is 100% original, so you can publish, present, and ship with confidence. Trusted by researchers, students, and content creators worldwide.'
        : 'প্রতিটি আউটপুট ১০০% অরিজিনাল, তাই আত্মবিশ্বাসের সাথে পাবলিশ, প্রেজেন্ট এবং শেয়ার করুন। বিশ্বব্যাপী গবেষক, শিক্ষার্থী এবং কন্টেন্ট ক্রিয়েটরদের বিশ্বস্ত।',
      size: 'small'
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            {language === 'en' ? 'Productivity Gains with' : 'উৎপাদনশীলতা বাড়ান'} <span className="text-gradient-accent">AI Sorix</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {language === 'en' 
              ? 'Do more, spend less, and stay focused with your all-in-one AI research workspace.'
              : 'বেশি করুন, কম খরচ করুন, এবং আপনার অল-ইন-ওয়ান AI রিসার্চ ওয়ার্কস্পেসে ফোকাস থাকুন।'}
          </p>
        </div>

        {/* Productivity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* First row - 2 large cards */}
          {productivityFeatures.slice(0, 2).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-10 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="inline-flex p-2.5 sm:p-3 rounded-xl bg-muted text-primary flex-shrink-0">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground pt-0.5 sm:pt-1">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed pl-0 sm:pl-[52px]">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Second row - 3 smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 lg:mt-8">
          {productivityFeatures.slice(2).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                  <div className="inline-flex p-2 sm:p-2.5 rounded-xl bg-muted text-primary flex-shrink-0">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground pt-0.5">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed pl-0 sm:pl-[46px]">
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
