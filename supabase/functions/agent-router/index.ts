// Hybrid task router: routes user prompts to Nango API tools or Browserless web automation.
// Streams SSE events: route_decision, tool_use, tool_result, content, error.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { openrouterChatWithFallback } from "../_shared/openrouter.ts";
import { nangoProxy } from "../_shared/nango.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TOOLS = [
  {
    type: "function",
    function: {
      name: "nango_proxy",
      description: "Call any REST endpoint of a connected provider via Nango proxy. Use this whenever the user asks to read, send, post, create, schedule on a service they have connected (Gmail, GitHub, Notion, Slack, LinkedIn, Google Calendar, etc.).",
      parameters: {
        type: "object",
        properties: {
          provider: { type: "string", description: "Provider id (e.g. github, google-mail, notion, slack)" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          endpoint: { type: "string", description: "Path on the upstream API, starting with /" },
          body: { type: "object", description: "JSON body for write requests", additionalProperties: true },
          query: { type: "object", description: "Query string params", additionalProperties: { type: "string" } },
        },
        required: ["provider", "method", "endpoint"],
      },
    },
  },
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
      description: "Call one of the user's CUSTOM REST integrations by id. The auth header is added automatically by the server. Use when the user references one of their custom integrations by name.",
      parameters: {
        type: "object",
        properties: {
          integration_id: { type: "string", description: "id of the user's custom integration" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", description: "Path appended to base_url, starting with /" },
          query: { type: "object", description: "Query string params", additionalProperties: { type: "string" } },
          body: { type: "object", description: "JSON body", additionalProperties: true },
        },
        required: ["integration_id", "method", "path"],
      },
    },
  },
];

async function runTool(name: string, args: any, userId: string, supabase: any) {
  if (name === "nango_proxy") {
    return await nangoProxy({
      provider: args.provider,
      connectionId: userId,
      method: args.method,
      endpoint: args.endpoint,
      body: args.body,
      query: args.query,
    });
  }
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
      method: "POST",
      headers: { "Content-Type": "application/javascript" },
      body: fnCode,
      signal: AbortSignal.timeout(60_000),
    });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data: j?.data ?? j };
  }
  if (name === "custom_http_call") {
    const { data: integ, error } = await supabase
      .from("user_custom_integrations")
      .select("*").eq("id", args.integration_id).eq("user_id", userId).maybeSingle();
    if (error || !integ) return { ok: false, status: 404, data: { error: "custom_integration_not_found" } };
    const url = new URL((integ.base_url as string).replace(/\/$/, "") + args.path);
    if (args.query) for (const [k, v] of Object.entries(args.query)) url.searchParams.set(k, String(v));
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      [integ.auth_header || "Authorization"]: `${integ.auth_scheme ? integ.auth_scheme + " " : ""}${integ.api_key}`.trim(),
    };
    try {
      const r = await fetch(url.toString(), {
        method: args.method,
        headers,
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { messages = [] } = await req.json();

    // Pull connected providers to inform the router
    const { data: integ } = await supabase
      .from("user_integrations").select("provider,status").eq("user_id", user.id);
    const connected = (integ ?? []).filter(i => i.status === "connected").map(i => i.provider);

    const SYSTEM = `You are Sorix Agent, an autonomous executor that DOES tasks.

Available connected providers for this user: ${connected.length ? connected.join(", ") : "none yet"}.

ROUTING RULES (decide silently before each turn):
- API path: if the task touches a connected provider, call \`nango_proxy\` with the right HTTP method and endpoint of that provider's REST API (you know GitHub, Gmail, Notion, Slack, LinkedIn, Google Drive/Calendar/Docs/Sheets, Twitter/X, Facebook, Instagram, YouTube, Telegram, WhatsApp public REST shapes).
- Browser path: if the task needs info from a public website with no connected API, call \`web_scrape\` with the URL.
- If the user asks for something on a service that is NOT connected, briefly tell them to open Integrations (/agent/integrations) and connect it. Don't lecture.

Always do the work — never tell the user to copy/paste or "go open the app". After tools succeed, reply in 1–2 short sentences confirming what you did. Match the user's language.`;

    const convo: any[] = [{ role: "system", content: SYSTEM }, ...messages];
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (o: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

        try {
          for (let turn = 0; turn < 6; turn++) {
            const r = await openrouterChatWithFallback({
              messages: convo, tools: TOOLS, tool_choice: "auto", max_tokens: 2048,
            });
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
              if (msg.content) send({ type: "content", text: msg.content });
              convo.push({ role: "assistant", content: msg.content ?? "", tool_calls: calls });

              for (const c of calls) {
                const name = c.function?.name as string;
                let args: any = {};
                try { args = JSON.parse(c.function?.arguments || "{}"); } catch { /* */ }

                send({
                  type: "route_decision",
                  path: name === "nango_proxy" ? "api" : "browser",
                  reason: name === "nango_proxy"
                    ? `Calling ${args.provider} ${args.method} ${args.endpoint}`
                    : `Browsing ${args.url}`,
                });
                send({ type: "tool_use", tool_name: name, description: name === "nango_proxy" ? `${args.provider} ${args.endpoint}` : `Open ${args.url}`, steps: ["Execute"] });

                const result = await runTool(name, args, user.id);
                send({
                  type: "tool_result",
                  name,
                  ok: result.ok,
                  summary: result.ok ? "Success" : `Error ${result.status}`,
                });

                convo.push({
                  role: "tool", tool_call_id: c.id, name,
                  content: JSON.stringify(result).slice(0, 6000),
                });
              }
              continue;
            }

            const final = msg.content ?? "";
            for (let i = 0; i < final.length; i += 60) send({ type: "content", text: final.slice(i, i + 60) });
            break;
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
