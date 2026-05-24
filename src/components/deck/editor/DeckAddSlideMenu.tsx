import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FilePlus, Sparkles, Copy, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onBlank: () => void;
  onAi: () => void;
  onDuplicate: () => void;
  className?: string;
}

const DeckAddSlideMenu: React.FC<Props> = ({ onBlank, onAi, onDuplicate, className }) => {
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
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-foreground font-medium px-3 py-1.5 text-[12px]"
      >
        <Plus className="w-3.5 h-3.5" />
        New
        <span className="inline-flex items-center px-1.5 py-[1px] rounded text-[9.5px] font-semibold bg-primary/10 text-primary">
          <Sparkles className="w-2.5 h-2.5 mr-0.5" />
          AI
        </span>
        <ChevronDown className={cn('w-3 h-3 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-full mb-1.5 left-0 right-0 z-[80] rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
          >
            <button
              onClick={() => { setOpen(false); onBlank(); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left"
            >
              <FilePlus className="w-4 h-4 text-foreground/80" />
              <span className="text-[12.5px] text-foreground">Blank slide</span>
            </button>
            <button
              onClick={() => { setOpen(false); onAi(); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left border-t border-border/60"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[12.5px] text-foreground">With AI prompt</span>
            </button>
            <button
              onClick={() => { setOpen(false); onDuplicate(); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left border-t border-border/60"
            >
              <Copy className="w-4 h-4 text-foreground/80" />
              <span className="text-[12.5px] text-foreground">Duplicate current</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckAddSlideMenu;
