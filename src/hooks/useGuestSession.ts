// Guest session for unauthenticated visitors.
// Stores a stable guest_id + token usage in localStorage so guests
// can try the chat & free tools before being asked to sign up.

import { useCallback, useEffect, useState } from "react";

const GUEST_ID_KEY = "sorix_guest_id";
const GUEST_TOKENS_KEY = "sorix_guest_tokens_used";
export const GUEST_TOKEN_LIMIT = 15000; // ~one full free-plan budget for trial

const isBrowser = typeof window !== "undefined";

const readId = (): string => {
  if (!isBrowser) return "";
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
};

const readTokens = (): number => {
  if (!isBrowser) return 0;
  const raw = localStorage.getItem(GUEST_TOKENS_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export const useGuestSession = (isAuthenticated: boolean) => {
  const [guestId, setGuestId] = useState<string>("");
  const [guestTokensUsed, setGuestTokensUsed] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) return;
    setGuestId(readId());
    setGuestTokensUsed(readTokens());
  }, [isAuthenticated]);

  const addGuestTokens = useCallback((n: number) => {
    if (!isBrowser || !Number.isFinite(n) || n <= 0) return;
    const next = Math.min(readTokens() + Math.ceil(n), GUEST_TOKEN_LIMIT);
    localStorage.setItem(GUEST_TOKENS_KEY, String(next));
    setGuestTokensUsed(next);
  }, []);

  const resetGuest = useCallback(() => {
    if (!isBrowser) return;
    localStorage.removeItem(GUEST_TOKENS_KEY);
    setGuestTokensUsed(0);
  }, []);

  return {
    isGuest: !isAuthenticated,
    guestId,
    guestTokensUsed,
    guestTokensLimit: GUEST_TOKEN_LIMIT,
    guestTokensRemaining: Math.max(0, GUEST_TOKEN_LIMIT - guestTokensUsed),
    isGuestLimitReached: !isAuthenticated && guestTokensUsed >= GUEST_TOKEN_LIMIT,
    addGuestTokens,
    resetGuest,
  };
};

// Plain readers usable outside React (e.g. API layer)
export const getGuestId = (): string => readId();
export const getGuestTokensUsed = (): number => readTokens();
export const addGuestTokensRaw = (n: number) => {
  if (!isBrowser || !Number.isFinite(n) || n <= 0) return;
  const next = Math.min(readTokens() + Math.ceil(n), GUEST_TOKEN_LIMIT);
  localStorage.setItem(GUEST_TOKENS_KEY, String(next));
};
export const isGuestOverLimit = (): boolean => readTokens() >= GUEST_TOKEN_LIMIT;
