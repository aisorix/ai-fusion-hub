import React, { useState } from 'react';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img src={logo} alt="AI Sorix" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-foreground tracking-tight">AI Sorix</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
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

          {/* Right Side: Language + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'বাং'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[120px]">
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
            <a
              href="https://chat.aifiesta.com/login"
              className="px-5 py-2.5 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
            >
              {t('login')}
            </a>

            {/* Register Button */}
            <a
              href="https://chat.aifiesta.com/register"
              className="px-5 py-2.5 gradient-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {t('register')}
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
              {t('features')}
            </a>
            <a href="#pricing" className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition">
              {t('pricing')}
            </a>
            <a href="#faq" className="block py-3 px-4 rounded-xl hover:bg-muted text-foreground font-medium transition">
              {t('faqs')}
            </a>
            
            {/* Language Toggle Mobile */}
            <div className="flex items-center gap-2 px-4 py-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'bn' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
              >
                বাং
              </button>
            </div>

            <div className="flex gap-3 px-4">
              <a
                href="https://chat.aifiesta.com/login"
                className="flex-1 text-center py-3 border border-border text-foreground font-medium rounded-xl"
              >
                {t('login')}
              </a>
              <a
                href="https://chat.aifiesta.com/register"
                className="flex-1 text-center py-3 gradient-primary text-primary-foreground font-semibold rounded-xl"
              >
                {t('register')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
