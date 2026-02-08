import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="flex justify-center">
      <div
        className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 
        rounded-full border border-primary/20 
        bg-background/80 backdrop-blur-md shadow-md
        hover:shadow-lg transition-all duration-200"
      >
        <Link
          to="/about-sorix-lab"
          className="inline-flex items-center px-2 py-0.5 
            rounded-full text-[10px] sm:text-xs font-medium
            border border-primary/30 bg-primary/5 text-primary
            hover:bg-primary/10 hover:border-primary/50 transition"
        >
          Built by Sorixlab
        </Link>

        <span className="hidden sm:inline-flex h-1.5 w-1.5 rounded-full bg-primary" />

        <span className="text-xs sm:text-sm text-foreground/80 whitespace-nowrap">
          {language === "en" ? "New: Grok 4.1 & Claude Opus 4.5" : "নতুন: Grok 4.1 ও Claude Opus 4.5"}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
