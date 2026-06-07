import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const INTERNAL_WEBHOOK_SECRET = Deno.env.get("INTERNAL_WEBHOOK_SECRET");
const SSLCOMMERZ_STORE_ID = Deno.env.get("SSLCOMMERZ_STORE_ID");
const SSLCOMMERZ_STORE_PASSWORD = Deno.env.get("SSLCOMMERZ_STORE_PASSWORD");
const SSLCOMMERZ_SANDBOX = Deno.env.get("SSLCOMMERZ_SANDBOX") !== "false";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  basic: 'Sorix Basic',
  pro: 'Sorix Pro',
  premium: 'Sorix Premium',
  premium_plus: 'Sorix Premium Plus',
  max: 'Sorix Max',
  enterprise: 'Enterprise',
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
  _internal_secret?: string;
}

// --- SSLCommerz IPN Validation ---
async function validateSSLCommerz(valId: string): Promise<boolean> {
  if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
    console.error("SSLCommerz credentials not available for validation");
    return false;
  }
  const validationUrl = SSLCOMMERZ_SANDBOX
    ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
    : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

  try {
    const resp = await fetch(
      `${validationUrl}?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(SSLCOMMERZ_STORE_ID)}&store_passwd=${encodeURIComponent(SSLCOMMERZ_STORE_PASSWORD)}&format=json`
    );
    const result = await resp.json();
    console.log("SSLCommerz validation result:", result.status);
    return result.status === 'VALID' || result.status === 'VALIDATED';
  } catch (err) {
    console.error("SSLCommerz validation error:", err);
    return false;
  }
}

// --- Stripe Session Verification ---
async function verifyStripeSession(sessionId: string): Promise<boolean> {
  if (!STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY not available for verification");
    return false;
  }
  try {
    const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { "Authorization": `Bearer ${STRIPE_SECRET_KEY}` },
    });
    const session = await resp.json();
    console.log("Stripe session status:", session.payment_status);
    return session.payment_status === 'paid';
  } catch (err) {
    console.error("Stripe session verification error:", err);
    return false;
  }
}

