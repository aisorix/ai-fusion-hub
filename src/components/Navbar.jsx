import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-xl font-black text-primary-foreground">AI</span>
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">AI Sorix</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#Features" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
              Pricing
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
              FAQs
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://chat.aifiesta.com"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-muted hover:bg-muted/80 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-in slide-in-from-top-2">
            <a href="#Features" className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition">
              Features
            </a>
            <a href="#pricing" className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition">
              Pricing
            </a>
            <a href="#faq" className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition">
              FAQs
            </a>
            <a
              href="https://chat.aifiesta.com"
              className="block w-full text-center py-3 gradient-accent text-primary-foreground font-semibold rounded-xl"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
