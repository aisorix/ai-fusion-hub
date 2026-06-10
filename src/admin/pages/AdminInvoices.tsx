import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface Inv { id: string; user_id: string; amount: number; currency: string; status: string; payment_method: string; created_at: string; }

export default function AdminInvoices() {
  const [rows, setRows] = useState<Inv[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    invokeAdmin<{ rows: Inv[]; total: number }>(`admin-invoices-list?page=${page}`).then((r) => { setRows(r.rows); setTotal(r.total); setLoading(false); }).catch(() => setLoading(false));
  }, [page]);

  async function exportCsv() {
    const { data: { session } } = await supabase.auth.getSession();
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-invoices-list?export=csv`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "invoices.csv"; a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-slate-400">All payment history records.</p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
      </div>

      <Card className="bg-slate-900/60 border-slate-800">
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Method</TableHead>
                  <TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className="border-slate-800">
                    <TableCell className="text-xs text-slate-400">{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">{r.user_id?.slice(0, 8)}</TableCell>
                    <TableCell className="capitalize">{r.payment_method ?? "—"}</TableCell>
                    <TableCell><Badge variant={r.status === "completed" || r.status === "paid" ? "default" : r.status === "refunded" ? "destructive" : "outline"}>{r.status}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">{r.currency ?? "USD"} {Number(r.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">No invoices.</TableCell></TableRow>}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between p-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">Page {page} • {total} total</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <Button size="sm" variant="outline" disabled={page * 50 >= total} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
