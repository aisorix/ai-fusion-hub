import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: "1. Introduction",
      content: `This Privacy Policy describes how AI Sorix ("we," "our," or "us") collects, uses, and protects the personal information of users of our platform. By accessing or using https://aisorix.com, you consent to the collection and use of your data as outlined in this policy.`
    },
    {
      title: "2. Information We Collect",
      content: "We may collect the following types of information:",
      list: [
        { bold: "Account Information:", text: "Name, email address, phone number, and billing information (needed for account creation and invoicing)." },
        { bold: "Payment Details:", text: "All payments are processed securely through our trusted partners, primarily SSLCommerz and bKash. We do not store your full credit card, debit card, or mobile banking PINs on our servers." },
        { bold: "Usage Data:", text: "The number of Tokens/Credits used, prompts submitted, AI models selected (e.g., DeepSeek, Gemini), and generated responses." },
        { bold: "Technical Data:", text: "IP address, browser type, device information, and cookies to improve your user experience and security." }
      ]
    },
    {
      title: "3. How We Use Your Information",
      content: "We use your information to:",
      list: [
        { text: "Provide, personalize, and maintain the AI Sorix platform." },
        { text: "Process subscription payments and credit top-ups via local and international gateways." },
        { text: "Improve our AI models, features, and overall service quality." },
        { text: "Communicate important updates, security alerts, and promotional offers (where permitted)." },
        { text: "Ensure platform safety, prevent abuse (e.g., multi-account spamming), and comply with legal obligations." }
      ]
    },
    {
      title: "4. Data Sharing",
      content: "We value your privacy. We may share limited data only with:",
      list: [
        { bold: "Payment Processors:", text: "Trusted partners (such as SSLCommerz, bKash, or Stripe) strictly for transaction fulfillment." },
        { bold: "AI Model Providers:", text: "Third-party AI providers (e.g., OpenRouter, OpenAI, Anthropic, Google) to generate responses to your requests." },
        { bold: "Service Providers:", text: "Partners who help us with cloud hosting (e.g., Vercel, Supabase) and analytics." }
      ],
      note: "Note: We utilize privacy-preserving routing where possible to strip personal identifiers from prompts before sending them to model providers. We do not sell your personal data to advertisers or third parties."
    },
    {
      title: "5. Data Security",
      content: "We implement industry-standard encryption (SSL/TLS), strict access controls, and secure data storage to protect your information. However, please be aware that no system transmitting data over the Internet can be guaranteed to be 100% secure."
    },
    {
      title: "6. Data Retention",
      content: "We retain personal and usage data only as long as necessary to provide our services to you or to comply with legal obligations (such as tax and accounting laws in Bangladesh). You may request the deletion of your account at any time."
    },
    {
      title: "7. Your Rights",
      content: "Depending on your location, you may have the right to:",
      list: [
        { bold: "Access:", text: "Request a copy of the personal data we hold about you." },
        { bold: "Correction:", text: "Request that we correct inaccurate or incomplete data." },
        { bold: "Deletion:", text: "Request the permanent deletion of your account and personal data." },
        { bold: "Restriction:", text: "Request limits on how we process your data." }
      ],
      note: "To exercise these rights, please contact us at: support@aisorix.com."
    },
    {
      title: "8. International Data Transfers",
      content: "AI Sorix is based in Bangladesh. If you are accessing our services from outside Bangladesh, please be aware that your information may be transferred to, stored, and processed in Bangladesh or other countries where our servers and AI providers are located. By using our services, you consent to this transfer in compliance with standard data protection laws."
    },
    {
      title: "9. Age & Parental Consent",
      content: "AI Sorix is not directed towards children under the digital consent age in their country (typically 13 or 16). By using this platform, you confirm that you meet the legal minimum age in your jurisdiction or have obtained verifiable parental consent. We do not knowingly collect personal data from children without consent. If we discover such data, we will delete it promptly."
    },
    {
      title: "10. Third-Party Content and AI Output",
      content: "Our services utilize advanced Artificial Intelligence. Responses generated by AI models may contain information from third parties. We are not responsible for the accuracy, reliability, or legality of third-party outputs generated by the AI models."
    },
    {
      title: "11. Changes to This Privacy Policy",
      content: `We may update this policy from time to time to reflect changes in our practices or legal requirements. The updated version will be indicated by an updated "Effective Date." Continued use of AI Sorix after updates constitutes your acceptance of the revised policy.`
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-primary mb-6">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {section.content}
                </p>
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
              </div>
            ))}

            {/* Contact Section */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                12. Contact Us
              </h2>
              <p className="text-muted-foreground mb-6">
                For questions, support, or legal notices, please contact us:
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

export default PrivacyPolicy;
