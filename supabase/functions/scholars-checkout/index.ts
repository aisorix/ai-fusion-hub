import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SSLCOMMERZ_STORE_ID = Deno.env.get("SSLCOMMERZ_STORE_ID");
const SSLCOMMERZ_STORE_PASSWORD = Deno.env.get("SSLCOMMERZ_STORE_PASSWORD");
const SSLCOMMERZ_SANDBOX = Deno.env.get("SSLCOMMERZ_SANDBOX") !== "false";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/payment-webhook`;

type Kind = "course" | "workshop" | "competition";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return json({ success: false, error: "Missing authorization" }, 401);
    }

    const userClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ success: false, error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const kind = body?.kind as Kind;
    const slug = String(body?.slug || "").trim();
    const seats = Math.max(1, Math.min(50, parseInt(body?.seats ?? "1", 10) || 1));
    const teamName = (body?.team_name as string | undefined)?.slice(0, 120) ?? null;
    const origin = body?.origin || req.headers.get("origin") || "";

    if (!["course", "workshop", "competition"].includes(kind) || !slug) {
      return json({ success: false, error: "Invalid input" }, 400);
    }

    const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Look up trusted price from DB
    const { data: itemData, error: itemErr } = await admin.rpc("get_scholars_item", {
      _kind: kind, _slug: slug,
    });
    if (itemErr || !itemData) {
      return json({ success: false, error: "Item not found" }, 404);
    }
    const item: any = itemData;
    if (!item.is_published) return json({ success: false, error: "Item not available" }, 400);

    // Already enrolled / booked?
    if (kind === "course") {
      const { data: existing } = await admin.from("course_purchases")
        .select("id").eq("user_id", user.id).eq("course_id", item.id).maybeSingle();
      if (existing) return json({ success: false, error: "Already enrolled" }, 409);
    }
    if (kind === "competition") {
      const { data: existing } = await admin.from("competition_registrations")
        .select("id").eq("user_id", user.id).eq("competition_id", item.id).maybeSingle();
      if (existing) return json({ success: false, error: "Already registered" }, 409);
    }
    if (kind === "workshop" && item.seats_total) {
      if ((item.seats_booked || 0) + seats > item.seats_total) {
        return json({ success: false, error: "Not enough seats available" }, 400);
      }
    }

    const unitPrice = Number(item.price) || 0;
    const totalAmount = kind === "workshop" ? unitPrice * seats : unitPrice;

    // Free enrollment shortcut — skip gateway, write directly + enroll
    if (totalAmount <= 0) {
      await fulfilFree(admin, user.id, user.email || "", kind, item, seats, teamName);
      return json({ success: true, free: true, redirect: `/sorixscholars/${kind === "workshop" ? "workshops" : kind === "course" ? "courses" : "competitions"}/${slug}?enrolled=1` });
    }

    if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
      return json({ success: false, error: "Payment gateway not configured" }, 500);
    }

    const tranId = `SCHOLARS_${kind.toUpperCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const { error: intentErr } = await admin.from("payment_intents").insert({
      gateway: "sslcommerz",
      external_id: tranId,
      user_id: user.id,
      plan_id: `scholars_${kind}`,
      amount: totalAmount,
      currency: "BDT",
      billing_cycle: "monthly",
      status: "pending",
      kind,
      item_slug: slug,
      seats: kind === "workshop" ? seats : null,
      metadata: { item_id: item.id, item_title: item.title, team_name: teamName },
    });
    if (intentErr) {
      console.error("Intent insert failed:", intentErr);
      return json({ success: false, error: "Could not initialize payment" }, 500);
    }

    const url = SSLCOMMERZ_SANDBOX
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const form = new URLSearchParams();
    form.append("store_id", SSLCOMMERZ_STORE_ID);
    form.append("store_passwd", SSLCOMMERZ_STORE_PASSWORD);
    form.append("total_amount", totalAmount.toString());
    form.append("currency", "BDT");
    form.append("tran_id", tranId);
    form.append("success_url", `${origin}/payment/success?tran_id=${tranId}&gateway=sslcommerz&scope=scholars`);
    form.append("fail_url", `${origin}/payment/failed?tran_id=${tranId}&gateway=sslcommerz&scope=scholars`);
    form.append("cancel_url", `${origin}/payment/cancel?tran_id=${tranId}&gateway=sslcommerz&scope=scholars`);
    form.append("ipn_url", WEBHOOK_URL);
    form.append("cus_name", user.user_metadata?.full_name || "Sorix Scholar");
    form.append("cus_email", user.email || "noreply@aisorix.com");
    form.append("cus_phone", "01700000000");
    form.append("cus_add1", "Dhaka");
    form.append("cus_city", "Dhaka");
    form.append("cus_country", "Bangladesh");
    form.append("shipping_method", "NO");
    form.append("product_name", `${item.title} (${kind})`);
    form.append("product_category", "Scholars");
    form.append("product_profile", "non-physical-goods");

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const result = await resp.json();
    if (result.status !== "SUCCESS") {
      return json({ success: false, error: result.failedreason || "Gateway error" }, 400);
    }
    return json({ success: true, gatewayPageURL: result.GatewayPageURL, tranId });
  } catch (e: any) {
    console.error("scholars-checkout error:", e);
    return json({ success: false, error: e.message }, 500);
  }
});

async function fulfilFree(admin: any, userId: string, email: string, kind: Kind, item: any, seats: number, team: string | null) {
  if (kind === "course") {
    await admin.from("course_purchases").upsert({
      user_id: userId, course_id: item.id, amount_paid: 0, currency: "BDT", status: "confirmed",
    }, { onConflict: "user_id,course_id" });
    await admin.from("user_enrollments").upsert({
      user_id: userId, kind: "course", source_slug: item.slug, title: item.title,
    }, { onConflict: "user_id,kind,source_slug" });
  } else if (kind === "workshop") {
    await admin.from("workshop_bookings").insert({
      user_id: userId, workshop_id: item.id, seats, amount_paid: 0, currency: "BDT", status: "confirmed",
    });
    await admin.from("user_enrollments").upsert({
      user_id: userId, kind: "workshop", source_slug: item.slug, title: item.title,
    }, { onConflict: "user_id,kind,source_slug" });
  } else if (kind === "competition") {
    await admin.from("competition_registrations").upsert({
      user_id: userId, competition_id: item.id, team_name: team, amount_paid: 0, currency: "BDT", status: "confirmed",
    }, { onConflict: "user_id,competition_id" });
    await admin.from("user_enrollments").upsert({
      user_id: userId, kind: "competition", source_slug: item.slug, title: item.title,
    }, { onConflict: "user_id,kind,source_slug" });
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
