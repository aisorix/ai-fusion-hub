import React from 'react';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background py-16 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Logo + Email */}
          <div className="text-center md:text-left">
            {/* Logo */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-black text-primary-foreground">AI</span>
              </div>
              <span className="text-3xl font-bold text-foreground">AI Fiesta</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-6 h-6 text-muted-foreground" />
              <a href="mailto:support@aifiesta.ai" className="text-lg text-muted-foreground hover:text-primary transition">
                support@aifiesta.ai
              </a>
            </div>
          </div>

          {/* Right: Links + Copyright */}
          <div className="text-center md:text-right">
            {/* Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-8 mb-6">
              <a href="https://chat.aifiesta.ai/privacy" target="_blank" rel="noopener noreferrer"
                 className="text-muted-foreground hover:text-primary font-medium transition">
                Privacy Policy
              </a>
              <a href="https://chat.aifiesta.ai/terms" target="_blank" rel="noopener noreferrer"
                 className="text-muted-foreground hover:text-primary font-medium transition">
                Terms & Conditions
              </a>
            </div>

            {/* Copyright */}
            <p className="text-muted-foreground">
              © 2025 AI Fiesta. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
