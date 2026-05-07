import { RefObject, useEffect, useRef } from 'react';

/**
 * Keeps a textarea/input always ready for typing.
 * - Focuses on mount
 * - Re-focuses whenever any value in `deps` changes (e.g. attachments count, isParsing flips)
 * - Skips focusing while `skipWhen` is true (modals, camera, etc.)
 */
export function useAutoFocusInput<T extends HTMLTextAreaElement | HTMLInputElement>(
  ref: RefObject<T>,
  deps: ReadonlyArray<unknown> = [],
  skipWhen: boolean = false,
) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (skipWhen) return;
    const el = ref.current;
    if (!el) return;
    // Defer to next tick so layout/animations settle
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
