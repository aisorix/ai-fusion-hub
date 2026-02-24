import React from 'react';
import { cn } from '@/lib/utils';

export type DeckTheme = 'dark' | 'cyan-blue' | 'minimalist' | 'sunset';

interface DeckThemePickerProps {
  selected: DeckTheme;
  onSelect: (theme: DeckTheme) => void;
}

const themes: { id: DeckTheme; label: string; colors: string }[] = [
  { id: 'dark', label: 'Dark', colors: 'bg-gradient-to-br from-gray-900 to-gray-800' },
  { id: 'cyan-blue', label: 'Cyan Blue', colors: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
  { id: 'minimalist', label: 'Minimal', colors: 'bg-white border border-gray-300' },
  { id: 'sunset', label: 'Sunset', colors: 'bg-gradient-to-br from-orange-400 to-purple-600' },
];

const DeckThemePicker: React.FC<DeckThemePickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Theme:</span>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={cn(
            'w-7 h-7 rounded-lg transition-all',
            t.colors,
            selected === t.id
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
              : 'hover:scale-105 opacity-70 hover:opacity-100'
          )}
          title={t.label}
        />
      ))}
    </div>
  );
};

export default DeckThemePicker;
