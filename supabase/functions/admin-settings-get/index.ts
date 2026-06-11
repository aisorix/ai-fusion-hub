import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const { data, error } = await ctx.service.from("system_settings").select("*");
  if (error) return jsonResponse({ error: error.message }, 500);
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return jsonResponse({ settings: map });
});
