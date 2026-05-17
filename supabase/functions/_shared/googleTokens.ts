// Helper to fetch a valid Google access token for a user, refreshing if needed.
// Looks up the per-service connection row (google_gmail/drive/calendar/docs/sheets),
// with a fallback to the legacy combined "google" row for users on the old flow.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export type GoogleCapability = "gmail" | "drive" | "calendar" | "docs" | "sheets";

const CAPABILITY_TO_SERVICE: Record<GoogleCapability, string> = {
  gmail: "google_gmail",
  drive: "google_drive",
  calendar: "google_calendar",
  docs: "google_docs",
  sheets: "google_sheets",
};

export async function getValidGoogleToken(
  userId: string,
  capability: GoogleCapability = "gmail",
): Promise<{ token: string | null; error?: string; service?: string }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const preferred = CAPABILITY_TO_SERVICE[capability];

  // Try preferred per-service row first, then legacy "google" row.
  const { data: rows } = await admin
    .from("user_connections")
    .select("service, access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .in("service", [preferred, "google"]);

  const row = rows?.find((r) => r.service === preferred) || rows?.find((r) => r.service === "google");
  if (!row) return { token: null, error: "google_not_connected" };

  const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  const stillValid = expiresAt > Date.now() + 60_000;
  if (stillValid && row.access_token) return { token: row.access_token, service: row.service };

  if (!row.refresh_token) {
    return {
      token: row.access_token,
      service: row.service,
      error: row.access_token ? undefined : "google_no_refresh_token",
    };
  }

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    return { token: row.access_token, service: row.service, error: "google_oauth_not_configured" };
  }

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
    return { token: null, service: row.service, error: "google_refresh_failed" };
  }

  const json = await res.json();
  const newToken = json.access_token as string;
  const expiresIn = (json.expires_in as number) || 3600;
  const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await admin
    .from("user_connections")
    .update({ access_token: newToken, expires_at: newExpiresAt, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("service", row.service);

  return { token: newToken, service: row.service };
}
