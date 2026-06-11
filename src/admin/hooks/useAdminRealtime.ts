import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminRealtime<T = any>(table: string, initial: T[] = []) {
  const [rows, setRows] = useState<T[]>(initial);
  useEffect(() => {
    const ch = supabase.channel(`admin-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
        setRows((curr) => {
          if (payload.eventType === "INSERT") return [payload.new as T, ...curr];
          if (payload.eventType === "UPDATE") return curr.map((r: any) => r.id === (payload.new as any).id ? payload.new as T : r);
          if (payload.eventType === "DELETE") return curr.filter((r: any) => r.id !== (payload.old as any).id);
          return curr;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table]);
  return [rows, setRows] as const;
}
