import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const TermsOfService = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: "1. Introduction",
      content: `Welcome to AI Sorix ("the Platform"). AI Sorix is owned and operated as a technology startup based in Dhaka, Bangladesh ("we," "our," or "us"). By accessing or using AI Sorix via aisorix.com or any of our related services, you ("User," "you") agree to be bound by these Terms & Conditions, our Privacy Policy, and any additional policies we may introduce.`,
      warning: "If you do not agree to these terms, you must discontinue use immediately."
    },
    {
      title: "2. Services Provided",
      content: "AI Sorix provides access to an aggregated interface of premium artificial intelligence services, including interactions with AI platforms such as ChatGPT (OpenAI), Gemini (Google), DeepSeek, Claude (Anthropic), and Llama (Meta). Our services include:",
      list: [
        { text: "Multi-Model AI Chat & Reasoning" },
        { text: "AI-Powered Code Generation" },
        { text: "Image Generation (via supported models)" },
        { text: "Document Analysis (PDF/Docx)" }
      ]
    },
    {
      title: "3. Subscription Plans & Pricing",
      content: "We offer the following subscription tiers (Prices in BDT):",
      list: [
        { bold: "Sorix Basic:", text: "৳499 BDT / month" },
        { bold: "Sorix Pro:", text: "৳999 BDT / month" },
        { bold: "Sorix Ultra:", text: "৳1,999 BDT / month" }
      ],
      note: "Prices are inclusive of applicable taxes/VAT. We reserve the right to change subscription prices with prior notice."
    },
    {
      title: "4. Payment Processing",
      content: "Payment methods available:",
      list: [
        { bold: "For Customers in Bangladesh:", text: "Payments are processed securely via local gateways including SSLCommerz and bKash." },
        { bold: "International Customers:", text: "Payments may be processed via Stripe or international cards where supported." }
      ],
      note: "Your billing information must be accurate. Failed payments may result in the immediate suspension of your account until the balance is cleared."
    },
    {
      title: "5. Refund & Cancellation Policy",
      content: "",
      list: [
        { bold: "Strict No-Refund Policy:", text: "All payments made to AI Sorix are non-refundable, regardless of your usage during the subscription period. Once your subscription fee is charged, you will not be entitled to a refund for unused services, unused credits, or partial months." },
        { bold: "Cancellation:", text: "You may cancel your subscription at any time via your dashboard. Cancellation prevents future billing but does not refund the current month. You will retain access until the end of your current billing cycle." }
      ]
    },
    {
      title: "6. Credit Usage Policy (Fair Use)",
      content: `To provide access to expensive models (like GPT-4o) alongside efficient models (like DeepSeek V3) at an affordable price, AI Sorix uses a "Credit System":`,
      list: [
        { bold: "Variable Cost:", text: "Different AI models consume credits at different rates." },
        { bold: "Standard Models:", text: "(e.g., DeepSeek V3, Gemini Flash, GPT-4o-Mini) consume 1x Credits." },
        { bold: "Premium Models:", text: "(e.g., GPT-4o, Claude 3.5 Sonnet, DeepSeek R1) consume Higher Credits (e.g., 5x - 20x per interaction)." },
        { bold: "Allocation:", text: "Your subscription grants a specific \"Credit Limit\" per month (e.g., 2 Million Credits for Basic)." },
        { bold: "Reset:", text: "Credits reset at the start of each billing cycle. Unused credits do not roll over to the next month." },
        { bold: "Exhaustion:", text: "If you exhaust your credits, you may be restricted to \"Free Tier\" models or required to purchase a Top-Up." },
        { bold: "No Cash Value:", text: "Credits have no monetary value and cannot be exchanged for cash or transferred." }
      ]
    },
    {
      title: "7. Intellectual Property",
      content: "All materials, brand assets, the AI Sorix name, logo, and proprietary interface designs are the intellectual property of AI Sorix. You may not reproduce, redistribute, scrape, or sell our materials without express written consent."
    },
    {
      title: "8. Restrictions on Use",
      content: "You may not:",
      list: [
        { text: "Use AI Sorix for activities that violate the laws of Bangladesh or your local jurisdiction." },
        { text: "Attempt to reverse-engineer, API-scrape, or bypass the credit counting system." },
        { text: "Share your account credentials (account sharing may lead to a permanent ban)." },
        { text: "Generate or disseminate harmful, illegal, political hate speech, or sexually explicit content." }
      ]
    },
    {
      title: "9. Acceptable Use Policy (AUP)",
      content: "When using AI Sorix, you agree NOT to:",
      list: [
        { text: "Generate content that is illegal, abusive, hateful, or discriminatory." },
        { text: "Use the platform to create malware, phishing scams, or misinformation." },
        { text: "Attempt to manipulate the \"Credit System\" to gain unauthorized access to Premium models." },
        { text: "Resell access to your account to third parties." }
      ],
      warning: "Violations will result in the immediate termination of your account without refund."
    },
    {
      title: "10. Content Ownership & Usage Rights",
      content: "",
      list: [
        { bold: "Your Output:", text: "Subject to the terms of the underlying AI providers (OpenAI, Google, etc.), you generally retain the rights to the content you generate (\"Output\"), including for commercial use." },
        { bold: "Third-Party Terms:", text: "AI Sorix acts as an interface. Your use of the generated content is also subject to the Terms of Service of the respective model provider (e.g., OpenAI's Usage Policy)." },
        { bold: "Liability:", text: "We make no warranties that AI-generated output is free from copyright claims. You are solely responsible for how you use the content." }
      ]
    },
    {
      title: "11. Disclaimer of Warranties",
      content: `AI Sorix provides access to third-party AI models on an "as is" basis. We do not guarantee:`,
      list: [
        { text: "That the AI responses will always be accurate (AI can hallucinate)." },
        { text: "That the service will be uninterrupted (Third-party APIs like OpenAI may have downtime)." }
      ],
      note: "We are not liable for any business losses or academic penalties incurred from using our tool."
    },
    {
      title: "12. Limitation of Liability",
      content: "To the extent permitted by Bangladeshi law, AI Sorix and its founders will not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services."
    },
    {
      title: "13. Age Restriction",
      content: "AI Sorix is not directed towards children under the age of 13. By using this platform, you confirm that you are at least 13 years old. If you are under 18, you confirm you are using the service with parental consent."
    },
    {
      title: "14. Termination",
      content: "We reserve the right to suspend or terminate accounts that violate these Terms. No refunds will be given for terminations due to violations of our Acceptable Use Policy."
    },
    {
      title: "15. Governing Law & Dispute Resolution",
      content: "These Terms are governed by the laws of Bangladesh. Any disputes arising from these terms shall be resolved through negotiation or strictly within the jurisdiction of the courts in Dhaka, Bangladesh."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <img src={logo} alt="AI Sorix" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <span className="text-lg sm:text-xl font-bold text-gradient-primary">AI Sorix</span>
            </Link>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>January 6, 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-primary mb-6">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using AI Sorix. By using our services, you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8 sm:space-y-10">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="futuristic-card p-6 sm:p-8 rounded-2xl"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {section.content}
                  </p>
                )}
                {section.list && (
                  <ul className="space-y-3 mb-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
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
                  <p className="text-sm text-primary/80 bg-primary/10 rounded-xl p-4 border border-primary/20">
                    {section.note}
                  </p>
                )}
                {section.warning && (
                  <div className="flex items-start gap-3 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl p-4 border border-amber-500/20 mt-4">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{section.warning}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Contact Section */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                16. Contact Us
              </h2>
              <p className="text-muted-foreground mb-6">
                For questions, support, or legal notices, contact:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <a 
                  href="mailto:support@aisorix.com" 
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span>support@aisorix.com</span>
                </a>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span>AI Sorix HQ, Ashulia, Savar, Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-muted-foreground text-sm">
            <p>© 2025 AI Sorix. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
