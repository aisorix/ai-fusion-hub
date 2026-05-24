import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Palette, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DeckTheme } from './DeckThemePicker';

interface ThemeDef {
  id: DeckTheme;
  label: string;
  bg: string;
  cardBg: string;
  titleColor: string;
  bodyColor: string;
}

// Same definitions as DeckThemePicker — kept here so the showcase is self-contained.
export const DECK_THEMES: ThemeDef[] = [
  { id: 'dark', label: 'Dark', bg: 'bg-gray-900', cardBg: 'bg-gray-800', titleColor: 'text-white', bodyColor: 'text-gray-400' },
  { id: 'cyan-blue', label: 'Cyan Blue', bg: 'bg-gradient-to-br from-cyan-600 to-blue-700', cardBg: 'bg-white/10', titleColor: 'text-white', bodyColor: 'text-cyan-200' },
  { id: 'minimalist', label: 'Minimalist', bg: 'bg-white', cardBg: 'bg-gray-50', titleColor: 'text-gray-900', bodyColor: 'text-gray-500' },
  { id: 'sunset', label: 'Sunset', bg: 'bg-gradient-to-br from-orange-500 to-purple-700', cardBg: 'bg-white/10', titleColor: 'text-white', bodyColor: 'text-orange-200' },
  { id: 'pearl', label: 'Pearl', bg: 'bg-gray-100', cardBg: 'bg-white border border-gray-200', titleColor: 'text-gray-900', bodyColor: 'text-gray-500' },
  { id: 'vortex', label: 'Vortex', bg: 'bg-black', cardBg: 'bg-gray-900', titleColor: 'text-white', bodyColor: 'text-gray-400' },
  { id: 'clementa', label: 'Clementa', bg: 'bg-amber-100', cardBg: 'bg-amber-50', titleColor: 'text-amber-800', bodyColor: 'text-amber-600' },
  { id: 'stratos', label: 'Stratos', bg: 'bg-slate-900', cardBg: 'bg-slate-800', titleColor: 'text-white', bodyColor: 'text-slate-300' },
  { id: 'nova', label: 'Nova', bg: 'bg-gradient-to-br from-blue-500 to-purple-500', cardBg: 'bg-white', titleColor: 'text-gray-900', bodyColor: 'text-gray-500' },
  { id: 'twilight', label: 'Twilight', bg: 'bg-gradient-to-br from-rose-200 to-slate-400', cardBg: 'bg-white/80', titleColor: 'text-rose-900', bodyColor: 'text-rose-700' },
  { id: 'creme', label: 'Creme', bg: 'bg-stone-200', cardBg: 'bg-stone-100', titleColor: 'text-stone-800', bodyColor: 'text-stone-500' },
  { id: 'lux', label: 'Lux', bg: 'bg-teal-900', cardBg: 'bg-teal-800', titleColor: 'text-emerald-200', bodyColor: 'text-emerald-400' },
  { id: 'marine', label: 'Marine', bg: 'bg-teal-800', cardBg: 'bg-teal-700', titleColor: 'text-white', bodyColor: 'text-teal-200' },
  { id: 'consultant', label: 'Consultant', bg: 'bg-gray-100', cardBg: 'bg-white', titleColor: 'text-gray-800', bodyColor: 'text-gray-500' },
  { id: 'lavender', label: 'Lavender', bg: 'bg-violet-200', cardBg: 'bg-white', titleColor: 'text-violet-900', bodyColor: 'text-violet-600' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-900', cardBg: 'bg-indigo-800', titleColor: 'text-white', bodyColor: 'text-indigo-300' },
  { id: 'gamma', label: 'Gamma', bg: 'bg-rose-50', cardBg: 'bg-white', titleColor: 'text-orange-600', bodyColor: 'text-gray-600' },
  { id: 'founder', label: 'Founder', bg: 'bg-purple-900', cardBg: 'bg-gray-700', titleColor: 'text-white', bodyColor: 'text-gray-300' },
  { id: 'atmosphere', label: 'Atmosphere', bg: 'bg-gradient-to-br from-pink-300 to-pink-500', cardBg: 'bg-white', titleColor: 'text-pink-600', bodyColor: 'text-pink-400' },
  { id: 'blueberry', label: 'Blueberry', bg: 'bg-purple-900', cardBg: 'bg-purple-800', titleColor: 'text-white', bodyColor: 'text-purple-300' },
  { id: 'sage', label: 'Sage', bg: 'bg-green-100', cardBg: 'bg-white', titleColor: 'text-green-900', bodyColor: 'text-green-600' },
  { id: 'coal', label: 'Coal', bg: 'bg-teal-900', cardBg: 'bg-gray-800', titleColor: 'text-white', bodyColor: 'text-gray-400' },
];

const POPULAR_IDS: DeckTheme[] = ['minimalist', 'gamma', 'vortex'];

interface Props {
  selected: DeckTheme;
  onSelect: (t: DeckTheme) => void;
}

const ThemeCard: React.FC<{ t: ThemeDef; selected: boolean; onSelect: () => void; size?: 'lg' | 'sm' }> = ({ t, selected, onSelect, size = 'lg' }) => (
  <button
    onClick={onSelect}
    className={cn(
      'relative rounded-xl overflow-hidden border-2 transition-all text-left bg-card',
      selected ? 'border-primary ring-2 ring-primary/30' : 'border-border/60 hover:border-muted-foreground/40'
    )}
  >
    <div className={cn('p-3 aspect-[4/3]', t.bg)}>
      <div className={cn('rounded-lg h-full flex flex-col justify-center px-4 py-3 gap-1', t.cardBg)}>
        <div className={cn('font-bold leading-none', t.titleColor, size === 'lg' ? 'text-base sm:text-lg' : 'text-sm')}>
          Title
        </div>
        <div className={cn('text-[11px] leading-tight', t.bodyColor)}>Body &amp; link</div>
      </div>
    </div>
    <div className={cn(
      'px-3 py-2 text-[12px] font-medium text-center bg-card flex items-center justify-center gap-1.5',
      selected ? 'text-primary' : 'text-foreground/80'
    )}>
      {selected && <Check className="w-3.5 h-3.5" />}
      <span>{t.label}</span>
    </div>
  </button>
);

const DeckThemeShowcase: React.FC<Props> = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  // Build the visible row: always 3 cards. Ensure the selected theme appears if not in popular.
  const visibleIds = (() => {
    const ids = [...POPULAR_IDS];
    if (!ids.includes(selected)) ids[ids.length - 1] = selected;
    return ids;
  })();
  const visible = visibleIds.map((id) => DECK_THEMES.find((t) => t.id === id)!).filter(Boolean);

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card/60 p-3.5 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <ImageIcon className="w-4 h-4 text-primary" />
          <h3 className="text-[14px] font-semibold text-foreground truncate">Visuals</h3>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border/60 bg-card hover:bg-muted transition-colors text-[12px] font-medium text-foreground"
        >
          <Palette className="w-3.5 h-3.5 text-primary" />
          View more
        </button>
      </div>
      <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <span className="font-medium text-foreground/70">Theme</span>
        <span>—</span>
        <span className="truncate">Use one of our popular themes below or view more</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {visible.map((t) => (
          <ThemeCard
            key={t.id}
            t={t}
            selected={selected === t.id}
            onSelect={() => onSelect(t.id)}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Theme</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {DECK_THEMES.map((t) => (
              <ThemeCard
                key={t.id}
                t={t}
                selected={selected === t.id}
                onSelect={() => { onSelect(t.id); setOpen(false); }}
                size="sm"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeckThemeShowcase;
