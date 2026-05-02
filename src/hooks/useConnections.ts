import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserConnection {
  id: string;
  service: string;
  status: string;
  external_account_id: string | null;
  scopes: string[] | null;
  expires_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("user_connections")
      .select("id, service, status, external_account_id, scopes, expires_at, metadata, created_at, updated_at")
      .eq("user_id", user.id);
    if (!error && data) setConnections(data as any);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // realtime updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`user_connections:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_connections", filter: `user_id=eq.${user.id}` },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  const getByService = useCallback(
    (service: string) => connections.find((c) => c.service === service),
    [connections]
  );

  const disconnect = useCallback(
    async (service: string) => {
      if (!user) return;
      await supabase.from("user_connections").delete().eq("user_id", user.id).eq("service", service);
      await refresh();
    },
    [user, refresh]
  );

  return { connections, loading, refresh, getByService, disconnect };
}
