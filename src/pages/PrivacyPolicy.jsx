import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, MapPin, Calendar, Home, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  const sections = [
    {
      title: language === 'en' ? "1. Introduction" : "১. ভূমিকা",
      content: language === 'en' 
        ? `This Privacy Policy describes how AI Sorix ("we," "our," or "us") collects, uses, and protects the personal information of users of our platform. By accessing or using https://aisorix.com, you consent to the collection and use of your data as outlined in this policy.`
        : `এই গোপনীয়তা নীতি বর্ণনা করে কিভাবে AI Sorix ("আমরা," "আমাদের," বা "আমাদের") আমাদের প্ল্যাটফর্মের ব্যবহারকারীদের ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করে।`
    },
    {
      title: language === 'en' ? "2. Information We Collect" : "২. আমরা যে তথ্য সংগ্রহ করি",
      content: language === 'en' ? "We may collect the following types of information:" : "আমরা নিম্নলিখিত ধরনের তথ্য সংগ্রহ করতে পারি:",
      list: [
        { bold: language === 'en' ? "Account Information:" : "অ্যাকাউন্ট তথ্য:", text: language === 'en' ? "Name, email address, phone number, and billing information." : "নাম, ইমেইল, ফোন নম্বর এবং বিলিং তথ্য।" },
        { bold: language === 'en' ? "Payment Details:" : "পেমেন্ট বিবরণ:", text: language === 'en' ? "Processed securely through SSLCommerz and bKash. We do not store your full card or PIN." : "SSLCommerz এবং bKash এর মাধ্যমে নিরাপদে প্রক্রিয়া করা হয়।" },
        { bold: language === 'en' ? "Usage Data:" : "ব্যবহারের ডেটা:", text: language === 'en' ? "Tokens used, prompts submitted, AI models selected, and responses." : "ব্যবহৃত টোকেন, জমা দেওয়া প্রম্পট, নির্বাচিত AI মডেল।" },
        { bold: language === 'en' ? "Technical Data:" : "প্রযুক্তিগত ডেটা:", text: language === 'en' ? "IP address, browser type, device information, and cookies." : "IP ঠিকানা, ব্রাউজারের ধরন, ডিভাইসের তথ্য।" }
      ]
    },
    {
      title: language === 'en' ? "3. How We Use Your Information" : "৩. আমরা কিভাবে আপনার তথ্য ব্যবহার করি",
      content: language === 'en' ? "We use your information to:" : "আমরা আপনার তথ্য ব্যবহার করি:",
      list: [
        { text: language === 'en' ? "Provide, personalize, and maintain the AI Sorix platform." : "AI Sorix প্ল্যাটফর্ম প্রদান, ব্যক্তিগতকৃত এবং রক্ষণাবেক্ষণ করতে।" },
        { text: language === 'en' ? "Process subscription payments and credit top-ups." : "সাবস্ক্রিপশন পেমেন্ট এবং ক্রেডিট টপ-আপ প্রক্রিয়া করতে।" },
        { text: language === 'en' ? "Improve our AI models, features, and service quality." : "আমাদের AI মডেল, বৈশিষ্ট্য এবং সেবার মান উন্নত করতে।" },
        { text: language === 'en' ? "Communicate updates, security alerts, and promotional offers." : "আপডেট, নিরাপত্তা সতর্কতা এবং প্রচারমূলক অফার জানাতে।" },
        { text: language === 'en' ? "Ensure platform safety and comply with legal obligations." : "প্ল্যাটফর্ম নিরাপত্তা নিশ্চিত করতে এবং আইনি বাধ্যবাধকতা মেনে চলতে।" }
      ]
    },
    {
      title: language === 'en' ? "4. Data Sharing" : "৪. ডেটা শেয়ারিং",
      content: language === 'en' ? "We value your privacy. We may share limited data only with:" : "আমরা আপনার গোপনীয়তাকে মূল্য দিই। আমরা শুধুমাত্র সীমিত ডেটা শেয়ার করতে পারি:",
      list: [
        { bold: language === 'en' ? "Payment Processors:" : "পেমেন্ট প্রসেসর:", text: language === 'en' ? "SSLCommerz, bKash for local payments, and Stripe for international card transactions (Visa, Mastercard, AMEX)." : "স্থানীয় পেমেন্টের জন্য SSLCommerz, bKash এবং আন্তর্জাতিক কার্ড লেনদেনের জন্য Stripe (Visa, Mastercard, AMEX)।" },
        { bold: language === 'en' ? "AI Model Providers:" : "AI মডেল প্রদানকারী:", text: language === 'en' ? "OpenRouter, OpenAI, Anthropic, Google for responses." : "প্রতিক্রিয়ার জন্য OpenRouter, OpenAI, Anthropic, Google।" },
        { bold: language === 'en' ? "Service Providers:" : "সেবা প্রদানকারী:", text: language === 'en' ? "Cloud hosting and analytics partners." : "ক্লাউড হোস্টিং এবং অ্যানালিটিক্স পার্টনার।" }
      ],
      note: language === 'en' ? "Note: We accept Stripe for secure international payments. We do not sell your personal data to advertisers or third parties." : "দ্রষ্টব্য: আমরা নিরাপদ আন্তর্জাতিক পেমেন্টের জন্য Stripe গ্রহণ করি। আমরা বিজ্ঞাপনদাতা বা তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত ডেটা বিক্রি করি না।"
    },
    {
      title: language === 'en' ? "5. Data Security" : "৫. ডেটা নিরাপত্তা",
      content: language === 'en' 
        ? "We implement industry-standard encryption (SSL/TLS), strict access controls, and secure data storage to protect your information."
        : "আমরা আপনার তথ্য সুরক্ষিত রাখতে শিল্প-মানের এনক্রিপশন (SSL/TLS), কঠোর অ্যাক্সেস নিয়ন্ত্রণ এবং নিরাপদ ডেটা স্টোরেজ বাস্তবায়ন করি।"
    },
    {
      title: language === 'en' ? "6. Data Retention" : "৬. ডেটা ধারণ",
      content: language === 'en' 
        ? "We retain personal and usage data only as long as necessary to provide our services or to comply with legal obligations."
        : "আমরা শুধুমাত্র আমাদের সেবা প্রদান বা আইনি বাধ্যবাধকতা মেনে চলার জন্য প্রয়োজনীয় সময় পর্যন্ত ব্যক্তিগত এবং ব্যবহারের ডেটা ধারণ করি।"
    },
    {
      title: language === 'en' ? "7. Your Rights" : "৭. আপনার অধিকার",
      content: language === 'en' ? "Depending on your location, you may have the right to:" : "আপনার অবস্থানের উপর নির্ভর করে, আপনার অধিকার থাকতে পারে:",
      list: [
        { bold: language === 'en' ? "Access:" : "অ্যাক্সেস:", text: language === 'en' ? "Request a copy of your personal data." : "আপনার ব্যক্তিগত ডেটার একটি কপি অনুরোধ করুন।" },
        { bold: language === 'en' ? "Correction:" : "সংশোধন:", text: language === 'en' ? "Request correction of inaccurate data." : "ভুল ডেটা সংশোধনের অনুরোধ করুন।" },
        { bold: language === 'en' ? "Deletion:" : "মুছে ফেলা:", text: language === 'en' ? "Request permanent deletion of your account." : "আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলার অনুরোধ করুন।" },
        { bold: language === 'en' ? "Restriction:" : "সীমাবদ্ধতা:", text: language === 'en' ? "Request limits on data processing." : "ডেটা প্রক্রিয়াকরণে সীমাবদ্ধতার অনুরোধ করুন।" }
      ],
      note: language === 'en' ? "To exercise these rights, contact us at: support@aisorix.com" : "এই অধিকার প্রয়োগ করতে, আমাদের সাথে যোগাযোগ করুন: support@aisorix.com"
    },
    {
      title: language === 'en' ? "8. Changes to This Policy" : "৮. এই নীতিতে পরিবর্তন",
      content: language === 'en' 
        ? `We may update this policy from time to time. The updated version will be indicated by an updated "Effective Date."`
        : `আমরা সময়ে সময়ে এই নীতি আপডেট করতে পারি। আপডেট করা সংস্করণ একটি আপডেট করা "কার্যকর তারিখ" দ্বারা নির্দেশিত হবে।`
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
            <span className="text-foreground font-medium">{language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary mb-5 shadow-glow">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.'
                : 'আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই নীতি ব্যাখ্যা করে কিভাবে আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।'}
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
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-3">
                  {section.content}
                </p>
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
              </article>
            ))}

            {/* Contact Section */}
            <article className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background border border-primary/20 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {language === 'en' ? '9. Contact Us' : '৯. যোগাযোগ করুন'}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-5">
                {language === 'en' ? 'For questions, support, or legal notices, please contact us:' : 'প্রশ্ন, সহায়তা বা আইনি নোটিশের জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:'}
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
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'en' ? 'Terms of Service' : 'সেবার শর্তাবলী'}
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

export default PrivacyPolicy;