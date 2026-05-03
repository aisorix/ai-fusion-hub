import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserIntegration {
  id: string;
  provider: string;
  nango_connection_id: string;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useIntegrations() {
  const { user } = useAuth();
  const [items, setItems] = useState<UserIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_integrations")
      .select("*")
      .eq("user_id", user.id);
    setItems((data as any) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`user_integrations:${user.id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "user_integrations", filter: `user_id=eq.${user.id}` },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, refresh]);

  const getByProvider = useCallback(
    (p: string) => items.find(i => i.provider === p),
    [items]
  );

  const startConnect = useCallback(async (provider: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");

    // Return back to whatever page the user is on (preview or production), preserving the path.
    const returnUrl = `${window.location.origin}${window.location.pathname}`;

    const res = await fetch(
      `https://flqwpuixevufwxfktdxg.supabase.co/functions/v1/nango-connect-start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ provider, returnUrl }),
      }
    );
    const j = await res.json();
    if (!res.ok || !j.url) throw new Error(j.message ?? "Failed to start connection");
    window.location.href = j.url;
  }, []);

  // Sync newly completed OAuth connections from Nango -> user_integrations
  const syncFromNango = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      await fetch(
        `https://flqwpuixevufwxfktdxg.supabase.co/functions/v1/nango-list-connections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
    } catch (e) {
      console.error("nango sync failed", e);
    }
    await refresh();
  }, [refresh]);

  const disconnect = useCallback(async (provider: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");
    await fetch(
      `https://flqwpuixevufwxfktdxg.supabase.co/functions/v1/nango-disconnect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ provider }),
      }
    );
    await refresh();
  }, [refresh]);

  return { items, loading, refresh, getByProvider, startConnect, disconnect, syncFromNango };
}
