import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, Mail, MapPin, Calendar, AlertTriangle, Home, ChevronRight, XCircle, Clock, CreditCard, ShieldCheck, Phone, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const RefundPolicy = () => {
  const { language } = useLanguage();

  const sections = [
    {
      title: language === 'en' ? "1. Introduction" : "১. ভূমিকা",
      content: language === 'en' 
        ? "This Refund & Cancellation Policy outlines our policies regarding payments, refunds, and subscription cancellations for AI Sorix services. By subscribing to our services, you agree to this policy."
        : "এই রিফান্ড ও বাতিলকরণ নীতি AI Sorix সেবার জন্য পেমেন্ট, রিফান্ড এবং সাবস্ক্রিপশন বাতিলকরণ সম্পর্কে আমাদের নীতিগুলো বর্ণনা করে। আমাদের সেবায় সাবস্ক্রাইব করে, আপনি এই নীতিতে সম্মত হন।"
    },
    {
      title: language === 'en' ? "2. No-Refund Policy" : "২. নো-রিফান্ড নীতি",
      content: language === 'en' 
        ? "Due to the digital nature of our AI services, all payments made to AI Sorix are final and non-refundable."
        : "আমাদের AI সেবার ডিজিটাল প্রকৃতির কারণে, AI Sorix-এ করা সমস্ত পেমেন্ট চূড়ান্ত এবং অ-ফেরতযোগ্য।",
      list: [
        { bold: language === 'en' ? "Subscription Fees:" : "সাবস্ক্রিপশন ফি:", text: language === 'en' ? "Monthly and yearly subscription payments are non-refundable." : "মাসিক এবং বার্ষিক সাবস্ক্রিপশন পেমেন্ট অ-ফেরতযোগ্য।" },
        { bold: language === 'en' ? "Credit Top-ups:" : "ক্রেডিট টপ-আপ:", text: language === 'en' ? "Purchased credits cannot be refunded or transferred." : "ক্রয়কৃত ক্রেডিট ফেরত বা স্থানান্তর করা যাবে না।" },
        { bold: language === 'en' ? "Partial Usage:" : "আংশিক ব্যবহার:", text: language === 'en' ? "Refunds are not provided for unused portions of subscriptions." : "সাবস্ক্রিপশনের অব্যবহৃত অংশের জন্য রিফান্ড দেওয়া হয় না।" }
      ],
      warning: language === 'en' ? "All sales are final. Please review our plans carefully before purchasing." : "সমস্ত বিক্রয় চূড়ান্ত। ক্রয়ের আগে অনুগ্রহ করে আমাদের প্ল্যান সাবধানে পর্যালোচনা করুন।"
    },
    {
      title: language === 'en' ? "3. Subscription Cancellation" : "৩. সাবস্ক্রিপশন বাতিলকরণ",
      content: language === 'en' 
        ? "You may cancel your subscription at any time through your account settings."
        : "আপনি আপনার অ্যাকাউন্ট সেটিংসের মাধ্যমে যেকোনো সময় আপনার সাবস্ক্রিপশন বাতিল করতে পারেন।",
      list: [
        { bold: language === 'en' ? "Access Retention:" : "অ্যাক্সেস ধারণ:", text: language === 'en' ? "You retain full access to premium features until your current billing cycle ends." : "আপনার বর্তমান বিলিং চক্র শেষ না হওয়া পর্যন্ত আপনি প্রিমিয়াম বৈশিষ্ট্যগুলিতে সম্পূর্ণ অ্যাক্সেস পাবেন।" },
        { bold: language === 'en' ? "No Prorated Refunds:" : "কোনো আনুপাতিক রিফান্ড নেই:", text: language === 'en' ? "Cancellation does not entitle you to a refund for the remaining period." : "বাতিলকরণ আপনাকে অবশিষ্ট সময়ের জন্য রিফান্ডের অধিকার দেয় না।" },
        { bold: language === 'en' ? "Auto-Renewal:" : "স্বয়ংক্রিয় নবায়ন:", text: language === 'en' ? "Cancel before your renewal date to avoid being charged for the next cycle." : "পরবর্তী চক্রের জন্য চার্জ এড়াতে আপনার নবায়ন তারিখের আগে বাতিল করুন।" }
      ],
      note: language === 'en' ? "Cancellation takes effect at the end of your current billing period." : "বাতিলকরণ আপনার বর্তমান বিলিং পিরিয়ডের শেষে কার্যকর হয়।"
    },
    {
      title: language === 'en' ? "4. Billing Cycle & Access" : "৪. বিলিং চক্র ও অ্যাক্সেস",
      content: language === 'en' ? "Your subscription follows a monthly or yearly billing cycle:" : "আপনার সাবস্ক্রিপশন মাসিক বা বার্ষিক বিলিং চক্র অনুসরণ করে:",
      list: [
        { bold: language === 'en' ? "Monthly Plans:" : "মাসিক প্ল্যান:", text: language === 'en' ? "Billed on the same date each month." : "প্রতি মাসে একই তারিখে বিল করা হয়।" },
        { bold: language === 'en' ? "Yearly Plans:" : "বার্ষিক প্ল্যান:", text: language === 'en' ? "Billed annually with up to 20% savings." : "২০% পর্যন্ত সাশ্রয় সহ বার্ষিক বিল করা হয়।" },
        { bold: language === 'en' ? "Failed Payments:" : "ব্যর্থ পেমেন্ট:", text: language === 'en' ? "Access may be suspended if payment fails. Service resumes upon successful payment." : "পেমেন্ট ব্যর্থ হলে অ্যাক্সেস স্থগিত হতে পারে। সফল পেমেন্টের পর সেবা পুনরায় শুরু হয়।" }
      ]
    },
    {
      title: language === 'en' ? "5. Exceptional Circumstances" : "৫. ব্যতিক্রমী পরিস্থিতি",
      content: language === 'en' 
        ? "While we maintain a strict no-refund policy, we may consider exceptions in the following cases:"
        : "যদিও আমরা কঠোর নো-রিফান্ড নীতি বজায় রাখি, নিম্নলিখিত ক্ষেত্রে আমরা ব্যতিক্রম বিবেচনা করতে পারি:",
      list: [
        { bold: language === 'en' ? "Duplicate Payments:" : "ডুপ্লিকেট পেমেন্ট:", text: language === 'en' ? "If you were charged multiple times for the same transaction." : "যদি একই লেনদেনের জন্য আপনাকে একাধিকবার চার্জ করা হয়।" },
        { bold: language === 'en' ? "Technical Errors:" : "প্রযুক্তিগত ত্রুটি:", text: language === 'en' ? "System errors that resulted in incorrect charges." : "সিস্টেম ত্রুটি যার ফলে ভুল চার্জ হয়েছে।" },
        { bold: language === 'en' ? "Unauthorized Transactions:" : "অননুমোদিত লেনদেন:", text: language === 'en' ? "Fraudulent transactions not initiated by you (subject to verification)." : "আপনার দ্বারা শুরু করা হয়নি এমন প্রতারণামূলক লেনদেন (যাচাইয়ের সাপেক্ষে)।" }
      ],
      note: language === 'en' ? "Requests must be submitted within 7 days of the transaction date." : "অনুরোধ লেনদেনের তারিখের ৭ দিনের মধ্যে জমা দিতে হবে।"
    },
    {
      title: language === 'en' ? "6. Payment Disputes" : "৬. পেমেন্ট বিরোধ",
      content: language === 'en' 
        ? "If you believe there is an error in your billing, please contact us before initiating a dispute with your bank or payment provider."
        : "যদি আপনি মনে করেন আপনার বিলিংয়ে কোনো ত্রুটি আছে, অনুগ্রহ করে আপনার ব্যাংক বা পেমেন্ট প্রদানকারীর সাথে বিরোধ শুরু করার আগে আমাদের সাথে যোগাযোগ করুন।",
      list: [
        { bold: language === 'en' ? "Dispute Window:" : "বিরোধ উইন্ডো:", text: language === 'en' ? "7 days from the transaction date (as per Bangladesh Bank guidelines)." : "লেনদেনের তারিখ থেকে ৭ দিন (বাংলাদেশ ব্যাংকের নির্দেশিকা অনুযায়ী)।" },
        { bold: language === 'en' ? "Resolution Time:" : "সমাধানের সময়:", text: language === 'en' ? "We aim to resolve disputes within 5-7 business days." : "আমরা ৫-৭ কার্যদিবসের মধ্যে বিরোধ সমাধান করার লক্ষ্য রাখি।" },
        { bold: language === 'en' ? "SSLCommerz/bKash:" : "SSLCommerz/bKash:", text: language === 'en' ? "Disputes for local payments are handled through respective payment gateway procedures." : "স্থানীয় পেমেন্টের বিরোধ সংশ্লিষ্ট পেমেন্ট গেটওয়ে পদ্ধতির মাধ্যমে পরিচালিত হয়।" }
      ]
    },
    {
      title: language === 'en' ? "7. Chargeback Policy" : "৭. চার্জব্যাক নীতি",
      content: language === 'en' 
        ? "Initiating a chargeback without first contacting us may result in account suspension."
        : "প্রথমে আমাদের সাথে যোগাযোগ না করে চার্জব্যাক শুরু করলে অ্যাকাউন্ট স্থগিত হতে পারে।",
      list: [
        { bold: language === 'en' ? "Contact First:" : "প্রথমে যোগাযোগ করুন:", text: language === 'en' ? "We encourage you to contact our support team before filing a chargeback." : "চার্জব্যাক দাখিল করার আগে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করার জন্য উৎসাহিত করি।" },
        { bold: language === 'en' ? "Account Suspension:" : "অ্যাকাউন্ট স্থগিত:", text: language === 'en' ? "Fraudulent chargebacks will result in permanent account termination." : "প্রতারণামূলক চার্জব্যাকের ফলে স্থায়ী অ্যাকাউন্ট বন্ধ হবে।" }
      ],
      warning: language === 'en' ? "Fraudulent chargebacks may be reported to relevant authorities." : "প্রতারণামূলক চার্জব্যাক সংশ্লিষ্ট কর্তৃপক্ষের কাছে রিপোর্ট করা হতে পারে।"
    },
    {
      title: language === 'en' ? "8. Free Trial Terms" : "৮. ফ্রি ট্রায়াল শর্তাবলী",
      content: language === 'en' ? "If you sign up for a free trial:" : "আপনি যদি ফ্রি ট্রায়ালে সাইন আপ করেন:",
      list: [
        { bold: language === 'en' ? "No Payment Required:" : "কোনো পেমেন্ট প্রয়োজন নেই:", text: language === 'en' ? "No payment is charged during the trial period." : "ট্রায়াল পিরিয়ডে কোনো পেমেন্ট চার্জ করা হয় না।" },
        { bold: language === 'en' ? "Auto-Conversion:" : "স্বয়ংক্রিয় রূপান্তর:", text: language === 'en' ? "Your trial may convert to a paid subscription unless cancelled before expiry." : "মেয়াদ শেষের আগে বাতিল না করলে আপনার ট্রায়াল পেইড সাবস্ক্রিপশনে রূপান্তরিত হতে পারে।" },
        { bold: language === 'en' ? "Notification:" : "বিজ্ঞপ্তি:", text: language === 'en' ? "We will notify you before charging your payment method." : "আপনার পেমেন্ট পদ্ধতি চার্জ করার আগে আমরা আপনাকে জানাব।" }
      ]
    },
    {
      title: language === 'en' ? "9. Price Changes" : "৯. মূল্য পরিবর্তন",
      content: language === 'en' 
        ? "We reserve the right to change subscription prices with prior notice."
        : "আমরা পূর্ব বিজ্ঞপ্তি সহ সাবস্ক্রিপশন মূল্য পরিবর্তনের অধিকার সংরক্ষণ করি।",
      list: [
        { bold: language === 'en' ? "Notice Period:" : "নোটিশ পিরিয়ড:", text: language === 'en' ? "At least 30 days notice before price changes take effect." : "মূল্য পরিবর্তন কার্যকর হওয়ার কমপক্ষে ৩০ দিন আগে নোটিশ।" },
        { bold: language === 'en' ? "Existing Subscriptions:" : "বিদ্যমান সাবস্ক্রিপশন:", text: language === 'en' ? "Current subscribers will be notified via email." : "বর্তমান সাবস্ক্রাইবারদের ইমেইলের মাধ্যমে জানানো হবে।" },
        { bold: language === 'en' ? "Cancellation Option:" : "বাতিল অপশন:", text: language === 'en' ? "You may cancel before the new price takes effect." : "নতুন মূল্য কার্যকর হওয়ার আগে আপনি বাতিল করতে পারেন।" }
      ]
    }
  ];

  const keyPolicies = [
    {
      icon: XCircle,
      title: language === 'en' ? "No Refunds" : "কোনো রিফান্ড নেই",
      description: language === 'en' ? "All payments are final and non-refundable" : "সমস্ত পেমেন্ট চূড়ান্ত এবং অ-ফেরতযোগ্য",
      color: "from-red-500/20 to-red-600/10"
    },
    {
      icon: Clock,
      title: language === 'en' ? "Cancel Anytime" : "যেকোনো সময় বাতিল",
      description: language === 'en' ? "Access continues until billing cycle ends" : "বিলিং চক্র শেষ না হওয়া পর্যন্ত অ্যাক্সেস থাকে",
      color: "from-emerald-500/20 to-emerald-600/10"
    },
    {
      icon: ShieldCheck,
      title: language === 'en' ? "Secure Payments" : "নিরাপদ পেমেন্ট",
      description: language === 'en' ? "SSLCommerz & bKash protected" : "SSLCommerz ও bKash সুরক্ষিত",
      color: "from-blue-500/20 to-blue-600/10"
    },
    {
      icon: RefreshCw,
      title: language === 'en' ? "7-Day Dispute Window" : "৭ দিনের বিরোধ উইন্ডো",
      description: language === 'en' ? "As per Bangladesh Bank guidelines" : "বাংলাদেশ ব্যাংকের নির্দেশিকা অনুযায়ী",
      color: "from-purple-500/20 to-purple-600/10"
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
            <span className="text-foreground font-medium">{language === 'en' ? 'Refund & Cancellation Policy' : 'রিফান্ড ও বাতিলকরণ নীতি'}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] opacity-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary mb-5 shadow-glow">
              <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {language === 'en' ? 'Refund & Cancellation Policy' : 'রিফান্ড ও বাতিলকরণ নীতি'}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Understand our payment policies, subscription cancellation process, and refund guidelines for AI Sorix services.'
                : 'AI Sorix সেবার জন্য আমাদের পেমেন্ট নীতি, সাবস্ক্রিপশন বাতিলকরণ প্রক্রিয়া এবং রিফান্ড নির্দেশিকা বুঝুন।'}
            </p>
          </div>
        </div>
      </section>

      {/* Key Policies Grid */}
      <section className="py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {keyPolicies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <div 
                  key={index}
                  className={`relative overflow-hidden rounded-xl border border-border/50 p-4 sm:p-5 bg-gradient-to-br ${policy.color} hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background/50 backdrop-blur flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                      {policy.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {policy.description}
                    </p>
                  </div>
                </div>
              );
            })}
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
                {language === 'en' 
                  ? 'For billing inquiries, refund requests, or cancellation assistance, please contact our support team:'
                  : 'বিলিং অনুসন্ধান, রিফান্ড অনুরোধ, বা বাতিলকরণ সহায়তার জন্য, অনুগ্রহ করে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:'}
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
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'en' ? 'Terms of Service' : 'সেবার শর্তাবলী'}
              </Link>
              <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'en' ? 'Cookie Policy' : 'কুকি নীতি'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;