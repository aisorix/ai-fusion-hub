import { requireAdmin, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  try {
    const body = await req.json().catch(() => ({}));
    const page = Math.max(1, Number(body.page ?? 1));
    const limit = Math.min(100, Math.max(10, Number(body.limit ?? 25)));
    const search = (body.search ?? "").toString().trim();
    const plan = (body.plan ?? "").toString();
    const sortBy = ["created_at", "full_name"].includes(body.sortBy) ? body.sortBy : "created_at";
    const sortOrder = body.sortOrder === "asc" ? true : false;

    const s = ctx.service;
    let q = s
      .from("profiles")
      .select("user_id, full_name, avatar_url, country_code, phone, created_at", { count: "exact" })
      .order(sortBy, { ascending: sortOrder });

    if (search) {
      q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    const from = (page - 1) * limit;
    q = q.range(from, from + limit - 1);
    const { data: profiles, count, error } = await q;
    if (error) throw error;

    const userIds = (profiles ?? []).map((p) => p.user_id);
    let subs: any[] = [];
    if (userIds.length) {
      const { data } = await s
        .from("subscriptions")
        .select("user_id, plan_id, status, tokens_used, amount, current_period_end")
        .in("user_id", userIds);
      subs = data ?? [];
    }
    const subByUser = new Map(subs.map((x) => [x.user_id, x]));

    // Email lookup via admin API
    const emails = new Map<string, string>();
    for (const uid of userIds) {
      try {
        const { data: u } = await s.auth.admin.getUserById(uid);
        if (u.user?.email) emails.set(uid, u.user.email);
      } catch { /* ignore */ }
    }

    const users = (profiles ?? []).map((p) => {
      const sub = subByUser.get(p.user_id);
      return {
        userId: p.user_id,
        fullName: p.full_name,
        email: emails.get(p.user_id) ?? "",
        avatarUrl: p.avatar_url,
        country: p.country_code,
        plan: sub?.plan_id ?? "free",
        status: sub?.status ?? "active",
        tokensUsed: sub?.tokens_used ?? 0,
        amount: sub?.amount ?? 0,
        joined: p.created_at,
        renewsAt: sub?.current_period_end,
      };
    });

    const filtered = plan ? users.filter((u) => u.plan === plan) : users;

    return jsonResponse({
      users: filtered,
      total: count ?? users.length,
      page,
      limit,
    });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
