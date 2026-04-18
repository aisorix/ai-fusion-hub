import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Briefcase, Globe, Rocket, Heart, Zap, Users, Mail } from "lucide-react";

const benefits = [
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere. Our team is distributed across Bangladesh and Asia." },
  { icon: Rocket, title: "Cutting-Edge AI", desc: "Work with GPT-5, Gemini 3, and the latest AI models every day." },
  { icon: Zap, title: "Fast Growth", desc: "Join an early-stage company with massive growth potential in the Asian AI market." },
  { icon: Heart, title: "Impact-Driven", desc: "Build AI tools that transform education, healthcare, and agriculture for millions." },
  { icon: Users, title: "Small Team, Big Impact", desc: "Every team member makes a significant contribution to the product and company." },
  { icon: Briefcase, title: "Competitive Compensation", desc: "Competitive salary, equity, and benefits for all full-time team members." },
];

const openings = [
  { title: "Senior AI/ML Engineer", location: "Dhaka, Bangladesh (Remote)", type: "Full-time", desc: "Build and fine-tune AI models powering AI Sorix's suite of tools. Experience with LLMs, computer vision, and Python required. You'll work on prompt engineering, model orchestration, and inference optimization." },
  { title: "Full-Stack Developer", location: "Dhaka, Bangladesh (Hybrid)", type: "Full-time", desc: "Develop and maintain our React + TypeScript platform. Strong skills in Tailwind CSS, API integration, and real-time features needed. You'll build tools used by thousands of users daily." },
  { title: "AI Content Strategist", location: "Remote — Asia", type: "Full-time", desc: "Create SEO-optimized content, case studies, blog posts, and educational materials. You'll help position AI Sorix as the #1 AI platform in Bangladesh and Asia through strategic content." },
  { title: "Product Designer (UI/UX)", location: "Remote — Worldwide", type: "Contract", desc: "Design intuitive, beautiful interfaces for our AI tools. Experience with SaaS platforms, design systems, and dark/light mode theming preferred. You'll shape the experience for 50,000+ users." },
  { title: "Community Manager — Bangladesh", location: "Dhaka, Bangladesh", type: "Full-time", desc: "Grow and engage our user community across Bangladesh. Manage social media, organize AI events, build partnerships with universities and startups, and drive user adoption." },
  { title: "DevOps / Infrastructure Engineer", location: "Remote — Asia", type: "Full-time", desc: "Manage our cloud infrastructure, edge functions, and CI/CD pipelines. Experience with serverless architectures, CDN optimization, and database performance tuning required." },
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Careers at AI Sorix
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us build the world's most trusted multi-model AI workspace. Remote-first, global team, hiring across continents.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12 sm:mb-16 bg-card border border-border rounded-2xl p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            At AI Sorix, we're building a unified, zero-trust AI workspace that gives professionals, creators, researchers, and enterprises worldwide secure access to the best frontier models — GPT-5, Claude Sonnet 4.5, Gemini 3 Pro, DeepSeek V3.2, and more — through one privacy-first platform. We believe access to advanced AI should not be locked behind walled gardens or compromised by data privacy concerns. If you want to ship globally-relevant AI products that millions rely on, we want to hear from you.
          </p>
        </section>

        {/* Why Work Here */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Why Work at AI Sorix</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all">
                <b.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{job.desc}</p>
                <a href="mailto:support@aisorix.com?subject=Application%20—%20${encodeURIComponent(job.title)}" className="text-sm font-medium text-primary hover:underline">
                  Apply →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* General Application */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Don't see your role?</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            We're always looking for talented people to join our mission. Send your resume and portfolio — we'll keep you in mind for future opportunities.
          </p>
          <a href="mailto:support@aisorix.com?subject=General%20Application" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Mail className="w-4 h-4" /> support@aisorix.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;
