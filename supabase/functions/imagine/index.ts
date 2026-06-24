import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_MODEL = "sourceful/riverflow-v2-fast-preview";

// Tier-based per-image cost (at 1K resolution, single image).
const TIER_COST: Record<string, number> = {
  basic: 25000,
  pro: 35000,
  premium: 45000,
};

const MODEL_TIER: Record<string, 'basic' | 'pro' | 'premium'> = {
  "sourceful/riverflow-v2-fast-preview": 'basic',
  "sourceful/riverflow-v2-standard-preview": 'basic',
  "x-ai/grok-imagine-image-quality": 'basic',
  "google/gemini-2.5-flash-image": 'basic',
  "google/gemini-3.1-flash-image-preview": 'basic',
  "openai/gpt-5-image-mini": 'basic',
  "openai/gpt-5.4-image-2": 'pro',
  "bytedance-seed/seedream-4.5": 'pro',
  "google/gemini-3-pro-image-preview": 'premium',
  "black-forest-labs/flux.2-max": 'premium',
  "black-forest-labs/flux.2-pro": 'premium',
};

const ALLOWED_MODELS = Object.keys(MODEL_TIER);

const PLAN_RANK: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 };
const TIER_RANK: Record<string, number> = { basic: 1, pro: 2, premium: 3 };

const ASPECT_DIMENSIONS: Record<string, [number, number]> = {
  "1:1": [1024, 1024],
  "16:9": [1280, 720],
  "9:16": [720, 1280],
  "4:3": [1152, 864],
  "3:4": [864, 1152],
  "3:2": [1216, 832],
  "2:3": [832, 1216],
  "21:9": [1536, 640],
};

