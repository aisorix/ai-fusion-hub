import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CustomIntegration {
  id: string;
  name: string;
  base_url: string;
  auth_header: string;
  auth_scheme: string;
  api_key: string;
  description: string | null;
  created_at: string;
}

export interface CustomIntegrationInput {
  name: string;
  base_url: string;
  auth_header?: string;
  auth_scheme?: string;
  api_key: string;
  description?: string;
}

export function useCustomIntegrations() {
  const { user } = useAuth();
  const [items, setItems] = useState<CustomIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_custom_integrations" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems(((data as any) ?? []) as CustomIntegration[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (input: CustomIntegrationInput) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("user_custom_integrations" as any).insert({
      user_id: user.id,
      name: input.name,
      base_url: input.base_url,
      auth_header: input.auth_header || "Authorization",
      auth_scheme: input.auth_scheme || "Bearer",
      api_key: input.api_key,
      description: input.description || "",
    });
    if (error) throw error;
    await refresh();
  }, [user, refresh]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from("user_custom_integrations" as any).delete().eq("id", id);
    if (error) throw error;
    await refresh();
  }, [refresh]);

  return { items, loading, refresh, create, remove };
}
