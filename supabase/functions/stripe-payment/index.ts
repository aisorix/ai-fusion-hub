import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/payment-webhook`;

interface PaymentRequest {
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  billingCycle: 'monthly' | 'yearly';
  origin: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Stripe is not configured. Please add your Stripe API key." 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: PaymentRequest = await req.json();
    const { userId, planId, planName, amount, currency, customerName, customerEmail, billingCycle, origin } = body;

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);
    
    // Map currency symbol to ISO code
    const currencyCode = currency === "৳" || currency === "BDT" ? "bdt" : 
                         currency === "$" || currency === "USD" ? "usd" : 
                         currency.toLowerCase();

    // Generate unique transaction ID
    const tranId = `SORIX_STRIPE_${planId.toUpperCase()}_${Date.now()}`;

    console.log("Creating Stripe checkout session:", { tranId, planId, amount, currency: currencyCode });

    // Create Stripe Checkout Session
    const sessionResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": currencyCode,
        "line_items[0][price_data][product_data][name]": `${planName} - ${billingCycle} subscription`,
        "line_items[0][price_data][product_data][description]": `Sorix AI ${planName} plan (${billingCycle})`,
        "line_items[0][price_data][unit_amount]": amountInCents.toString(),
        "line_items[0][quantity]": "1",
        "customer_email": customerEmail,
        "client_reference_id": tranId,
        "metadata[user_id]": userId,
        "metadata[plan_id]": planId,
        "metadata[billing_cycle]": billingCycle,
        "metadata[tran_id]": tranId,
        "success_url": `${origin}/payment/success?tran_id=${tranId}&gateway=stripe`,
        "cancel_url": `${origin}/payment/cancel?tran_id=${tranId}&gateway=stripe`,
      }).toString(),
    });

    const session = await sessionResponse.json();
    console.log("Stripe session response:", session);

    if (session.error) {
      console.error("Stripe error:", session.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: session.error.message || "Failed to create checkout session" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (session.url) {
      return new Response(
        JSON.stringify({
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
          tranId: tranId,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create checkout session" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  } catch (error: any) {
    console.error("Stripe payment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
