import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Sub {
  id: string; user_id: string; plan_id: string; status: string; amount: number;
  currency: string; billing_cycle: string; current_period_end: string | null; full_name: string | null;
}

const PLANS = ["free", "basic", "pro", "premium", "premium_plus", "max", "enterprise"];

export default function AdminSubscriptions() {
  const [rows, setRows] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<Sub | null>(null);
  const [newPlan, setNewPlan] = useState("");

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statusFilter) params.set("status", statusFilter);
    invokeAdmin<{ rows: Sub[] }>(`admin-subscriptions-list?${params}`).then((r) => { setRows(r.rows); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, [statusFilter]);

  async function saveChange() {
    if (!editing || !newPlan) return;
    try {
      await invokeAdmin("admin-subscription-update", { id: editing.id, action: "change_plan", plan_id: newPlan });
      toast.success("Plan updated");
      setEditing(null); setNewPlan("");
      load();
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
  }
  async function cancelSub(s: Sub) {
    if (!confirm(`Cancel subscription for ${s.full_name ?? s.user_id}?`)) return;
    try {
      await invokeAdmin("admin-subscription-update", { id: s.id, action: "cancel" });
      toast.success("Subscription cancelled");
      load();
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-sm text-slate-400">Change plans, cancel, and inspect active billing.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex gap-2">
          <Input placeholder="Search by name or user id" value={q} onChange={(e) => setQ(e.target.value)} className="bg-slate-900 border-slate-800 w-72" />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="past_due">Past due</option>
          <option value="trialing">Trialing</option>
        </select>
      </div>

      <Card className="bg-slate-900/60 border-slate-800">
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead>User</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead>
                <TableHead>Cycle</TableHead><TableHead className="text-right">Amount</TableHead>
                <TableHead>Renews</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id} className="border-slate-800">
                  <TableCell><Link to={`/admin/users/${s.user_id}`} className="text-indigo-400 hover:underline">{s.full_name ?? s.user_id.slice(0, 8)}</Link></TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{s.plan_id}</Badge></TableCell>
                  <TableCell><Badge variant={s.status === "active" ? "default" : "outline"} className="capitalize">{s.status}</Badge></TableCell>
                  <TableCell className="capitalize text-slate-300">{s.billing_cycle}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.currency} {Number(s.amount).toFixed(2)}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(s); setNewPlan(s.plan_id); }}>Change</Button>
                    {s.status === "active" && <Button size="sm" variant="destructive" onClick={() => cancelSub(s)}>Cancel</Button>}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-8">No subscriptions match.</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader><DialogTitle>Change Plan</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-slate-400">User: {editing?.full_name ?? editing?.user_id}</p>
            <select value={newPlan} onChange={(e) => setNewPlan(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full">
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
