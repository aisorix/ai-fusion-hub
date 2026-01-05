import React from 'react';

const aiModels = [
  {
    title: "ChatGPT 5",
    subtitle: "All Rounder Explainer",
    desc: "Great for questions, brainstorming, and clear step-by-step explanations",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Claude Sonnet 4",
    subtitle: "Co-Writing Master",
    desc: "Refines polished emails, essays, and scripts while keeping your style.",
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Gemini 2.5 Pro",
    subtitle: "Long Context Master",
    desc: "Handles long documents and images, tracking full context and details.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Perplexity Sonar",
    subtitle: "Live Web Researcher",
    desc: "Delivers fresh answers and news from credible, real-time sources.",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "DeepSeek R1",
    subtitle: "Reasoning Specialist",
    desc: "Excels at logic, math, and coding with clear, detailed solutions.",
    color: "from-violet-500 to-purple-500"
  },
  {
    title: "Grok 4",
    subtitle: "Creative Powerhouse",
    desc: "Bold, unconventional ideas and punchy copy for trend-focused content.",
    color: "from-cyan-500 to-blue-500"
  }
];

const Workflow = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
            AI Models
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Pick the Best of
            <br className="hidden sm:block" />
            <span className="text-gradient-primary">Each AI Model</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every AI has its superpower. Combine them all for unstoppable results.
          </p>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl md:text-5xl font-black text-primary-foreground">AI</span>
            </div>
            {/* Orbiting dots */}
            <div className="absolute -inset-8 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2" />
            </div>
            <div className="absolute -inset-12 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-secondary rounded-full -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* AI Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {aiModels.map((model, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1"
            >
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${model.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl font-bold text-primary-foreground">{model.title[0]}</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">{model.title}</h3>
              <p className="text-primary font-semibold text-sm mb-3">{model.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed">
                {model.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
