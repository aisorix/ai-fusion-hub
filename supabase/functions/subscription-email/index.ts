import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'payment_confirmation' | 'renewal_reminder' | 'cancellation_notice' | 'pause_notice' | 'resume_notice';
  email: string;
  planName: string;
  amount?: number;
  currency?: string;
  nextBillingDate?: string;
  userName?: string;
}

const getEmailContent = (request: EmailRequest) => {
  const { type, planName, amount, currency, nextBillingDate, userName } = request;
  const name = userName || 'Valued Customer';

  switch (type) {
    case 'payment_confirmation':
      return {
        subject: `Payment Confirmed - ${planName} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10b981;">Payment Confirmed! ✓</h1>
            <p>Hi ${name},</p>
            <p>Thank you for your payment! Your subscription has been successfully processed.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Amount:</strong> ${currency}${amount}</p>
              <p><strong>Next billing date:</strong> ${nextBillingDate}</p>
            </div>
            <p>Enjoy your premium features!</p>
            <p>Best regards,<br>The Sorix Team</p>
          </div>
        `,
      };

    case 'renewal_reminder':
      return {
        subject: `Renewal Reminder - ${planName} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f59e0b;">Renewal Reminder 🔔</h1>
            <p>Hi ${name},</p>
            <p>Your ${planName} subscription will renew soon.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Amount:</strong> ${currency}${amount}</p>
              <p><strong>Renewal date:</strong> ${nextBillingDate}</p>
            </div>
            <p>No action needed - your subscription will automatically renew.</p>
            <p>Best regards,<br>The Sorix Team</p>
          </div>
        `,
      };

    case 'cancellation_notice':
      return {
        subject: `Subscription Cancelled - ${planName} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ef4444;">Subscription Cancelled</h1>
            <p>Hi ${name},</p>
            <p>Your ${planName} subscription has been cancelled.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Access until:</strong> ${nextBillingDate}</p>
            </div>
            <p>You'll continue to have access until the end of your current billing period.</p>
            <p>We'd love to have you back anytime!</p>
            <p>Best regards,<br>The Sorix Team</p>
          </div>
        `,
      };

    case 'pause_notice':
      return {
        subject: `Subscription Paused - ${planName} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6b7280;">Subscription Paused ⏸️</h1>
            <p>Hi ${name},</p>
            <p>Your ${planName} subscription has been paused.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Status:</strong> Paused</p>
            </div>
            <p>You can resume your subscription anytime from your settings.</p>
            <p>Best regards,<br>The Sorix Team</p>
          </div>
        `,
      };

    case 'resume_notice':
      return {
        subject: `Subscription Resumed - ${planName} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10b981;">Welcome Back! 🎉</h1>
            <p>Hi ${name},</p>
            <p>Your ${planName} subscription has been resumed.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Next billing date:</strong> ${nextBillingDate}</p>
            </div>
            <p>Enjoy your premium features!</p>
            <p>Best regards,<br>The Sorix Team</p>
          </div>
        `,
      };

    default:
      return {
        subject: 'Subscription Update',
        html: `<p>Your subscription has been updated.</p>`,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
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

    const request: EmailRequest = await req.json();

    // Verify email matches authenticated user to prevent sending to arbitrary addresses
    if (request.email !== user.email) {
      return new Response(
        JSON.stringify({ error: 'Can only send emails to your own address' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending subscription email:", request.type, "to:", request.email);

    const { subject, html } = getEmailContent(request);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sorix <onboarding@resend.dev>",
        to: [request.email],
        subject,
        html,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, ...emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
