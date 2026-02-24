import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Paintbrush, Camera, Shapes, Box, PenLine, Sparkles } from 'lucide-react';

export type ArtStyle = 'illustration' | 'photo' | 'abstract' | '3d' | 'line-art' | 'custom';

interface DeckArtStylePickerProps {
  selected: ArtStyle;
  onSelect: (value: ArtStyle) => void;
  customStyle: string;
  onCustomStyleChange: (value: string) => void;
}

const styles: { id: ArtStyle; label: string; icon: React.ElementType; gradient: string }[] = [
  { id: 'illustration', label: 'Illustration', icon: Paintbrush, gradient: 'from-amber-400 to-orange-500' },
  { id: 'photo', label: 'Photo', icon: Camera, gradient: 'from-emerald-400 to-teal-500' },
  { id: 'abstract', label: 'Abstract', icon: Shapes, gradient: 'from-violet-400 to-purple-600' },
  { id: '3d', label: '3D', icon: Box, gradient: 'from-blue-400 to-indigo-500' },
  { id: 'line-art', label: 'Line Art', icon: PenLine, gradient: 'from-gray-400 to-gray-600' },
  { id: 'custom', label: 'Custom', icon: Sparkles, gradient: 'from-pink-400 to-rose-500' },
];

const DeckArtStylePicker: React.FC<DeckArtStylePickerProps> = ({
  selected,
  onSelect,
  customStyle,
  onCustomStyleChange,
}) => {
  return (
    <div className="w-full">
      <span className="text-xs text-muted-foreground mb-2 block">Image style:</span>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {styles.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 min-w-[72px] p-2.5 rounded-xl border-2 transition-all shrink-0',
                selected === s.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30 bg-card'
              )}
            >
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', s.gradient)}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className={cn(
                'text-[10px] font-medium',
                selected === s.id ? 'text-primary' : 'text-muted-foreground'
              )}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
      {selected === 'custom' && (
        <input
          value={customStyle}
          onChange={(e) => onCustomStyleChange(e.target.value)}
          placeholder="Describe your image style..."
          className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  );
};

export default DeckArtStylePicker;
