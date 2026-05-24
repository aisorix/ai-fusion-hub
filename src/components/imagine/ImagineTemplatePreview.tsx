import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Wand2, ImagePlus, Sparkles, Camera, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { AspectRatio, Resolution } from './ImagineOptionsPanel';

export interface Template {
  id: string;
  category: 'styles' | 'creations' | 'portraits' | 'transforms';
  title: string;
  prompt: string;
  grad: string; // tailwind gradient classes (without "bg-gradient-to-br")
  icon: string; // glyph
  aspect: AspectRatio;
  resolution: Resolution;
  needsPhoto?: boolean;
}

interface Props {
  template: Template | null;
  onClose: () => void;
  onUsePrompt: (t: Template) => void;
  onUseAsReference: (t: Template, sampleDataUrl: string) => void;
}

const RES_PX: Record<Resolution, string> = {
  '1K': '1024',
  '2K': '2048',
  '4K': '4096',
};

const ASPECT_RATIO_PX: Record<AspectRatio, [number, number]> = {
  '1:1': [1, 1], '16:9': [16, 9], '9:16': [9, 16], '4:3': [4, 3],
  '3:4': [3, 4], '3:2': [3, 2], '2:3': [2, 3], '21:9': [21, 9],
};

const dimsFor = (a: AspectRatio, r: Resolution): string => {
  const base = parseInt(RES_PX[r], 10);
  const [w, h] = ASPECT_RATIO_PX[a];
  const long = base;
  if (w >= h) {
    return `${long}px × ${Math.round(long * h / w)}px`;
  }
  return `${Math.round(long * w / h)}px × ${long}px`;
};

// Render the sample card to a data URL so it can be attached as a reference image.
const cardToDataUrl = async (el: HTMLElement): Promise<string> => {
  const rect = el.getBoundingClientRect();
  const w = Math.max(512, Math.round(rect.width));
  const h = Math.max(640, Math.round(rect.height));
  // Use foreignObject SVG → blob trick (lightweight, no external deps).
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;">
        ${el.outerHTML}
      </div>
    </foreignObject>
  </svg>`;
  const svg = new Blob([html], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svg);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('canvas')); return; }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
};

const ImagineTemplatePreview: React.FC<Props> = ({ template, onClose, onUsePrompt, onUseAsReference }) => {
  const [copied, setCopied] = React.useState(false);
  const sampleRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (!template) return;
    await navigator.clipboard.writeText(template.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const handleReference = async () => {
    if (!template || !sampleRef.current) return;
    try {
      const dataUrl = await cardToDataUrl(sampleRef.current);
      onUseAsReference(template, dataUrl);
    } catch {
      // Fallback: just send a placeholder solid color
      toast.error('Could not capture sample. Use Prompt instead.');
    }
  };

  return (
    <AnimatePresence>
      {template && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-card border border-border shadow-2xl flex flex-col md:flex-row">
              {/* Sample preview */}
              <div className="md:w-2/5 relative p-5 flex items-center justify-center bg-muted/30 border-b md:border-b-0 md:border-r border-border">
                <button
                  onClick={onClose}
                  className="md:hidden absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-background z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div
                  ref={sampleRef}
                  className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-lg"
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br', template.grad)} />
                  <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,_white,_transparent_60%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-4 right-4 text-4xl text-white/70 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                    {template.icon}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-white text-base font-semibold drop-shadow-md">{template.title}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="md:w-3/5 flex flex-col">
                <div className="flex items-start justify-between gap-3 p-5 pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {template.category}
                      </span>
                      {template.needsPhoto && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Camera className="w-2.5 h-2.5" />
                          Needs photo
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-foreground truncate">{template.title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="hidden md:flex w-8 h-8 rounded-full hover:bg-muted items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-5 pb-3 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
                        Image Prompt
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-foreground/85 bg-muted/40 border border-border/40 rounded-xl p-3.5">
                    {template.prompt}
                  </p>

                  <div className="flex items-center gap-3 mt-4 text-[12px] text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{template.aspect}</span>
                    <span className="w-px h-3 bg-border" />
                    <span>{template.resolution}</span>
                    <span className="w-px h-3 bg-border" />
                    <span>{dimsFor(template.aspect, template.resolution)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onUsePrompt(template)}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.5)]"
                  >
                    <Wand2 className="w-4 h-4" />
                    Use Prompt
                  </button>
                  {!template.needsPhoto && (
                    <button
                      onClick={handleReference}
                      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Use as Reference
                    </button>
                  )}
                  {template.needsPhoto && (
                    <p className="flex-1 flex items-center justify-center text-[12px] text-muted-foreground gap-1.5 px-3">
                      <Camera className="w-3.5 h-3.5" />
                      Add a photo and describe changes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImagineTemplatePreview;
