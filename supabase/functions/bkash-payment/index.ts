import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BKASH_APP_KEY = Deno.env.get("BKASH_APP_KEY");
const BKASH_APP_SECRET = Deno.env.get("BKASH_APP_SECRET");
const BKASH_USERNAME = Deno.env.get("BKASH_USERNAME");
const BKASH_PASSWORD = Deno.env.get("BKASH_PASSWORD");
const BKASH_SANDBOX = Deno.env.get("BKASH_SANDBOX") !== "false";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/payment-webhook`;
const INTERNAL_WEBHOOK_SECRET = Deno.env.get("INTERNAL_WEBHOOK_SECRET");

interface PaymentRequest {
  action: 'grant_token' | 'create_payment' | 'execute_payment' | 'query_payment';
  userId?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  customerPhone?: string;
  billingCycle?: 'monthly' | 'yearly';
  paymentID?: string;
}

// Get bKash token
async function getGrantToken(): Promise<string | null> {
  if (!BKASH_APP_KEY || !BKASH_APP_SECRET || !BKASH_USERNAME || !BKASH_PASSWORD) {
    console.error("bKash credentials not configured");
    return null;
  }

  const baseUrl = BKASH_SANDBOX
    ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta"
    : "https://tokenized.pay.bka.sh/v1.2.0-beta";

  try {
    const response = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "username": BKASH_USERNAME,
        "password": BKASH_PASSWORD,
      },
      body: JSON.stringify({
        app_key: BKASH_APP_KEY,
        app_secret: BKASH_APP_SECRET,
      }),
    });

    const result = await response.json();
    console.log("bKash token response:", result);
    
    if (result.id_token) {
      return result.id_token;
    }
    return null;
  } catch (error) {
    console.error("bKash token error:", error);
    return null;
  }
}

// Create bKash payment
async function createPayment(
  token: string,
  amount: number,
  planId: string,
  planName: string,
  billingCycle: string,
  userId: string,
  origin: string
): Promise<any> {
  const baseUrl = BKASH_SANDBOX
    ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta"
    : "https://tokenized.pay.bka.sh/v1.2.0-beta";

  const invoiceNumber = `SORIX_${planId.toUpperCase()}_${Date.now()}`;
  const callbackURL = `${origin}/payment/bkash/callback`;

  try {
    const response = await fetch(`${baseUrl}/tokenized/checkout/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token,
        "X-APP-Key": BKASH_APP_KEY!,
      },
      body: JSON.stringify({
        mode: "0011",
        callbackURL: callbackURL,
        amount: amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: invoiceNumber,
      }),
    });

    const result = await response.json();
    console.log("bKash create payment response:", result);
    return result;
  } catch (error) {
    console.error("bKash create payment error:", error);
    throw error;
  }
}

// Execute bKash payment
async function executePayment(token: string, paymentID: string): Promise<any> {
  const baseUrl = BKASH_SANDBOX
    ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta"
    : "https://tokenized.pay.bka.sh/v1.2.0-beta";

  try {
    const response = await fetch(`${baseUrl}/tokenized/checkout/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token,
        "X-APP-Key": BKASH_APP_KEY!,
      },
      body: JSON.stringify({ paymentID }),
    });

    const result = await response.json();
    console.log("bKash execute payment response:", result);
    return result;
  } catch (error) {
    console.error("bKash execute payment error:", error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: PaymentRequest = await req.json();
    const { action, userId, planId, planName, amount, billingCycle, paymentID } = body;
    const origin = req.headers.get("origin") || "";

    switch (action) {
      case 'grant_token': {
        const token = await getGrantToken();
        if (token) {
          return new Response(
            JSON.stringify({ success: true, token }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } else {
          return new Response(
            JSON.stringify({ success: false, error: "Failed to get bKash token" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      case 'create_payment': {
        if (!userId || !planId || !planName || !amount || !billingCycle) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing required fields" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const token = await getGrantToken();
        if (!token) {
          return new Response(
            JSON.stringify({ success: false, error: "Failed to get bKash token" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const result = await createPayment(token, amount, planId, planName, billingCycle, userId, origin);
        
        if (result.bkashURL) {
          return new Response(
            JSON.stringify({
              success: true,
              bkashURL: result.bkashURL,
              paymentID: result.paymentID,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: result.errorMessage || "Payment creation failed",
            }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      case 'execute_payment': {
        if (!paymentID || !userId || !planId || !amount || !billingCycle) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing required fields" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const token = await getGrantToken();
        if (!token) {
          return new Response(
            JSON.stringify({ success: false, error: "Failed to get bKash token" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const result = await executePayment(token, paymentID);
        
        if (result.transactionStatus === "Completed") {
          // Call webhook to record payment and update subscription
          try {
            await fetch(WEBHOOK_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gateway: 'bkash',
                status: 'success',
                tran_id: result.trxID || paymentID,
                amount: parseFloat(result.amount) || amount,
                currency: 'BDT',
                user_id: userId,
                plan_id: planId,
                billing_cycle: billingCycle,
                payment_method: 'bkash',
                _internal_secret: INTERNAL_WEBHOOK_SECRET,
              }),
            });
          } catch (webhookError) {
            console.error("Failed to call webhook:", webhookError);
          }

          return new Response(
            JSON.stringify({
              success: true,
              transactionId: result.trxID,
              amount: result.amount,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: result.errorMessage || "Payment execution failed",
            }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid action" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
  } catch (error: any) {
    console.error("bKash payment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
