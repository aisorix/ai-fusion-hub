import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, GraduationCap, Leaf, Heart, Building2 } from "lucide-react";

const caseStudies = [
  {
    icon: GraduationCap,
    title: "Transforming Rural Education in Bangladesh with AI",
    sector: "Education",
    impact: "40% improvement in student engagement",
    description: "A network of schools in rural Sylhet division adopted AI Sorix to create personalized learning content and automate assessments, reaching 5,000+ students with limited teaching resources.",
  },
  {
    icon: Leaf,
    title: "Precision Agriculture for Smallholder Farmers in Asia",
    sector: "Agriculture",
    impact: "25% increase in crop yield",
    description: "Sorix Agro helped rice farmers in Rangpur identify crop diseases early using AI image analysis, reducing pesticide costs and increasing harvest yields across 200+ farms.",
  },
  {
    icon: Heart,
    title: "AI-Powered Health Screening in Dhaka Communities",
    sector: "Healthcare",
    impact: "10,000+ health assessments completed",
    description: "Community health workers in Dhaka used Sorix Health to provide preliminary health insights to underserved populations, enabling faster referrals to medical professionals.",
  },
  {
    icon: Building2,
    title: "Startup Productivity Boost with AI Agents",
    sector: "Technology",
    impact: "60% reduction in research time",
    description: "A Dhaka-based fintech startup integrated AI Sorix's multi-model chat and agent workflows, reducing content creation and market research time from days to hours.",
  },
  {
    icon: TrendingUp,
    title: "Content Marketing at Scale for Asian E-commerce",
    sector: "E-commerce",
    impact: "3x content output with same team",
    description: "An e-commerce company operating across Bangladesh and Myanmar used Sorix Deck and Imagine to produce marketing presentations and product visuals at unprecedented speed.",
  },
];

const CaseStudiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI Case Studies | How AI Sorix Transforms Education & Agriculture in Asia"
        description="Real-world case studies showing how AI Sorix is transforming education, agriculture, healthcare, and business across Bangladesh and Asia with AI-powered solutions."
        path="/case-studies"
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Case Studies
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how organizations across Bangladesh and Asia are achieving real results with AI Sorix.
          </p>
        </div>

        <div className="space-y-8">
          {caseStudies.map((study, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <study.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[11px] font-medium bg-primary/10 text-primary rounded-full px-3 py-1">{study.sector}</span>
                    <span className="text-[11px] font-medium bg-green-500/10 text-green-600 dark:text-green-400 rounded-full px-3 py-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {study.impact}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{study.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{study.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
