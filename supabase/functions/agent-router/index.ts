// Unified Sorix Agent backend: legacy OAuth tools (Gmail/Telegram/Calendar/Drive/FB/LinkedIn/WhatsApp)
// + Browserless web automation + custom HTTP. Streams real telemetry tied to cowork_tasks.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { openrouterChatWithFallback } from "../_shared/openrouter.ts";
import { TOOL_SCHEMAS as LEGACY_TOOL_SCHEMAS, TOOL_UI as LEGACY_TOOL_UI, executeTool as executeLegacyTool } from "../_shared/agentTools.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- Universal tools (always available) ---
const UNIVERSAL_TOOLS = [
  {
    type: "function",
    function: {
      name: "web_scrape",
      description: "Open a URL in a real cloud browser (Browserless) and return its title + visible text. Use ONLY when the task needs information from a website that isn't available through a connected API.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full https URL" },
          screenshot: { type: "boolean", description: "Whether to also return a base64 screenshot" },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "custom_http_call",
      description: "Call one of the user's CUSTOM REST integrations by id. Auth header is added automatically server-side.",
      parameters: {
        type: "object",
        properties: {
          integration_id: { type: "string" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          query: { type: "object", additionalProperties: { type: "string" } },
          body: { type: "object", additionalProperties: true },
        },
        required: ["integration_id", "method", "path"],
      },
    },
  },
];

// Map: legacy tool name -> service it requires (must appear in user_connections)
const LEGACY_TOOL_REQUIRES: Record<string, string> = {
  telegram_send_message: "telegram",
  telegram_list_recent_chats: "telegram",
  gmail_send_email: "google",
  gmail_list_recent: "google",
  calendar_create_event: "google",
  calendar_list_upcoming: "google",
  drive_list_files: "google",
  facebook_page_post: "facebook",
  linkedin_create_post: "linkedin",
  whatsapp_send_message: "whatsapp",
};

const LEGACY_TOOL_NAMES = new Set(LEGACY_TOOL_SCHEMAS.map((t: any) => t.function.name));

async function runUniversalTool(name: string, args: any, userId: string, supabase: any) {
  if (name === "web_scrape") {
    const token = Deno.env.get("BROWSERLESS_API_KEY");
    if (!token) return { ok: false, status: 500, data: { error: "browserless_missing" } };
    const fnCode = `
export default async function ({ page }) {
  await page.goto(${JSON.stringify(args.url)}, { waitUntil: "domcontentloaded", timeout: 30000 });
  const title = await page.title();
  const text = (await page.evaluate(() => document.body.innerText)).slice(0, 6000);
  ${args.screenshot ? `const shot = await page.screenshot({ encoding: "base64", fullPage: false });` : `const shot = null;`}
  return { data: { title, text, screenshot: shot } };
}`;
    const r = await fetch(`https://production-sfo.browserless.io/function?token=${encodeURIComponent(token)}`, {
      method: "POST", headers: { "Content-Type": "application/javascript" },
      body: fnCode, signal: AbortSignal.timeout(60_000),
    });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data: j?.data ?? j };
  }
  if (name === "custom_http_call") {
    const { data: integ } = await supabase
      .from("user_custom_integrations").select("*").eq("id", args.integration_id).eq("user_id", userId).maybeSingle();
    if (!integ) return { ok: false, status: 404, data: { error: "custom_integration_not_found" } };
    const url = new URL((integ.base_url as string).replace(/\/$/, "") + args.path);
    if (args.query) for (const [k, v] of Object.entries(args.query)) url.searchParams.set(k, String(v));
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      [integ.auth_header || "Authorization"]: `${integ.auth_scheme ? integ.auth_scheme + " " : ""}${integ.api_key}`.trim(),
    };
    try {
      const r = await fetch(url.toString(), {
        method: args.method, headers,
        body: ["GET", "DELETE"].includes(args.method) ? undefined : JSON.stringify(args.body ?? {}),
        signal: AbortSignal.timeout(30_000),
      });
      const text = await r.text();
      let data: any; try { data = JSON.parse(text); } catch { data = text; }
      return { ok: r.ok, status: r.status, data };
    } catch (e) {
      return { ok: false, status: 500, data: { error: String((e as Error).message ?? e) } };
    }
  }
  return { ok: false, status: 400, data: { error: `unknown_tool:${name}` } };
}

