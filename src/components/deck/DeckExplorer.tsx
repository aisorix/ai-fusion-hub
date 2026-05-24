import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LayoutGrid } from 'lucide-react';
import DeckTemplates, { DECK_TEMPLATE_COUNT } from './DeckTemplates';
import DeckHistoryFeed from './DeckHistoryFeed';
import type { DeckHistoryItem } from '@/services/deckApi';

interface Props {
  onUseTemplate: (prompt: string, recommendedSlides?: number) => void;
  historyItems: DeckHistoryItem[];
  historyLoading: boolean;
  historyLoadingId?: string | null;
  onLoadHistory: (item: DeckHistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

type Tab = 'templates' | 'creations';

const DeckExplorer: React.FC<Props> = ({
  onUseTemplate, historyItems, historyLoading, historyLoadingId, onLoadHistory, onDeleteHistory,
}) => {
  const [tab, setTab] = useState<Tab>('templates');

  const TabBtn = ({ id, label, icon: Icon, count }: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={cn(
          'relative flex items-center gap-2 px-1 pb-3 pt-2 text-[13.5px] sm:text-[14px] font-semibold transition-colors whitespace-nowrap',
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
        <div className="flex items-center gap-4 sm:gap-6 px-1 sm:px-0 overflow-x-auto scrollbar-hide">
          <TabBtn id="templates" label="Templates" icon={LayoutGrid} count={DECK_TEMPLATE_COUNT} />
          <TabBtn id="creations" label="Your Creations" icon={Sparkles} count={historyItems.length} />
        </div>
      </div>

      <div className="min-h-[40vh]">
        {tab === 'templates' ? (
          <DeckTemplates onUseTemplate={onUseTemplate} />
        ) : (
          <DeckHistoryFeed
            items={historyItems}
            loading={historyLoading}
            loadingId={historyLoadingId}
            onLoad={onLoadHistory}
            onDelete={onDeleteHistory}
          />
        )}
      </div>
    </section>
  );
};

export default DeckExplorer;
