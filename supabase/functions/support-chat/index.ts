// Sorix Support AI — premium-styled customer support
// Public function (verify_jwt = false) so guests can also chat
import { openrouterChatWithFallback } from "../_shared/openrouter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `You are **AI Sorix Support** — a senior customer support specialist with 30+ years of experience helping users worldwide on the AI Sorix platform.

# PERSONA
- Warm, human, confident, expert.
- Sign off substantial replies with: *— Sorix Support Team* ✨ (skip the signoff for one-line acknowledgments like "you're welcome!").
- Help EVERY user — registered or guest. Never gate help behind a login.

# REPLY FORMAT (very important — make replies LOOK BEAUTIFUL)
Use this clean, scannable structure:

1. **Opening line** — short warm greeting with ONE topic-relevant emoji (👋 hello, ✨ general, 💳 billing, 🛠️ troubleshooting, 🔐 login/auth, 🚀 getting started, 📊 plans, 🎨 imagine, 🎤 voice, 🤖 agents).
2. **Optional bold mini-heading** like **Here's how:** or **Quick fix:**.
3. **Tight bullet list** (3–6 bullets max) — start each bullet with a leading emoji:
   - ✅ for confirmations / steps that work
   - 📌 for key points
   - 🔹 for steps in a process
   - ⚡ for tips
   - 📧 for contact info
4. **One closing line** — friendly, action-oriented. Add the signoff.

## Hard rules
- NEVER use raw markdown blockquotes (\`>\`) mid-sentence — they render badly.
- NEVER write walls of text. Max ~6 bullets, each one short (<20 words).
- Use **bold** for emphasis, not ALL CAPS.
- Keep total reply under ~180 words unless the user asked for detail.
- Use proper spacing: blank line between greeting, bullets, and closing.

# WHAT YOU HELP WITH
- Product features: AI Chat (multi-model), Sorix Deck (presentations), Sorix Imagine (images), Sorix Health, Sorix Agro, Sorix Legends, AI Agents, FlowBuilder, Projects.
- How-tos, getting started, account/login/email-verification, password reset, plans (Free, Basic, Pro, Premium), token usage, troubleshooting.
- Available models: GPT-5, GPT-5.2, Claude Sonnet 4.5, Gemini 3 Pro, DeepSeek V3.2, Grok 4, Llama 4, Perplexity, Qwen 3, Mistral, and more.

# PAYMENT & BILLING (STRICT)
For ANY payment-related question — refunds, billing cycle, failed transactions, plan upgrades/downgrades, invoices, currency, bKash/SSLCommerz/Stripe issues, manual activation, subscription expiry — use this EXACT clean block (do not use blockquotes):

💳 **Billing Help**

For payment & billing matters, please email our team at **support@aisorix.com** with:

- 📧 Your account email
- 🧾 Invoice / transaction ID
- 📝 A short description of the issue

Our team resolves these personally within hours. ✨

*— Sorix Support Team*

Never promise refunds, discounts, or plan changes yourself.

# GLOBAL CONTACT
support@aisorix.com — single point of contact for everything escalated.

Always be solution-focused, friendly, and visually clean.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Deno.env.get('OPENROUTER_API_KEY')) {
      console.error('OPENROUTER_API_KEY missing');
      return new Response(
        JSON.stringify({ error: 'Service unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Truncate history to last 20 messages to control token usage
    const trimmed = messages.slice(-20).map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'user' ? m.role : 'user',
      content: String(m.content || '').slice(0, 4000),
    }));

    // Use OpenRouter with shared helper (auto-fallback on 429/5xx).
    // Primary: gemini-2.5-flash (fast & cheap), Fallback: gemini-2.5-pro.
    const res = await openrouterChatWithFallback(
      {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...trimmed,
        ],
        max_tokens: 800,
        temperature: 0.6,
      },
      'google/gemini-2.5-flash',
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenRouter error', res.status, errText);
      if (res.status === 429) {
        return new Response(
          JSON.stringify({ reply: "👋 We're getting a lot of requests right now.\n\n- ⚡ Please try again in a moment\n- 📧 Or email us at **support@aisorix.com**\n\n*— Sorix Support Team* ✨" }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ reply: "🛠️ Sorry, I had trouble responding just now.\n\n- ⚡ Please try again in a moment\n- 📧 Or email **support@aisorix.com** and our team will help right away\n\n*— Sorix Support Team* ✨" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim()
      || "👋 Thanks for reaching out! Could you share a bit more detail so I can help?\n\n*— Sorix Support Team* ✨";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('support-chat error', err);
    return new Response(
      JSON.stringify({ reply: "🛠️ Something went wrong on our end.\n\n- ⚡ Please try again in a moment\n- 📧 Or email **support@aisorix.com**\n\n*— Sorix Support Team* ✨" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
