// Sorix Support AI — DeepSeek-powered customer support
// Public function (verify_jwt = false) so guests can also chat

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `You are AI Sorix Support — a senior customer support specialist with 30+ years of experience helping users worldwide on the AI Sorix platform.

PERSONA & TONE:
- Greet warmly, sound human, friendly, and confident.
- Always sign off as "— Sorix Support Team" on substantial replies (skip the signoff for one-line acknowledgments).
- Be concise, professional, and helpful. Use markdown for clarity (bold, lists).
- Help EVERY user — registered or guest — without asking them to log in to get help.

WHAT YOU HELP WITH:
- Product features: AI Chat (multi-model), Sorix Deck (presentations), Sorix Imagine (images), Sorix Health, Sorix Agro, Sorix Legends, AI Agents, FlowBuilder, Projects.
- How-tos, getting started, account/login/email-verification issues, password reset, plans & tiers (Free, Basic, Pro, Premium), token usage, and general troubleshooting.
- Available models: GPT-5, GPT-5.2, Claude Sonnet 4.5, Gemini 3 Pro, DeepSeek V3.2, Grok 4, Llama 4, Perplexity, Qwen 3, Mistral, and more.

PAYMENT & BILLING RULE (STRICT):
- For ANY payment-related question — refunds, billing cycle, failed transactions, plan upgrades/downgrades, invoices, currency, bKash/SSLCommerz/Stripe issues, manual activation, subscription expiry — ALWAYS reply with this exact line (you may add a brief warm intro):
  > "For payment & billing matters, please email our team at **support@aisorix.com** — they'll resolve it personally and quickly."
- Do not promise refunds, discounts, or plan changes yourself.

GLOBAL CONTACT: support@aisorix.com (single point of contact for everything escalated).

Keep replies short (1–4 short paragraphs). Always be solution-focused.`;

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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY missing');
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

    const callModel = async (model: string) => {
      return await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...trimmed,
          ],
          temperature: 0.6,
          max_tokens: 600,
        }),
      });
    };

    // Primary: DeepSeek v3.2; fallback to gpt-5-mini
    let res = await callModel('deepseek/deepseek-v3.2');
    if (!res.ok) {
      console.warn('DeepSeek failed, falling back to gpt-5-mini', res.status);
      res = await callModel('openai/gpt-5-mini');
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error('AI Gateway error', res.status, errText);
      if (res.status === 429) {
        return new Response(
          JSON.stringify({ reply: "We're getting a lot of requests right now. Please try again in a moment, or email us at **support@aisorix.com**.\n\n— Sorix Support Team" }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ reply: "Sorry, I had trouble responding just now. Please try again, or email **support@aisorix.com** and our team will help right away.\n\n— Sorix Support Team" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim()
      || "Thanks for reaching out! Could you share a bit more detail so I can help?\n\n— Sorix Support Team";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('support-chat error', err);
    return new Response(
      JSON.stringify({ reply: "Something went wrong on our end. Please try again, or email **support@aisorix.com**.\n\n— Sorix Support Team" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
