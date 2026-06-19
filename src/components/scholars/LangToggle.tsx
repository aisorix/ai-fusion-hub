import { Languages } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useScholarsLang();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 bg-card hover:bg-muted/50 text-xs font-semibold text-foreground transition-colors ${className}`}
    >
      <Languages className="w-3.5 h-3.5" />
      {lang === "bn" ? "EN" : "বাংলা"}
    </button>
  );
}
