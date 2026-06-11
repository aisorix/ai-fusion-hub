import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, boolean>();
let warmed = false;

async function warmCache() {
  if (warmed) return;
  warmed = true;
  const { data } = await supabase.rpc("get_enabled_flags");
  for (const row of (data ?? []) as any[]) cache.set(row.key, !!row.enabled);
}

export function useFeatureFlag(key: string, fallback = false) {
  const [enabled, setEnabled] = useState<boolean>(cache.get(key) ?? fallback);
  useEffect(() => {
    let active = true;
    warmCache().then(() => active && setEnabled(cache.get(key) ?? fallback));
    const ch = supabase.channel(`flag-${key}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "feature_flags", filter: `key=eq.${key}` }, async () => {
        warmed = false; cache.clear();
        await warmCache();
        if (active) setEnabled(cache.get(key) ?? fallback);
      })
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, [key, fallback]);
  return enabled;
}
