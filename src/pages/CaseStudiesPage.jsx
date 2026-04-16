import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, GraduationCap, Leaf, Heart, Building2, ArrowRight, Mail, Quote } from "lucide-react";

const caseStudies = [
  {
    icon: GraduationCap,
    title: "Transforming Rural Education in Bangladesh with AI",
    sector: "Education",
    impact: "40% improvement in student engagement",
    description: "A network of schools in rural Sylhet division adopted AI Sorix to create personalized learning content and automate assessments, reaching 5,000+ students with limited teaching resources.",
    stats: [
      { label: "Students Reached", value: "5,000+" },
      { label: "Teachers Trained", value: "120" },
      { label: "Content Generated", value: "10,000+ lessons" },
    ],
    quote: "AI Sorix has made it possible for our teachers to deliver world-class education even in the most remote villages of Bangladesh.",
  },
  {
    icon: Leaf,
    title: "Precision Agriculture for Smallholder Farmers in Asia",
    sector: "Agriculture",
    impact: "25% increase in crop yield",
    description: "Sorix Agro helped rice farmers in Rangpur identify crop diseases early using AI image analysis, reducing pesticide costs and increasing harvest yields across 200+ farms.",
    stats: [
      { label: "Farms Covered", value: "200+" },
      { label: "Pesticide Cost Reduction", value: "35%" },
      { label: "Diseases Detected Early", value: "1,200+" },
    ],
    quote: "For the first time, our farmers have access to the same kind of AI-powered tools that large agribusinesses use.",
  },
  {
    icon: Heart,
    title: "AI-Powered Health Screening in Dhaka Communities",
    sector: "Healthcare",
    impact: "10,000+ health assessments completed",
    description: "Community health workers in Dhaka used Sorix Health to provide preliminary health insights to underserved populations, enabling faster referrals to medical professionals.",
    stats: [
      { label: "Assessments Completed", value: "10,000+" },
      { label: "Referrals Generated", value: "2,400" },
      { label: "Health Workers Trained", value: "85" },
    ],
    quote: "Sorix Health allows our community workers to provide informed guidance quickly, improving access to healthcare in underserved areas.",
  },
  {
    icon: Building2,
    title: "Startup Productivity Boost with AI Agents",
    sector: "Technology",
    impact: "60% reduction in research time",
    description: "A Dhaka-based fintech startup integrated AI Sorix's multi-model chat and agent workflows, reducing content creation and market research time from days to hours.",
    stats: [
      { label: "Time Saved per Week", value: "25+ hours" },
      { label: "Reports Generated", value: "500+" },
      { label: "Team Members Using AI", value: "15" },
    ],
    quote: "AI Sorix replaced 3 separate AI subscriptions for our team and gave us better results with a single platform.",
  },
  {
    icon: TrendingUp,
    title: "Content Marketing at Scale for Asian E-commerce",
    sector: "E-commerce",
    impact: "3x content output with same team",
    description: "An e-commerce company operating across Bangladesh and Myanmar used Sorix Deck and Imagine to produce marketing presentations and product visuals at unprecedented speed.",
    stats: [
      { label: "Content Output", value: "3x increase" },
      { label: "Design Cost Savings", value: "50%" },
      { label: "Markets Served", value: "3 countries" },
    ],
    quote: "We went from creating 10 product visuals per week to over 30 — without hiring additional designers.",
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

        <div className="space-y-10">
          {caseStudies.map((study, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 pl-0 sm:pl-[72px]">
                {study.stats.map((stat, si) => (
                  <div key={si} className="text-center p-3 bg-muted/30 rounded-xl">
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="pl-0 sm:pl-[72px]">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground italic leading-relaxed">"{study.quote}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-16 sm:mt-20 bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Get Similar Results</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            Ready to transform your organization with AI? Get in touch and let us show you how AI Sorix can help.
          </p>
          <a
            href="mailto:support@aisorix.com?subject=Case%20Study%20Inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" /> Contact Us
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
