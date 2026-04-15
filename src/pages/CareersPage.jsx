import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Briefcase, Globe } from "lucide-react";

const openings = [
  { title: "Senior AI/ML Engineer", location: "Dhaka, Bangladesh (Remote)", type: "Full-time", desc: "Build and fine-tune AI models powering AI Sorix's suite of tools. Experience with LLMs, computer vision, and Python required." },
  { title: "Full-Stack Developer", location: "Dhaka, Bangladesh (Hybrid)", type: "Full-time", desc: "Develop and maintain our React + Supabase platform. Strong TypeScript, Tailwind CSS, and API integration skills needed." },
  { title: "AI Content Strategist", location: "Remote — Asia", type: "Full-time", desc: "Create SEO-optimized content, case studies, and educational materials that position AI Sorix as a leader in the Asian AI ecosystem." },
  { title: "Product Designer (UI/UX)", location: "Remote — Worldwide", type: "Contract", desc: "Design intuitive interfaces for our AI tools. Experience with SaaS, design systems, and dark/light mode theming preferred." },
  { title: "Community Manager — Bangladesh", location: "Dhaka, Bangladesh", type: "Full-time", desc: "Grow and engage our user community across Bangladesh. Manage social media, partnerships, and local AI events." },
];

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Careers at AI Sorix | Join the Top AI Team in Bangladesh"
        description="Join AI Sorix and help build the future of AI in Bangladesh and Asia. Explore open positions in engineering, design, AI research, content, and community management."
        path="/careers"
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Careers at AI Sorix
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us build the #1 AI platform in Asia. We're based in Dhaka, Bangladesh and hiring globally.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {openings.map((job, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <h2 className="text-lg font-semibold text-foreground">{job.title}</h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{job.desc}</p>
              <a href="mailto:careers@aisorix.com" className="text-sm font-medium text-primary hover:underline">
                Apply →
              </a>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Don't see your role?</h2>
          <p className="text-sm text-muted-foreground mb-4">We're always looking for talented people. Send your resume and we'll keep you in mind.</p>
          <a href="mailto:careers@aisorix.com" className="text-sm font-medium text-primary hover:underline">careers@aisorix.com</a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;
