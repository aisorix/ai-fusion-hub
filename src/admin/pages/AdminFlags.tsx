import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import DataTable from "@/admin/components/DataTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit3 } from "lucide-react";
import ConfirmDialog from "@/admin/components/ConfirmDialog";

interface Flag { id: string; key: string; description: string; enabled: boolean; rollout_percent: number; audience: any; }

export default function AdminFlags() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Flag> | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const { flags } = await invokeAdmin<{ flags: Flag[] }>("admin-flags-crud", { action: "list" }); setFlags(flags); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (f: Flag, enabled: boolean) => {
    setFlags((curr) => curr.map((x) => x.id === f.id ? { ...x, enabled } : x));
    try { await invokeAdmin("admin-flags-crud", { action: "upsert", flag: { ...f, enabled } }); }
    catch (e: any) { toast.error(e.message); load(); }
  };

  const save = async () => {
    if (!editing?.key) return toast.error("Key is required");
    try {
      await invokeAdmin("admin-flags-crud", { action: "upsert", flag: editing });
      toast.success("Flag saved"); setEditing(null); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async () => {
    if (!delId) return;
    try { await invokeAdmin("admin-flags-crud", { action: "delete", id: delId }); toast.success("Deleted"); setDelId(null); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Toggle features in real time. Changes propagate instantly via Realtime.</p>
        <Button onClick={() => setEditing({ key: "", description: "", enabled: false, rollout_percent: 100, audience: {} })}><Plus className="w-4 h-4 mr-1" /> New flag</Button>
      </div>
      {loading ? <div className="text-sm text-slate-500">Loading…</div> : (
        <DataTable
          rows={flags}
          searchKeys={["key", "description"]}
          columns={[
            { key: "key", header: "Key", render: (r) => <span className="font-mono text-xs">{r.key}</span> },
            { key: "description", header: "Description", render: (r) => <span className="text-sm text-slate-600">{r.description}</span> },
            { key: "rollout_percent", header: "Rollout %", render: (r) => `${r.rollout_percent}%` },
            { key: "enabled", header: "Enabled", render: (r) => <Switch checked={r.enabled} onCheckedChange={(v) => toggle(r, v)} /> },
            { key: "actions", header: "", render: (r) => (
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon" onClick={() => setEditing(r)}><Edit3 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDelId(r.id)}><Trash2 className="w-4 h-4 text-rose-600" /></Button>
              </div>
            ), className: "text-right" },
          ]}
        />
      )}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit flag" : "New flag"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><label className="text-xs text-slate-600">Key</label><Input value={editing?.key ?? ""} onChange={(e) => setEditing((p) => ({ ...p, key: e.target.value }))} placeholder="new_homepage" /></div>
            <div><label className="text-xs text-slate-600">Description</label><Textarea value={editing?.description ?? ""} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-600">Rollout %</label><Input type="number" min={0} max={100} value={editing?.rollout_percent ?? 100} onChange={(e) => setEditing((p) => ({ ...p, rollout_percent: Number(e.target.value) }))} /></div>
              <div className="flex items-end gap-2"><Switch checked={editing?.enabled ?? false} onCheckedChange={(v) => setEditing((p) => ({ ...p, enabled: v }))} /><span className="text-sm">Enabled</span></div>
            </div>
            <div><label className="text-xs text-slate-600">Audience JSON</label><Textarea rows={4} className="font-mono text-xs" value={JSON.stringify(editing?.audience ?? {}, null, 2)} onChange={(e) => { try { setEditing((p) => ({ ...p, audience: JSON.parse(e.target.value) })); } catch {} }} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} title="Delete this flag?" destructive confirmLabel="Delete" onConfirm={remove} />
    </div>
  );
}
