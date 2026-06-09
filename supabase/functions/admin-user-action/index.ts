import { requireAdmin, canWrite, isSuper, audit, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only" }, 403);

  try {
    const { userId, action, reason } = await req.json();
    if (!userId || !action) return jsonResponse({ error: "userId and action required" }, 400);

    const s = ctx.service;
    let result: unknown = null;

    switch (action) {
      case "suspend": {
        const { error } = await s.auth.admin.updateUserById(userId, { ban_duration: "8760h" });
        if (error) throw error;
        result = { suspended: true };
        break;
      }
      case "unsuspend": {
        const { error } = await s.auth.admin.updateUserById(userId, { ban_duration: "none" });
        if (error) throw error;
        result = { suspended: false };
        break;
      }
      case "ban": {
        const { error } = await s.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
        if (error) throw error;
        result = { banned: true };
        break;
      }
      case "delete": {
        if (!isSuper(ctx)) return jsonResponse({ error: "Only SUPER_ADMIN can delete" }, 403);
        const { error } = await s.auth.admin.deleteUser(userId);
        if (error) throw error;
        result = { deleted: true };
        break;
      }
      default:
        return jsonResponse({ error: "unknown action" }, 400);
    }

    await audit(ctx, `user.${action}`, "user", userId, null, { reason, result }, "high");
    return jsonResponse({ ok: true, result });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
