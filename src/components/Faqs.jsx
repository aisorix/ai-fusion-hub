import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { language, t } = useLanguage();

  const faqData = language === 'en' ? [
    {
      question: "How is AI Sorix different from subscribing to each AI separately?",
      answer: "AI Sorix brings together the world's most powerful AI models — Grok 4, ChatGPT 5, Gemini 2.5 Pro, DeepSeek, Claude Sonnet 4, and Perplexity Sonar Pro — in one place. Instead of juggling multiple subscriptions and browser tabs, you get all answers side-by-side in a single chat window, plus exclusive features like Prompt Enhancer and Custom Projects."
    },
    {
      question: "Can I choose which AI models to use?",
      answer: "Yes! You can toggle AI models on or off at any time during your chat and turn them back on later without losing your chat history."
    },
    {
      question: "Do I get unlimited messages?",
      answer: "You get 3,000,000 tokens per month with your subscription. Each token is approximately ¾ of a word. For most users, this is far more than needed — the average usage is around 200,000 tokens per month. Standard models consume tokens at 1x rate whereas Premium models consume tokens at 4x rate."
    },
    {
      question: "What happens if I run out of tokens?",
      answer: "3 million tokens is a very large allowance, and 99% of users never come close to exhausting it. You'll see warnings before hitting zero. That said, if you reach that limit, please reach out to us at Support to get more tokens on paid basis."
    },
    {
      question: "Do you offer refunds?",
      answer: "No. All payments are non-refundable, regardless of usage. You may cancel any time to stop future billing (see our Terms & Conditions)."
    },
    {
      question: "How can I manage or cancel my subscription?",
      answer: "Log in to AI Sorix, go to Settings, and select your subscription management option."
    },
    {
      question: "Can I use AI Sorix on my phone?",
      answer: "Yes! You can use AI Sorix in your mobile browser or install our dedicated apps — Android and iOS — to access the platform anytime, anywhere."
    },
    {
      question: "Will I get free upgrades when new AI versions are released?",
      answer: "Yes! If ChatGPT releases Model 6 or another AI provider launches a higher version, you will get access at no extra cost."
    }
  ] : [
    {
      question: "AI Sorix প্রতিটি AI-তে আলাদা সাবস্ক্রিপশন থেকে কীভাবে আলাদা?",
      answer: "AI Sorix বিশ্বের সবচেয়ে শক্তিশালী AI মডেলগুলো — Grok 4, ChatGPT 5, Gemini 2.5 Pro, DeepSeek, Claude Sonnet 4, এবং Perplexity Sonar Pro — এক জায়গায় একত্রিত করে। একাধিক সাবস্ক্রিপশন এবং ব্রাউজার ট্যাব নিয়ে ঝামেলা না করে, আপনি একটি চ্যাট উইন্ডোতে পাশাপাশি সব উত্তর পাবেন, সাথে Prompt Enhancer এবং Custom Projects এর মতো এক্সক্লুসিভ ফিচার।"
    },
    {
      question: "আমি কি বেছে নিতে পারি কোন AI মডেল ব্যবহার করব?",
      answer: "হ্যাঁ! আপনি চ্যাটের যেকোনো সময় AI মডেল চালু বা বন্ধ করতে পারেন এবং চ্যাট হিস্ট্রি না হারিয়ে পরে আবার চালু করতে পারেন।"
    },
    {
      question: "আমি কি আনলিমিটেড মেসেজ পাব?",
      answer: "আপনি আপনার সাবস্ক্রিপশনে প্রতি মাসে ৩০ লক্ষ টোকেন পাবেন। প্রতিটি টোকেন প্রায় একটি শব্দের ৩/৪ অংশ। বেশিরভাগ ব্যবহারকারীর জন্য এটি প্রয়োজনের চেয়ে অনেক বেশি — গড় ব্যবহার প্রায় ২ লক্ষ টোকেন প্রতি মাসে।"
    },
    {
      question: "টোকেন শেষ হয়ে গেলে কী হবে?",
      answer: "৩০ লক্ষ টোকেন অনেক বড় পরিমাণ, এবং ৯৯% ব্যবহারকারী কখনোই এটি শেষ করার কাছে যান না। শূন্যে পৌঁছানোর আগে আপনি সতর্কতা দেখতে পাবেন। তবে, যদি আপনি সেই সীমায় পৌঁছান, অতিরিক্ত টোকেন পেতে অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।"
    },
    {
      question: "আপনারা কি রিফান্ড দেন?",
      answer: "না। সব পেমেন্ট অ-ফেরতযোগ্য, ব্যবহার নির্বিশেষে। আপনি যেকোনো সময় ভবিষ্যত বিলিং বন্ধ করতে বাতিল করতে পারেন।"
    },
    {
      question: "আমি কীভাবে আমার সাবস্ক্রিপশন পরিচালনা বা বাতিল করব?",
      answer: "AI Sorix-এ লগইন করুন, সেটিংসে যান এবং আপনার সাবস্ক্রিপশন ম্যানেজমেন্ট অপশন নির্বাচন করুন।"
    },
    {
      question: "আমি কি ফোনে AI Sorix ব্যবহার করতে পারি?",
      answer: "হ্যাঁ! আপনি মোবাইল ব্রাউজারে AI Sorix ব্যবহার করতে পারেন অথবা আমাদের Android এবং iOS অ্যাপ ইনস্টল করে যেকোনো সময়, যেকোনো জায়গায় প্ল্যাটফর্ম অ্যাক্সেস করতে পারেন।"
    },
    {
      question: "নতুন AI ভার্সন রিলিজ হলে কি আমি ফ্রি আপগ্রেড পাব?",
      answer: "হ্যাঁ! যদি ChatGPT Model 6 রিলিজ করে বা অন্য কোনো AI প্রোভাইডার উচ্চতর ভার্সন লঞ্চ করে, আপনি কোনো অতিরিক্ত খরচ ছাড়াই অ্যাক্সেস পাবেন।"
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-32 bg-background relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <MessageCircleQuestion className="w-4 h-4" />
            {language === 'en' ? 'Got Questions?' : 'প্রশ্ন আছে?'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('faqTitle')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('faqDesc')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl border overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'border-primary/30 shadow-lg' 
                  : 'border-border hover:border-border/80 hover:shadow-md'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left focus:outline-none gap-4"
              >
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  {item.question}
                </h3>

                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted text-muted-foreground'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* Answer Body */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            {language === 'en' ? 'Still have questions?' : 'এখনও প্রশ্ন আছে?'}
          </p>
          <a
            href="mailto:support@aisorix.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/30 hover:bg-card font-semibold transition-all duration-300"
          >
            {language === 'en' ? 'Contact Support' : 'সাপোর্টে যোগাযোগ করুন'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