const RESOLUTION_MULTIPLIER: Record<string, number> = { "1K": 1, "2K": 2, "4K": 4 };

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const body = await req.json();
    const {
      prompt,
      model: requestedModel,
      imageData,
      aspectRatio = "1:1",
      resolution = "1K",
      format = "webp",
      count: rawCount = 1,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selectedModel = requestedModel && ALLOWED_MODELS.includes(requestedModel)
      ? requestedModel
      : DEFAULT_MODEL;

    const aspect = ASPECT_DIMENSIONS[aspectRatio] ? aspectRatio : "1:1";
    const resKey = RESOLUTION_MULTIPLIER[resolution] ? resolution : "1K";
    const fmt = ["webp", "png", "jpg"].includes(format) ? format : "webp";
    const count = Math.max(1, Math.min(4, Number(rawCount) || 1));

    const [baseW, baseH] = ASPECT_DIMENSIONS[aspect];
    const mult = RESOLUTION_MULTIPLIER[resKey];
    const width = baseW * mult;
    const height = baseH * mult;

    // Plan check
    const { data: sub } = await supabase
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
      premium_plus: 7000000,
      max: 17000000,
      enterprise: 50000000,
    };

    const currentUsed = sub?.tokens_used ?? 0;
    const planId = sub?.plan_id ?? "free";
    const limit = planLimits[planId] ?? 15000;
    const isProPlus = planId === "pro" || planId === "premium";
    const isFreeTier = planId === "free";

    const modelTier = MODEL_TIER[selectedModel] ?? 'basic';
    const perImageCost = TIER_COST[modelTier];

    // Free-tier trial: up to 3 free image renders, no model-tier or token gates.
    let isFreeTrial = false;
    if (isFreeTier) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("imagine_free_renders_used")
        .eq("user_id", userId)
        .maybeSingle();
      const used = (prof as any)?.imagine_free_renders_used ?? 0;
      if (used + count > 3) {
        return new Response(
          JSON.stringify({
            error: "free_trial_exhausted",
            message: "Free Sorix Imagine trial used up — upgrade to keep creating.",
            usedFreeRenders: used,
            freeLimit: 3,
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      isFreeTrial = true;
    }

    if (!isFreeTrial && (PLAN_RANK[planId] ?? 0) < (TIER_RANK[modelTier] ?? 1)) {
      return new Response(
        JSON.stringify({ error: `This model requires a ${modelTier} plan or above` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if ((resKey === "2K" || resKey === "4K") && !isProPlus) {
      return new Response(
        JSON.stringify({ error: "2K/4K resolution requires a Pro or Premium plan" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (count > 2 && !isProPlus) {
      return new Response(
        JSON.stringify({ error: "3+ outputs require a Pro or Premium plan" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const totalCost = perImageCost * count * mult;
    if (!isFreeTrial && currentUsed + totalCost > limit) {
      return new Response(
        JSON.stringify({ error: "insufficient_tokens", tokensUsed: currentUsed, tokensLimit: limit }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterKey) {
      return new Response(JSON.stringify({ error: "Image generation not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Always append user details to the prompt so models honor aspect/format hints.
    const detailLine = `Aspect ratio: ${aspect}. Resolution: ${resKey}. Output format: ${fmt.toUpperCase()}.`;
    const finalPrompt = `${prompt.trim()}\n\n${detailLine}`;

    const buildMessages = () => {
      if (imageData && typeof imageData === "string") {
        return [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageData } },
            { type: "text", text: finalPrompt },
          ],
        }];
      }
      return [{ role: "user", content: finalPrompt }];
    };

    const FALLBACK_MODEL = "google/gemini-2.5-flash-image";

    const extractImage = (orData: any): string => {
      const message = orData?.choices?.[0]?.message;
      if (!message) return "";
      if (message.images?.length > 0) {
        const u = message.images[0]?.image_url?.url || message.images[0]?.url;
        if (u) return u;
      }
      if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if ((part.type === "image_url" || part.type === "image") && (part.image_url?.url || part.url)) {
            return part.image_url?.url || part.url;
          }
        }
      }
      if (typeof message.content === "string") {
        if (message.content.startsWith("data:image")) return message.content;
        const md = message.content.match(/!\[[^\]]*\]\((data:image[^)]+|https?:\/\/[^)\s]+\.(?:png|jpg|jpeg|webp))\)/i);
        if (md) return md[1];
      }
      return "";
    };

    const callModel = async (model: string): Promise<{ url?: string; error?: string; status?: number }> => {
      const isFlux = model.startsWith("black-forest-labs/");
      const modalities = isFlux ? ["image"] : ["text", "image"];
      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://sorixai.lovable.app",
          "X-Title": "Sorix Imagine",
        },
        body: JSON.stringify({ model, messages: buildMessages(), modalities }),
      });
      const raw = await orResponse.text();
      if (!orResponse.ok) {
        console.error("OpenRouter error:", model, orResponse.status, raw.slice(0, 300));
        return { error: raw.slice(0, 200), status: orResponse.status };
      }
      let data: any = {};
      try { data = JSON.parse(raw); } catch { /* */ }
      const url = extractImage(data);
      if (!url) {
        console.error("No image extracted:", model, JSON.stringify(data?.choices?.[0]?.message)?.slice(0, 300));
        return { error: "No image returned from model", status: 502 };
      }
      return { url };
    };

    const generateOnce = async (): Promise<{ url?: string; error?: string }> => {
      let lastErr = "";
      // Try selected model with up to 3 attempts (initial + 2 retries) on transient errors.
      for (let attempt = 0; attempt < 3; attempt++) {
        const r = await callModel(selectedModel);
        if (r.url) return { url: r.url };
        lastErr = r.error || "Generation failed";
        const transient = !r.status || r.status >= 500 || r.status === 429 || r.status === 502;
        if (!transient) break;
        await new Promise((res) => setTimeout(res, 600 * (attempt + 1)));
      }
      // Auto-fallback to a reliable model
      if (selectedModel !== FALLBACK_MODEL) {
        console.warn(`[imagine] falling back to ${FALLBACK_MODEL} after ${selectedModel} failed`);
        const r = await callModel(FALLBACK_MODEL);
        if (r.url) return { url: r.url };
        lastErr = r.error || lastErr;
      }
      return { error: lastErr };
    };

    const settled = await Promise.all(
      Array.from({ length: count }).map(() => generateOnce())
    );
    const imageUrls: string[] = [];
    const ids: string[] = [];
    let firstError = "";
    for (const s of settled) {
      if (s.url) imageUrls.push(s.url);
      else if (!firstError && s.error) firstError = s.error;
    }

    if (imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: firstError || "Image generation failed. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Persist each generated image
    for (const url of imageUrls) {
      const { data: row } = await supabase
        .from("image_generations")
        .insert({
          user_id: userId,
          prompt,
          style: null,
          image_url: url,
          width,
          height,
          tokens_used: perImageCost * mult,
          model: selectedModel,
        })
        .select("id")
        .single();
      if (row?.id) ids.push(row.id);
    }

    const actualCost = perImageCost * imageUrls.length * mult;
    if (sub) {
      await supabase
        .from("subscriptions")
        .update({ tokens_used: currentUsed + actualCost })
        .eq("user_id", userId)
        .eq("status", "active");
    }

    return new Response(
      JSON.stringify({
        imageUrls,
        imageUrl: imageUrls[0],
        ids,
        tokensUsed: actualCost,
        totalTokensUsed: currentUsed + actualCost,
        width,
        height,
        format: fmt,
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
