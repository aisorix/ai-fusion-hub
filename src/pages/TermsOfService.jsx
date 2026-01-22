import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, MapPin, Calendar, AlertTriangle, Home, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const TermsOfService = () => {
  const { language } = useLanguage();

  const sections = [
    {
      title: language === 'en' ? "1. Introduction" : "১. ভূমিকা",
      content: language === 'en' 
        ? `Welcome to AI Sorix. By accessing or using AI Sorix via aisorix.com, you agree to be bound by these Terms & Conditions, our Privacy Policy, and any additional policies we may introduce.`
        : `AI Sorix-এ স্বাগতম। aisorix.com এর মাধ্যমে AI Sorix অ্যাক্সেস বা ব্যবহার করে, আপনি এই শর্তাবলী, আমাদের গোপনীয়তা নীতি এবং আমরা যে কোনো অতিরিক্ত নীতি প্রবর্তন করতে পারি তাতে বাধ্য থাকতে সম্মত হন।`,
      warning: language === 'en' ? "If you do not agree to these terms, you must discontinue use immediately." : "আপনি এই শর্তাবলীতে সম্মত না হলে, আপনাকে অবিলম্বে ব্যবহার বন্ধ করতে হবে।"
    },
    {
      title: language === 'en' ? "2. Services Provided" : "২. প্রদত্ত সেবা",
      content: language === 'en' ? "AI Sorix provides access to premium AI services including:" : "AI Sorix প্রিমিয়াম AI সেবায় অ্যাক্সেস প্রদান করে যার মধ্যে রয়েছে:",
      list: [
        { text: language === 'en' ? "Multi-Model AI Chat & Reasoning" : "মাল্টি-মডেল AI চ্যাট ও রিজনিং" },
        { text: language === 'en' ? "AI-Powered Code Generation" : "AI-চালিত কোড জেনারেশন" },
        { text: language === 'en' ? "Image Generation (via supported models)" : "ইমেজ জেনারেশন (সমর্থিত মডেলের মাধ্যমে)" },
        { text: language === 'en' ? "Document Analysis (PDF/Docx)" : "ডকুমেন্ট বিশ্লেষণ (PDF/Docx)" }
      ]
    },
    {
      title: language === 'en' ? "3. Subscription Plans & Pricing" : "৩. সাবস্ক্রিপশন প্ল্যান ও মূল্য",
      content: language === 'en' ? "We offer the following subscription tiers (Prices in BDT):" : "আমরা নিম্নলিখিত সাবস্ক্রিপশন স্তর অফার করি (মূল্য BDT-তে):",
      list: [
        { bold: language === 'en' ? "Sorix Basic:" : "সোরিক্স বেসিক:", text: "৳499 / " + (language === 'en' ? "month" : "মাস") },
        { bold: language === 'en' ? "Sorix Pro:" : "সোরিক্স প্রো:", text: "৳999 / " + (language === 'en' ? "month" : "মাস") },
        { bold: language === 'en' ? "Sorix Premium:" : "সোরিক্স প্রিমিয়াম:", text: "৳1,999 / " + (language === 'en' ? "month" : "মাস") }
      ],
      note: language === 'en' ? "Prices are inclusive of applicable taxes. We reserve the right to change prices with prior notice." : "মূল্য প্রযোজ্য কর সহ। আমরা পূর্ব বিজ্ঞপ্তি সহ মূল্য পরিবর্তনের অধিকার সংরক্ষণ করি।"
    },
    {
      title: language === 'en' ? "4. Payment Processing" : "৪. পেমেন্ট প্রক্রিয়াকরণ",
      content: language === 'en' ? "Payment methods available:" : "উপলব্ধ পেমেন্ট পদ্ধতি:",
      list: [
        { bold: language === 'en' ? "Bangladesh:" : "বাংলাদেশ:", text: language === 'en' ? "SSLCommerz and bKash" : "SSLCommerz এবং bKash" },
        { bold: language === 'en' ? "International:" : "আন্তর্জাতিক:", text: language === 'en' ? "Stripe or international cards" : "Stripe বা আন্তর্জাতিক কার্ড" }
      ],
      note: language === 'en' ? "Failed payments may result in account suspension until the balance is cleared." : "ব্যর্থ পেমেন্টে ব্যালেন্স পরিশোধ না হওয়া পর্যন্ত অ্যাকাউন্ট স্থগিত হতে পারে।"
    },
    {
      title: language === 'en' ? "5. Refund & Cancellation" : "৫. রিফান্ড ও বাতিলকরণ",
      list: [
        { bold: language === 'en' ? "No-Refund Policy:" : "নো-রিফান্ড নীতি:", text: language === 'en' ? "All payments are non-refundable, regardless of usage." : "সমস্ত পেমেন্ট অ-ফেরতযোগ্য, ব্যবহার নির্বিশেষে।" },
        { bold: language === 'en' ? "Cancellation:" : "বাতিলকরণ:", text: language === 'en' ? "You may cancel anytime. You retain access until your billing cycle ends." : "আপনি যেকোনো সময় বাতিল করতে পারেন। আপনার বিলিং চক্র শেষ না হওয়া পর্যন্ত অ্যাক্সেস থাকবে।" }
      ]
    },
    {
      title: language === 'en' ? "6. Credit Usage (Fair Use)" : "৬. ক্রেডিট ব্যবহার (ফেয়ার ইউজ)",
      content: language === 'en' ? "AI Sorix uses a Credit System:" : "AI Sorix একটি ক্রেডিট সিস্টেম ব্যবহার করে:",
      list: [
        { bold: language === 'en' ? "Standard Models:" : "স্ট্যান্ডার্ড মডেল:", text: language === 'en' ? "1x Credits per interaction" : "প্রতি ইন্টারঅ্যাকশনে 1x ক্রেডিট" },
        { bold: language === 'en' ? "Premium Models:" : "প্রিমিয়াম মডেল:", text: language === 'en' ? "5x - 20x Credits per interaction" : "প্রতি ইন্টারঅ্যাকশনে 5x - 20x ক্রেডিট" },
        { bold: language === 'en' ? "Reset:" : "রিসেট:", text: language === 'en' ? "Credits reset monthly. Unused credits do not roll over." : "ক্রেডিট মাসিক রিসেট হয়। অব্যবহৃত ক্রেডিট জমা হয় না।" }
      ]
    },
    {
      title: language === 'en' ? "7. Restrictions on Use" : "৭. ব্যবহারের সীমাবদ্ধতা",
      content: language === 'en' ? "You may not:" : "আপনি করতে পারবেন না:",
      list: [
        { text: language === 'en' ? "Use for activities that violate laws." : "আইন লঙ্ঘনকারী কার্যকলাপের জন্য ব্যবহার করা।" },
        { text: language === 'en' ? "Attempt to reverse-engineer or bypass systems." : "সিস্টেম রিভার্স-ইঞ্জিনিয়ার বা বাইপাস করার চেষ্টা করা।" },
        { text: language === 'en' ? "Share account credentials." : "অ্যাকাউন্ট ক্রেডেনশিয়াল শেয়ার করা।" },
        { text: language === 'en' ? "Generate harmful, illegal, or explicit content." : "ক্ষতিকর, অবৈধ বা স্পষ্ট বিষয়বস্তু তৈরি করা।" }
      ],
      warning: language === 'en' ? "Violations will result in immediate account termination without refund." : "লঙ্ঘনের ফলে রিফান্ড ছাড়াই অবিলম্বে অ্যাকাউন্ট বন্ধ হবে।"
    },
    {
      title: language === 'en' ? "8. Disclaimer of Warranties" : "৮. ওয়ারেন্টি অস্বীকৃতি",
      content: language === 'en' 
        ? `AI Sorix provides access to third-party AI models on an "as is" basis. We do not guarantee accuracy or uninterrupted service.`
        : `AI Sorix "যেমন আছে" ভিত্তিতে তৃতীয় পক্ষের AI মডেলগুলিতে অ্যাক্সেস প্রদান করে। আমরা নির্ভুলতা বা নিরবচ্ছিন্ন সেবার গ্যারান্টি দিই না।`,
      note: language === 'en' ? "We are not liable for any losses incurred from using our tool." : "আমাদের টুল ব্যবহার থেকে সৃষ্ট কোনো ক্ষতির জন্য আমরা দায়ী নই।"
    },
    {
      title: language === 'en' ? "9. Governing Law" : "৯. প্রযোজ্য আইন",
      content: language === 'en' 
        ? "These Terms are governed by the laws of Bangladesh. Disputes shall be resolved within the jurisdiction of courts in Dhaka, Bangladesh."
        : "এই শর্তাবলী বাংলাদেশের আইন দ্বারা পরিচালিত। বিরোধ ঢাকা, বাংলাদেশের আদালতের এখতিয়ারে সমাধান করা হবে।"
    }
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:opacity-80">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <img src={logo} alt="AI Sorix" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              <span className="text-base sm:text-lg font-bold text-foreground">AI Sorix</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Updated: Jan 6, 2026' : 'আপডেট: ৬ জানুয়ারি, ২০২৬'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Home' : 'হোম'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{language === 'en' ? 'Terms of Service' : 'সেবার শর্তাবলী'}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary mb-5 shadow-glow">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {language === 'en' ? 'Terms of Service' : 'সেবার শর্তাবলী'}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Please read these terms carefully before using AI Sorix. By using our services, you agree to be bound by these terms.'
                : 'AI Sorix ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী সাবধানে পড়ুন। আমাদের সেবা ব্যবহার করে, আপনি এই শর্তাবলী মেনে চলতে সম্মত হন।'}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 sm:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 sm:space-y-6">
            {sections.map((section, index) => (
              <article 
                key={index} 
                className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-border transition-all duration-300"
              >
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-3">
                    {section.content}
                  </p>
                )}
                {section.list && (
                  <ul className="space-y-2.5 mb-3">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          {item.bold && <strong className="text-foreground">{item.bold} </strong>}
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <p className="text-sm text-primary bg-primary/10 rounded-lg p-3 sm:p-4 border border-primary/20">
                    {section.note}
                  </p>
                )}
                {section.warning && (
                  <div className="flex items-start gap-3 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg p-3 sm:p-4 border border-amber-500/20 mt-3">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>{section.warning}</span>
                  </div>
                )}
              </article>
            ))}

            {/* Contact Section */}
            <article className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background border border-primary/20 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === 'en' ? '10. Contact Us' : '১০. যোগাযোগ করুন'}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-5">
                {language === 'en' ? 'For questions, support, or legal notices, contact:' : 'প্রশ্ন, সহায়তা বা আইনি নোটিশের জন্য যোগাযোগ করুন:'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:support@aisorix.com" 
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base">support@aisorix.com</span>
                </a>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base">Ashulia, Savar, Dhaka, Bangladesh</span>
                </div>
              </div>
            </article>
          </div>

          {/* Footer */}
          <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © 2025 AI Sorix. {language === 'en' ? 'All rights reserved.' : 'সর্বস্বত্ব সংরক্ষিত।'}
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
              </Link>
              <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'en' ? 'Cookie Policy' : 'কুকি নীতি'}
              </Link>
              <Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'en' ? 'Refund Policy' : 'রিফান্ড নীতি'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;