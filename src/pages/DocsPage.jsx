import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, Presentation, ImageIcon, Heart, Leaf, Crown, Workflow, Bot, BookOpen, Rocket } from "lucide-react";

const docSections = [
  { icon: Rocket, title: "Getting Started", desc: "Create your account, explore the dashboard, and start using AI Sorix in minutes.", link: "/register" },
  { icon: MessageSquare, title: "AI Chat", desc: "Multi-model AI chat with GPT-5, Gemini, and more. Upload files, search the web, and export conversations.", link: "/chat" },
  { icon: Presentation, title: "Sorix Deck", desc: "Generate beautiful AI-powered presentations from a single prompt. Customize themes, styles, and layouts.", link: "/deck" },
  { icon: ImageIcon, title: "Sorix Imagine", desc: "Create stunning images using AI. Choose from multiple art styles, aspect ratios, and generation models.", link: "/imagine" },
  { icon: Heart, title: "Sorix Health", desc: "Get AI-driven health insights, symptom analysis, and nutrition guidance. Powered by medical AI models.", link: "/health" },
  { icon: Leaf, title: "Sorix Agro", desc: "AI-powered crop analysis, disease detection, soil assessment, and agricultural recommendations.", link: "/agro" },
  { icon: Crown, title: "Sorix Legends", desc: "Chat with AI personas of historical figures. Learn from Einstein, Shakespeare, and more.", link: "/legends" },
  { icon: Bot, title: "AI Agents", desc: "Autonomous AI agents that research, write, analyze, and execute multi-step tasks for you.", link: "/agent" },
  { icon: Workflow, title: "Flow Builder", desc: "Create AI-generated flowcharts, diagrams, and process maps from natural language descriptions.", link: "/flowbuilder" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docSections.map((section, i) => (
            <Link
              key={i}
              to={section.link}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {section.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocsPage;
