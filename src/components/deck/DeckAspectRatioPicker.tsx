import React from 'react';
import { RectangleHorizontal, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DeckAspectRatio = '16:9' | '4:3' | '1:1';

interface Props {
  value: DeckAspectRatio;
  onChange: (v: DeckAspectRatio) => void;
}

const OPTIONS: { id: DeckAspectRatio; icon: React.ReactNode }[] = [
  { id: '16:9', icon: <RectangleHorizontal className="w-3.5 h-3.5" /> },
  { id: '4:3', icon: <RectangleHorizontal className="w-3.5 h-3.5" /> },
  { id: '1:1', icon: <Square className="w-3.5 h-3.5" /> },
];

const DeckAspectRatioPicker: React.FC<Props> = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {OPTIONS.map((o) => {
      const active = value === o.id;
      return (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'h-10 rounded-full border flex items-center justify-center gap-1.5 text-[12.5px] font-medium transition-colors',
            active
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground'
          )}
        >
          {o.icon}
          <span>{o.id}</span>
        </button>
      );
    })}
  </div>
);

export default DeckAspectRatioPicker;
