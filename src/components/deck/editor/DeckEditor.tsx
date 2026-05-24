import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from '../DeckThemePicker';
import DeckEditorSidebar from './DeckEditorSidebar';
import DeckEditorCanvas from './DeckEditorCanvas';
import DeckAiSlidePromptDialog from './DeckAiSlidePromptDialog';
import { useFakeStreamProgress } from './useFakeStreamProgress';
import DeckGeneratingCard from './DeckGeneratingCard';

interface Props {
  slides: Slide[];
  onSlidesChange: (next: Slide[]) => void;
  theme: DeckTheme;
  isGenerating: boolean;
  expectedSlideCount: number;
  onCreateNew: () => void;
  onAddAiSlide?: (prompt: string, layout: Slide['layout'], insertAt: number) => Promise<void>;
}

const renumber = (list: Slide[]): Slide[] =>
  list.map((s, i) => ({ ...s, slide_number: i + 1 }));

const blankSlide = (n: number, layout: Slide['layout'] = 'text-only'): Slide => ({
  slide_number: n,
  heading: 'New slide',
  bullet_points: ['Click to edit this point'],
  image_prompt: '',
  layout,
});

const DeckEditor: React.FC<Props> = ({
  slides, onSlidesChange, theme, isGenerating, expectedSlideCount,
  onCreateNew, onAddAiSlide,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState<'slides' | 'outline'>('slides');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [aiDialog, setAiDialog] = useState(false);
  const [pending, setPending] = useState<Set<number>>(new Set());

  // For initial deck generation, show placeholder cards
  const placeholderCount = isGenerating && slides.length === 0 ? expectedSlideCount : 0;
  const streamProgress = useFakeStreamProgress(placeholderCount, isGenerating && slides.length === 0);

  // Auto-follow new slides during generation
  useEffect(() => {
    if (slides.length > 0 && activeIndex >= slides.length) {
      setActiveIndex(Math.max(0, slides.length - 1));
    }
  }, [slides.length, activeIndex]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA/)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setActiveIndex((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  const updateSlide = useCallback((idx: number, updated: Slide) => {
    onSlidesChange(slides.map((s, i) => (i === idx ? updated : s)));
  }, [slides, onSlidesChange]);

  const deleteSlide = useCallback((idx: number) => {
    if (slides.length <= 1) return;
    const next = renumber(slides.filter((_, i) => i !== idx));
    onSlidesChange(next);
    setActiveIndex((cur) => Math.max(0, Math.min(cur, next.length - 1)));
  }, [slides, onSlidesChange]);

  const duplicateSlide = useCallback((idx: number) => {
    const target = slides[idx];
    if (!target) return;
    const dup = { ...target, heading: target.heading };
    const next = renumber([...slides.slice(0, idx + 1), dup, ...slides.slice(idx + 1)]);
    onSlidesChange(next);
    setActiveIndex(idx + 1);
  }, [slides, onSlidesChange]);

  const insertBlank = useCallback(() => {
    const next = renumber([...slides.slice(0, activeIndex + 1), blankSlide(0), ...slides.slice(activeIndex + 1)]);
    onSlidesChange(next);
    setActiveIndex(activeIndex + 1);
  }, [slides, activeIndex, onSlidesChange]);

  const handleAiSlide = useCallback(async (prompt: string, layout: Slide['layout']) => {
    if (!onAddAiSlide) {
      toast.error('AI slide insertion not available');
      return;
    }
    const insertAt = activeIndex + 1;
    // Optimistic placeholder
    const placeholder = blankSlide(0, layout);
    placeholder.heading = '';
    const withPlaceholder = renumber([...slides.slice(0, insertAt), placeholder, ...slides.slice(insertAt)]);
    onSlidesChange(withPlaceholder);
    setActiveIndex(insertAt);
    setPending((p) => new Set([...p, insertAt]));

    try {
      await onAddAiSlide(prompt, layout, insertAt);
    } catch (err: any) {
      // Rollback placeholder
      onSlidesChange(renumber(slides));
      toast.error(err?.message || 'Failed to add slide');
    } finally {
      setPending((p) => {
        const next = new Set(p);
        next.delete(insertAt);
        return next;
      });
    }
  }, [slides, activeIndex, onSlidesChange, onAddAiSlide]);

  // Display set — during initial generation show placeholders
  const displaySlides: Slide[] = slides.length > 0
    ? slides
    : Array.from({ length: placeholderCount }, (_, i) => blankSlide(i + 1));

  const activeSlide = displaySlides[activeIndex] || null;
  const activePending = slides.length === 0 ? isGenerating : pending.has(activeIndex);

  return (
    <div className="flex-1 min-h-0 flex bg-background overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebar(true)}
        className="md:hidden fixed bottom-4 left-4 z-30 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-border shadow-lg text-[12px] font-medium text-foreground"
      >
        <Menu className="w-3.5 h-3.5" />
        Slides
      </button>

      {/* Sidebar — desktop */}
      <div className="hidden md:flex h-full">
        <DeckEditorSidebar
          slides={displaySlides}
          theme={theme}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onDelete={deleteSlide}
          onAddBlank={insertBlank}
          onAddAi={() => setAiDialog(true)}
          onDuplicate={() => duplicateSlide(activeIndex)}
          onCreateNewDeck={onCreateNew}
          isGenerating={isGenerating && slides.length === 0}
          pendingIndexes={pending}
          tab={tab}
          onTabChange={setTab}
        />
      </div>

      {/* Sidebar — mobile drawer */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72"
            >
              <DeckEditorSidebar
                slides={displaySlides}
                theme={theme}
                activeIndex={activeIndex}
                onSelect={(i) => { setActiveIndex(i); setMobileSidebar(false); }}
                onDelete={deleteSlide}
                onAddBlank={() => { insertBlank(); setMobileSidebar(false); }}
                onAddAi={() => { setAiDialog(true); setMobileSidebar(false); }}
                onDuplicate={() => { duplicateSlide(activeIndex); setMobileSidebar(false); }}
                onCreateNewDeck={onCreateNew}
                onClose={() => setMobileSidebar(false)}
                isGenerating={isGenerating && slides.length === 0}
                pendingIndexes={pending}
                tab={tab}
                onTabChange={setTab}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <DeckEditorCanvas
        slide={activeSlide}
        theme={theme}
        activeIndex={activeIndex}
        totalSlides={displaySlides.length}
        onUpdateSlide={(u) => updateSlide(activeIndex, u)}
        onChangeLayout={(layout) => activeSlide && updateSlide(activeIndex, { ...activeSlide, layout })}
        onDuplicate={() => duplicateSlide(activeIndex)}
        onDelete={() => deleteSlide(activeIndex)}
        pending={activePending}
      />

      <DeckAiSlidePromptDialog
        open={aiDialog}
        onOpenChange={setAiDialog}
        onGenerate={handleAiSlide}
      />
    </div>
  );
};

export default DeckEditor;
