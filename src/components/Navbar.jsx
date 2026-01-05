import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const langRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-gradient-to-r from-background/80 via-background/70 to-background/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-primary/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
        : 'bg-gradient-to-r from-background/50 via-background/40 to-background/50 backdrop-blur-xl border-b border-white/5'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group">
            <img src={logo} alt="AI Sorix" className="w-9 h-9 sm:w-12 sm:h-12 object-contain" />
            <span className="text-lg sm:text-2xl font-bold text-gradient-primary tracking-tight">AI Sorix</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <a href="#Features" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
              {t('features')}
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
              {t('pricing')}
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
              {t('faqs')}
            </a>
          </div>

          {/* Right Side: Theme + Language + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'বাং'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[120px] z-50">
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 ${language === 'en' ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => { setLanguage('bn'); setLangDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 ${language === 'bn' ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                  >
                    🇧🇩 বাংলা
                  </button>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="px-5 py-2.5 border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition-all duration-300"
            >
              {t('login')}
            </Link>

            {/* Register Button */}
            <Link
              to="/register"
              className="px-5 py-2.5 gradient-primary text-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {t('register')}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-background/95 backdrop-blur-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">
              {/* Navigation Links */}
              <div className="space-y-2">
                <a 
                  href="#Features" 
                  className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('features')}
                </a>
                <a 
                  href="#pricing" 
                  className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('pricing')}
                </a>
                <a 
                  href="#faq" 
                  className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('faqs')}
                </a>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-border my-4" />
              
              {/* Language Toggle */}
              <div className="flex items-center gap-3 px-4 py-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Language:</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${language === 'en' ? 'gradient-primary text-foreground' : 'bg-muted text-foreground'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${language === 'bn' ? 'gradient-primary text-foreground' : 'bg-muted text-foreground'}`}
                >
                  বাং
                </button>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Auth Buttons */}
              <div className="space-y-3 mt-6">
                <Link
                  to="/login"
                  className="block w-full text-center py-3.5 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-3.5 gradient-primary text-foreground font-semibold rounded-xl shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('register')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;