import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Newspaper, Download, Mail } from "lucide-react";

const pressReleases = [
  {
    date: "2026-04-10",
    title: "AI Sorix Launches Sorix Agro — AI-Powered Agriculture for South Asian Farmers",
    summary: "AI Sorix introduces Sorix Agro, bringing crop disease detection, soil analysis, and yield prediction to smallholder farmers across Bangladesh and Southeast Asia.",
  },
  {
    date: "2026-03-25",
    title: "AI Sorix Ranked Among Top 5 AI Platforms in Bangladesh",
    summary: "With over 50,000 users across Asia, AI Sorix has been recognized as one of the leading AI research ecosystems in Bangladesh and the broader South Asian region.",
  },
  {
    date: "2026-03-15",
    title: "Sorix Lab Announces AI Agents — Autonomous Task Execution for Professionals",
    summary: "The new AI Agents feature enables users to delegate complex multi-step tasks to autonomous AI workers, from research to content creation and data analysis.",
  },
  {
    date: "2026-03-01",
    title: "AI Sorix Expands AI Model Access with GPT-5, Gemini 3, and More",
    summary: "Users now have access to the world's most advanced AI models in a single workspace, making AI Sorix the most comprehensive AI platform available in Asia.",
  },
];

const PressPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Press & Media | AI Sorix - AI Innovation from Bangladesh"
        description="Latest press releases, media resources, and news about AI Sorix. Headquartered in Dhaka, Bangladesh, AI Sorix is a leading AI platform serving users across Asia."
        path="/press"
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Press & Media
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            News, press releases, and media resources from AI Sorix — built in Dhaka, Bangladesh.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {pressReleases.map((pr, i) => (
            <article key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <time className="text-xs text-muted-foreground">{new Date(pr.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                  <h2 className="text-lg font-semibold text-foreground mt-1 mb-2">{pr.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pr.summary}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">Media Inquiries</h2>
          <p className="text-sm text-muted-foreground mb-4">For press inquiries, interviews, or media kit requests, please contact us.</p>
          <a href="mailto:press@aisorix.com" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Mail className="w-4 h-4" /> press@aisorix.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PressPage;
