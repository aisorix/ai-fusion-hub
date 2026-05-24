import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ListOrdered, X, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from '../DeckThemePicker';
import DeckSlideCard from '../DeckSlideCard';
import DeckCreateNewButton from './DeckCreateNewButton';
import DeckAddSlideMenu from './DeckAddSlideMenu';
import DeckGeneratingCard from './DeckGeneratingCard';

interface Props {
  slides: Slide[];
  theme: DeckTheme;
  activeIndex: number;
  onSelect: (i: number) => void;
  onDelete: (i: number) => void;
  onAddBlank: () => void;
  onAddAi: () => void;
  onDuplicate: () => void;
  onCreateNewDeck: () => void;
  onClose?: () => void;
  isGenerating?: boolean;
  pendingIndexes?: Set<number>;
  tab: 'slides' | 'outline';
  onTabChange: (t: 'slides' | 'outline') => void;
}

const DeckEditorSidebar: React.FC<Props> = ({
  slides, theme, activeIndex, onSelect, onDelete,
  onAddBlank, onAddAi, onDuplicate, onCreateNewDeck, onClose,
  isGenerating, pendingIndexes, tab, onTabChange,
}) => {
  return (
    <aside className="h-full w-full md:w-[232px] shrink-0 flex flex-col bg-card/40 backdrop-blur-md border-r border-border/60">
      {/* Top tabs */}
      <div className="px-2.5 py-2 flex items-center justify-between gap-1 border-b border-border/40">
        <div className="inline-flex items-center gap-0.5 rounded-full bg-muted/50 p-0.5">
          <button
            onClick={() => onTabChange('slides')}
            className={cn(
              'inline-flex items-center justify-center w-8 h-7 rounded-full transition-colors',
              tab === 'slides' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            title="Slides"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onTabChange('outline')}
            className={cn(
              'inline-flex items-center justify-center w-8 h-7 rounded-full transition-colors',
              tab === 'outline' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            title="Outline"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>




      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {tab === 'slides' ? (
          slides.map((slide, i) => {
            const isPending = pendingIndexes?.has(i);
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={cn(
                  'group relative w-full rounded-lg overflow-hidden border transition-all text-left',
                  activeIndex === i
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border/60 hover:border-muted-foreground/40',
                )}
              >
                <div className="relative aspect-video bg-muted/40 overflow-hidden">
                  {isPending ? (
                    <div className="absolute inset-0">
                      <DeckGeneratingCard theme={theme} index={i} visibleLines={3} className="!aspect-auto h-full !rounded-none border-0" />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0"
                      style={{
                        width: '960px',
                        transform: 'scale(0.215)',
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                      }}
                    >
                      <DeckSlideCard slide={slide} theme={theme} index={i} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur text-[10px] font-semibold text-foreground tabular-nums">
                  {i + 1}
                </div>
                {!isPending && slides.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded bg-background/80 backdrop-blur text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center"
                    title="Delete slide"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </button>
            );
          })
        ) : (
          slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                'w-full text-left px-2.5 py-2 rounded-lg border transition-colors flex items-start gap-2',
                activeIndex === i
                  ? 'border-primary bg-primary/5'
                  : 'border-border/60 bg-card/50 hover:bg-muted',
              )}
            >
              <span className="text-[10.5px] font-mono text-muted-foreground mt-0.5 w-4 shrink-0">{i + 1}</span>
              <span className="text-[12px] font-medium text-foreground line-clamp-2 leading-snug">
                {pendingIndexes?.has(i) ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Sparkles className="w-3 h-3" /> AI generating…
                  </span>
                ) : (
                  slide.heading || <span className="text-muted-foreground italic">Untitled slide</span>
                )}
              </span>
            </button>
          ))
        )}
        {isGenerating && slides.length === 0 && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg deck-shimmer" />
            ))}
          </div>
        )}
      </div>

      {/* Add slide footer */}
      <div className="px-2.5 py-2 border-t border-border/40">
        <DeckAddSlideMenu onBlank={onAddBlank} onAi={onAddAi} onDuplicate={onDuplicate} />
      </div>
    </aside>
  );
};

export default DeckEditorSidebar;
