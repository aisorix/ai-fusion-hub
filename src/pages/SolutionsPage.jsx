import React from "react";
import { useParams, Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Workflow, GraduationCap, Rocket, FlaskConical, ArrowRight, CheckCircle } from "lucide-react";

const solutionsData = {
  "workflow-automation": {
    icon: Workflow,
    title: "AI-Powered Workflow Automation",
    subtitle: "Automate repetitive tasks with intelligent AI agents",
    seoTitle: "Workflow Automation | AI Sorix - AI Automation for Bangladesh & Asia",
    seoDesc: "Automate your workflows with AI Sorix. From content creation to data analysis, our AI agents handle multi-step tasks autonomously. Top AI automation tool in Bangladesh.",
    benefits: [
      "Automate content creation, research, and data analysis",
      "Multi-step task execution with AI agents",
      "Integrate with your existing tools and workflows",
      "Save 60%+ time on repetitive processes",
      "Built for teams and individuals across Asia",
    ],
    useCases: [
      "Marketing teams automating social media content",
      "Researchers automating literature reviews",
      "Businesses automating report generation",
      "Startups automating customer support workflows",
    ],
  },
  "ai-for-educators": {
    icon: GraduationCap,
    title: "AI for Educators",
    subtitle: "Transform teaching and learning with AI-powered tools",
    seoTitle: "AI for Educators | AI Sorix - AI Education Tools in Bangladesh",
    seoDesc: "AI Sorix empowers educators in Bangladesh and Asia with AI-powered lesson planning, content creation, automated grading, and personalized learning pathways.",
    benefits: [
      "Generate lesson plans and educational content instantly",
      "Create presentations and visual aids with AI",
      "Automate grading and assessment creation",
      "Personalized learning support for students",
      "Multilingual support including Bengali",
    ],
    useCases: [
      "Teachers creating engaging lesson content",
      "Universities scaling personalized learning",
      "Ed-tech companies building AI features",
      "Tutors providing adaptive practice materials",
    ],
  },
  "ai-for-startups": {
    icon: Rocket,
    title: "AI for Startups",
    subtitle: "Scale faster with an AI-powered workspace",
    seoTitle: "AI for Startups | AI Sorix - Best AI Platform for Asian Startups",
    seoDesc: "AI Sorix helps startups in Bangladesh and Asia scale faster with AI-powered research, content creation, image generation, and autonomous agents. All in one platform.",
    benefits: [
      "All-in-one AI workspace replacing multiple subscriptions",
      "Access GPT-5, Gemini, and top AI models",
      "Generate pitch decks, marketing materials, and content",
      "AI agents for market research and competitive analysis",
      "Affordable pricing for early-stage startups",
    ],
    useCases: [
      "Founders creating investor pitch decks",
      "Marketing teams generating content at scale",
      "Product teams conducting user research",
      "Sales teams creating proposals and documents",
    ],
  },
  "ai-for-researchers": {
    icon: FlaskConical,
    title: "AI for Researchers",
    subtitle: "Accelerate research with multi-model AI",
    seoTitle: "AI for Researchers | AI Sorix - AI Research Platform in Bangladesh & Asia",
    seoDesc: "AI Sorix provides researchers in Bangladesh and Asia with multi-model AI chat, document analysis, citation support, and AI-powered literature review tools.",
    benefits: [
      "Multi-model AI for cross-referencing research",
      "Upload and analyze research papers with AI",
      "Generate literature reviews and summaries",
      "Web search integration for latest findings",
      "Export research in multiple formats",
    ],
    useCases: [
      "PhD students reviewing academic literature",
      "Scientists analyzing experimental data",
      "Policy researchers synthesizing reports",
      "Journalists fact-checking and investigating",
    ],
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
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {solution.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{solution.subtitle}</p>
        </div>

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

        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SolutionsPage;
