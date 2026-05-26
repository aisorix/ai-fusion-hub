// Edge function: Text-to-Speech via OpenRouter (x-ai/grok-voice-tts-1.0, with fallback).
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { decode as base64Decode } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

const PRIMARY_MODEL = Deno.env.get('OPENROUTER_TTS_MODEL') || 'x-ai/grok-voice-tts-1.0';
const FALLBACK_MODEL = 'openai/gpt-4o-mini-tts';

const ALLOWED_VOICES = new Set([
  'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer', 'verse',
]);

async function synthViaOpenRouter(model: string, apiKey: string, text: string, voice: string) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sorixai.lovable.app',
      'X-Title': 'Sorix TTS',
    },
    body: JSON.stringify({
      model,
      modalities: ['text', 'audio'],
      audio: { voice, format: 'mp3' },
      messages: [{ role: 'user', content: text }],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error(`[tts] ${model} ${res.status}:`, raw.slice(0, 300));
    return { ok: false as const, status: res.status, error: raw };
  }
  let json: any = {};
  try { json = JSON.parse(raw); } catch { /* */ }
  const msg = json?.choices?.[0]?.message;
  const b64 = msg?.audio?.data
    || (Array.isArray(msg?.content)
          ? msg.content.find((p: any) => p?.type === 'audio')?.audio?.data
          : null);
  if (!b64) {
    console.error(`[tts] ${model} no audio payload`, JSON.stringify(msg)?.slice(0, 300));
    return { ok: false as const, status: 502, error: 'no audio in response' };
  }
  try {
    const bytes = base64Decode(b64);
    return { ok: true as const, bytes };
  } catch (e) {
    return { ok: false as const, status: 502, error: 'invalid base64 audio' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const voice = ALLOWED_VOICES.has(body.voice) ? body.voice : 'nova';
    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (text.length > 4000) {
      return new Response(JSON.stringify({ error: 'text exceeds 4000 chars' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result = await synthViaOpenRouter(PRIMARY_MODEL, apiKey, text, voice);
    let usedModel = PRIMARY_MODEL;
    if (!result.ok) {
      console.warn(`[tts] primary "${PRIMARY_MODEL}" failed, falling back to "${FALLBACK_MODEL}"`);
      const fb = await synthViaOpenRouter(FALLBACK_MODEL, apiKey, text, voice);
      if (fb.ok) { result = fb; usedModel = FALLBACK_MODEL; }
    }

    if (!result.ok) {
      return new Response(JSON.stringify({ error: 'TTS provider error', detail: String(result.error).slice(0, 300) }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(result.bytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'X-TTS-Model': usedModel,
      },
    });
  } catch (err) {
    console.error('[tts-speak] error', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
