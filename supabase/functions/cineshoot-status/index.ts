import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return json({ error: "Unauthorized" }, 401);
    const userId = user.id;

    const { jobId } = await req.json().catch(() => ({}));
    if (!jobId || typeof jobId !== 'string') return json({ error: 'jobId required' }, 400);

    // Load job (RLS scopes to owner)
    const { data: job, error: loadErr } = await supabase
      .from('video_jobs')
      .select('*')
      .eq('id', jobId)
      .maybeSingle();
    if (loadErr || !job) return json({ error: 'Job not found' }, 404);

    const respond = async (extra: Record<string, unknown> = {}) => {
      // Always return latest subscription total so the client can update its UI.
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('tokens_used')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return json({
        id: job.id,
        status: job.status,
        videoUrl: job.video_url,
        error: job.error,
        tokensCharged: job.tokens_charged,
        totalTokensUsed: sub?.tokens_used ?? 0,
        prompt: job.prompt,
        model: job.model,
        ...extra,
      });
    };

    // Terminal states: return as-is.
    if (job.status === 'completed' || job.status === 'failed') {
      return respond();
    }

    if (!job.provider_polling_url) {
      await supabaseAdmin.from('video_jobs').update({
        status: 'failed', error: 'Missing polling URL',
      }).eq('id', job.id);
      job.status = 'failed';
      job.error = 'Missing polling URL';
      return respond();
    }

    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterKey) return json({ error: 'Video service not configured' }, 500);

    const orHeaders = {
      Authorization: `Bearer ${openrouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aisorix.com',
      'X-Title': 'Sorix Cineshoot',
    };

    // One poll per request.
    const pRes = await fetch(job.provider_polling_url, { headers: orHeaders });
    const pRaw = await pRes.text();

    if (!pRes.ok) {
      console.error('Cineshoot poll error', pRes.status, pRaw.slice(0, 400));
      // Transient: bump attempts, keep rendering.
      await supabaseAdmin.from('video_jobs').update({
        attempts: (job.attempts ?? 0) + 1,
      }).eq('id', job.id);
      return respond();
    }

    let pData: any = {};
    try { pData = JSON.parse(pRaw); } catch {}
    const providerStatus = pData?.status || 'pending';

    if (providerStatus === 'failed') {
      const errMsg = pData?.error?.message || pData?.error || 'Video generation failed';
      await supabaseAdmin.from('video_jobs').update({
        status: 'failed', error: String(errMsg),
      }).eq('id', job.id);
      job.status = 'failed';
      job.error = String(errMsg);
      return respond();
    }

    if (providerStatus !== 'completed') {
      await supabaseAdmin.from('video_jobs').update({
        attempts: (job.attempts ?? 0) + 1,
      }).eq('id', job.id);
      return respond();
    }

    // Completed by provider — find a source URL.
    let sourceUrl = '';
    const urls = pData?.signed_urls || pData?.unsigned_urls || [];
    if (Array.isArray(urls) && urls[0]) sourceUrl = urls[0];
    if (!sourceUrl && Array.isArray(pData?.outputs)) {
      for (const o of pData.outputs) {
        if (o?.url) { sourceUrl = o.url; break; }
        if (o?.video_url?.url) { sourceUrl = o.video_url.url; break; }
      }
    }
    if (!sourceUrl && job.provider_job_id) {
      sourceUrl = `https://openrouter.ai/api/v1/videos/${job.provider_job_id}/content`;
    }
    if (!sourceUrl) {
      // Provider says completed but no URL — keep polling.
      await supabaseAdmin.from('video_jobs').update({
        attempts: (job.attempts ?? 0) + 1,
      }).eq('id', job.id);
      return respond();
    }

    // Mark uploading so concurrent polls don't double-charge.
    await supabaseAdmin.from('video_jobs').update({
      status: 'uploading',
    }).eq('id', job.id).eq('status', 'rendering');

    // Download + upload to storage.
    let videoUrl = '';
    try {
      const dlRes = await fetch(sourceUrl, { headers: orHeaders });
      if (!dlRes.ok) {
        console.error('Cineshoot download error', dlRes.status);
        // Don't fail terminally — let next poll retry.
        await supabaseAdmin.from('video_jobs').update({
          status: 'rendering',
          attempts: (job.attempts ?? 0) + 1,
        }).eq('id', job.id);
        return respond();
      }
      const videoBytes = new Uint8Array(await dlRes.arrayBuffer());
      const path = `${userId}/${crypto.randomUUID()}.mp4`;
      const { error: upErr } = await supabaseAdmin.storage
        .from('cineshoot-videos')
        .upload(path, videoBytes, { contentType: 'video/mp4', upsert: false });
      if (upErr) {
        console.error('Cineshoot upload error', upErr);
        await supabaseAdmin.from('video_jobs').update({
          status: 'rendering',
          attempts: (job.attempts ?? 0) + 1,
        }).eq('id', job.id);
        return respond();
      }
      const { data: signed, error: signErr } = await supabaseAdmin.storage
        .from('cineshoot-videos')
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (signErr || !signed?.signedUrl) {
        console.error('Cineshoot sign error', signErr);
        await supabaseAdmin.from('video_jobs').update({
          status: 'rendering',
          attempts: (job.attempts ?? 0) + 1,
        }).eq('id', job.id);
        return respond();
      }
      videoUrl = signed.signedUrl;
    } catch (e) {
      console.error('Cineshoot persist error', e);
      await supabaseAdmin.from('video_jobs').update({
        status: 'rendering',
        attempts: (job.attempts ?? 0) + 1,
      }).eq('id', job.id);
      return respond();
    }

    // Atomic completion: only the first call to flip rendering/uploading -> completed
    // charges tokens. tokens_charged IS NULL is the idempotency guard.
    const tokensCost = job.tokens_estimated ?? 0;

    const { data: completedRows, error: completeErr } = await supabaseAdmin
      .from('video_jobs')
      .update({
        status: 'completed',
        video_url: videoUrl,
        tokens_charged: tokensCost,
        error: null,
      })
      .eq('id', job.id)
      .is('tokens_charged', null)
      .select('id');

    if (completeErr) {
      console.error('Cineshoot complete update error', completeErr);
      return json({ error: 'Failed to finalize job' }, 500);
    }

    if (completedRows && completedRows.length > 0) {
      // We won the race — deduct tokens once and write history row.
      if (tokensCost > 0) {
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('id, tokens_used')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ tokens_used: (sub.tokens_used ?? 0) + tokensCost })
            .eq('id', sub.id);
        }
      }


      // Mirror into video_generations history.
      await supabaseAdmin.from('video_generations').insert({
        user_id: userId,
        prompt: job.prompt,
        model: job.model,
        video_url: videoUrl,
        aspect_ratio: job.aspect_ratio,
        resolution: job.resolution,
        duration_sec: job.duration_sec,
        sound: job.sound,
        source_type: job.source_type,
        tokens_used: tokensCost,
      });
    }


    // Re-load for final return shape.
    const { data: final } = await supabase
      .from('video_jobs')
      .select('*')
      .eq('id', job.id)
      .maybeSingle();
    if (final) Object.assign(job, final);

    return respond();
  } catch (e) {
    console.error('cineshoot-status fatal', e);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
