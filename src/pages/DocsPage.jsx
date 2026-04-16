import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, Presentation, ImageIcon, Heart, Leaf, Crown, Workflow, Bot, BookOpen, Rocket, ArrowRight, Mail, HelpCircle } from "lucide-react";

const docSections = [
  { icon: Rocket, title: "Getting Started", desc: "Create your account, explore the dashboard, and start using AI Sorix in minutes. No credit card required.", link: "/register" },
  { icon: MessageSquare, title: "AI Chat", desc: "Multi-model AI chat with GPT-5, Gemini 3, and more. Upload files, search the web, export conversations, and collaborate with your team.", link: "/chat" },
  { icon: Presentation, title: "Sorix Deck", desc: "Generate beautiful AI-powered presentations from a single prompt. Customize themes, art styles, and layouts. Export as images or slides.", link: "/deck" },
  { icon: ImageIcon, title: "Sorix Imagine", desc: "Create stunning images using AI. Choose from multiple art styles, aspect ratios, models including Flux AI and DALL-E.", link: "/imagine" },
  { icon: Heart, title: "Sorix Health", desc: "Get AI-driven health insights, symptom analysis, and nutrition guidance. Powered by medical research AI models.", link: "/health" },
  { icon: Leaf, title: "Sorix Agro", desc: "AI-powered crop analysis, disease detection via photo upload, soil assessment, and agricultural recommendations for farmers.", link: "/agro" },
  { icon: Crown, title: "Sorix Legends", desc: "Chat with AI personas of historical figures. Learn from Einstein, Shakespeare, Tagore, and more. Available on all plans.", link: "/legends" },
  { icon: Bot, title: "AI Agents", desc: "Autonomous AI agents that research, write, analyze, schedule, and execute multi-step tasks. Your virtual AI workforce.", link: "/agent" },
  { icon: Workflow, title: "Flow Builder", desc: "Create AI-generated flowcharts, diagrams, and process maps from natural language descriptions. Export as SVG or PNG.", link: "/flowbuilder" },
];

const quickStart = [
  { step: "1", title: "Create an Account", desc: "Sign up for free at AI Sorix. Email verification is quick and simple." },
  { step: "2", title: "Choose a Tool", desc: "Start with AI Chat for general questions, or explore specialized tools like Deck, Imagine, or Health." },
  { step: "3", title: "Start Creating", desc: "Type your prompt and let AI do the work. Upload files, select models, and customize outputs." },
  { step: "4", title: "Export & Share", desc: "Export your work as PDF, DOCX, images, or share conversations with your team via unique links." },
];

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Documentation | AI Sorix - Getting Started Guide & Feature Docs"
        description="Complete documentation for AI Sorix. Learn how to use AI Chat, Sorix Deck, Imagine, Health, Agro, Legends, AI Agents, and Flow Builder. Get started in minutes."
        path="/docs"
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to get started with AI Sorix. Explore our tools and features.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((qs, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-bold text-primary">{qs.step}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{qs.title}</h3>
                <p className="text-sm text-muted-foreground">{qs.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Docs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Tools & Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, i) => (
              <Link
                key={i}
                to={section.link}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Need Help */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Need Help?</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is here to help you get the most out of AI Sorix.
          </p>
          <a href="mailto:support@aisorix.com?subject=Documentation%20Help" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Mail className="w-4 h-4" /> support@aisorix.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocsPage;
