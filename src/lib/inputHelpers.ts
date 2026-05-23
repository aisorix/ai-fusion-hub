import type React from "react";

/**
 * Returns true only for a deliberate Enter submit.
 * Guards against mobile IME composition (Gboard / SwiftKey / iOS predictive
 * text) which can fire synthetic Enter keydowns mid-typing (often with
 * keyCode 229 or isComposing true) and accidentally submit prompt bars.
 */
export const isSubmitEnter = (e: React.KeyboardEvent): boolean => {
  if (e.key !== "Enter" || e.shiftKey) return false;
  const native = e.nativeEvent as KeyboardEvent & { isComposing?: boolean; keyCode?: number };
  if (native?.isComposing) return false;
  if (native?.keyCode === 229) return false;
  return true;
};
