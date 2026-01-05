import React from 'react';
import { Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="AI Sorix" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-bold text-foreground">AI Sorix</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t('product')}</h4>
            <ul className="space-y-4">
              <li>
                <a href="#Features" className="text-muted-foreground hover:text-primary transition-colors">{t('features')}</a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">{t('pricing')}</a>
              </li>
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t('faqs')}</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('changelog')}</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t('legal')}</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://chat.aifiesta.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="https://chat.aifiesta.ai/terms" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('cookiePolicy')}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 AI Sorix. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:support@aisorix.com" className="hover:text-primary transition-colors">
              support@aisorix.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
