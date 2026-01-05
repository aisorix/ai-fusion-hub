import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
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