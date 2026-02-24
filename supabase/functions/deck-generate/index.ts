import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOKENS_PER_SLIDE = 2000;
const TOKENS_PER_IMAGE = 12000;

const planLimits: Record<string, number> = {
  free: 15000,
  basic: 800000,
  pro: 1500000,
  premium: 3000000,
};

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

    const { prompt, slideCount = 5, theme = "dark", generateImages = true, textContent = "concise", artStyle = "illustration" } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check token balance
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("tokens_used, plan_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentUsed = sub?.tokens_used ?? 0;
    const planId = sub?.plan_id ?? "free";
    const limit = planLimits[planId] ?? 15000;

    const estimatedTextTokens = slideCount * TOKENS_PER_SLIDE;
    const estimatedImageTokens = generateImages ? slideCount * TOKENS_PER_IMAGE : 0;
    const estimatedTotal = estimatedTextTokens + estimatedImageTokens;

    if (currentUsed + estimatedTotal > limit) {
      return new Response(
        JSON.stringify({ error: "insufficient_tokens", tokensUsed: currentUsed, tokensLimit: limit }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call LLM for slide structure
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build text density instruction
    let textInstruction = "3-5 bullet points per slide";
    if (textContent === "minimal") textInstruction = "2-3 very short bullet points per slide";
    else if (textContent === "concise") textInstruction = "3-4 concise bullet points per slide";
    else if (textContent === "detailed") textInstruction = "4-6 longer, more detailed bullet points per slide";
    else if (textContent === "extensive") textInstruction = "5-8 detailed bullet points with thorough descriptions per slide";

    // Build art style instruction
    const artInstruction = artStyle && artStyle !== "illustration"
      ? `\nImage style: "${artStyle}". Prepend "${artStyle} style, " to every image_prompt you generate.`
      : "";

    const systemPrompt = `You are an expert presentation designer. Output a strict JSON array where each object represents a slide. Each slide must contain:
- slide_number (integer starting from 1)
- heading (string, concise title)
- bullet_points (array of ${textInstruction})
- image_prompt (a highly detailed prompt optimized for FLUX.2 image generation, describing a professional visual for the slide)
- layout (one of: "split", "text-only", "full-image")

Rules:
- Generate exactly ${slideCount} slides
- First slide should be a title slide with layout "full-image"
- Last slide should be a summary/conclusion with layout "text-only"
- Most middle slides should use "split" layout
- Make image_prompts vivid, specific, and professional${artInstruction}
- Output ONLY the JSON array, no markdown, no explanation`;

    const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sorixai.lovable.app",
        "X-Title": "Sorix Deck",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!llmResponse.ok) {
      const errBody = await llmResponse.text();
      console.error("LLM error:", llmResponse.status, errBody);
      return new Response(
        JSON.stringify({ error: "Slide generation failed", details: errBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const llmData = await llmResponse.json();
    let content = llmData.choices?.[0]?.message?.content || "";

    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1].trim();

    let slides: any[];
    try {
      slides = JSON.parse(content);
    } catch {
      console.error("Failed to parse LLM JSON:", content.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Failed to parse slide structure" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate images in parallel
    let imageCount = 0;
    if (generateImages) {
      const imagePromises = slides.map(async (slide: any, idx: number) => {
        if (!slide.image_prompt || slide.layout === "text-only") return;
        try {
          const imgResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openrouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://sorixai.lovable.app",
              "X-Title": "Sorix Deck",
            },
            body: JSON.stringify({
              model: "black-forest-labs/flux.2-klein-4b",
              messages: [{ role: "user", content: slide.image_prompt }],
              modalities: ["image"],
            }),
          });

          if (!imgResponse.ok) {
            console.error(`Image gen failed for slide ${idx + 1}:`, await imgResponse.text());
            return;
          }

          const imgData = await imgResponse.json();
          const message = imgData.choices?.[0]?.message;
          let imageUrl = "";
          if (message?.images?.length > 0) {
            imageUrl = message.images[0]?.image_url?.url || "";
          }
          if (!imageUrl && Array.isArray(message?.content)) {
            const imgPart = message.content.find((c: any) => c.type === "image_url");
            imageUrl = imgPart?.image_url?.url || "";
          }
          if (!imageUrl && typeof message?.content === "string" && message.content.startsWith("data:image")) {
            imageUrl = message.content;
          }

          if (imageUrl) {
            slide.image_url = imageUrl;
            imageCount++;
          }
        } catch (err) {
          console.error(`Image gen error slide ${idx + 1}:`, err);
        }
      });

      await Promise.allSettled(imagePromises);
    }

    // Calculate actual token cost
    const actualTextTokens = slides.length * TOKENS_PER_SLIDE;
    const actualImageTokens = imageCount * TOKENS_PER_IMAGE;
    const totalTokens = actualTextTokens + actualImageTokens;

    const title = slides[0]?.heading || "Untitled Presentation";

    // Save to presentations table
    await supabase.from("presentations").insert({
      user_id: userId,
      title,
      prompt,
      slide_count: slides.length,
      slides_data: slides,
      theme,
      tokens_used: totalTokens,
    });

    // Save to analysis_history
    await supabase.from("analysis_history").insert({
      user_id: userId,
      tool: "deck",
      title,
      input_data: { prompt, slideCount, theme, generateImages },
      result_data: { slides, tokens_used: totalTokens },
    });

    // Deduct tokens
    if (sub) {
      await supabase
        .from("subscriptions")
        .update({ tokens_used: currentUsed + totalTokens })
        .eq("user_id", userId)
        .eq("status", "active");
    }

    return new Response(
      JSON.stringify({
        slides,
        title,
        tokensUsed: totalTokens,
        totalTokensUsed: currentUsed + totalTokens,
        imageCount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Deck generate error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
