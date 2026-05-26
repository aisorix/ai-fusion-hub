import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Wand2, ImagePlus, Sparkles, Camera, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { AspectRatio, Resolution } from './ImagineOptionsPanel';

export interface Template {
  id: string;
  category: 'styles' | 'creations' | 'portraits' | 'transforms';
  title: string;
  prompt: string;
  image: string;
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

const RES_PX: Record<Resolution, number> = { '1K': 1024, '2K': 2048, '4K': 4096 };
const ASPECT_RATIO: Record<AspectRatio, [number, number]> = {
  '1:1': [1, 1], '16:9': [16, 9], '9:16': [9, 16], '4:3': [4, 3],
  '3:4': [3, 4], '3:2': [3, 2], '2:3': [2, 3], '21:9': [21, 9],
};

const dimsFor = (a: AspectRatio, r: Resolution): string => {
  const base = RES_PX[r];
  const [w, h] = ASPECT_RATIO[a];
  if (w >= h) return `${base}px × ${Math.round(base * h / w)}px`;
  return `${Math.round(base * w / h)}px × ${base}px`;
};

const fetchAsDataUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
};

const ImagineTemplatePreview: React.FC<Props> = ({ template, onClose, onUsePrompt, onUseAsReference }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!template) return;
    await navigator.clipboard.writeText(template.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const handleReference = async () => {
    if (!template) return;
    try {
      const dataUrl = await fetchAsDataUrl(template.image);
      onUseAsReference(template, dataUrl);
    } catch {
      toast.error('Could not load reference. Use Prompt instead.');
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

          {/* Desktop / md+ : centered modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="hidden md:flex fixed inset-0 z-[310] items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-card border border-border shadow-2xl flex flex-row">
              <div className="w-2/5 relative p-5 flex items-center justify-center bg-muted/30 border-r border-border">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-muted">
                  <img src={template.image} alt={template.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-white text-base font-semibold drop-shadow-md">{template.title}</p>
                  </div>
                </div>
              </div>

              <div className="w-3/5 flex flex-col">
                <div className="flex items-start justify-between gap-3 p-5 pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {template.category}
                      </span>
                      {template.needsPhoto && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Camera className="w-2.5 h-2.5" /> Needs photo
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-foreground truncate">{template.title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex w-8 h-8 rounded-full hover:bg-muted items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-5 pb-3 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Image Prompt</p>
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

                <div className="p-4 border-t border-border bg-muted/20 flex flex-row gap-2">
                  <button
                    onClick={() => onUsePrompt(template)}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.5)]"
                  >
                    <Wand2 className="w-4 h-4" /> Use Prompt
                  </button>
                  {!template.needsPhoto && (
                    <button
                      onClick={handleReference}
                      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" /> Use as Reference
                    </button>
                  )}
                  {template.needsPhoto && (
                    <p className="flex-1 flex items-center justify-center text-[12px] text-muted-foreground gap-1.5 px-3">
                      <Camera className="w-3.5 h-3.5" /> Add a photo and describe changes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile : bottom sheet, drag-to-dismiss */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="md:hidden fixed inset-x-0 bottom-0 z-[310] flex flex-col bg-card border-t border-border rounded-t-3xl shadow-2xl"
            style={{ height: '92dvh', maxHeight: '92dvh' }}
          >
            {/* Drag handle */}
            <div className="flex flex-col items-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-4 pt-2 pb-3 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {template.category}
                  </span>
                  {template.needsPhoto && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Camera className="w-2.5 h-2.5" /> Needs photo
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-foreground truncate">{template.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground shrink-0 active:scale-95 transition-transform"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
              {/* Compact hero strip */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted mb-4">
                <img src={template.image} alt={template.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white text-sm font-semibold drop-shadow-md">{template.title}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Image Prompt</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground active:bg-muted transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[13.5px] leading-relaxed text-foreground/85 bg-muted/40 border border-border/40 rounded-xl p-3.5">
                {template.prompt}
              </p>

              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-4 text-[12px] text-muted-foreground">
                <span className="font-semibold text-foreground/80">{template.aspect}</span>
                <span className="w-px h-3 bg-border" />
                <span>{template.resolution}</span>
                <span className="w-px h-3 bg-border" />
                <span>{dimsFor(template.aspect, template.resolution)}</span>
              </div>
            </div>

            {/* Sticky bottom action bar */}
            <div
              className="shrink-0 px-4 pt-3 border-t border-border bg-card/95 backdrop-blur flex flex-col gap-2"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}
            >
              <button
                onClick={() => onUsePrompt(template)}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:opacity-90 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.5)]"
              >
                <Wand2 className="w-4 h-4" /> Use Prompt
              </button>
              {!template.needsPhoto && (
                <button
                  onClick={handleReference}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-background active:bg-muted text-foreground font-semibold text-sm"
                >
                  <ImagePlus className="w-4 h-4" /> Use as Reference
                </button>
              )}
              {template.needsPhoto && (
                <p className="w-full flex items-center justify-center text-[12px] text-muted-foreground gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Add a photo and describe changes
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImagineTemplatePreview;
