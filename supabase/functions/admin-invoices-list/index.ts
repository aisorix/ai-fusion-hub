import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(200, Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "50", 10)));
  const exportCsv = url.searchParams.get("export") === "csv";

  if (exportCsv) {
    const { data } = await ctx.service.from("payment_history").select("*").order("created_at", { ascending: false }).limit(10000);
    const headers = ["id","user_id","amount","currency","status","payment_method","created_at"];
    const csv = [headers.join(",")].concat((data ?? []).map((r: any) =>
      headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")
    )).join("\n");
    return new Response(csv, {
      headers: { ...corsHeaders, "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="invoices.csv"` },
    });
  }

  const from = (page - 1) * pageSize;
  const { data, count, error } = await ctx.service
    .from("payment_history").select("*", { count: "exact" })
    .order("created_at", { ascending: false }).range(from, from + pageSize - 1);
  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ rows: data ?? [], total: count ?? 0, page, pageSize });
});
