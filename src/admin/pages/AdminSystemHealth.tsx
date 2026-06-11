import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import KpiCard from "@/admin/components/KpiCard";
import { Button } from "@/components/ui/button";
import { Activity, Database, Cloud, AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminSystemHealth() {
  const [h, setH] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const load = () => { setLoading(true); invokeAdmin("admin-system-health").then(setH).finally(() => setLoading(false)); };
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);
  if (!h) return <div className="text-sm text-slate-500">Loading…</div>;
  const okTone = (ok: boolean) => ok ? "positive" : "danger";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Auto-refreshes every 30s. Last check: {new Date(h.checked_at).toLocaleTimeString()}</p>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Database" value={h.db.ok ? "Healthy" : "Down"} tone={okTone(h.db.ok) as any} hint={`${h.db.latency_ms}ms round-trip`} icon={<Database className="w-5 h-5" />} />
        <KpiCard label="AI Gateway" value={h.ai_gateway.ok ? "Up" : "Down"} tone={okTone(h.ai_gateway.ok) as any} hint={`${h.ai_gateway.latency_ms}ms`} icon={<Cloud className="w-5 h-5" />} />
        <KpiCard label="OpenRouter" value={h.openrouter.ok ? "Up" : "Down"} tone={okTone(h.openrouter.ok) as any} hint={`${h.openrouter.latency_ms}ms`} icon={<Cloud className="w-5 h-5" />} />
        <KpiCard label="Error rate (1h)" value={`${h.edge_functions.error_rate_percent}%`} tone={h.edge_functions.error_rate_percent > 5 ? "danger" : "positive"} hint={`${h.edge_functions.calls_last_hour} AI calls`} icon={<AlertTriangle className="w-5 h-5" />} />
      </div>
      <div className="text-xs text-slate-500"><Activity className="w-3 h-3 inline mr-1" /> Storage analytics surfaced in dedicated storage panel (per-bucket).</div>
    </div>
  );
}
