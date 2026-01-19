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
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background backdrop-blur-xl shadow-lg border-b border-border/50' 
          : 'bg-background border-b border-border/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 sm:gap-3 group relative z-10">
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
              <a href="#about" className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
                {t('aboutUs')}
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
                  <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[120px] z-[60]">
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
            <div className="flex lg:hidden items-center gap-2 relative z-10">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-muted/80 hover:bg-muted border border-border/50 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Rendered outside nav for proper z-index */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="lg:hidden fixed inset-x-0 top-0 z-[101] animate-slide-in-right">
            <div className="bg-background border-b border-border shadow-2xl max-h-[85vh] overflow-y-auto rounded-b-3xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="AI Sorix" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-bold text-gradient-primary">AI Sorix</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-muted/80 hover:bg-muted border border-border/50 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="px-5 py-6">
                {/* Navigation Links */}
                <div className="space-y-1">
                  <a 
                    href="#Features" 
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition-all text-base border border-transparent hover:border-border/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    {t('features')}
                  </a>
                  <a 
                    href="#pricing" 
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition-all text-base border border-transparent hover:border-border/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    {t('pricing')}
                  </a>
                  <a 
                    href="#faq" 
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition-all text-base border border-transparent hover:border-border/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    {t('faqs')}
                  </a>
                  <a 
                    href="#about" 
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition-all text-base border border-transparent hover:border-border/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    {t('aboutUs')}
                  </a>
                </div>
                
                {/* Divider */}
                <div className="h-px bg-border my-5" />
                
                {/* Language Toggle */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Language</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${language === 'en' ? 'gradient-primary text-foreground shadow-md' : 'bg-background text-foreground border border-border hover:bg-muted'}`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => setLanguage('bn')}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${language === 'bn' ? 'gradient-primary text-foreground shadow-md' : 'bg-background text-foreground border border-border hover:bg-muted'}`}
                    >
                      🇧🇩 বাংলা
                    </button>
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="space-y-3 mt-6">
                  <Link
                    to="/login"
                    className="block w-full text-center py-3.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center py-3.5 gradient-primary text-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;