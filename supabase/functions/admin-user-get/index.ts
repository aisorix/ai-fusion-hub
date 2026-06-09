import { requireAdmin, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  try {
    const { userId } = await req.json();
    if (!userId) return jsonResponse({ error: "userId required" }, 400);
    const s = ctx.service;

    const [authUser, profile, sub, payments, tickets, audits] = await Promise.all([
      s.auth.admin.getUserById(userId),
      s.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      s.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
      s.from("payment_history").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      s.from("chat_conversations").select("id, subject, status, priority, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      s.from("audit_logs").select("*").eq("resource_id", userId).order("created_at", { ascending: false }).limit(50),
    ]);

    return jsonResponse({
      auth: { id: authUser.data.user?.id, email: authUser.data.user?.email, createdAt: authUser.data.user?.created_at, lastSignInAt: authUser.data.user?.last_sign_in_at },
      profile: profile.data,
      subscription: sub.data,
      payments: payments.data ?? [],
      tickets: tickets.data ?? [],
      auditLog: audits.data ?? [],
    });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
