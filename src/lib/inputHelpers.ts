import type React from "react";

/** True when the current device uses a touch/soft keyboard (mobile/tablet). */
const isMobileLikeDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia?.("(pointer: coarse)").matches) return true;
  } catch {
    /* noop */
  }
  return "ontouchstart" in window || (navigator?.maxTouchPoints ?? 0) > 0;
};

/**
 * Returns true only for a deliberate Enter submit.
 * - Desktop: Enter submits, Shift+Enter inserts a newline.
 * - Mobile / touch devices: Enter NEVER submits — it inserts a newline like
 *   Shift+Enter so users can type spaces and multi-line messages naturally.
 *   Only the on-screen Send button submits.
 * - Always ignores IME composition (Gboard / SwiftKey / iOS predictive text
 *   fire synthetic Enter events with keyCode 229 or isComposing=true).
 */
export const isSubmitEnter = (e: React.KeyboardEvent): boolean => {
  if (e.key !== "Enter" || e.shiftKey) return false;
  const native = e.nativeEvent as KeyboardEvent & { isComposing?: boolean; keyCode?: number };
  if (native?.isComposing) return false;
  if (native?.keyCode === 229) return false;
  if (isMobileLikeDevice()) return false;
  return true;
};
