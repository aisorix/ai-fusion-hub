import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { TOOL_SCHEMAS, TOOL_UI, executeTool } from "../_shared/agentTools.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Sorix Agent — an autonomous executor. You DO things, you don't just describe them.

CORE RULES:
- When the user asks you to send/post/create/schedule/email/message anything, IMMEDIATELY call the matching tool. Do NOT tell the user to copy-paste, open an app, or do it themselves — that's your job.
- Never explain "as an AI I cannot access your apps" — you CAN, through the tools listed below.
- If a required service isn't connected, the tool will return an error like "telegram_not_connected"; in that case briefly tell the user (1 sentence) to open Connections (/agent/connections) and link the service. Do not lecture about security.
- For Telegram, the bot can only message users who messaged it first. If telegram_send_message returns "telegram_recipient_not_found", briefly say so and ask the user to (a) have the recipient send /start to the bot, or (b) provide a numeric chat_id.
- For destructive/public posts (Facebook, LinkedIn, WhatsApp, Email): if the user's prompt is unambiguous about content + recipient, just do it. If anything is unclear (no recipient, vague content), ask ONE short clarifying question first.
- After a tool succeeds, reply in 1–2 short sentences confirming what you did. Use a check ✅ when appropriate.
- Always respond in the user's language (English/Bangla).

You have direct API access via these tools — call them aggressively rather than describing manual steps.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!openRouterKey) {
      return new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader || "" } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, model } = await req.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

        const convo: any[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ];

        const MAX_TURNS = 6;
        try {
          for (let turn = 0; turn < MAX_TURNS; turn++) {
            // Non-streaming call to allow tool-call detection cleanly
            const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openRouterKey}`,
                "HTTP-Referer": "https://sorixai.lovable.app",
                "X-Title": "AI Sorix Agent",
              },
              body: JSON.stringify({
                model: model || "google/gemini-2.5-pro",
                messages: convo,
                tools: TOOL_SCHEMAS,
                tool_choice: "auto",
                max_tokens: 2048,
              }),
            });

            if (!r.ok) {
              const errTxt = await r.text();
              console.error("OpenRouter error:", errTxt);
              send({ type: "error", message: "AI model error. Please try again." });
              break;
            }

            const json = await r.json();
            const choice = json.choices?.[0];
            const msg = choice?.message ?? {};
            const toolCalls = msg.tool_calls as any[] | undefined;

            if (toolCalls && toolCalls.length > 0) {
              // Echo assistant's planning content if any
              if (msg.content) send({ type: "content", text: msg.content });

              // Append assistant message with tool_calls (required by OpenAI/OpenRouter spec)
              convo.push({ role: "assistant", content: msg.content ?? "", tool_calls: toolCalls });

              // Execute each tool sequentially
              for (const call of toolCalls) {
                const name = call.function?.name as string;
                let args: any = {};
                try { args = JSON.parse(call.function?.arguments || "{}"); } catch { args = {}; }

                const ui = TOOL_UI[name] ?? { title: name, description: "Running tool", steps: ["Execute"] };
                send({
                  type: "tool_use",
                  tool_name: ui.title,
                  description: ui.description,
                  steps: ui.steps,
                });

                const result = await executeTool(name, args, user.id);

                convo.push({
                  role: "tool",
                  tool_call_id: call.id,
                  name,
                  content: JSON.stringify(result),
                });
              }
              // Continue loop so model can see tool results and produce final answer
              continue;
            }

            // No tool calls → final answer. Stream as content events.
            const finalText: string = msg.content ?? "";
            // Emit in small chunks for nicer UX
            const CHUNK = 40;
            for (let i = 0; i < finalText.length; i += CHUNK) {
              send({ type: "content", text: finalText.slice(i, i + CHUNK) });
            }
            break;
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Agent loop error:", err);
          send({ type: "error", message: String(err instanceof Error ? err.message : err) });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Sorix Agent error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
