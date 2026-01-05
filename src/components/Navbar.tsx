import React from 'react';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-card shadow-lg py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Left */}
          <div>
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-black text-primary-foreground">AI</span>
              </div>
              <span className="text-xl font-bold text-foreground">AI Sorix</span>
            </a>
          </div>

          {/* Center Menu - Desktop */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <a href="#Features" className="text-muted-foreground hover:text-primary font-medium transition">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary font-medium transition">
              Pricing
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-primary font-medium transition">
              FAQs
            </a>
          </div>

          {/* Login button */}
          <div>
            <a
              href="https://chat.aifiesta.com"
              className="inline-flex items-center px-5 py-2 gradient-accent text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
