// OpenRouter helper with model fallback for the Sorix Agent router.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const PRIMARY_MODEL = "anthropic/claude-3.5-sonnet";
export const FALLBACK_MODEL = "google/gemini-2.5-pro";

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

/** Retry once with the fallback model on 429/5xx. */
export async function openrouterChatWithFallback(payload: Record<string, unknown>): Promise<Response> {
  const r = await openrouterChat(payload, PRIMARY_MODEL);
  if (r.ok) return r;
  if (r.status === 429 || r.status >= 500) {
    return await openrouterChat(payload, FALLBACK_MODEL);
  }
  return r;
}
