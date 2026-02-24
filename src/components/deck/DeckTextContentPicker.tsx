import React from 'react';
import { cn } from '@/lib/utils';

export type TextContent = 'minimal' | 'concise' | 'detailed' | 'extensive';

interface DeckTextContentPickerProps {
  selected: TextContent;
  onSelect: (value: TextContent) => void;
}

const options: { id: TextContent; label: string; lines: number[] }[] = [
  { id: 'minimal', label: 'Minimal', lines: [60, 45] },
  { id: 'concise', label: 'Concise', lines: [70, 55, 40] },
  { id: 'detailed', label: 'Detailed', lines: [80, 65, 50, 35] },
  { id: 'extensive', label: 'Extensive', lines: [85, 70, 55, 40, 30] },
];

const DeckTextContentPicker: React.FC<DeckTextContentPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full">
      <span className="text-xs text-muted-foreground mb-2 block">Text content:</span>
      <div className="grid grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
              selected === opt.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/30 bg-card'
            )}
          >
            {/* Visual lines */}
            <div className="w-full space-y-1.5 mb-1">
              <div className="h-2 w-8 rounded bg-muted-foreground/30 mx-auto" />
              {opt.lines.map((w, i) => (
                <div
                  key={i}
                  className="h-1 rounded bg-muted-foreground/20 mx-auto"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <span className={cn(
              'text-[10px] font-medium',
              selected === opt.id ? 'text-primary' : 'text-muted-foreground'
            )}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeckTextContentPicker;
