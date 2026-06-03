import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Per-second USD base cost (real)
const PRICING: Record<string, { price: number; tier: 'basic' | 'pro' | 'premium'; maxRes: string; durs: number[] }> = {
  "x-ai/grok-imagine-video":     { price: 0.07,    tier: 'basic',   maxRes: '720p',  durs: range(4,10) },
  "kwaivgi/kling-video-o1":      { price: 0.112,   tier: 'basic',   maxRes: '1080p', durs: [5,10] },
  "kwaivgi/kling-v3.0-std":      { price: 0.126,   tier: 'pro',     maxRes: '1080p', durs: range(3,15) },
  "kwaivgi/kling-v3.0-pro":      { price: 0.21,    tier: 'premium', maxRes: '1080p', durs: range(3,15) },
  "bytedance/seedance-2.0-fast": { price: 0.0538,  tier: 'basic',   maxRes: '1080p', durs: range(4,12) },
  "bytedance/seedance-2.0":      { price: 0.06726, tier: 'basic',   maxRes: '1080p', durs: range(4,12) },
  "bytedance/seedance-1-5-pro":  { price: 0.02306, tier: 'pro',     maxRes: '1080p', durs: range(4,12) },
  "google/veo-3.1-lite":         { price: 0.05,    tier: 'basic',   maxRes: '1080p', durs: range(4,8) },
  "google/veo-3.1-fast":         { price: 0.10,    tier: 'basic',   maxRes: '1080p', durs: range(4,10) },
  "google/veo-3.1":              { price: 0.40,    tier: 'pro',     maxRes: '4K',    durs: range(4,10) },
  "openai/sora-2-pro":           { price: 0.30,    tier: 'pro',     maxRes: '4K',    durs: range(4,12) },
  "minimax/hailuo-2.3":          { price: 0.0817,  tier: 'basic',   maxRes: '1080p', durs: range(4,10) },
};

function range(a: number, b: number): number[] {
  const r: number[] = []; for (let i = a; i <= b; i++) r.push(i); return r;
}

const RES_MULT: Record<string, number> = { '720p': 1, '1080p': 1, '2K': 1.25, '4K': 1.5 };
const RES_ORDER = ['720p', '1080p', '2K', '4K'];
const TOKENS_PER_USD = 30000;
const MARKUP = 2;
const PLAN_RANK: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 };
const TIER_RANK: Record<string, number> = { basic: 1, pro: 2, premium: 3 };

const PLAN_LIMITS: Record<string, number> = {
  free: 15000,
  basic: 800000,
  pro: 1500000,
  premium: 3000000,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return json({ error: "Unauthorized" }, 401);
    const userId = user.id;

    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      model,
      aspectRatio = '16:9',
      resolution = '1080p',
      durationSec = 5,
      sound = false,
      imageData,
      videoUrl: refVideoUrl,
    } = body || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
      return json({ error: 'Prompt is required' }, 400);
    }
    if (prompt.length > 2000) return json({ error: 'Prompt too long' }, 400);

    const cfg = PRICING[model];
    if (!cfg) return json({ error: 'Invalid model' }, 400);

    const aspect = ['16:9', '9:16', '1:1'].includes(aspectRatio) ? aspectRatio : '16:9';
    const dur = Math.max(cfg.durs[0], Math.min(cfg.durs[cfg.durs.length - 1], Number(durationSec) || 5));
    if (!cfg.durs.includes(dur)) {
      // snap to nearest allowed
    }

    // resolution validation
    const resReqIdx = RES_ORDER.indexOf(resolution);
    const resMaxIdx = RES_ORDER.indexOf(cfg.maxRes);
    if (resReqIdx < 0) return json({ error: 'Invalid resolution' }, 400);
    const resolved = resReqIdx > resMaxIdx ? cfg.maxRes : resolution;

    // Subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tokens_used, plan_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const planId = sub?.plan_id ?? 'free';
    const currentUsed = sub?.tokens_used ?? 0;
    const limit = PLAN_LIMITS[planId] ?? 15000;

    if ((PLAN_RANK[planId] ?? 0) < TIER_RANK[cfg.tier]) {
      return json({ error: `This model requires ${cfg.tier} plan or above` }, 403);
    }

    const usdCost = cfg.price * dur * MARKUP * (RES_MULT[resolved] || 1);
    const tokensCost = Math.ceil(usdCost * TOKENS_PER_USD);
    if (currentUsed + tokensCost > limit) {
      return json({ error: 'insufficient_tokens', tokensUsed: currentUsed, tokensLimit: limit }, 403);
    }

    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterKey) return json({ error: 'Video generation not configured' }, 500);

    // Build OpenRouter video request
    const content: any[] = [{ type: 'text', text: prompt.trim() }];
    if (imageData && typeof imageData === 'string') {
      content.unshift({ type: 'image_url', image_url: { url: imageData } });
    }
    if (refVideoUrl && typeof refVideoUrl === 'string') {
      content.unshift({ type: 'video_url', video_url: { url: refVideoUrl } });
    }

    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aisorix.com',
        'X-Title': 'Sorix Cineshoot',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: content.length === 1 ? prompt.trim() : content }],
        modalities: ['text', 'video'],
        video: {
          aspect_ratio: aspect,
          duration: dur,
          resolution: resolved,
          audio: !!sound,
        },
      }),
    });

    const raw = await orRes.text();
    if (!orRes.ok) {
      console.error('Cineshoot OpenRouter error', orRes.status, raw.slice(0, 400));
      return json({ error: `Video model failed (${orRes.status}). Try a different model or try again.` }, 502);
    }

    let data: any = {};
    try { data = JSON.parse(raw); } catch {}
    const msg = data?.choices?.[0]?.message;
    let videoUrl = '';
    if (msg?.videos?.length) videoUrl = msg.videos[0]?.video_url?.url || msg.videos[0]?.url || '';
    if (!videoUrl && Array.isArray(msg?.content)) {
      for (const p of msg.content) {
        if ((p.type === 'video_url' || p.type === 'video') && (p.video_url?.url || p.url)) {
          videoUrl = p.video_url?.url || p.url; break;
        }
      }
    }
    if (!videoUrl && typeof msg?.content === 'string') {
      const m = msg.content.match(/(https?:\/\/[^\s)]+\.(?:mp4|webm|mov))/i);
      if (m) videoUrl = m[1];
    }
    if (!videoUrl) {
      console.error('Cineshoot: no video extracted', JSON.stringify(data).slice(0, 400));
      return json({ error: 'No video returned from model' }, 502);
    }

    // Persist
    const { data: row } = await supabase
      .from('video_generations')
      .insert({
        user_id: userId,
        prompt,
        model,
        video_url: videoUrl,
        aspect_ratio: aspect,
        resolution: resolved,
        duration_sec: dur,
        sound: !!sound,
        source_type: imageData ? 'image' : refVideoUrl ? 'video' : 'text',
        tokens_used: tokensCost,
      })
      .select('id')
      .single();

    if (sub) {
      await supabase
        .from('subscriptions')
        .update({ tokens_used: currentUsed + tokensCost })
        .eq('user_id', userId)
        .eq('status', 'active');
    }

    return json({
      videoUrl,
      id: row?.id,
      tokensUsed: tokensCost,
      totalTokensUsed: currentUsed + tokensCost,
    }, 200);
  } catch (e) {
    console.error('Cineshoot fatal', e);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
