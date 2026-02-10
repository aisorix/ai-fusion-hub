import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify user with their token
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Use service role to delete user data and auth account
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Delete user data from tables
    await adminClient.from('project_messages').delete().eq('user_id', user.id)
    await adminClient.from('projects').delete().eq('user_id', user.id)
    await adminClient.from('payment_history').delete().eq('user_id', user.id)
    await adminClient.from('subscriptions').delete().eq('user_id', user.id)
    await adminClient.from('reviews').delete().eq('user_id', user.id)
    await adminClient.from('profiles').delete().eq('user_id', user.id)
    await adminClient.from('user_roles').delete().eq('user_id', user.id)

    // Delete storage files
    const { data: files } = await adminClient.storage.from('profile-avatars').list(user.id)
    if (files && files.length > 0) {
      await adminClient.storage.from('profile-avatars').remove(files.map(f => `${user.id}/${f.name}`))
    }

    // Delete auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
    if (deleteError) {
      return new Response(JSON.stringify({ error: 'Failed to delete account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
