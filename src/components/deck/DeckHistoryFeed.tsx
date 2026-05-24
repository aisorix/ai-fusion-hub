import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Presentation, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { deckApi, type DeckHistoryItem } from '@/services/deckApi';
import { DECK_THEMES } from './DeckThemeShowcase';
import type { DeckTheme } from './DeckThemePicker';
import { cn } from '@/lib/utils';

interface Props {
  items: DeckHistoryItem[];
  loading: boolean;
  loadingId?: string | null;
  onLoad: (item: DeckHistoryItem) => void;
  onDelete: (id: string) => void;
}

const DeckHistoryFeed: React.FC<Props> = ({ items, loading, loadingId, onLoad, onDelete }) => {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deckApi.deletePresentation(id);
      onDelete(id);
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center rounded-2xl border border-dashed border-border/50 bg-card/30">
        <Presentation className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No presentations yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Your decks will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {items.map((item, idx) => {
        const themeId = (item.input_data?.theme as DeckTheme) || 'dark';
        const theme = DECK_THEMES.find((t) => t.id === themeId) || DECK_THEMES[0];
        const slideCount = item.input_data?.slideCount || item.result_data?.slides?.length || 0;
        const isLoading = loadingId === item.id;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
            onClick={() => onLoad(item)}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/40 bg-card text-left hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all"
          >
            {/* Themed preview background */}
            <div className={cn('absolute inset-0 p-4 flex flex-col justify-between', theme.bg)}>
              <div className={cn('rounded-lg px-3 py-2.5 flex flex-col gap-1', theme.cardBg)}>
                <div className={cn('text-[11px] font-bold leading-tight line-clamp-2', theme.titleColor)}>
                  {item.title}
                </div>
                <div className={cn('text-[9px] leading-tight line-clamp-2', theme.bodyColor)}>
                  {item.input_data?.prompt || 'Presentation'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn('inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm')}>
                  <Presentation className="w-2.5 h-2.5" />
                  {slideCount} slides
                </span>
                <span className="text-[9px] text-white/70 bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}

            <button
              onClick={(e) => handleDelete(e, item.id)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              aria-label="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.button>
        );
      })}
    </div>
  );
};

export default DeckHistoryFeed;
