import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "How is AI Fiesta different from subscribing to each AI separately?",
    answer: "AI Fiesta brings together the world's most powerful AI models — Grok 4, ChatGPT 5, Gemini 2.5 Pro, DeepSeek, Claude Sonnet 4, and Perplexity Sonar Pro — in one place. Instead of juggling multiple subscriptions and browser tabs, you get all answers side-by-side in a single chat window, plus exclusive features like Prompt Enhancer and Custom Projects."
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
    answer: "Log in to AI Fiesta, go to Settings, and select your subscription management option."
  },
  {
    question: "Where can I access the Community and the Promptbook?",
    answer: "You can log in at community.aifiesta.ai using your registered email. Please note: this feature is only available to paid users."
  },
  {
    question: "Can I use AI Fiesta on my phone?",
    answer: "Yes! You can use AI Fiesta in your mobile browser at chat.aifiesta.ai or install our dedicated apps — Android and iOS — to access the platform anytime, anywhere."
  },
  {
    question: "Will I get free upgrades when new AI versions are released?",
    answer: "Yes! If ChatGPT releases Model 6 or another AI provider launches a higher version, you will get access at no extra cost."
  }
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground">
            Frequently Asked Questions (FAQs)
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
              >
                <h3 className="text-xl font-semibold text-foreground pr-8">
                  {item.question}
                </h3>

                <ChevronDown
                  className={`w-6 h-6 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer Body */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
