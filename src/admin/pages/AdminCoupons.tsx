import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Coupon {
  id: string; code: string; description: string | null;
  percent_off: number | null; amount_off: number | null; currency: string | null;
  max_redemptions: number | null; redeemed_count: number; expires_at: string | null; active: boolean;
}

export default function AdminCoupons() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", percent_off: "", amount_off: "", max_redemptions: "", expires_at: "" });

  const load = () => { setLoading(true); invokeAdmin<{ rows: Coupon[] }>("admin-coupons-crud", { op: "list" }).then((r) => { setRows(r.rows); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  async function create() {
    if (!form.code) return toast.error("Code required");
    try {
      await invokeAdmin("admin-coupons-crud", {
        op: "create", code: form.code, description: form.description || null,
        percent_off: form.percent_off ? parseInt(form.percent_off) : null,
        amount_off: form.amount_off ? parseFloat(form.amount_off) : null,
        max_redemptions: form.max_redemptions ? parseInt(form.max_redemptions) : null,
        expires_at: form.expires_at || null,
      });
      toast.success("Coupon created");
      setCreating(false); setForm({ code: "", description: "", percent_off: "", amount_off: "", max_redemptions: "", expires_at: "" });
      load();
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
  }
  async function toggle(c: Coupon) {
    try { await invokeAdmin("admin-coupons-crud", { op: "update", id: c.id, active: !c.active }); load(); } catch (e: any) { toast.error(e.message); }
  }
  async function remove(c: Coupon) {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    try { await invokeAdmin("admin-coupons-crud", { op: "delete", id: c.id }); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Coupons</h1><p className="text-sm text-slate-500">Promotional discount codes.</p></div>
        <Button onClick={() => setCreating(true)} className="gap-2"><Plus className="w-4 h-4" /> New Coupon</Button>
      </div>

      <Card className="bg-white border-slate-200">
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead>Redemptions</TableHead>
                <TableHead>Expires</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id} className="border-slate-200">
                  <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                  <TableCell>{c.percent_off ? `${c.percent_off}% off` : c.amount_off ? `${c.currency} ${c.amount_off} off` : "—"}</TableCell>
                  <TableCell>{c.redeemed_count}{c.max_redemptions ? `/${c.max_redemptions}` : ""}</TableCell>
                  <TableCell className="text-xs text-slate-500">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell><Badge variant={c.active ? "default" : "outline"}>{c.active ? "Active" : "Disabled"}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => toggle(c)}>{c.active ? "Disable" : "Enable"}</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(c)}><Trash2 className="w-3 h-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">No coupons yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="bg-slate-900 border-slate-200 text-slate-100">
          <DialogHeader><DialogTitle>New Coupon</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="CODE (e.g. LAUNCH20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="bg-slate-50 border-slate-200" />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-50 border-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Percent off (1-100)" value={form.percent_off} onChange={(e) => setForm({ ...form, percent_off: e.target.value })} className="bg-slate-50 border-slate-200" />
              <Input type="number" step="0.01" placeholder="Amount off" value={form.amount_off} onChange={(e) => setForm({ ...form, amount_off: e.target.value })} className="bg-slate-50 border-slate-200" />
            </div>
            <Input type="number" placeholder="Max redemptions (optional)" value={form.max_redemptions} onChange={(e) => setForm({ ...form, max_redemptions: e.target.value })} className="bg-slate-50 border-slate-200" />
            <Input type="datetime-local" placeholder="Expires" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="bg-slate-50 border-slate-200" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={create}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
