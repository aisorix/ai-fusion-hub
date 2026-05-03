// Nango helper: builds session tokens, lists/deletes connections, proxies API calls.
// Multi-tenant: connection_id == auth.uid() for each (user, provider) pair.

const NANGO_BASE = "https://api.nango.dev";

function nangoKey(): string {
  const k = Deno.env.get("NANGO_SECRET_KEY");
  if (!k) throw new Error("NANGO_SECRET_KEY not configured");
  return k;
}

export async function nangoFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${nangoKey()}`);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  return await fetch(`${NANGO_BASE}${path}`, { ...init, headers });
}

/**
 * Create a Nango Connect session token (used to launch hosted OAuth UI).
 * Returns the hosted URL the browser should be redirected to.
 */
export async function createConnectSession(opts: {
  userId: string;
  email?: string;
  provider: string;            // integration unique key
  redirectUri: string;         // where the browser comes back after OAuth
}): Promise<{ url: string; sessionToken: string }> {
  const body = {
    end_user: { id: opts.userId, email: opts.email ?? undefined },
    allowed_integrations: [opts.provider],
  };
  const r = await nangoFetch("/connect/sessions", { method: "POST", body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) {
    throw new Error(`nango_session_failed: ${JSON.stringify(j)}`);
  }
  const token = j?.data?.token ?? j?.token;
  if (!token) throw new Error("nango_no_token");
  // Hosted Connect UI URL with redirect param
  const url = `https://connect.nango.dev?session_token=${encodeURIComponent(token)}&redirect_uri=${encodeURIComponent(opts.redirectUri)}`;
  return { url, sessionToken: token };
}

export async function getConnection(provider: string, connectionId: string) {
  const r = await nangoFetch(`/connection/${encodeURIComponent(connectionId)}?provider_config_key=${encodeURIComponent(provider)}`);
  if (!r.ok) return null;
  return await r.json();
}

export async function deleteConnection(provider: string, connectionId: string) {
  return await nangoFetch(`/connection/${encodeURIComponent(connectionId)}?provider_config_key=${encodeURIComponent(provider)}`, { method: "DELETE" });
}

export async function nangoProxy(opts: {
  provider: string;
  connectionId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;          // path on the upstream provider, e.g. /me
  body?: unknown;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}) {
  const qs = opts.query ? "?" + new URLSearchParams(opts.query).toString() : "";
  const r = await nangoFetch(`/proxy${opts.endpoint}${qs}`, {
    method: opts.method,
    headers: {
      "Provider-Config-Key": opts.provider,
      "Connection-Id": opts.connectionId,
      ...(opts.headers ?? {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await r.text();
  let data: unknown = text;
  try { data = JSON.parse(text); } catch { /* keep text */ }
  return { ok: r.ok, status: r.status, data };
}
