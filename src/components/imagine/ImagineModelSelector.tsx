import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, Lock, Sparkles, Zap, Star, Cpu, Wand2, Image as ImageIcon, Flame } from 'lucide-react';

export interface ImageModel {
  id: string;
  displayName: string;
  shortName: string;
  modelId: string;
  emoji: string;
  icon: React.ElementType;
  gradient: string;
  proOnly?: boolean;
  tagline?: string;
}

export const imageModels: ImageModel[] = [
  {
    id: 'riverflow',
    displayName: 'Riverflow V2',
    shortName: 'Riverflow V2',
    modelId: 'sourceful/riverflow-v2-standard-preview',
    emoji: '🌊',
    icon: Wand2,
    gradient: 'from-sky-500 to-indigo-500',
    tagline: 'High quality · default',
  },
  {
    id: 'nano-banana',
    displayName: 'Nano Banana',
    shortName: 'Nano Banana',
    modelId: 'google/gemini-2.5-flash-image',
    emoji: '🍌',
    icon: Sparkles,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'nano-banana-2',
    displayName: 'Nano Banana 2',
    shortName: 'Nano 2',
    modelId: 'google/gemini-3.1-flash-image-preview',
    emoji: '🍌',
    icon: Star,
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'nano-banana-pro',
    displayName: 'Nano Banana Pro',
    shortName: 'Nano Pro',
    modelId: 'google/gemini-3-pro-image-preview',
    emoji: '🍌',
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    proOnly: true,
  },
  {
    id: 'gpt5-image',
    displayName: 'GPT-5 Image',
    shortName: 'GPT-5',
    modelId: 'openai/gpt-5-image-mini',
    emoji: '🤖',
    icon: Cpu,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'gpt-image-2',
    displayName: 'GPT Image 2',
    shortName: 'GPT Image 2',
    modelId: 'openai/gpt-5.4-image-2',
    emoji: '🤖',
    icon: Cpu,
    gradient: 'from-emerald-600 to-cyan-600',
    proOnly: true,
  },
  {
    id: 'grok-imagine',
    displayName: 'Grok Imagine',
    shortName: 'Grok',
    modelId: 'x-ai/grok-imagine-image-quality',
    emoji: '⚡',
    icon: Zap,
    gradient: 'from-slate-500 to-zinc-700',
  },
  {
    id: 'seedream',
    displayName: 'ByteDance Seedream 4.5',
    shortName: 'Seedream 4.5',
    modelId: 'bytedance-seed/seedream-4.5',
    emoji: '🌱',
    icon: ImageIcon,
    gradient: 'from-lime-500 to-green-600',
  },
  {
    id: 'flux-max',
    displayName: 'FLUX.2 Max',
    shortName: 'FLUX.2 Max',
    modelId: 'black-forest-labs/flux.2-max',
    emoji: '🔥',
    icon: Flame,
    gradient: 'from-orange-500 to-red-600',
    proOnly: true,
  },
  {
    id: 'flux-pro',
    displayName: 'FLUX.2 Pro',
    shortName: 'FLUX.2 Pro',
    modelId: 'black-forest-labs/flux.2-pro',
    emoji: '🔥',
    icon: Flame,
    gradient: 'from-rose-500 to-fuchsia-600',
    proOnly: true,
  },
];

interface Props {
  selectedModelId: string;
  onSelectModel: (model: ImageModel) => void;
  userPlan: string;
  onUpgrade: () => void;
  compact?: boolean;
}

const ImagineModelSelector: React.FC<Props> = ({
  selectedModelId,
  onSelectModel,
  userPlan,
  onUpgrade,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const selected = imageModels.find((m) => m.modelId === selectedModelId) || imageModels[0];

  const isLocked = (m: ImageModel) =>
    !!m.proOnly && (userPlan === 'free' || userPlan === 'basic');

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = 280;
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
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
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
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 pl-2 pr-2 py-1.5 rounded-full border text-xs sm:text-[13px] font-medium transition-colors max-w-[180px]',
          'border-border/60 text-foreground hover:bg-background',
          open && 'bg-background border-primary/40'
        )}
        aria-label="Select model"
      >
        <span className={cn(
          'w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[11px] shrink-0',
          selected.gradient
        )}>
          <span>{selected.emoji}</span>
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
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
              Choose model
            </p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-1.5">
            {imageModels.map((m) => {
              const locked = isLocked(m);
              const active = m.modelId === selectedModelId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    if (locked) {
                      onUpgrade();
                    } else {
                      onSelectModel(m);
                    }
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left',
                    active ? 'bg-primary/10' : 'hover:bg-muted/60'
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm shrink-0',
                    m.gradient
                  )}>
                    {m.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[13px] font-medium truncate', active ? 'text-primary' : 'text-foreground')}>
                        {m.displayName}
                      </span>
                      {m.proOnly && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          Pro
                        </span>
                      )}
                    </div>
                    {m.tagline && (
                      <p className="text-[10.5px] text-muted-foreground truncate">{m.tagline}</p>
                    )}
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

export default ImagineModelSelector;
