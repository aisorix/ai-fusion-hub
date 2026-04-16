import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Newspaper, Download, Mail, Image, FileText, Globe } from "lucide-react";

const pressReleases = [
  {
    date: "2026-04-10",
    title: "AI Sorix Launches Sorix Agro — AI-Powered Agriculture for South Asian Farmers",
    summary: "AI Sorix introduces Sorix Agro, bringing crop disease detection, soil analysis, and yield prediction to smallholder farmers across Bangladesh and Southeast Asia, helping 200+ farms increase yields by 25%.",
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
    summary: "Users now have access to 10+ frontier AI models in a single workspace, making AI Sorix the most comprehensive AI platform available in Asia.",
  },
  {
    date: "2026-02-15",
    title: "Sorix Health Reaches 10,000 AI-Assisted Health Assessments in Bangladesh",
    summary: "Community health workers and individuals across Dhaka have used Sorix Health for over 10,000 AI-powered health assessments, improving healthcare access in underserved communities.",
  },
  {
    date: "2026-02-01",
    title: "AI Sorix Launches Full Bangla Language Support Across All Tools",
    summary: "AI Sorix becomes one of the first AI platforms to offer comprehensive Bangla language support, serving 170 million native speakers with localized AI tools.",
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

        {/* Press Releases */}
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

        {/* Brand Assets */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <Image className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Brand Assets</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Download the AI Sorix logo, brand guidelines, product screenshots, and marketing materials for press and media use.
            </p>
            <a
              href="mailto:support@aisorix.com?subject=Brand%20Assets%20Request"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Download className="w-4 h-4" /> Request Brand Kit
            </a>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Company Fact Sheet</h2>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li><strong className="text-foreground">Founded:</strong> 2025, Dhaka, Bangladesh</li>
              <li><strong className="text-foreground">Headquarters:</strong> Dhaka, Bangladesh</li>
              <li><strong className="text-foreground">Users:</strong> 50,000+ across Asia</li>
              <li><strong className="text-foreground">AI Models:</strong> 10+ frontier models</li>
              <li><strong className="text-foreground">Tools:</strong> 8 AI-powered tools</li>
            </ul>
          </div>
        </section>

        {/* Media Contact */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-3">Media Inquiries</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            For press inquiries, interviews, media kits, or partnership opportunities, please contact our team.
          </p>
          <a href="mailto:support@aisorix.com" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Mail className="w-4 h-4" /> support@aisorix.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PressPage;
