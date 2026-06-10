import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

interface Event {
  id: string;
  feature: string;
  model: string | null;
  status: string;
  user_id: string | null;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number | null;
  created_at: string;
}

export default function AdminAILive() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from("ai_events").select("*").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setEvents((data ?? []) as any));
    const ch = supabase.channel("admin-ai-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ai_events" }, (p) => {
        setEvents((prev) => [p.new as Event, ...prev].slice(0, 100));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Live AI Feed</h1>
        <Badge className="bg-emerald-500/20 text-emerald-300 gap-1.5"><Radio className="w-3 h-3 animate-pulse" /> Realtime</Badge>
      </div>
      <p className="text-sm text-slate-400">Most recent 100 AI calls across the platform.</p>

      <Card className="bg-slate-900/60 border-slate-800 divide-y divide-slate-800">
        {events.length === 0 && <div className="p-8 text-center text-slate-500">Waiting for events…</div>}
        {events.map((e) => (
          <div key={e.id} className="p-3 flex items-center gap-3 text-sm hover:bg-slate-800/40">
            <Badge variant={e.status === "success" ? "default" : "destructive"} className="capitalize">{e.status}</Badge>
            <span className="font-medium w-28 truncate">{e.feature}</span>
            <span className="text-slate-400 w-32 truncate">{e.model ?? "—"}</span>
            <span className="text-slate-400 tabular-nums w-20 text-right">{(e.tokens_in ?? 0) + (e.tokens_out ?? 0)} tok</span>
            <span className="text-slate-400 tabular-nums w-20 text-right">{e.latency_ms ?? "—"}ms</span>
            <span className="text-slate-500 text-xs ml-auto">{new Date(e.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
