import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20">
      <div className="flex justify-center">
        <div
          className="flex items-center gap-1.5 
          px-3 sm:px-4 py-1 sm:py-1.5   /* smaller padding on mobile */
          rounded-full
          bg-white/20 dark:bg-gray-800/30
          backdrop-blur-lg
          shadow-md hover:shadow-lg
          text-[9px] sm:text-[10px]  /* smaller font on mobile */
          transition-all duration-300"
        >
          <Link
            to="/about-sorix-lab"
            className="inline-flex items-center px-2 py-0.5 
              rounded-full text-[8px] sm:text-[10px] font-medium  /* smaller font on mobile */
              bg-primary/10 dark:bg-primary/20 text-primary
              hover:bg-primary/20 dark:hover:bg-primary/30 transition"
          >
            Built by Sorixlab
          </Link>

          <span className="hidden sm:inline-flex h-1 w-1 rounded-full bg-primary" />

          <span className="whitespace-nowrap text-foreground/80 dark:text-foreground/70">
            {language === "en" ? "New: Grok 4.1 & Claude Opus 4.5" : "নতুন: Grok 4.1 ও Claude Opus 4.5"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
