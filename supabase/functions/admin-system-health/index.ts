import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

async function ping(url: string, opts: RequestInit = {}): Promise<{ ok: boolean; latency_ms: number }> {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(5000) });
    return { ok: r.ok || r.status === 401 || r.status === 405, latency_ms: Date.now() - t0 };
  } catch {
    return { ok: false, latency_ms: Date.now() - t0 };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const t0 = Date.now();
  const { error: dbErr } = await ctx.service.from("system_settings").select("key").limit(1);
  const dbLatency = Date.now() - t0;

  const [aiGw, openrouter] = await Promise.all([
    ping("https://ai.gateway.lovable.dev/v1/models", { headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY") ?? ""}` } }),
    ping("https://openrouter.ai/api/v1/models"),
  ]);

  const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: events } = await ctx.service.from("ai_events").select("status").gte("created_at", sinceIso);
  const total = (events ?? []).length;
  const errors = (events ?? []).filter((e: any) => e.status !== "success" && e.status !== "ok").length;
  const errorRate = total ? Math.round((errors / total) * 1000) / 10 : 0;

  return jsonResponse({
    db: { ok: !dbErr, latency_ms: dbLatency },
    ai_gateway: aiGw,
    openrouter,
    edge_functions: { calls_last_hour: total, error_rate_percent: errorRate },
    storage: { note: "tracked per bucket; see Storage panel" },
    checked_at: new Date().toISOString(),
  });
});
