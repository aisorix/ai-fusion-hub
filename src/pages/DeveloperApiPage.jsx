import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, Webhook, Box, Zap, ArrowRight, Mail, Shield, Globe } from "lucide-react";

const features = [
  { icon: Code, title: "RESTful API", desc: "Access all AI Sorix capabilities — chat, image generation, presentations, and more — through a clean, well-documented REST API." },
  { icon: Box, title: "SDKs & Libraries", desc: "Official SDKs for JavaScript, Python, and more. Get started in minutes with your preferred language and framework." },
  { icon: Webhook, title: "Webhooks", desc: "Real-time event notifications for task completions, generation results, and subscription changes via secure webhooks." },
  { icon: Shield, title: "API Key Authentication", desc: "Secure API key management with granular permissions, rate limiting, and usage analytics per key." },
  { icon: Zap, title: "Streaming Responses", desc: "Stream AI responses in real-time for chat, analysis, and content generation endpoints with Server-Sent Events." },
  { icon: Globe, title: "Multi-Region", desc: "Low-latency endpoints optimized for Asia, with global CDN distribution for fast response times worldwide." },
];

const useCases = [
  "Integrate AI chat into your SaaS product",
  "Automate content & image generation pipelines",
  "Build custom AI-powered workflows",
  "Add AI health or agriculture analysis to your app",
  "Create presentation & report generation systems",
  "Power chatbots with multi-model AI",
];

const DeveloperApiPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Developer API | AI Sorix - Coming Soon"
        description="The AI Sorix Developer API is coming soon. Build AI-powered applications with our RESTful API, SDKs, and webhooks. Access GPT-5, Gemini, and 10+ AI models programmatically."
        path="/developer-api"
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Coming Soon
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Developer API
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Programmatic access to AI Sorix's full suite of AI tools. Build, integrate, and scale AI-powered applications with our upcoming API.
          </p>
        </div>

        {/* What to Expect */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Use Cases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {useCases.map((uc, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{uc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Join the Waitlist</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            Be the first to get access when the AI Sorix Developer API launches. We'll notify you with early access, documentation, and free API credits.
          </p>
          <a
            href="mailto:support@aisorix.com?subject=Developer%20API%20Waitlist"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" /> Join Waitlist
          </a>
          <p className="text-xs text-muted-foreground mt-4">
            Or email us directly at <a href="mailto:support@aisorix.com" className="text-primary hover:underline">support@aisorix.com</a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DeveloperApiPage;
