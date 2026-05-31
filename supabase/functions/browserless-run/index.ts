// Runs a JS snippet in a remote Browserless cloud browser and returns the result.
// Uses Browserless's REST /function endpoint so we don't need a local Playwright runtime.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const BROWSERLESS_HOST = "https://production-sfo.browserless.io";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const token = Deno.env.get("BROWSERLESS_API_KEY");
    if (!token) return json({ ok: false, code: "unknown", message: "BROWSERLESS_API_KEY missing" }, 500);

    // Real auth: validate the bearer token with Supabase
    const auth = req.headers.get("Authorization") ?? "";
    if (!auth.startsWith("Bearer ")) return json({ ok: false, code: "unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return json({ ok: false, code: "unauthorized" }, 401);

    const { url, action, screenshot } = await req.json();

    // Only the named, validated `scrape` action is allowed. The previous `custom`
    // action accepted raw user JS and was removed because it enabled arbitrary
    // remote code execution (SSRF, quota abuse, etc.).
    if (action === "scrape" && typeof url === "string") {
      // Restrict to http/https and reject obvious internal targets.
      let target: URL;
      try {
        target = new URL(url);
      } catch {
        return json({ ok: false, code: "bad_request", message: "Invalid url" }, 400);
      }
      if (target.protocol !== "http:" && target.protocol !== "https:") {
        return json({ ok: false, code: "bad_request", message: "Only http(s) URLs are allowed" }, 400);
      }
      const host = target.hostname.toLowerCase();
      if (
        host === "localhost" ||
        host.endsWith(".localhost") ||
        host === "0.0.0.0" ||
        host.startsWith("127.") ||
        host.startsWith("10.") ||
        host.startsWith("192.168.") ||
        host === "169.254.169.254"
      ) {
        return json({ ok: false, code: "bad_request", message: "Blocked host" }, 400);
      }

      const fnCode = `
export default async function ({ page }) {
  await page.goto(${JSON.stringify(target.toString())}, { waitUntil: "domcontentloaded", timeout: 30000 });
  const title = await page.title();
  const text = (await page.evaluate(() => document.body.innerText)).slice(0, 8000);
  ${screenshot ? `const shot = await page.screenshot({ encoding: "base64", fullPage: false });` : `const shot = null;`}
  return { data: { title, text, screenshot: shot } };
}`;
      const r = await fetch(`${BROWSERLESS_HOST}/function?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/javascript" },
        body: fnCode,
        signal: AbortSignal.timeout(60_000),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return json({ ok: false, code: "browserless_timeout", message: j?.message ?? "Browserless error" }, 502);
      return json({ ok: true, ...j });
    }

    return json({ ok: false, code: "bad_request", message: "Provide action='scrape' with url" }, 400);
  } catch (e) {
    const msg = String((e as Error).message ?? e);
    const code = msg.includes("timeout") ? "browserless_timeout" : "unknown";
    return json({ ok: false, code, message: msg }, 500);
  }
});
