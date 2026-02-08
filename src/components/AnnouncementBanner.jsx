import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const AnnouncementBanner = () => {
  const { language } = useLanguage();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1
        rounded-full border border-primary/20 
        bg-background/90 backdrop-blur-sm shadow-sm
        text-[10px] sm:text-xs
        hover:shadow-md transition-all duration-200"
      >
        <Link
          to="/about-sorix-lab"
          className="inline-flex items-center px-2 py-0.5 
            rounded-full text-[9px] sm:text-[10px] font-medium
            border border-primary/30 bg-primary/10 text-primary
            hover:bg-primary/20 hover:border-primary/40 transition"
        >
          Built by Sorixlab
        </Link>

        <span className="hidden sm:inline-flex h-1 w-1 rounded-full bg-primary" />

        <span className="whitespace-nowrap text-foreground/80">
          {language === "en" ? "New: Grok 4.1 & Claude Opus 4.5" : "নতুন: Grok 4.1 ও Claude Opus 4.5"}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
