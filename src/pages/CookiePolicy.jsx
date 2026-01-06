import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Mail, MapPin, Calendar, Settings, BarChart3, Sparkles, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const CookiePolicy = () => {
  const { t } = useLanguage();

  const cookieTypes = [
    {
      icon: Settings,
      title: "Essential Cookies (Strictly Necessary)",
      description: "These cookies are required for the operation of our platform. They enable you to log into secure areas of our website and use our AI services.",
      items: [
        { bold: "Authentication:", text: "We use cookies to identify you when you visit so you don't have to log in every time you refresh the page." },
        { bold: "Security:", text: "These cookies help detect and prevent security risks, such as unauthorized login attempts." },
        { bold: "Credit Tracking:", text: "Essential for tracking your session usage to ensure your \"Credit Balance\" is updated accurately in real-time." }
      ],
      color: "from-emerald-500/20 to-emerald-600/10"
    },
    {
      icon: BarChart3,
      title: "Performance & Analytics Cookies",
      description: "These cookies allow us to recognize and count the number of visitors and see how visitors move around our website when they are using it.",
      items: [
        { bold: "Purpose:", text: "This helps us improve the way our website works, for example, by ensuring that users are finding the AI models (e.g., DeepSeek, Gemini) they are looking for easily." },
        { bold: "Tools:", text: "We may use tools like Google Analytics or Vercel Analytics to gather this anonymous data." }
      ],
      color: "from-blue-500/20 to-blue-600/10"
    },
    {
      icon: Sparkles,
      title: "Functionality Cookies",
      description: "These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (for example, your preferred \"Dark Mode\" setting or default AI model).",
      items: [],
      color: "from-purple-500/20 to-purple-600/10"
    },
    {
      icon: CreditCard,
      title: "Third-Party & Payment Cookies",
      description: "We use trusted third-party services that may also set cookies on your device:",
      items: [
        { bold: "Payment Gateways:", text: "SSLCommerz and bKash may use cookies to process your transactions securely and verify your identity during payment." },
        { bold: "Social Login:", text: "If you log in using Google or GitHub, these providers may set their own cookies to authenticate you." }
      ],
      color: "from-cyan-500/20 to-cyan-600/10"
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
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-primary mb-6">
              <Cookie className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your experience on AI Sorix.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8 sm:space-y-10">
            {/* Introduction */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains how AI Sorix ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website aisorix.com. By using our platform, you consent to the use of cookies as described in this policy.
              </p>
            </div>

            {/* What Are Cookies */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                2. What Are Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They allow the website to recognize your device, remember your preferences (like login status or language), and ensure the site functions correctly.
              </p>
            </div>

            {/* How We Use Cookies */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                3. How We Use Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We use cookies for the following specific purposes:
              </p>
              
              <div className="grid gap-6">
                {cookieTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div 
                      key={index}
                      className={`relative overflow-hidden rounded-xl border border-border/50 p-5 sm:p-6 bg-gradient-to-br ${type.color}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background/50 backdrop-blur flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            3.{index + 1}. {type.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            {type.description}
                          </p>
                          {type.items.length > 0 && (
                            <ul className="space-y-2">
                              {type.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span>
                                    <strong className="text-foreground">{item.bold} </strong>
                                    {item.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                4. Managing Your Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">Browser Settings: </strong>
                    You can control and/or delete cookies as you wish via your browser settings (Chrome, Firefox, Safari, Edge).
                  </span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">Impact: </strong>
                    Please note that if you choose to disable Essential Cookies, some parts of AI Sorix (specifically logging in and generating AI responses) will not work.
                  </span>
                </li>
              </ul>
            </div>

            {/* Updates */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                5. Updates to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our technology or legal requirements. Please check this page regularly to stay informed about our use of cookies.
              </p>
            </div>

            {/* Contact Section */}
            <div className="futuristic-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                6. Contact Us
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicy;
