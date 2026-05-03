// Runs a JS snippet in a remote Browserless cloud browser and returns the result.
// Uses Browserless's REST /function endpoint so we don't need a local Playwright runtime.
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

    // Auth check (any signed-in user)
    const auth = req.headers.get("Authorization") ?? "";
    if (!auth.startsWith("Bearer ")) return json({ ok: false, code: "unauthorized" }, 401);

    const { url, action, code, screenshot } = await req.json();

    // Action 1: scrape — fetch URL, extract text + take screenshot.
    if (action === "scrape" && typeof url === "string") {
      const fnCode = `
export default async function ({ page }) {
  await page.goto(${JSON.stringify(url)}, { waitUntil: "domcontentloaded", timeout: 30000 });
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

    // Action 2: custom — run user-supplied function code.
    if (action === "custom" && typeof code === "string") {
      const r = await fetch(`${BROWSERLESS_HOST}/function?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/javascript" },
        body: code,
        signal: AbortSignal.timeout(60_000),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return json({ ok: false, code: "browserless_timeout", message: j?.message ?? "Browserless error" }, 502);
      return json({ ok: true, ...j });
    }

    return json({ ok: false, code: "bad_request", message: "Provide action='scrape' with url, or action='custom' with code" }, 400);
  } catch (e) {
    const msg = String((e as Error).message ?? e);
    const code = msg.includes("timeout") ? "browserless_timeout" : "unknown";
    return json({ ok: false, code, message: msg }, 500);
  }
});
