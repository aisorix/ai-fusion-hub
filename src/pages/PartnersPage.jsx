import React from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Handshake, GraduationCap, Building2, Rocket, Globe } from "lucide-react";

const partnerTypes = [
  {
    icon: GraduationCap,
    title: "Education Partners",
    desc: "Schools, universities, and ed-tech organizations in Bangladesh and Asia can integrate AI Sorix to enhance learning outcomes with AI-powered tools.",
  },
  {
    icon: Building2,
    title: "Enterprise Partners",
    desc: "Businesses can leverage AI Sorix's multi-model AI platform to boost team productivity, automate workflows, and accelerate content creation.",
  },
  {
    icon: Rocket,
    title: "Startup Partners",
    desc: "Early-stage startups in Asia get special access to AI Sorix tools and dedicated support to build AI-powered products and services.",
  },
  {
    icon: Globe,
    title: "Regional Distributors",
    desc: "Become an AI Sorix distribution partner in your country. Help us bring world-class AI to every corner of Asia and beyond.",
  },
];

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Partners | AI Sorix - AI Partnership Program in Bangladesh & Asia"
        description="Partner with AI Sorix to bring AI-powered solutions to education, enterprise, and startups across Bangladesh and Asia. Join our growing partner ecosystem."
        path="/partners"
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Partner with AI Sorix
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our partner ecosystem and help bring AI innovation to Bangladesh, Asia, and the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {partnerTypes.map((type, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <type.icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">{type.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <Handshake className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Become a Partner</h2>
          <p className="text-sm text-muted-foreground mb-4">Interested in partnering with AI Sorix? Reach out and let's explore how we can work together.</p>
          <a href="mailto:partners@aisorix.com" className="text-sm font-medium text-primary hover:underline">partners@aisorix.com</a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersPage;
