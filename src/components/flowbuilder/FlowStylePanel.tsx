import React from 'react';
import { Paintbrush } from 'lucide-react';

export interface ColorTheme {
  id: string;
  name: string;
  colors: string[];
}

export const colorThemes: ColorTheme[] = [
  { id: 'default', name: 'Default', colors: ['#4F46E5', '#7C3AED', '#EC4899'] },
  { id: 'dark', name: 'Dark', colors: ['#1E293B', '#334155', '#64748B'] },
  { id: 'forest', name: 'Forest', colors: ['#15803D', '#22C55E', '#86EFAC'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0369A1', '#0EA5E9', '#7DD3FC'] },
  { id: 'sunset', name: 'Sunset', colors: ['#DC2626', '#F97316', '#FBBF24'] },
  { id: 'neon', name: 'Neon', colors: ['#A855F7', '#EC4899', '#06B6D4'] },
  { id: 'corporate', name: 'Corporate', colors: ['#1E40AF', '#3B82F6', '#93C5FD'] },
  { id: 'pastel', name: 'Pastel', colors: ['#F9A8D4', '#C4B5FD', '#A5F3FC'] },
];

interface FlowStylePanelProps {
  selectedTheme: string;
  onSelectTheme: (id: string) => void;
}

const FlowStylePanel: React.FC<FlowStylePanelProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Paintbrush className="w-3.5 h-3.5 text-violet-500" />
        <span className="text-xs font-medium text-muted-foreground">Color Theme</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {colorThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              selectedTheme === theme.id
                ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                : 'border-border/50 bg-muted/20 text-muted-foreground hover:border-border'
            }`}
          >
            <div className="flex gap-0.5">
              {theme.colors.map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlowStylePanel;
