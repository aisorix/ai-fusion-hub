import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOKENS_PER_IMAGE = 12000;
const DEFAULT_MODEL = "sourceful/riverflow-v2-fast-preview";

const ALLOWED_MODELS = [
  "sourceful/riverflow-v2-fast-preview",
  "google/gemini-2.5-flash-image",
  "google/gemini-3.1-flash-image-preview",
  "google/gemini-3-pro-image-preview",
  "openai/gpt-5-image-mini",
  "openai/gpt-5.4-image-2",
  "x-ai/grok-imagine-image-quality",
  "bytedance-seed/seedream-4.5",
  "black-forest-labs/flux.2-max",
  "black-forest-labs/flux.2-pro",
];

const PRO_ONLY_MODELS = [
  "google/gemini-3-pro-image-preview",
  "openai/gpt-5.4-image-2",
  "black-forest-labs/flux.2-max",
  "black-forest-labs/flux.2-pro",
];

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
    };

    const currentUsed = sub?.tokens_used ?? 0;
    const planId = sub?.plan_id ?? "free";
    const limit = planLimits[planId] ?? 15000;
    const isProPlus = planId === "pro" || planId === "premium";

    if (PRO_ONLY_MODELS.includes(selectedModel) && !isProPlus) {
      return new Response(
        JSON.stringify({ error: "This model requires a Pro or Premium plan" }),
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

    const totalCost = TOKENS_PER_IMAGE * count * mult;
    if (currentUsed + totalCost > limit) {
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

    let messages: any[];
    if (imageData && typeof imageData === "string") {
      messages = [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: imageData } },
          { type: "text", text: prompt },
        ],
      }];
    } else {
      messages = [{ role: "user", content: prompt }];
    }

    const isFlux = selectedModel.startsWith("black-forest-labs/");
    const modalities = isFlux ? ["image"] : ["text", "image"];

    const generateOnce = async (): Promise<string> => {
      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://sorixai.lovable.app",
          "X-Title": "Sorix Imagine",
        },
        body: JSON.stringify({ model: selectedModel, messages, modalities }),
      });

      if (!orResponse.ok) {
        const errBody = await orResponse.text();
        console.error("OpenRouter error:", orResponse.status, errBody);
        throw new Error(`Generation failed: ${errBody.substring(0, 200)}`);
      }

      const orData = await orResponse.json();
      const message = orData.choices?.[0]?.message;
      let imageUrl = "";

      if (message?.images?.length > 0) {
        imageUrl = message.images[0]?.image_url?.url || "";
      }
      if (!imageUrl && Array.isArray(message?.content)) {
        for (const part of message.content) {
          if ((part.type === "image_url" || part.type === "image") && part.image_url?.url) {
            imageUrl = part.image_url.url; break;
          }
        }
      }
      if (!imageUrl && typeof message?.content === "string" && message.content.startsWith("data:image")) {
        imageUrl = message.content;
      }
      if (!imageUrl) {
        console.error("Could not extract image:", JSON.stringify(message)?.substring(0, 400));
        throw new Error("No image returned from model");
      }
      return imageUrl;
    };

    // Generate N in parallel
    const settled = await Promise.allSettled(
      Array.from({ length: count }).map(() => generateOnce())
    );
    const imageUrls: string[] = [];
    const ids: string[] = [];
    for (const s of settled) {
      if (s.status === "fulfilled") imageUrls.push(s.value);
    }

    if (imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "All image generations failed" }),
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
          tokens_used: TOKENS_PER_IMAGE * mult,
          model: selectedModel,
        })
        .select("id")
        .single();
      if (row?.id) ids.push(row.id);
    }

    const actualCost = TOKENS_PER_IMAGE * imageUrls.length * mult;
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
