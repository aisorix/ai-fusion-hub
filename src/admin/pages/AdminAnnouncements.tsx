import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import DataTable from "@/admin/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusPill from "@/admin/components/StatusPill";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit3 } from "lucide-react";

interface Ann { id?: string; title: string; body_md: string; severity: string; audience: string; starts_at?: string | null; ends_at?: string | null; active: boolean; }

export default function AdminAnnouncements() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Ann | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const r = await invokeAdmin<{ announcements: any[] }>("admin-announcements-crud", { action: "list" }); setRows(r.announcements); }
    catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    try { await invokeAdmin("admin-announcements-crud", { action: "upsert", announcement: editing }); toast.success("Saved"); setEditing(null); load(); }
    catch (e: any) { toast.error(e.message); }
  };
  const remove = async () => {
    if (!delId) return;
    try { await invokeAdmin("admin-announcements-crud", { action: "delete", id: delId }); toast.success("Deleted"); setDelId(null); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Drive the in-app announcement banner.</p>
        <Button onClick={() => setEditing({ title: "", body_md: "", severity: "info", audience: "all", active: true })}><Plus className="w-4 h-4 mr-1" /> New</Button>
      </div>
      {loading ? <div className="text-sm text-slate-500">Loading…</div> : (
        <DataTable rows={rows} searchKeys={["title"]} columns={[
          { key: "title", header: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
          { key: "severity", header: "Severity", render: (r) => <StatusPill value={r.severity} /> },
          { key: "audience", header: "Audience" },
          { key: "active", header: "Status", render: (r) => <StatusPill value={r.active ? "on" : "off"} /> },
          { key: "actions", header: "", className: "text-right", render: (r) => (
            <div className="flex gap-1 justify-end">
              <Button variant="ghost" size="icon" onClick={() => setEditing(r)}><Edit3 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setDelId(r.id)}><Trash2 className="w-4 h-4 text-rose-600" /></Button>
            </div>
          )},
        ]} />
      )}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit announcement" : "New announcement"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={editing?.title ?? ""} onChange={(e) => setEditing((p) => ({ ...p!, title: e.target.value }))} />
            <Textarea rows={6} placeholder="Body (markdown supported)" value={editing?.body_md ?? ""} onChange={(e) => setEditing((p) => ({ ...p!, body_md: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <Select value={editing?.severity ?? "info"} onValueChange={(v) => setEditing((p) => ({ ...p!, severity: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="info">Info</SelectItem><SelectItem value="success">Success</SelectItem><SelectItem value="warn">Warning</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent>
              </Select>
              <Input placeholder="Audience (all, pro, etc.)" value={editing?.audience ?? "all"} onChange={(e) => setEditing((p) => ({ ...p!, audience: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-600">Starts at</label><Input type="datetime-local" value={editing?.starts_at?.slice(0,16) ?? ""} onChange={(e) => setEditing((p) => ({ ...p!, starts_at: e.target.value || null }))} /></div>
              <div><label className="text-xs text-slate-600">Ends at</label><Input type="datetime-local" value={editing?.ends_at?.slice(0,16) ?? ""} onChange={(e) => setEditing((p) => ({ ...p!, ends_at: e.target.value || null }))} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={editing?.active ?? true} onCheckedChange={(v) => setEditing((p) => ({ ...p!, active: v }))} /><span className="text-sm">Active</span></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} title="Delete announcement?" destructive confirmLabel="Delete" onConfirm={remove} />
    </div>
  );
}
