import { RefObject, useEffect, useRef } from 'react';

/**
 * Keeps a textarea/input always ready for typing.
 *
 * Desktop: focuses on initial mount and on every dep change (so input is always ready).
 * Mobile (when `mobileOnlyDeps` is true):
 *   - Does NOT focus on initial mount (keyboard stays closed on page load)
 *   - Does NOT focus when popovers/menus toggle
 *   - ONLY focuses when the FIRST dep increases (convention: attachments.length),
 *     i.e. right after the user uploads a file/image.
 *
 * Skips focusing while `skipWhen` is true (modals, generating, etc.).
 */
export function useAutoFocusInput<T extends HTMLTextAreaElement | HTMLInputElement>(
  ref: RefObject<T>,
  deps: ReadonlyArray<unknown> = [],
  skipWhen: boolean = false,
  mobileOnlyDeps: boolean = false,
) {
  const mountedRef = useRef(false);
  const prevFirstDepRef = useRef<unknown>(deps[0]);

  useEffect(() => {
    if (skipWhen) return;

    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches;

    const isMount = !mountedRef.current;
    mountedRef.current = true;

    if (mobileOnlyDeps && isMobile) {
      // On mobile: never focus on mount, never focus on arbitrary dep changes.
      // Only focus when the first dep (attachments.length) INCREASED.
      const prev = prevFirstDepRef.current;
      const curr = deps[0];
      prevFirstDepRef.current = curr;

      if (isMount) return;
      if (typeof curr !== 'number' || typeof prev !== 'number') return;
      if (curr <= prev) return;
    } else {
      // Desktop (or hook used without mobile gating): keep first-dep snapshot fresh.
      prevFirstDepRef.current = deps[0];
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
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipWhen, ...deps]);
}
