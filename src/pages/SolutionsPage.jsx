import React from "react";
import { useParams, Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Workflow, GraduationCap, Rocket, FlaskConical, ArrowRight, CheckCircle, Quote, Users, Zap, Globe, Mail } from "lucide-react";

const solutionsData = {
  "workflow-automation": {
    icon: Workflow,
    title: "AI-Powered Workflow Automation",
    subtitle: "Automate repetitive tasks with intelligent AI agents and save 60%+ time on routine processes.",
    seoTitle: "Workflow Automation | AI Sorix - AI Automation for Bangladesh & Asia",
    seoDesc: "Automate your workflows with AI Sorix. From content creation to data analysis, our AI agents handle multi-step tasks autonomously. Top AI automation tool in Bangladesh.",
    benefits: [
      "Automate content creation, research, and data analysis",
      "Multi-step task execution with autonomous AI agents",
      "Integrate with your existing tools and workflows",
      "Save 60%+ time on repetitive processes",
      "Built for teams and individuals across Asia",
      "Support for Bangla and English languages",
    ],
    useCases: [
      "Marketing teams automating social media content",
      "Researchers automating literature reviews",
      "Businesses automating report generation",
      "Startups automating customer support workflows",
      "HR teams creating job descriptions and onboarding materials",
      "Sales teams generating proposals and outreach emails",
    ],
    stats: [
      { value: "60%", label: "Time savings" },
      { value: "3x", label: "Content output" },
      { value: "10+", label: "AI models" },
    ],
    testimonial: {
      quote: "AI Sorix automated our entire content pipeline. What used to take our team a full day now takes 2 hours.",
      author: "Marketing Director, Dhaka Fintech Startup",
    },
  },
  "ai-for-educators": {
    icon: GraduationCap,
    title: "AI for Educators",
    subtitle: "Transform teaching and learning with AI-powered tools designed for educators across Bangladesh and Asia.",
    seoTitle: "AI for Educators | AI Sorix - AI Education Tools in Bangladesh",
    seoDesc: "AI Sorix empowers educators in Bangladesh and Asia with AI-powered lesson planning, content creation, automated grading, and personalized learning pathways.",
    benefits: [
      "Generate lesson plans and educational content instantly",
      "Create presentations and visual aids with Sorix Deck",
      "Automate grading and assessment creation",
      "Personalized learning support for students",
      "Multilingual support including Bengali",
      "Research assistance with multi-model AI",
    ],
    useCases: [
      "Teachers creating engaging lesson content for classes",
      "Universities scaling personalized learning programs",
      "Ed-tech companies building AI-powered features",
      "Tutors providing adaptive practice materials",
      "School administrators generating reports and analysis",
      "Researchers conducting educational studies",
    ],
    stats: [
      { value: "5,000+", label: "Students reached" },
      { value: "40%", label: "Engagement increase" },
      { value: "120+", label: "Educators trained" },
    ],
    testimonial: {
      quote: "AI Sorix has made it possible for our teachers to deliver world-class education even in the most remote villages of Bangladesh.",
      author: "School Principal, Sylhet Division",
    },
  },
  "ai-for-startups": {
    icon: Rocket,
    title: "AI for Startups",
    subtitle: "Scale faster with an all-in-one AI workspace that replaces multiple subscriptions.",
    seoTitle: "AI for Startups | AI Sorix - Best AI Platform for Asian Startups",
    seoDesc: "AI Sorix helps startups in Bangladesh and Asia scale faster with AI-powered research, content creation, image generation, and autonomous agents. All in one platform.",
    benefits: [
      "All-in-one AI workspace replacing multiple subscriptions",
      "Access GPT-5, Gemini 3, and 10+ frontier AI models",
      "Generate pitch decks with Sorix Deck",
      "AI agents for market research and competitive analysis",
      "Create marketing visuals with Sorix Imagine",
      "Affordable pricing designed for early-stage startups",
    ],
    useCases: [
      "Founders creating investor pitch decks in minutes",
      "Marketing teams generating content at scale",
      "Product teams conducting rapid user research",
      "Sales teams creating proposals and documents",
      "CTOs evaluating technical architectures with AI",
      "Operations teams automating routine workflows",
    ],
    stats: [
      { value: "25+", label: "Hours saved/week" },
      { value: "50%", label: "Cost reduction" },
      { value: "500+", label: "Startups using Sorix" },
    ],
    testimonial: {
      quote: "AI Sorix replaced 3 separate AI subscriptions for our team and gave us better results with a single platform.",
      author: "CEO, Dhaka-based Fintech Startup",
    },
  },
  "ai-for-researchers": {
    icon: FlaskConical,
    title: "AI for Researchers",
    subtitle: "Accelerate research with multi-model AI, document analysis, and citation support.",
    seoTitle: "AI for Researchers | AI Sorix - AI Research Platform in Bangladesh & Asia",
    seoDesc: "AI Sorix provides researchers in Bangladesh and Asia with multi-model AI chat, document analysis, citation support, and AI-powered literature review tools.",
    benefits: [
      "Multi-model AI for cross-referencing research findings",
      "Upload and analyze research papers with AI",
      "Generate literature reviews and summaries",
      "Web search integration for latest findings",
      "Export research in PDF, DOCX, and Markdown",
      "Collaborate on shared research with team members",
    ],
    useCases: [
      "PhD students reviewing academic literature",
      "Scientists analyzing experimental data",
      "Policy researchers synthesizing reports",
      "Journalists fact-checking and investigating",
      "Graduate students writing thesis chapters",
      "Think tanks producing policy briefs",
    ],
    stats: [
      { value: "70%", label: "Faster literature reviews" },
      { value: "10+", label: "AI models available" },
      { value: "1,000+", label: "Researchers using Sorix" },
    ],
    testimonial: {
      quote: "What used to take me weeks of reading papers now takes hours. AI Sorix's multi-model approach gives me perspectives I wouldn't have found on my own.",
      author: "PhD Researcher, University of Dhaka",
    },
  },
};

const SolutionsPage = () => {
  const { slug } = useParams();
  const solution = solutionsData[slug];

  if (!solution) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Solution not found</h1>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = solution.icon;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={solution.seoTitle} description={solution.seoDesc} path={`/solutions/${slug}`} />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {solution.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{solution.subtitle}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {solution.stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Benefits & Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Key Benefits</h2>
            <ul className="space-y-4">
              {solution.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Use Cases</h2>
            <ul className="space-y-4">
              {solution.useCases.map((u, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-16">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <p className="text-base text-foreground italic leading-relaxed mb-3">
                "{solution.testimonial.quote}"
              </p>
              <p className="text-sm text-muted-foreground">— {solution.testimonial.author}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity text-base"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Questions? <a href="mailto:support@aisorix.com" className="text-primary hover:underline">support@aisorix.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SolutionsPage;
