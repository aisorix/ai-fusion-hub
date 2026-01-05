import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border border-primary/30 bg-primary/5 text-primary whitespace-nowrap">
            Built by Sorixlab
          </span>
          <span className="relative flex h-1.5 w-1.5 hidden sm:flex">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground text-center">
            {language === 'en' 
              ? 'New: Grok 4 & Claude Sonnet 4' 
              : 'নতুন: Grok 4 ও Claude Sonnet 4'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;