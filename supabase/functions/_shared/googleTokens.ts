// Helper to fetch a valid Google access token for a user, refreshing if needed.
// Used by all Google-powered agent tools (Gmail, Drive, Calendar, Docs, Sheets, YouTube).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export async function getValidGoogleToken(userId: string): Promise<{ token: string | null; error?: string }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: row, error } = await admin
    .from("user_connections")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .eq("service", "google")
    .maybeSingle();

  if (error || !row) return { token: null, error: "google_not_connected" };

  const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  const stillValid = expiresAt > Date.now() + 60_000;
  if (stillValid && row.access_token) return { token: row.access_token };

  if (!row.refresh_token) return { token: row.access_token, error: row.access_token ? undefined : "google_no_refresh_token" };

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  if (!clientId || !clientSecret) return { token: row.access_token, error: "google_oauth_not_configured" };

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: row.refresh_token,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Google refresh failed:", txt);
    return { token: null, error: "google_refresh_failed" };
  }

  const json = await res.json();
  const newToken = json.access_token as string;
  const expiresIn = (json.expires_in as number) || 3600;
  const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await admin
    .from("user_connections")
    .update({ access_token: newToken, expires_at: newExpiresAt, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("service", "google");

  return { token: newToken };
}
