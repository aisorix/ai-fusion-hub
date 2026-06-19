import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
const AnnouncementBanner = () => {
  const { language, t } = useLanguage();

  return (
    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[95%]">
      <div className="flex justify-center">
        <div
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5
          rounded-full
          bg-white/20 dark:bg-gray-800/30
          backdrop-blur-lg
          shadow-md hover:shadow-lg
          text-[9px] sm:text-xs
          transition-all duration-300
          whitespace-nowrap"
        >
          <Link
            to="/about-sorix-lab"
            className="inline-flex items-center px-1.5 sm:px-2 py-0.5 
              rounded-full text-[8px] sm:text-[10px] font-medium
              bg-primary/10 dark:bg-primary/20 text-primary
              hover:bg-primary/20 dark:hover:bg-primary/30 transition"
          >
            {t("builtBySorixlab")}
          </Link>

          <span className="h-1 w-1 rounded-full bg-primary" />

          <span className="text-foreground/80 dark:text-foreground/70">
            {language === "en" ? "New: Deepseek V4 & Claude Opus 4.8" : "নতুন: Deepseek V4 & Claude Opus 4.8"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
