// OpenRouter helper with model fallback for the Sorix Agent router.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const PRIMARY_MODEL = "google/gemini-2.5-pro";
export const FALLBACK_MODEL = "google/gemini-2.5-flash";

function key(): string {
  const k = Deno.env.get("OPENROUTER_API_KEY");
  if (!k) throw new Error("OPENROUTER_API_KEY not configured");
  return k;
}

export async function openrouterChat(payload: Record<string, unknown>, model = PRIMARY_MODEL): Promise<Response> {
  return await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key()}`,
      "HTTP-Referer": "https://aisorix.com",
      "X-Title": "Sorix Agent",
    },
    body: JSON.stringify({ ...payload, model }),
  });
}

/** Retry once with the fallback model on 429/5xx. Optionally override the primary model. */
export async function openrouterChatWithFallback(
  payload: Record<string, unknown>,
  preferredModel?: string,
): Promise<Response> {
  const primary = preferredModel || PRIMARY_MODEL;
  const r = await openrouterChat(payload, primary);
  if (r.ok) return r;
  if (r.status === 429 || r.status >= 500) {
    const fallback = primary === FALLBACK_MODEL ? PRIMARY_MODEL : FALLBACK_MODEL;
    return await openrouterChat(payload, fallback);
  }
  return r;
}
