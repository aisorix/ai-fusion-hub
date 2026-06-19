import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type ScholarsLang = "bn" | "en";

interface Ctx {
  lang: ScholarsLang;
  setLang: (l: ScholarsLang) => void;
  toggle: () => void;
  t: (bn: string, en: string) => string;
}

const ScholarsI18nContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "scholars_lang";

export function ScholarsI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<ScholarsLang>("bn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ScholarsLang | null;
      if (saved === "bn" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: ScholarsLang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(() => setLang(lang === "bn" ? "en" : "bn"), [lang, setLang]);
  const t = useCallback((bn: string, en: string) => (lang === "bn" ? bn : en), [lang]);

  return (
    <ScholarsI18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </ScholarsI18nContext.Provider>
  );
}

export function useScholarsLang() {
  const ctx = useContext(ScholarsI18nContext);
  if (!ctx) throw new Error("useScholarsLang must be used inside ScholarsI18nProvider");
  return ctx;
}
