import React from 'react';

const aiModels = [
  {
    title: "ChatGPT 5",
    subtitle: "All Rounder Explainer",
    desc: "Great for questions, brainstorming, and clear step-by-step explanations"
  },
  {
    title: "Claude Sonnet 4",
    subtitle: "Co-Writing Master",
    desc: "Refines polished emails, essays, and scripts while keeping your style."
  },
  {
    title: "Gemini 2.5 Pro",
    subtitle: "Long Context Master",
    desc: "Handles long documents and images, tracking full context and details."
  },
  {
    title: "Perplexity Sonar Pro",
    subtitle: "Live Web Researcher",
    desc: "Delivers fresh answers and news from credible, real-time sources."
  },
  {
    title: "DeepSeek",
    subtitle: "Reasoning Specialist",
    desc: "Excels at logic, math, and coding with clear, detailed solutions."
  },
  {
    title: "Grok 4",
    subtitle: "Creative Powerhouse",
    desc: "Bold, unconventional ideas and punchy copy for trend-focused content."
  }
];

export default function Workflow() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Pick the best characteristics<br className="hidden sm:block" />
            of each AI model
          </h2>
        </div>

        {/* Main Container */}
        <div className="relative bg-card rounded-3xl shadow-lg overflow-hidden">
          {/* Background Decorative Circle */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <div className="w-96 h-96 gradient-primary rounded-full blur-3xl"></div>
          </div>

          {/* Center Big Logo */}
          <div className="relative z-10 flex justify-center py-12">
            <div className="w-24 h-24 md:w-32 md:h-32 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl md:text-5xl font-black text-primary-foreground">AI</span>
            </div>
          </div>

          {/* AI Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-16">
            {aiModels.map((model, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-primary-foreground">{model.title[0]}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{model.title}</h3>
                <p className="text-primary font-semibold mb-1">{model.subtitle}</p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {model.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
