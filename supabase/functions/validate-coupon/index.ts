import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const rawCode = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
    const amount = Number(body?.amount);
    if (!rawCode || rawCode.length < 2 || rawCode.length > 64) {
      return json({ valid: false, error: "Invalid code" }, 400);
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return json({ valid: false, error: "Invalid amount" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: coupon, error } = await admin
      .from("coupons")
      .select("code, percent_off, amount_off, max_redemptions, redeemed_count, expires_at, active")
      .ilike("code", rawCode)
      .maybeSingle();

    if (error) return json({ valid: false, error: "Lookup failed" }, 500);
    if (!coupon || !coupon.active) return json({ valid: false, error: "Coupon not found" }, 404);
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return json({ valid: false, error: "Coupon expired" }, 410);
    }
    if (
      coupon.max_redemptions != null &&
      (coupon.redeemed_count ?? 0) >= coupon.max_redemptions
    ) {
      return json({ valid: false, error: "Coupon fully redeemed" }, 410);
    }

    let discount = 0;
    if (coupon.percent_off && coupon.percent_off > 0) {
      discount = Math.round((amount * Math.min(coupon.percent_off, 100)) / 100);
    } else if (coupon.amount_off && Number(coupon.amount_off) > 0) {
      discount = Math.min(Number(coupon.amount_off), amount);
    }
    const finalAmount = Math.max(amount - discount, 0);

    return json({
      valid: true,
      code: coupon.code,
      percent_off: coupon.percent_off ?? null,
      amount_off: coupon.amount_off ? Number(coupon.amount_off) : null,
      discount,
      final_amount: finalAmount,
    });
  } catch (e) {
    console.error("validate-coupon error:", e);
    return json({ valid: false, error: "Server error" }, 500);
  }
});
