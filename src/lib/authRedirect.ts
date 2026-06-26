// Centralised post-auth redirect logic so login/register/OAuth/verify-email
// all send the user back to wherever they came from.

const STORAGE_KEY = "postAuthReturnTo";
const LAST_VISITED_KEY = "lastVisitedPath";
const DEFAULT_REDIRECT = "/chat";

const BLOCKED_PREFIXES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/admin/login",
];

export function sanitizeReturnTo(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  // Must be a same-origin path. Reject protocol-relative or absolute URLs.
  if (!v.startsWith("/") || v.startsWith("//")) return null;
  if (BLOCKED_PREFIXES.some((p) => v === p || v.startsWith(p + "/") || v.startsWith(p + "?"))) {
    return null;
  }
  return v;
}

export function rememberReturnTo(path: string | null | undefined): void {
  const safe = sanitizeReturnTo(path);
  if (safe) {
    try {
      sessionStorage.setItem(STORAGE_KEY, safe);
    } catch {
      /* ignore */
    }
  }
}

export function rememberLastVisited(path: string | null | undefined): void {
  const safe = sanitizeReturnTo(path);
  if (safe) {
    try {
      sessionStorage.setItem(LAST_VISITED_KEY, safe);
    } catch {
      /* ignore */
    }
  }
}

interface LocationStateLike {
  returnTo?: unknown;
  from?: unknown;
  redirect?: unknown;
}

/**
 * Resolve where the user should land after authentication.
 * Priority: explicit state.returnTo → state.from → query/explicit override
 *           → sessionStorage.postAuthReturnTo → sessionStorage.lastVisitedPath → /chat
 * Consumes (clears) the sessionStorage values when used.
 */
export function consumePostAuthRedirect(
  state?: LocationStateLike | null,
  explicitOverride?: string | null,
): string {
  const candidates: Array<unknown> = [
    state?.returnTo,
    state?.from,
    state?.redirect,
    explicitOverride,
  ];

  for (const c of candidates) {
    const safe = sanitizeReturnTo(c);
    if (safe) {
      clearStored();
      return safe;
    }
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const safe = sanitizeReturnTo(stored);
    if (safe) {
      clearStored();
      return safe;
    }
  } catch {
    /* ignore */
  }

  try {
    const last = sessionStorage.getItem(LAST_VISITED_KEY);
    const safe = sanitizeReturnTo(last);
    if (safe) {
      clearStored();
      return safe;
    }
  } catch {
    /* ignore */
  }

  return DEFAULT_REDIRECT;
}

function clearStored() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(LAST_VISITED_KEY);
  } catch {
    /* ignore */
  }
}