function describeUniversal(name: string, args: any): { title: string; description: string; steps: string[] } {
  if (name === "web_scrape") return {
    title: "Browsing the web",
    description: `Opening ${args.url}`,
    steps: ["Launching browser", "Loading page", "Extracting content"],
  };
  if (name === "custom_http_call") return {
    title: "Custom integration",
    description: `${args.method} ${args.path}`,
    steps: ["Authenticating", "Sending request"],
  };
  return { title: name, description: "", steps: ["Execute"] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { messages = [], model } = await req.json();

    // Connected via legacy OAuth (user_connections)
    const { data: legacyConns } = await supabase
      .from("user_connections").select("service,status").eq("user_id", user.id);
    const legacyConnected = new Set((legacyConns ?? []).filter((c: any) => c.status === "connected").map((c: any) => c.service));

    // Filter legacy tools by connected services (only expose ones the user can actually use)
    const availableLegacyTools = LEGACY_TOOL_SCHEMAS.filter((t: any) => {
      const svc = LEGACY_TOOL_REQUIRES[t.function.name];
      return !svc || legacyConnected.has(svc);
    });

    // Custom integrations
    const { data: customs } = await supabase
      .from("user_custom_integrations").select("id,name,base_url,description").eq("user_id", user.id);
    const customList = (customs ?? []) as any[];

    const TOOLS = [...UNIVERSAL_TOOLS, ...availableLegacyTools];

    const SYSTEM = `You are Sorix Agent, an autonomous executor that DOES tasks for the user.

Connected services: ${[...legacyConnected].join(", ") || "none"}.
Custom integrations:
${customList.length ? customList.map(c => `- ${c.name} (id=${c.id}, base=${c.base_url})${c.description ? ` — ${c.description}` : ""}`).join("\n") : "- none"}

ROUTING:
- For Gmail/Calendar/Drive/Telegram/Facebook/LinkedIn/WhatsApp use the dedicated tools (e.g. gmail_send_email, telegram_send_message). They appear in your tool list ONLY if the user has connected them.
- For one of the user's custom integrations, use custom_http_call.
- For info from a public website with no API, use web_scrape.
- If the user asks for a service that isn't connected, briefly tell them to open Connections (/agent/connections) and link it. Don't lecture.

Always do the work — never tell the user to copy/paste. After tools succeed, reply in 1–2 short sentences confirming what you did. Match the user's language.`;

    const convo: any[] = [{ role: "system", content: SYSTEM }, ...messages];
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (o: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

        try {
          let fullAssistantText = "";
          for (let turn = 0; turn < 6; turn++) {
            const r = await openrouterChatWithFallback({
              messages: convo, tools: TOOLS, tool_choice: "auto", max_tokens: 2048,
            }, model);
            if (!r.ok) {
              const txt = await r.text();
              const code = r.status === 429 ? "rate_limit" : "llm_parse";
              send({ type: "error", code, message: `Model error (${r.status}). ${txt.slice(0, 200)}` });
              break;
            }
            const j = await r.json();
            const msg = j.choices?.[0]?.message ?? {};
            const calls = msg.tool_calls as any[] | undefined;

            if (calls?.length) {
              if (msg.content) {
                send({ type: "content", text: msg.content });
                fullAssistantText += msg.content;
              }
              convo.push({ role: "assistant", content: msg.content ?? "", tool_calls: calls });

              for (const c of calls) {
                const name = c.function?.name as string;
                let args: any = {};
                try { args = JSON.parse(c.function?.arguments || "{}"); } catch { /* */ }

                const isLegacy = LEGACY_TOOL_NAMES.has(name);
                const ui = isLegacy
                  ? (LEGACY_TOOL_UI as any)[name] ?? { title: name, description: "", steps: ["Execute"] }
                  : describeUniversal(name, args);

                // 1. Persist task row
                const { data: task } = await admin
                  .from("cowork_tasks")
                  .insert({
                    user_id: user.id,
                    title: ui.title,
                    description: ui.description,
                    status: "running",
                    steps: ui.steps.map((label: string, i: number) => ({
                      label, status: i === 0 ? "running" : "pending",
                    })),
                  })
                  .select("id")
                  .single();
                const taskId = task?.id ?? crypto.randomUUID();

                send({
                  type: "route_decision",
                  path: name === "web_scrape" ? "browser" : name === "nango_proxy" || isLegacy ? "api" : "custom",
                  reason: ui.description || ui.title,
                });
                send({ type: "tool_use", task_id: taskId, tool_name: name, title: ui.title, description: ui.description, steps: ui.steps });

                // 2. Execute
                let resultPayload: any;
                let okFlag = false;
                let summary = "";
                try {
                  if (isLegacy) {
                    const lr = await executeLegacyTool(name, args, user.id);
                    okFlag = lr.ok;
                    resultPayload = lr;
                    summary = lr.ok ? "Done" : (lr as any).hint || (lr as any).error || "Failed";
                  } else {
                    const ur = await runUniversalTool(name, args, user.id, supabase);
                    okFlag = ur.ok;
                    resultPayload = ur;
                    summary = ur.ok ? "Done" : `Error ${ur.status}`;
                  }
                } catch (e) {
                  okFlag = false;
                  resultPayload = { ok: false, error: String((e as Error).message ?? e) };
                  summary = "Exception";
                }

                // 3. Mark all steps done/failed and persist
                const finalSteps = ui.steps.map((label: string) => ({
                  label, status: okFlag ? "done" : "error",
                }));
                await admin.from("cowork_tasks").update({
                  status: okFlag ? "completed" : "failed",
                  steps: finalSteps,
                  result: summary,
                  updated_at: new Date().toISOString(),
                }).eq("id", taskId);

                send({ type: "tool_result", task_id: taskId, name, ok: okFlag, summary });

                convo.push({
                  role: "tool", tool_call_id: c.id, name,
                  content: JSON.stringify(resultPayload).slice(0, 6000),
                });
              }
              continue;
            }

            const final = msg.content ?? "";
            for (let i = 0; i < final.length; i += 60) send({ type: "content", text: final.slice(i, i + 60) });
            fullAssistantText += final;
            break;
          }

          // Persist assistant turn (user message persisted by client to keep ordering simple)
          if (fullAssistantText.trim()) {
            await admin.from("cowork_messages").insert({
              user_id: user.id, role: "assistant", content: fullAssistantText, model: model ?? null,
            });
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          send({ type: "error", code: "unknown", message: String((e as Error).message ?? e) });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
