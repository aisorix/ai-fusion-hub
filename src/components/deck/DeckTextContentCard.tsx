import React from 'react';
import { cn } from '@/lib/utils';
import { AlignLeft } from 'lucide-react';
import type { TextContent } from './DeckTextContentPicker';

interface Props {
  selected: TextContent;
  onSelect: (v: TextContent) => void;
}

const OPTIONS: { id: TextContent; label: string; lines: number[] }[] = [
  { id: 'minimal',   label: 'Minimal',   lines: [60, 45] },
  { id: 'concise',   label: 'Concise',   lines: [70, 55, 40] },
  { id: 'detailed',  label: 'Detailed',  lines: [80, 65, 50, 35] },
  { id: 'extensive', label: 'Extensive', lines: [85, 70, 55, 40, 30] },
];

const DeckTextContentCard: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card/60 p-3.5 sm:p-5">
      <div className="flex items-center gap-2 mb-1">
        <AlignLeft className="w-4 h-4 text-primary" />
        <h3 className="text-[14px] font-semibold text-foreground">Text content</h3>
      </div>
      <p className="text-[11.5px] text-muted-foreground mb-3.5">Amount of text per card</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {OPTIONS.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'group flex flex-col items-center justify-between gap-3 px-3 py-3.5 rounded-xl border transition-all',
                active
                  ? 'border-primary bg-primary/5 shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]'
                  : 'border-border/60 bg-card hover:border-muted-foreground/40'
              )}
            >
              <div className="w-full flex-1 flex flex-col justify-center gap-1.5">
                {opt.lines.map((w, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full mx-auto transition-colors',
                      active ? 'bg-primary/70' : 'bg-muted-foreground/30'
                    )}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <span
                className={cn(
                  'text-[12px] font-medium',
                  active ? 'text-primary' : 'text-foreground/80'
                )}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeckTextContentCard;
