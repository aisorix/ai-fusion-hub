import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, ...params } = await req.json();

    // === EXCHANGE CODE FOR TOKEN ===
    if (action === 'exchange_code') {
      const { code } = params;
      const CLIENT_ID = Deno.env.get('GITHUB_CLIENT_ID');
      const CLIENT_SECRET = Deno.env.get('GITHUB_CLIENT_SECRET');
      if (!CLIENT_ID || !CLIENT_SECRET) {
        return new Response(JSON.stringify({ error: 'GitHub OAuth not configured' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
      });
      const tokenData = await tokenRes.json();

      if (tokenData.error || !tokenData.access_token) {
        return new Response(JSON.stringify({ error: tokenData.error_description || 'OAuth failed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ access_token: tokenData.access_token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === LIST REPOS ===
    if (action === 'list_repos') {
      const { accessToken } = params;
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30&affiliation=owner', {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
      });
      const repos = await res.json();
      return new Response(JSON.stringify(repos.map((r: any) => ({
        id: r.id, full_name: r.full_name, name: r.name, owner: r.owner?.login,
        default_branch: r.default_branch, private: r.private,
      }))), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === CONNECT REPO ===
    if (action === 'connect_repo') {
      const { projectId, repoOwner, repoName, branch, accessToken } = params;
      // Remove existing connection for this project
      await serviceClient.from('project_github').delete().eq('project_id', projectId).eq('user_id', user.id);
      const { data, error } = await serviceClient.from('project_github').insert({
        project_id: projectId, user_id: user.id,
        repo_owner: repoOwner, repo_name: repoName, branch, access_token: accessToken,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === DISCONNECT REPO ===
    if (action === 'disconnect_repo') {
      const { projectId } = params;
      await serviceClient.from('project_github').delete().eq('project_id', projectId).eq('user_id', user.id);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === GET CONNECTION ===
    if (action === 'get_connection') {
      const { projectId } = params;
      const { data } = await serviceClient.from('project_github')
        .select('id, project_id, repo_owner, repo_name, branch, connected_at')
        .eq('project_id', projectId).eq('user_id', user.id).single();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === SYNC FILE (create/update/delete) ===
    if (action === 'sync_file') {
      const { projectId, filePath, content, operation } = params;
      // Get connection
      const { data: conn } = await serviceClient.from('project_github')
        .select('*').eq('project_id', projectId).eq('user_id', user.id).single();
      if (!conn) {
        return new Response(JSON.stringify({ error: 'No GitHub connection' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const apiBase = `https://api.github.com/repos/${conn.repo_owner}/${conn.repo_name}/contents/${filePath}`;
      const headers = {
        Authorization: `Bearer ${conn.access_token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      };

      // Check if file exists (for update/delete we need the SHA)
      let sha: string | undefined;
      try {
        const existRes = await fetch(`${apiBase}?ref=${conn.branch}`, { headers });
        if (existRes.ok) {
          const existData = await existRes.json();
          sha = existData.sha;
        }
      } catch { /* file doesn't exist yet */ }

      if (operation === 'delete') {
        if (!sha) {
          return new Response(JSON.stringify({ success: true, message: 'File not on GitHub' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        await fetch(apiBase, {
          method: 'DELETE', headers,
          body: JSON.stringify({ message: `Delete ${filePath}`, sha, branch: conn.branch }),
        });
      } else {
        // Create or update
        const body: any = {
          message: sha ? `Update ${filePath}` : `Create ${filePath}`,
          content: btoa(unescape(encodeURIComponent(content || ''))),
          branch: conn.branch,
        };
        if (sha) body.sha = sha;
        await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GitHub sync error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
