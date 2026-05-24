import React from 'react';
import { Presentation, Globe, FileText, Smartphone, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DeckFormat = 'presentation' | 'webpage' | 'document' | 'social';

interface Props {
  value: DeckFormat;
  onChange: (v: DeckFormat) => void;
}

const OPTIONS: { id: DeckFormat; label: string; icon: React.ReactNode }[] = [
  { id: 'presentation', label: 'Presentation', icon: <Presentation className="w-5 h-5" /> },
  { id: 'webpage', label: 'Webpage', icon: <Globe className="w-5 h-5" /> },
  { id: 'document', label: 'Document', icon: <FileText className="w-5 h-5" /> },
  { id: 'social', label: 'Social', icon: <Smartphone className="w-5 h-5" /> },
];

const DeckFormatPicker: React.FC<Props> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-2">
    {OPTIONS.map((o) => {
      const active = value === o.id;
      return (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all',
            active
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border bg-card hover:border-muted-foreground/30 text-foreground'
          )}
        >
          <span className={cn(
            'absolute top-2 left-2 w-4 h-4 rounded-full border flex items-center justify-center',
            active ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
          )}>
            {active && <Check className="w-2.5 h-2.5" />}
          </span>
          <span className={cn(active ? 'text-primary' : 'text-muted-foreground')}>{o.icon}</span>
          <span className="text-[12px] font-medium">{o.label}</span>
        </button>
      );
    })}
  </div>
);

export default DeckFormatPicker;
