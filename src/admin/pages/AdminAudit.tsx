import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import DataTable from "@/admin/components/DataTable";
import StatusPill from "@/admin/components/StatusPill";
import JsonDiff from "@/admin/components/JsonDiff";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminAudit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [actor, setActor] = useState("");
  const [resource, setResource] = useState("");
  const [severity, setSeverity] = useState("");
  const [active, setActive] = useState<any | null>(null);

  const load = async () => {
    try {
      const r = await invokeAdmin<{ logs: any[]; total: number }>("admin-audit-list", {
        actor: actor || undefined, resource: resource || undefined, severity: severity || undefined, pageSize: 100,
      });
      setLogs(r.logs); setTotal(r.total);
    } catch (e: any) { toast.error(e.message); }
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Actor email" value={actor} onChange={(e) => setActor(e.target.value)} className="w-52" />
        <Input placeholder="Resource" value={resource} onChange={(e) => setResource(e.target.value)} className="w-40" />
        <Select value={severity || "all"} onValueChange={(v) => setSeverity(v === "all" ? "" : v)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="info">Info</SelectItem><SelectItem value="warn">Warn</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
        </Select>
        <Button onClick={load}>Filter</Button>
        <span className="text-xs text-slate-500 ml-auto">{total} total</span>
      </div>
      <DataTable rows={logs} onRowClick={setActive} columns={[
        { key: "created_at", header: "When", render: (r) => new Date(r.created_at).toLocaleString() },
        { key: "actor_email", header: "Actor", render: (r) => <span className="font-mono text-xs">{r.actor_email}</span> },
        { key: "action", header: "Action", render: (r) => <span className="font-mono text-xs">{r.action}</span> },
        { key: "resource", header: "Resource" },
        { key: "severity", header: "Severity", render: (r) => <StatusPill value={r.severity ?? "info"} /> },
      ]} />
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
          <SheetHeader><SheetTitle>Audit entry</SheetTitle></SheetHeader>
          {active && (
            <div className="mt-4 space-y-3 text-sm">
              <div><span className="text-slate-500">When:</span> {new Date(active.created_at).toLocaleString()}</div>
              <div><span className="text-slate-500">Actor:</span> {active.actor_email}</div>
              <div><span className="text-slate-500">Action:</span> <span className="font-mono">{active.action}</span></div>
              <div><span className="text-slate-500">Resource:</span> {active.resource} {active.resource_id && <span className="text-xs font-mono text-slate-400">({active.resource_id})</span>}</div>
              <div><span className="text-slate-500">IP:</span> {active.ip}</div>
              <JsonDiff previous={active.previous_value} next={active.new_value} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
