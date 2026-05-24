import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LayoutGrid } from 'lucide-react';
import ImagineHistoryFeed from './ImagineHistoryFeed';
import ImagineTemplates, { TEMPLATE_COUNT } from './ImagineTemplates';
import type { ImageGeneration } from '@/services/imagineApi';
import type { AspectRatio, Resolution } from './ImagineOptionsPanel';

interface Props {
  onSelectHistory: (gen: ImageGeneration) => void;
  refreshHistory: number;
  onUseTemplate: (prompt: string, aspect?: AspectRatio, resolution?: Resolution, sampleUrl?: string) => void;
}

type Tab = 'mine' | 'templates';

const ImagineExplorer: React.FC<Props> = ({ onSelectHistory, refreshHistory, onUseTemplate }) => {
  const [tab, setTab] = useState<Tab>('mine');

  const TabBtn = ({ id, label, icon: Icon, count }: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={cn(
          'relative flex items-center gap-2 px-1 pb-3 pt-1 text-[14px] font-semibold transition-colors',
          active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Icon className={cn('w-4 h-4', active && 'text-primary')} />
        <span>{label}</span>
        {typeof count === 'number' && (
          <span className={cn(
            'text-[11px] font-medium tabular-nums',
            active ? 'text-primary/80' : 'text-muted-foreground/70'
          )}>
            {count}
          </span>
        )}
        {active && (
          <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-primary" />
        )}
      </button>
    );
  };

  return (
    <section className="w-full">
      <div className="border-b border-border/60 mb-4">
        <div className="flex items-center gap-6">
          <TabBtn id="mine" label="My Images" icon={Sparkles} />
          <TabBtn id="templates" label="Templates" icon={LayoutGrid} count={TEMPLATE_COUNT} />
        </div>
      </div>

      {tab === 'mine' ? (
        <ImagineHistoryFeed onSelect={onSelectHistory} refreshTrigger={refreshHistory} />
      ) : (
        <ImagineTemplates onUseTemplate={onUseTemplate} embedded />
      )}
    </section>
  );
};

export default ImagineExplorer;
