import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOKENS_PER_IMAGE = 12000;

const ALLOWED_MODELS = [
  "black-forest-labs/flux.2-klein-4b",
  "google/gemini-2.5-flash-image",
  "google/gemini-3.1-flash-image-preview",
  "google/gemini-3-pro-image-preview",
  "openai/gpt-5-image-mini",
];

const PRO_ONLY_MODELS = ["google/gemini-3-pro-image-preview"];

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

    const { prompt, style, model: requestedModel, imageData, width = 1024, height = 1024 } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selectedModel = requestedModel && ALLOWED_MODELS.includes(requestedModel)
      ? requestedModel
      : "black-forest-labs/flux.2-klein-4b";

    // Check token balance
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

    if (currentUsed + TOKENS_PER_IMAGE > limit) {
      return new Response(
        JSON.stringify({ error: "insufficient_tokens", tokensUsed: currentUsed, tokensLimit: limit }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pro-only model check
    if (PRO_ONLY_MODELS.includes(selectedModel) && !["pro", "premium"].includes(planId)) {
      return new Response(
        JSON.stringify({ error: "This model requires a Pro or Premium plan" }),
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

    // Build messages based on whether we have an image to edit
    let messages: any[];
    if (imageData && typeof imageData === "string") {
      // Multimodal: image editing
      messages = [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: imageData } },
          { type: "text", text: finalPrompt },
        ],
      }];
    } else {
      messages = [{ role: "user", content: finalPrompt }];
    }

    // Determine modalities based on model
    const isFlux = selectedModel.startsWith("black-forest-labs/");
    const modalities = isFlux ? ["image"] : ["text", "image"];

    const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sorixai.lovable.app",
        "X-Title": "Sorix Imagine",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        modalities,
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

    // Extract image from response - handle multiple formats
    const message = orData.choices?.[0]?.message;
    let imageUrl = "";

    // Format 1: message.images array (Flux)
    if (message?.images?.length > 0) {
      imageUrl = message.images[0]?.image_url?.url || "";
    }

    // Format 2: content array with image_url parts (Gemini/GPT)
    if (!imageUrl && Array.isArray(message?.content)) {
      for (const part of message.content) {
        if (part.type === "image_url" && part.image_url?.url) {
          imageUrl = part.image_url.url;
          break;
        }
        // Some models return inline_data
        if (part.type === "image" && part.image_url?.url) {
          imageUrl = part.image_url.url;
          break;
        }
      }
    }

    // Format 3: content is a data URI string
    if (!imageUrl && typeof message?.content === "string" && message.content.startsWith("data:image")) {
      imageUrl = message.content;
    }

    // Format 4: check for base64 in content parts
    if (!imageUrl && Array.isArray(message?.content)) {
      for (const part of message.content) {
        if (typeof part === "string" && part.startsWith("data:image")) {
          imageUrl = part;
          break;
        }
        if (part.type === "text" && typeof part.text === "string" && part.text.startsWith("data:image")) {
          imageUrl = part.text;
          break;
        }
      }
    }

    if (!imageUrl) {
      console.error("Could not extract image. Message:", JSON.stringify(message)?.substring(0, 500));
      return new Response(JSON.stringify({ error: "No image returned from model" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save to DB
    const { data: insertedRow, error: insertErr } = await supabase
      .from("image_generations")
      .insert({
        user_id: userId,
        prompt,
        style: style || null,
        image_url: imageUrl,
        width,
        height,
        tokens_used: TOKENS_PER_IMAGE,
        model: selectedModel,
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
        imageUrl,
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
