import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Image as ImageIcon, Type, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from '../DeckThemePicker';
import DeckSlideCard from '../DeckSlideCard';
import DeckGeneratingCard from './DeckGeneratingCard';

interface Props {
  slide: Slide | null;
  theme: DeckTheme;
  activeIndex: number;
  totalSlides: number;
  onUpdateSlide: (updated: Slide) => void;
  onChangeLayout: (layout: Slide['layout']) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  pending?: boolean;
}

const LAYOUTS: { id: Slide['layout']; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'split', label: 'Split', icon: Layout },
  { id: 'text-only', label: 'Text', icon: Type },
  { id: 'full-image', label: 'Image', icon: ImageIcon },
];

const DeckEditorCanvas: React.FC<Props> = ({
  slide, theme, activeIndex, totalSlides, onUpdateSlide, onChangeLayout,
  onDuplicate, onDelete, pending,
}) => {
  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto bg-muted/20">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Canvas toolbar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="text-[11px] text-muted-foreground tabular-nums">
            Slide <span className="text-foreground font-semibold">{activeIndex + 1}</span> / {totalSlides}
          </div>
          {slide && !pending && (
            <div className="flex items-center gap-1.5">
              <div className="inline-flex items-center gap-0.5 rounded-lg bg-card border border-border/60 p-0.5">
                {LAYOUTS.map((l) => {
                  const Icon = l.icon;
                  const active = slide.layout === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => onChangeLayout(l.id)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors',
                        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {l.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={onDuplicate}
                title="Duplicate"
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {totalSlides > 1 && (
                <button
                  onClick={onDelete}
                  title="Delete"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Slide */}
        <AnimatePresence mode="wait">
          {pending || !slide ? (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DeckGeneratingCard theme={theme} index={activeIndex} visibleLines={5} />
            </motion.div>
          ) : (
            <motion.div
              key={`s-${activeIndex}-${slide.layout}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <DeckSlideCard
                slide={slide}
                theme={theme}
                index={activeIndex}
                onUpdateSlide={onUpdateSlide}
                editable
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeckEditorCanvas;
