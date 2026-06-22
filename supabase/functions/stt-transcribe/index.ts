// Edge function: Speech-to-Text via OpenRouter (google/chirp-3, with fallback).
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { encode as base64Encode } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

const PRIMARY_MODEL = Deno.env.get('OPENROUTER_STT_MODEL') || 'google/chirp-3';
const FALLBACK_MODEL = 'openai/whisper-1';
const MAX_BYTES = 20 * 1024 * 1024;

const guessFormat = (mime: string, filename: string): string => {
  const m = (mime || '').toLowerCase();
  if (m.includes('webm')) return 'webm';
  if (m.includes('mp4') || m.includes('m4a') || m.includes('aac')) return 'mp4';
  if (m.includes('mpeg') || m.includes('mp3')) return 'mp3';
  if (m.includes('wav')) return 'wav';
  if (m.includes('ogg')) return 'ogg';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['webm', 'mp4', 'm4a', 'mp3', 'wav', 'ogg'].includes(ext)) return ext === 'm4a' ? 'mp4' : ext;
  return 'webm';
};

async function transcribeViaOpenRouter(model: string, apiKey: string, b64: string, format: string, language?: string) {
  const sys = `You are a speech-to-text engine. Transcribe the user's audio verbatim. Return ONLY the transcribed words, no commentary, no quotes.${language ? ` Language hint: ${language}.` : ''}`;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sorixai.lovable.app',
      'X-Title': 'Sorix Voice',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: sys },
        {
          role: 'user',
          content: [
            { type: 'input_audio', input_audio: { data: b64, format } },
            { type: 'text', text: 'Transcribe this audio verbatim.' },
          ],
        },
      ],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error(`[stt] ${model} ${res.status}:`, raw.slice(0, 300));
    return { ok: false as const, status: res.status, error: raw };
  }
  let json: any = {};
  try { json = JSON.parse(raw); } catch { /* */ }
  const msg = json?.choices?.[0]?.message;
  let text = '';
  if (typeof msg?.content === 'string') text = msg.content;
  else if (Array.isArray(msg?.content)) {
    for (const p of msg.content) if (typeof p?.text === 'string') text += p.text;
  }
  text = (text || '').trim().replace(/^"|"$/g, '');
  return { ok: true as const, text };
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

    const form = await req.formData();
    const file = form.get('file');
    const language = (form.get('language') as string | null) || undefined;
    if (!(file instanceof File) && !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: 'file is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: 'file exceeds 20MB' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ fallback: true, reason: 'stt_not_configured', text: '' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const filename = (file instanceof File && file.name) || 'audio.webm';
    const format = guessFormat((file as any).type || '', filename);
    const buf = new Uint8Array(await file.arrayBuffer());
    const b64 = base64Encode(buf);

    // Try primary model
    let result = await transcribeViaOpenRouter(PRIMARY_MODEL, apiKey, b64, format, language);
    let usedModel = PRIMARY_MODEL;

    // Fallback on any failure or empty transcript
    if (!result.ok || !result.text) {
      console.warn(`[stt] primary "${PRIMARY_MODEL}" failed/empty, falling back to "${FALLBACK_MODEL}"`);
      const fb = await transcribeViaOpenRouter(FALLBACK_MODEL, apiKey, b64, format, language);
      if (fb.ok) { result = fb; usedModel = FALLBACK_MODEL; }
    }

    if (!result.ok) {
      // Graceful: tell client to try its browser SpeechRecognition fallback.
      return new Response(JSON.stringify({ fallback: true, reason: 'provider_error', text: '', detail: String(result.error).slice(0, 200) }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ text: result.text || '', model: usedModel }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[stt-transcribe] error', err);
    return new Response(JSON.stringify({ fallback: true, reason: 'edge_error', text: '', detail: String(err).slice(0, 200) }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

