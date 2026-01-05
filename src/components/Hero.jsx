import React from 'react';
import { ArrowUpRight, Sparkles, Zap, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">New: Now with Grok 4 & Claude Sonnet 4</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-tight tracking-tight max-w-5xl mx-auto">
          <span className="text-foreground">All Premium AI in</span>
          <br />
          <span className="text-gradient-primary">One Powerful Platform</span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
          Stop juggling multiple AI subscriptions. Get ChatGPT 5, Claude, Gemini, DeepSeek, Grok & Perplexity — all in one place for a fraction of the cost.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://chat.aifiesta.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 gradient-accent text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-accent/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            Start Free Trial
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg border-2 border-border hover:border-primary/50 hover:bg-card transition-all duration-300"
          >
            View Pricing
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">3M+ Tokens/Month</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">6 Premium AI Models</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">100% Secure & Private</span>
          </div>
        </div>

        {/* AI Model Logos */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-6">
          {['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Grok', 'Perplexity'].map((name, i) => (
            <div
              key={name}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">{name[0]}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
