import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  basic: 'Sorix Basic',
  pro: 'Sorix Pro',
  premium: 'Sorix Premium',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify internal webhook secret - this endpoint is for cron jobs only
    const authHeader = req.headers.get('Authorization');
    const INTERNAL_SECRET = Deno.env.get('INTERNAL_WEBHOOK_SECRET');
    if (!authHeader || authHeader !== `Bearer ${INTERNAL_SECRET}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - internal endpoint only' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Starting renewal reminder check...");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Calculate date range for 3 days from now
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(threeDaysFromNow);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(threeDaysFromNow);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(`Looking for subscriptions ending between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`);

    // Find active subscriptions that will renew in 3 days
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .gte('current_period_end', startOfDay.toISOString())
      .lte('current_period_end', endOfDay.toISOString());

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${subscriptions?.length || 0} subscriptions to notify`);

    const emailResults = [];

    for (const subscription of subscriptions || []) {
      // Get user email from auth.users (using service role)
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(subscription.user_id);
      
      if (userError || !userData?.user?.email) {
        console.error(`Could not get email for user ${subscription.user_id}:`, userError);
        continue;
      }

      const userEmail = userData.user.email;
      const planName = PLAN_NAMES[subscription.plan_id] || subscription.plan_id;
      const renewalDate = new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Send renewal reminder email
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Sorix <onboarding@resend.dev>",
          to: [userEmail],
          subject: `Renewal Reminder - ${planName} Plan`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #f59e0b;">Renewal Reminder 🔔</h1>
              <p>Hi there,</p>
              <p>Your <strong>${planName}</strong> subscription will renew in <strong>3 days</strong>.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Amount:</strong> ${subscription.currency} ${subscription.amount}</p>
                <p><strong>Renewal date:</strong> ${renewalDate}</p>
              </div>
              <p>No action needed - your subscription will automatically renew. If you'd like to make changes, visit your account settings.</p>
              <p>Best regards,<br>The Sorix Team</p>
            </div>
          `,
        }),
      });

      const emailResult = await emailResponse.json();
      console.log(`Email sent to ${userEmail}:`, emailResult);
      emailResults.push({ email: userEmail, result: emailResult });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: subscriptions?.length || 0,
        emailsSent: emailResults.length,
        results: emailResults 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in renewal reminder function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
