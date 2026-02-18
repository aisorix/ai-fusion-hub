import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOKENS_PER_IMAGE = 12000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { prompt, style, width = 1024, height = 1024 } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check token balance
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("tokens_used, plan_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const planLimits: Record<string, number> = {
      free: 15000,
      basic: 800000,
      pro: 1500000,
      premium: 3000000,
    };

    const currentUsed = sub?.tokens_used ?? 0;
    const planId = sub?.plan_id ?? "free";
    const limit = planLimits[planId] ?? 15000;

    if (currentUsed + TOKENS_PER_IMAGE > limit) {
      return new Response(
        JSON.stringify({ error: "insufficient_tokens", tokensUsed: currentUsed, tokensLimit: limit }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build final prompt
    const finalPrompt = style ? `${prompt}, ${style}` : prompt;

    // Call OpenRouter
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterKey) {
      return new Response(JSON.stringify({ error: "Image generation not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sorixai.lovable.app",
        "X-Title": "Sorix Imagine",
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux.2-klein-4b",
        messages: [{ role: "user", content: finalPrompt }],
        modalities: ["image"],
      }),
    });

    if (!orResponse.ok) {
      const errBody = await orResponse.text();
      console.error("OpenRouter error:", orResponse.status, errBody);
      return new Response(
        JSON.stringify({ error: "Image generation failed", details: errBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orData = await orResponse.json();
    console.log("OpenRouter response structure:", JSON.stringify(orData).substring(0, 500));
    // Extract image from chat completions response
    const message = orData.choices?.[0]?.message;
    let imageUrl = "";
    // Images come in message.images array
    if (message?.images?.length > 0) {
      imageUrl = message.images[0]?.image_url?.url || "";
    }
    // Fallback: check content array
    if (!imageUrl && Array.isArray(message?.content)) {
      const imgPart = message.content.find((c: any) => c.type === "image_url");
      imageUrl = imgPart?.image_url?.url || "";
    }
    if (!imageUrl && typeof message?.content === "string" && message.content.startsWith("data:image")) {
      imageUrl = message.content;
    }

    if (!imageUrl) {
      console.error("Could not extract image. Content type:", typeof content, "Content preview:", JSON.stringify(content)?.substring(0, 300));
      return new Response(JSON.stringify({ error: "No image returned", debug: typeof content }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const finalImageUrl = imageUrl;

    // Save to DB
    const { data: insertedRow, error: insertErr } = await supabase
      .from("image_generations")
      .insert({
        user_id: userId,
        prompt,
        style: style || null,
        image_url: finalImageUrl,
        width,
        height,
        tokens_used: TOKENS_PER_IMAGE,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);
    }

    // Deduct tokens
    if (sub) {
      await supabase
        .from("subscriptions")
        .update({ tokens_used: currentUsed + TOKENS_PER_IMAGE })
        .eq("user_id", userId)
        .eq("status", "active");
    }

    return new Response(
      JSON.stringify({
        imageUrl: finalImageUrl,
        id: insertedRow?.id,
        tokensUsed: TOKENS_PER_IMAGE,
        totalTokensUsed: currentUsed + TOKENS_PER_IMAGE,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Imagine error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