// --- Internal Secret Validation ---
function validateInternalSecret(secret: string | undefined): boolean {
  if (!INTERNAL_WEBHOOK_SECRET) {
    console.error("INTERNAL_WEBHOOK_SECRET not configured");
    return false;
  }
  return secret === INTERNAL_WEBHOOK_SECRET;
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
      // Handle SSLCommerz IPN format. The value_a/value_b fields here are user-controlled
      // through the gateway redirect and MUST NOT be trusted. We only read tran_id and
      // val_id from the IPN; the real plan_id/user_id/amount come from payment_intents.
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
        user_id: '', // populated from payment_intents below
        plan_id: '', // populated from payment_intents below
        billing_cycle: 'monthly',
        payment_method: formData.get("card_type") as string || 'sslcommerz',
      };
    } else {
      throw new Error("Unsupported content type");
    }

    console.log("Payment webhook received:", JSON.stringify({ ...callbackData, _internal_secret: '[REDACTED]' }));

    if (!callbackData.tran_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing transaction id" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // === GATEWAY-SPECIFIC VERIFICATION ===
    // For successful payments we ALWAYS resolve user_id / plan_id / amount / billing_cycle
    // from a server-side trusted source — never from client- or IPN-supplied fields.
    let trustedUserId = '';
    let trustedPlanId = '';
    let trustedAmount = 0;
    let trustedCurrency = callbackData.currency || 'BDT';
    let trustedBillingCycle: 'monthly' | 'yearly' = 'monthly';
    let intentLookupKey = callbackData.tran_id;

    if (callbackData.status === 'success') {
      if (callbackData.gateway === 'sslcommerz') {
        if (!callbackData.val_id) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing validation ID" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        const isValid = await validateSSLCommerz(callbackData.val_id);
        if (!isValid) {
          return new Response(
            JSON.stringify({ success: false, error: "Payment validation failed" }),
            { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        console.log("SSLCommerz IPN validated");
      } else if (callbackData.gateway === 'stripe') {
        if (!callbackData.stripe_session_id) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing Stripe session ID" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        // Fetch the full Stripe session and read plan_id/user_id/tran_id from
        // server-side metadata only — never from the client request body.
        if (!STRIPE_SECRET_KEY) {
          return new Response(
            JSON.stringify({ success: false, error: "Stripe not configured" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        const sessionResp = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${callbackData.stripe_session_id}`,
          { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } },
        );
        const session = await sessionResp.json();
        if (!sessionResp.ok || session.payment_status !== 'paid') {
          return new Response(
            JSON.stringify({ success: false, error: "Payment not completed" }),
            { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        const meta = session.metadata || {};
        // Use server-side metadata for the lookup key; ignore the request body's tran_id.
        intentLookupKey = meta.tran_id || callbackData.tran_id;
        callbackData.tran_id = intentLookupKey;
        console.log("Stripe session verified, tran_id from metadata:", intentLookupKey);
      } else if (callbackData.gateway === 'bkash') {
        // bKash: require internal webhook secret (service-to-service call from bkash-payment)
        if (!validateInternalSecret(callbackData._internal_secret)) {
          return new Response(
            JSON.stringify({ success: false, error: "Unauthorized" }),
            { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        console.log("bKash internal call verified");
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Unknown payment gateway" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Resolve trusted plan/amount/user from payment_intents (created server-side
      // when the user initiated checkout). This is what defeats plan-upgrade attacks.
      const { data: intent, error: intentErr } = await supabase
        .from('payment_intents')
        .select('user_id, plan_id, amount, currency, billing_cycle')
        .eq('gateway', callbackData.gateway)
        .eq('external_id', intentLookupKey)
        .maybeSingle();

      if (intentErr || !intent) {
        console.error("No matching payment intent for", callbackData.gateway, intentLookupKey, intentErr);
        return new Response(
          JSON.stringify({ success: false, error: "Unknown payment intent" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      trustedUserId = intent.user_id;
      trustedPlanId = intent.plan_id;
      trustedAmount = Number(intent.amount);
      trustedCurrency = intent.currency || trustedCurrency;
      trustedBillingCycle = (intent.billing_cycle as 'monthly' | 'yearly') || 'monthly';

      // Replace whatever the client/IPN told us with the trusted values.
      callbackData.user_id = trustedUserId;
      callbackData.plan_id = trustedPlanId;
      callbackData.amount = trustedAmount;
      callbackData.currency = trustedCurrency;
      callbackData.billing_cycle = trustedBillingCycle;
    } else {
      // Failure paths — still require tran_id; fill user/plan from intent if available.
      const { data: intent } = await supabase
        .from('payment_intents')
        .select('user_id, plan_id, amount, currency, billing_cycle')
        .eq('gateway', callbackData.gateway)
        .eq('external_id', callbackData.tran_id)
        .maybeSingle();
      if (intent) {
        callbackData.user_id = intent.user_id;
        callbackData.plan_id = intent.plan_id;
        callbackData.amount = Number(intent.amount);
        callbackData.currency = intent.currency || callbackData.currency;
        callbackData.billing_cycle = (intent.billing_cycle as 'monthly' | 'yearly') || 'monthly';
      }
    }

    if (!callbackData.user_id || !callbackData.plan_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // === IDEMPOTENCY CHECK ===
    const { data: existingPayment } = await supabase
      .from('payment_history')
      .select('id')
      .eq('transaction_id', callbackData.tran_id)
      .maybeSingle();

    if (existingPayment) {
      console.log("Duplicate transaction ignored:", callbackData.tran_id);
      return new Response(
        JSON.stringify({ success: true, message: "Already processed" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark the intent as paid (best effort).
    if (callbackData.status === 'success') {
      await supabase
        .from('payment_intents')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('gateway', callbackData.gateway)
        .eq('external_id', intentLookupKey);
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
          status: 'failed',
          plan_id: callbackData.plan_id,
          billing_cycle: callbackData.billing_cycle,
          gateway_response: { gateway: callbackData.gateway, status: callbackData.status },
        });

      if (historyError) {
        console.error("Error recording failed payment:", historyError);
      }

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
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
