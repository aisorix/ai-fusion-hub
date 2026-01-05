import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative py-10 md:py-20 overflow-hidden bg-background">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
        {/* Date + Tag */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 text-sm text-muted-foreground">
          <time dateTime="2025-11-17" className="font-medium">November 17, 2025</time>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <a href="#" className="text-foreground hover:text-primary transition">
            Service
          </a>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight max-w-6xl mx-auto">
          Introducing AI Sorix
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Stop wasting time and money on multiple AI subscriptions. With AI Sorix, you unlock unlimited access to top-tier AI models under one smart, affordable platform — starting at ৳499/month for Basic and ৳999/month for Premium. Get more power, more productivity, and more value than any single premium AI service can offer.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://chatgpt"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 gradient-accent text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition transform hover:scale-105 shadow-xl"
          >
            Get Started Now
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </a>
        </div>

        {/* Small note */}
        <p className="mt-4 text-muted-foreground text-sm">
          Get smarter, more precise answers—every time.
        </p>
      </div>
    </div>
  );
};

export default Hero;
