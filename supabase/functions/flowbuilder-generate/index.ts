import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOKENS_NEW = 5000;
const TOKENS_EDIT = 3000;

const MODELS = [
  "anthropic/claude-sonnet-4.6",
  "anthropic/claude-opus-4.6",
  "google/gemini-3.1-pro-preview",
  "meta-llama/llama-3.1-8b-instruct",
];

const planLimits: Record<string, number> = {
  free: 15000,
  basic: 800000,
  pro: 1500000,
  premium: 3000000,
  premium_plus: 7000000,
  max: 17000000,
  enterprise: 50000000,
};

const SYSTEM_PROMPT = `You are an expert diagram and flowchart generator. You ONLY output valid Mermaid.js code. Do NOT include any explanation, markdown fences, or commentary — just raw Mermaid syntax.

Rules:
- Output ONLY the Mermaid code, nothing else
- Ensure the code is valid and will render correctly
- Support all Mermaid diagram types: flowchart, sequence, class, state, er, gantt, pie, mindmap, timeline, block-beta, etc.
- Use clear, readable node labels
- For edits: modify the existing code as requested while preserving structure
- If user requests colors/themes, apply them using Mermaid's styling syntax (classDef, style, etc.)
- Do NOT wrap output in \`\`\`mermaid or any code fences
- NEVER use "default" as a classDef name — it is a reserved keyword in Mermaid. Use names like "base", "primary", "nodeStyle" instead.
- For styling nodes, prefer inline style syntax: style id1 fill:#000,stroke:#fff
- Ensure all node IDs are simple alphanumeric (no spaces or special chars in IDs)
- When using classDef, always use valid class names (not reserved words like "default", "class", "style")
- Test that arrow syntax is correct: use --> for solid arrows, -.-> for dotted arrows`;

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

    const { prompt, existingCode, diagramType, colorTheme } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isEdit = !!existingCode;
    const tokenCost = isEdit ? TOKENS_EDIT : TOKENS_NEW;

    // Check token balance
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("tokens_used, plan_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentUsed = sub?.tokens_used ?? 0;
    const planId = sub?.plan_id ?? "free";
    const limit = planLimits[planId] ?? 15000;

    if (currentUsed + tokenCost > limit) {
      return new Response(
        JSON.stringify({ error: "insufficient_tokens", tokensUsed: currentUsed, tokensLimit: limit }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterKey) {
      return new Response(JSON.stringify({ error: "Service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build user message
    let userMessage = prompt;
    if (diagramType) userMessage = `Create a ${diagramType} diagram: ${userMessage}`;
    if (colorTheme) userMessage += `\nUse a ${colorTheme} color theme.`;
    if (existingCode) userMessage = `Modify this existing Mermaid diagram:\n\n${existingCode}\n\nChanges requested: ${prompt}`;

    // Try models in rotation
    const modelIndex = Math.floor(Math.random() * MODELS.length);
    let mermaidCode = "";
    let lastError = "";

    for (let i = 0; i < MODELS.length; i++) {
      const model = MODELS[(modelIndex + i) % MODELS.length];
      try {
        const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://sorixai.lovable.app",
            "X-Title": "Sorix FlowBuilder",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
            max_tokens: 4000,
            temperature: 0.3,
          }),
        });

        if (!orResponse.ok) {
          lastError = await orResponse.text();
          console.error(`Model ${model} failed:`, lastError);
          continue;
        }

        const orData = await orResponse.json();
        const content = orData.choices?.[0]?.message?.content?.trim() || "";

        // Clean up: remove code fences if present
        mermaidCode = content
          .replace(/^```mermaid\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        if (mermaidCode) {
          // Fix common Mermaid syntax issues
          mermaidCode = mermaidCode
            .replace(/classDef\s+default\s+/gi, 'classDef baseStyle ')
            .replace(/class\s+(\S+)\s+default\s*;/gi, 'class $1 baseStyle;');
          break;
        }
      } catch (err) {
        console.error(`Model ${model} error:`, err);
        lastError = String(err);
        continue;
      }
    }

    if (!mermaidCode) {
      return new Response(
        JSON.stringify({ error: "All models failed to generate diagram", details: lastError }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to analysis_history
    const title = prompt.length > 60 ? prompt.substring(0, 60) + "..." : prompt;
    await supabase.from("analysis_history").insert({
      user_id: user.id,
      tool: "flowbuilder",
      title,
      input_data: { prompt, diagramType, colorTheme },
      result_data: { mermaidCode, tokensUsed: tokenCost },
    });

    // Deduct tokens
    if (sub) {
      await supabase
        .from("subscriptions")
        .update({ tokens_used: currentUsed + tokenCost })
        .eq("user_id", user.id)
        .eq("status", "active");
    }

    return new Response(
      JSON.stringify({
        mermaidCode,
        tokensUsed: tokenCost,
        totalTokensUsed: currentUsed + tokenCost,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("FlowBuilder error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
