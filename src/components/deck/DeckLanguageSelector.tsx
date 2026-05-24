import React, { useEffect, useRef, useState } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type DeckLanguage =
  | 'auto' | 'english' | 'bangla' | 'hindi' | 'urdu'
  | 'arabic' | 'spanish' | 'french' | 'chinese' | 'japanese';

interface LangDef { id: DeckLanguage; label: string; native?: string; }

export const DECK_LANGUAGES: LangDef[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'english', label: 'English' },
  { id: 'bangla', label: 'Bangla', native: 'বাংলা' },
  { id: 'hindi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'urdu', label: 'Urdu', native: 'اردو' },
  { id: 'arabic', label: 'Arabic', native: 'العربية' },
  { id: 'spanish', label: 'Spanish', native: 'Español' },
  { id: 'french', label: 'French', native: 'Français' },
  { id: 'chinese', label: 'Chinese', native: '中文' },
  { id: 'japanese', label: 'Japanese', native: '日本語' },
];

interface Props {
  value: DeckLanguage;
  onChange: (v: DeckLanguage) => void;
}

const DeckLanguageSelector: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = DECK_LANGUAGES.find((l) => l.id === value) ?? DECK_LANGUAGES[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1.5 h-9 pl-3 pr-2.5 rounded-full border bg-card/60 transition-colors',
          'text-[12.5px] font-medium text-foreground',
          open ? 'border-primary/50 bg-card' : 'border-border/60 hover:bg-card'
        )}
      >
        <Languages className="w-3.5 h-3.5 text-primary" />
        <span className="truncate max-w-[140px]">{current.label}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 w-56 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl z-[100] py-1"
          >
            {DECK_LANGUAGES.map((l) => {
              const active = l.id === value;
              return (
                <button
                  key={l.id}
                  onClick={() => { onChange(l.id); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors',
                    active ? 'text-primary bg-primary/5' : 'text-foreground hover:bg-muted'
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{l.label}</span>
                    {l.native && (
                      <span className="text-[11px] text-muted-foreground truncate">{l.native}</span>
                    )}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckLanguageSelector;
