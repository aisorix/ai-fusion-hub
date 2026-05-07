import { RefObject, useEffect, useRef } from 'react';

/**
 * Keeps a textarea/input always ready for typing.
 * - Always focuses on initial mount (and whenever skipWhen flips off)
 * - Re-focuses on dep changes; if `mobileOnlyDeps` is true, that re-focus only
 *   fires on mobile viewports so desktop users don't have focus stolen during typing.
 * - Skips focusing while `skipWhen` is true (modals, camera, etc.)
 */
export function useAutoFocusInput<T extends HTMLTextAreaElement | HTMLInputElement>(
  ref: RefObject<T>,
  deps: ReadonlyArray<unknown> = [],
  skipWhen: boolean = false,
  mobileOnlyDeps: boolean = false,
) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (skipWhen) return;
    // Gate dep-driven re-focus to mobile when requested
    if (mobileOnlyDeps && mountedRef.current) {
      const isMobile = typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 767px)').matches;
      if (!isMobile) return;
    }
    const el = ref.current;
    if (!el) return;
    const id = window.setTimeout(() => {
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
    }, 0);
    mountedRef.current = true;
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipWhen, ...deps]);
}
