import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type DeckTheme =
  | 'dark' | 'cyan-blue' | 'minimalist' | 'sunset'
  | 'pearl' | 'vortex' | 'clementa' | 'stratos'
  | 'nova' | 'twilight' | 'creme' | 'lux'
  | 'marine' | 'consultant' | 'lavender' | 'indigo'
  | 'gamma' | 'founder' | 'atmosphere' | 'blueberry'
  | 'sage' | 'coal';

interface DeckThemePickerProps {
  selected: DeckTheme;
  onSelect: (theme: DeckTheme) => void;
}

interface ThemeDef {
  id: DeckTheme;
  label: string;
  bg: string;
  cardBg: string;
  titleColor: string;
  bodyColor: string;
}

const themes: ThemeDef[] = [
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

const DeckThemePicker: React.FC<DeckThemePickerProps> = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const selectedTheme = themes.find((t) => t.id === selected);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-xs">
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Theme:</span>
          <span className="font-medium text-foreground">{selectedTheme?.label || 'Dark'}</span>
          <div className={cn('w-4 h-4 rounded', selectedTheme?.bg || 'bg-gray-900')} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { onSelect(t.id); setOpen(false); }}
              className={cn(
                'relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02]',
                selected === t.id ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-muted-foreground/40'
              )}
            >
              {/* Mini preview */}
              <div className={cn('p-3 aspect-[4/3]', t.bg)}>
                <div className={cn('rounded-lg p-2.5 h-full flex flex-col gap-1.5', t.cardBg)}>
                  <div className={cn('text-xs font-bold truncate', t.titleColor)}>Title</div>
                  <div className={cn('text-[9px] leading-tight', t.bodyColor)}>Body text goes here with supporting details</div>
                  <div className="flex gap-1 mt-auto">
                    <div className={cn('h-1 w-6 rounded-full opacity-40', t.titleColor === 'text-white' ? 'bg-white' : 'bg-gray-400')} />
                    <div className={cn('h-1 w-4 rounded-full opacity-20', t.titleColor === 'text-white' ? 'bg-white' : 'bg-gray-400')} />
                  </div>
                </div>
              </div>
              {/* Label */}
              <div className="px-2.5 py-1.5 text-[11px] font-medium text-foreground bg-card text-center">
                {t.label}
              </div>
              {/* Check */}
              {selected === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeckThemePicker;
