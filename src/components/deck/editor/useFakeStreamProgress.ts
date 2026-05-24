import { useEffect, useState } from 'react';

/**
 * Drives a fake line-by-line reveal for placeholder slides while the
 * backend is generating. Returns the number of "lines" that should be
 * visible for the slide at index `slideIdx`.
 */
export function useFakeStreamProgress(slideCount: number, active: boolean, linesPerSlide = 5) {
  const [progress, setProgress] = useState<number[]>(() => Array(slideCount).fill(0));

  useEffect(() => {
    setProgress(Array(slideCount).fill(0));
    if (!active) return;
    let cancelled = false;
    let slide = 0;
    let line = 0;
    const tick = () => {
      if (cancelled) return;
      setProgress((prev) => {
        const next = [...prev];
        if (slide < slideCount) next[slide] = Math.min(linesPerSlide, line + 1);
        return next;
      });
      line += 1;
      if (line >= linesPerSlide) {
        line = 0;
        slide += 1;
      }
      if (slide < slideCount) setTimeout(tick, 320 + Math.random() * 220);
    };
    const t = setTimeout(tick, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [slideCount, active, linesPerSlide]);

  return progress;
}
