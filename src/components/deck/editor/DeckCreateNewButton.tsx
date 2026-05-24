import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, FilePlus, Sparkles, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onBlank: () => void;
  onFromPrompt: () => void;
  onFromTemplate?: () => void;
  className?: string;
  /** Compact pill variant used inside sidebar */
  compact?: boolean;
}

const DeckCreateNewButton: React.FC<Props> = ({ onBlank, onFromPrompt, onFromTemplate, className, compact }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative inline-flex items-stretch', className)}>
      <button
        onClick={onBlank}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-l-full border border-r-0 border-border bg-card hover:bg-muted transition-colors text-foreground font-medium',
          compact ? 'pl-3 pr-2.5 py-1 text-[11.5px]' : 'pl-3.5 pr-3 py-1.5 text-[12.5px]',
        )}
      >
        <Plus className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        New
      </button>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-r-full border border-border bg-card hover:bg-muted transition-colors',
          compact ? 'pl-1.5 pr-2 py-1' : 'pl-2 pr-2.5 py-1.5',
        )}
      >
        <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded text-[9.5px] font-semibold bg-primary/10 text-primary">
          <Sparkles className="w-2.5 h-2.5" />
          AI
        </span>
        <ChevronDown className={cn('text-muted-foreground transition-transform', open && 'rotate-180', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full mt-1.5 right-0 z-[80] w-56 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
          >
            <button
              onClick={() => { setOpen(false); onBlank(); }}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted text-left"
            >
              <FilePlus className="w-4 h-4 mt-0.5 text-foreground/80" />
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-foreground">Blank deck</div>
                <div className="text-[10.5px] text-muted-foreground">Start with one empty slide</div>
              </div>
            </button>
            <button
              onClick={() => { setOpen(false); onFromPrompt(); }}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted text-left border-t border-border/60"
            >
              <Sparkles className="w-4 h-4 mt-0.5 text-primary" />
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-foreground">From AI prompt</div>
                <div className="text-[10.5px] text-muted-foreground">Describe a brand-new deck</div>
              </div>
            </button>
            {onFromTemplate && (
              <button
                onClick={() => { setOpen(false); onFromTemplate(); }}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted text-left border-t border-border/60"
              >
                <LayoutTemplate className="w-4 h-4 mt-0.5 text-foreground/80" />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-foreground">From template</div>
                  <div className="text-[10.5px] text-muted-foreground">Pick a curated starting point</div>
                </div>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckCreateNewButton;
