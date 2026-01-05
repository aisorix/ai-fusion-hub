import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-cyan-500/10 via-primary/10 to-blue-500/10 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-muted-foreground">
            {language === 'en' 
              ? 'Built by' 
              : 'নির্মাতা'}
          </span>
          <a 
            href="https://sorixlab.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sorixlab
          </a>
          <span className="text-muted-foreground hidden sm:inline">
            {language === 'en' 
              ? '— Innovating AI Solutions for Bangladesh' 
              : '— বাংলাদেশের জন্য AI সমাধান উদ্ভাবন'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
