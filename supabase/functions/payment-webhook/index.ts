import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

interface PaymentCallback {
  gateway: 'sslcommerz' | 'bkash' | 'stripe';
  status: 'success' | 'failed' | 'cancelled';
  tran_id: string;
  val_id?: string;
  amount: number;
  currency?: string;
  user_id: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  payment_method?: string;
  stripe_session_id?: string;
}

const sendPaymentEmail = async (
  email: string,
  type: 'payment_confirmation' | 'payment_failed',
  planName: string,
  amount: number,
  currency: string,
  nextBillingDate?: string
) => {
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured, skipping email");
    return;
  }

  try {
    const subject = type === 'payment_confirmation' 
      ? `Payment Confirmed - ${planName} Plan` 
      : `Payment Failed - ${planName} Plan`;
    
    const html = type === 'payment_confirmation' 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Payment Confirmed! ✓</h1>
          <p>Thank you for your payment! Your subscription has been successfully processed.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> ${currency} ${amount}</p>
            <p><strong>Next billing date:</strong> ${nextBillingDate}</p>
          </div>
          <p>Enjoy your premium features!</p>
          <p>Best regards,<br>The Sorix Team</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Payment Failed ✗</h1>
          <p>Unfortunately, your payment could not be processed.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> ${currency} ${amount}</p>
          </div>
          <p>Please try again or contact support if the issue persists.</p>
          <p>Best regards,<br>The Sorix Team</p>
        </div>
      `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sorix <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse callback data - support both JSON and form-urlencoded
    let callbackData: PaymentCallback;
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      callbackData = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle SSLCommerz IPN format
      const formData = await req.formData();
      const status = formData.get("status") as string;
      const sslStatus = status === "VALID" || status === "VALIDATED" ? 'success' : 'failed';
      
      callbackData = {
        gateway: 'sslcommerz',
        status: sslStatus,
        tran_id: formData.get("tran_id") as string,
        val_id: formData.get("val_id") as string,
        amount: parseFloat(formData.get("amount") as string) || parseFloat(formData.get("value_d") as string) || 0,
        currency: formData.get("currency") as string || 'BDT',
        user_id: formData.get("value_a") as string, // userId passed in value_a
        plan_id: formData.get("value_b") as string, // planId passed in value_b
        billing_cycle: (formData.get("value_c") as 'monthly' | 'yearly') || 'monthly', // billingCycle in value_c
        payment_method: formData.get("card_type") as string || 'sslcommerz',
      };
    } else {
      throw new Error("Unsupported content type");
    }

    console.log("Payment webhook received:", JSON.stringify(callbackData));

    // Validate required fields
    if (!callbackData.tran_id || !callbackData.user_id || !callbackData.plan_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const planName = PLAN_NAMES[callbackData.plan_id] || callbackData.plan_id;
    const currency = callbackData.currency || 'BDT';
    const paymentMethod = callbackData.payment_method || callbackData.gateway;

    // Get user email
    let userEmail = '';
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(callbackData.user_id);
      userEmail = userData?.user?.email || '';
    } catch (e) {
      console.error("Could not fetch user email:", e);
    }

    if (callbackData.status === 'success') {
      // Calculate billing period
      const now = new Date();
      const periodEnd = new Date(now);
      if (callbackData.billing_cycle === 'yearly') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Check if subscription exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', callbackData.user_id)
        .maybeSingle();

      let subscriptionId: string | null = null;

      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan_id: callbackData.plan_id,
            status: 'active',
            amount: callbackData.amount,
            currency: currency,
            billing_cycle: callbackData.billing_cycle,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
          })
          .eq('id', existingSub.id);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          throw updateError;
        }
        subscriptionId = existingSub.id;
        console.log("Subscription updated:", existingSub.id);
      } else {
        // Create new subscription
        const { data: newSub, error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: callbackData.user_id,
            plan_id: callbackData.plan_id,
            status: 'active',
            amount: callbackData.amount,
            currency: currency,
            billing_cycle: callbackData.billing_cycle,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
          })
          .select('id')
          .single();

        if (insertError) {
          console.error("Error creating subscription:", insertError);
          throw insertError;
        }
        subscriptionId = newSub?.id || null;
        console.log("New subscription created");
      }

      // Record payment history
      const { error: historyError } = await supabase
        .from('payment_history')
        .insert({
          user_id: callbackData.user_id,
          subscription_id: subscriptionId,
          transaction_id: callbackData.tran_id,
          payment_method: paymentMethod,
          amount: callbackData.amount,
          currency: currency,
          status: 'completed',
          plan_id: callbackData.plan_id,
          billing_cycle: callbackData.billing_cycle,
          gateway_response: { gateway: callbackData.gateway, val_id: callbackData.val_id },
        });

      if (historyError) {
        console.error("Error recording payment history:", historyError);
      }

      // Send confirmation email
      if (userEmail) {
        await sendPaymentEmail(
          userEmail,
          'payment_confirmation',
          planName,
          callbackData.amount,
          currency,
          periodEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        );
      }

      console.log("Payment processed successfully");
      return new Response(
        JSON.stringify({ success: true, message: "Payment processed successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else {
      // Record failed payment
      const { error: historyError } = await supabase
        .from('payment_history')
        .insert({
          user_id: callbackData.user_id,
          transaction_id: callbackData.tran_id,
          payment_method: paymentMethod,
          amount: callbackData.amount,
          currency: currency,
          status: callbackData.status === 'cancelled' ? 'failed' : 'failed',
          plan_id: callbackData.plan_id,
          billing_cycle: callbackData.billing_cycle,
          gateway_response: { gateway: callbackData.gateway, status: callbackData.status },
        });

      if (historyError) {
        console.error("Error recording failed payment:", historyError);
      }

      // Send failure email
      if (userEmail) {
        await sendPaymentEmail(
          userEmail,
          'payment_failed',
          planName,
          callbackData.amount,
          currency
        );
      }

      console.log("Payment failed/cancelled recorded");
      return new Response(
        JSON.stringify({ success: true, message: "Payment failure recorded" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
