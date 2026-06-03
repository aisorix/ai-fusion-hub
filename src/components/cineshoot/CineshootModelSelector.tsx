import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, Lock } from 'lucide-react';
import { cineshootModels, isModelLocked, type CineshootModel } from './cineshootModels';

interface Props {
  selectedModelId: string;
  onSelectModel: (m: CineshootModel) => void;
  userPlan: string;
  onUpgrade: () => void;
}

const CineshootModelSelector: React.FC<Props> = ({ selectedModelId, onSelectModel, userPlan, onUpgrade }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const selected = cineshootModels.find(m => m.modelId === selectedModelId) || cineshootModels[0];

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = 300;
      const left = Math.max(8, Math.min(window.innerWidth - width - 8, r.right - width));
      setPos({ top: r.bottom + 8, left, width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !popoverRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 pl-2 pr-2 py-1.5 rounded-full border text-xs sm:text-[13px] font-medium transition-colors max-w-[180px]',
          'border-border/60 text-foreground hover:bg-background',
          open && 'bg-background border-primary/40'
        )}
      >
        <span className={cn('w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[11px] shrink-0', selected.gradient)}>
          {selected.emoji}
        </span>
        <span className="truncate">{selected.shortName}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && pos && createPortal(
        <div
          ref={popoverRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
          className="z-[300] rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-border/50">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Choose video model</p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-1.5">
            {cineshootModels.map(m => {
              const locked = isModelLocked(m, userPlan);
              const active = m.modelId === selectedModelId;
              return (
                <button
                  key={m.id}
                  onClick={() => { if (locked) onUpgrade(); else onSelectModel(m); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left',
                    active ? 'bg-primary/10' : 'hover:bg-muted/60'
                  )}
                >
                  <span className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm shrink-0', m.gradient)}>
                    {m.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[13px] font-medium truncate', active ? 'text-primary' : 'text-foreground')}>
                        {m.displayName}
                      </span>
                      {m.tier !== 'basic' && (
                        <span className={cn(
                          'text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                          m.tier === 'premium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                        )}>
                          {m.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-muted-foreground truncate">
                      {m.tagline || `${m.maxResolution} · up to ${m.durations[m.durations.length - 1]}s`}
                    </p>
                  </div>
                  {locked && <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CineshootModelSelector;
