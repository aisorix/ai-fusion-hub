import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from './DeckThemePicker';

interface DeckSlideshowProps {
  slides: Slide[];
  theme: DeckTheme;
  onClose: () => void;
  startIndex?: number;
}

const themeClasses: Record<string, { bg: string; heading: string; text: string; badge: string }> = {
  dark: { bg: 'bg-gray-900', heading: 'text-white', text: 'text-gray-300', badge: 'bg-cyan-500/20 text-cyan-400' },
  'cyan-blue': { bg: 'bg-cyan-700', heading: 'text-white', text: 'text-cyan-100', badge: 'bg-white/20 text-white' },
  minimalist: { bg: 'bg-white', heading: 'text-gray-900', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' },
  sunset: { bg: 'bg-gradient-to-br from-orange-500 to-purple-700', heading: 'text-white', text: 'text-orange-100', badge: 'bg-white/20 text-white' },
  pearl: { bg: 'bg-gray-100', heading: 'text-gray-900', text: 'text-gray-600', badge: 'bg-gray-200 text-gray-600' },
  vortex: { bg: 'bg-black', heading: 'text-white', text: 'text-gray-400', badge: 'bg-white/10 text-white' },
  clementa: { bg: 'bg-amber-100', heading: 'text-amber-800', text: 'text-amber-600', badge: 'bg-amber-200 text-amber-700' },
  stratos: { bg: 'bg-slate-900', heading: 'text-white', text: 'text-slate-300', badge: 'bg-slate-700 text-slate-300' },
  nova: { bg: 'bg-gradient-to-br from-blue-500 to-purple-500', heading: 'text-white', text: 'text-blue-100', badge: 'bg-white/20 text-white' },
  twilight: { bg: 'bg-gradient-to-br from-rose-200 to-slate-400', heading: 'text-rose-900', text: 'text-rose-700', badge: 'bg-rose-300/30 text-rose-800' },
  creme: { bg: 'bg-stone-200', heading: 'text-stone-800', text: 'text-stone-500', badge: 'bg-stone-300 text-stone-600' },
  lux: { bg: 'bg-teal-900', heading: 'text-emerald-200', text: 'text-emerald-400', badge: 'bg-emerald-800 text-emerald-300' },
  marine: { bg: 'bg-teal-800', heading: 'text-white', text: 'text-teal-200', badge: 'bg-teal-700 text-teal-200' },
  consultant: { bg: 'bg-gray-100', heading: 'text-gray-800', text: 'text-gray-500', badge: 'bg-gray-200 text-gray-600' },
  lavender: { bg: 'bg-violet-200', heading: 'text-violet-900', text: 'text-violet-600', badge: 'bg-violet-300 text-violet-700' },
  indigo: { bg: 'bg-indigo-900', heading: 'text-white', text: 'text-indigo-300', badge: 'bg-indigo-800 text-indigo-300' },
  gamma: { bg: 'bg-rose-50', heading: 'text-orange-600', text: 'text-gray-600', badge: 'bg-orange-100 text-orange-600' },
  founder: { bg: 'bg-purple-900', heading: 'text-white', text: 'text-gray-300', badge: 'bg-purple-800 text-purple-300' },
  atmosphere: { bg: 'bg-gradient-to-br from-pink-300 to-pink-500', heading: 'text-white', text: 'text-pink-100', badge: 'bg-white/20 text-white' },
  blueberry: { bg: 'bg-purple-900', heading: 'text-white', text: 'text-purple-300', badge: 'bg-purple-800 text-purple-300' },
  sage: { bg: 'bg-green-100', heading: 'text-green-900', text: 'text-green-600', badge: 'bg-green-200 text-green-700' },
  coal: { bg: 'bg-teal-900', heading: 'text-white', text: 'text-gray-400', badge: 'bg-gray-700 text-gray-300' },
};

const DeckSlideshow: React.FC<DeckSlideshowProps> = ({ slides, theme, onClose, startIndex = 0 }) => {
  const [current, setCurrent] = useState(startIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const tc = themeClasses[theme] || themeClasses.dark;

  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, slides.length - 1)), [slides.length]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) { diff > 0 ? goPrev() : goNext(); }
    setTouchStart(null);
  };

  const slide = slides[current];
  if (!slide) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
        <X className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/60 text-[10px] md:text-sm font-mono z-10">
        {current + 1} / {slides.length}
      </div>

      {/* Nav buttons - hidden on mobile (use swipe) */}
      <button
        onClick={goPrev}
        disabled={current === 0}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goNext}
        disabled={current === slides.length - 1}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide content */}
      <div className="w-full h-full max-w-[96vw] md:max-w-[90vw] max-h-[90vh] flex items-center justify-center p-2 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className={cn('w-full rounded-xl md:rounded-2xl overflow-hidden relative', tc.bg, slide.layout === 'split' ? 'min-h-[60vw] md:aspect-video' : 'aspect-video')}
            style={{ maxHeight: '85vh' }}
          >
            {slide.layout === 'full-image' ? (
              <>
                {slide.image_url && (
                  <img src={slide.image_url} alt={slide.heading} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className={cn('absolute top-3 left-3 md:top-5 md:left-6 text-[10px] md:text-xs font-mono px-2 md:px-3 py-0.5 md:py-1 rounded-full', tc.badge)}>
                  {slide.slide_number}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12">
                  <h2 className="text-lg md:text-4xl lg:text-5xl font-bold text-white leading-tight">{slide.heading}</h2>
                </div>
              </>
            ) : slide.layout === 'text-only' ? (
              <div className="flex flex-col justify-center h-full p-4 md:p-16">
                <div className={cn('text-[10px] md:text-xs font-mono px-2 md:px-3 py-0.5 md:py-1 rounded-full w-fit mb-3 md:mb-6', tc.badge)}>
                  {slide.slide_number}
                </div>
                <h2 className={cn('text-lg md:text-4xl font-bold mb-3 md:mb-6', tc.heading)}>{slide.heading}</h2>
                <ul className="space-y-1.5 md:space-y-3">
                  {slide.bullet_points.map((bp, i) => (
                    <li key={i} className={cn('text-xs md:text-xl flex items-start gap-2 md:gap-3', tc.text)}>
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current mt-1.5 md:mt-2.5 shrink-0 opacity-50" />
                      {bp}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="flex flex-col justify-center p-4 md:p-12 order-1">
                  <div className={cn('text-[10px] md:text-xs font-mono px-2 md:px-3 py-0.5 md:py-1 rounded-full w-fit mb-2 md:mb-4', tc.badge)}>
                    {slide.slide_number}
                  </div>
                  <h2 className={cn('text-base md:text-3xl font-bold mb-2 md:mb-4', tc.heading)}>{slide.heading}</h2>
                  <ul className="space-y-1 md:space-y-2">
                    {slide.bullet_points.map((bp, i) => (
                      <li key={i} className={cn('text-xs md:text-lg flex items-start gap-1.5 md:gap-2', tc.text)}>
                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current mt-1.5 md:mt-2 shrink-0 opacity-50" />
                        {bp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 md:p-4 flex items-center order-2 max-h-[30vh] md:max-h-none">
                  {slide.image_url && (
                    <img src={slide.image_url} alt={slide.heading} className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DeckSlideshow;
