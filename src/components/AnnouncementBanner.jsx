import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-1.5">
        <div className="flex items-center justify-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-primary/30 bg-primary/5 text-primary">
            Built by Sorixlab
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'New: Now with Grok 4 & Claude Sonnet 4' 
              : 'নতুন: এখন Grok 4 এবং Claude Sonnet 4 সহ'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;