import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useGoogleOAuth(opts?: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  const startOAuth = useCallback(async () => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        toast.error("Please sign in again");
        setLoading(false);
        return;
      }
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const startUrl = `https://${projectId}.supabase.co/functions/v1/google-oauth-start?token=${encodeURIComponent(
        token
      )}`;

      const popup = window.open(startUrl, "google_oauth", "width=520,height=640");
      if (!popup) {
        toast.error("Popup blocked. Please allow popups for this site.");
        setLoading(false);
        return;
      }

      const messageHandler = (e: MessageEvent) => {
        if (e.data?.type === "google_oauth_result") {
          window.removeEventListener("message", messageHandler);
          clearInterval(interval);
          if (e.data.ok) {
            toast.success(`Google connected${e.data.email ? `: ${e.data.email}` : ""}`);
            opts?.onSuccess?.();
          } else {
            toast.error(e.data.error || "Google connection failed");
          }
          setLoading(false);
        }
      };
      window.addEventListener("message", messageHandler);

      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          window.removeEventListener("message", messageHandler);
          setLoading(false);
        }
      }, 500);
    } catch (e: any) {
      toast.error(e?.message || "Failed to start Google OAuth");
      setLoading(false);
    }
  }, [opts]);

  return { startOAuth, loading };
}
