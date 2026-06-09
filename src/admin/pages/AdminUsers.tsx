import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download } from "lucide-react";

interface UserRow {
  userId: string; fullName: string; email: string; plan: string; status: string;
  tokensUsed: number; amount: number; joined: string; country?: string;
}

const PLANS = ["", "free", "basic", "pro", "premium", "premium_plus", "max", "enterprise"];

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const limit = 25;

  const load = () => {
    setLoading(true);
    invokeAdmin<{ users: UserRow[]; total: number }>("admin-users-list", { page, limit, search, plan })
      .then((d) => { setUsers(d.users); setTotal(d.total); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, plan]);

  const exportCsv = () => {
    const header = ["Name", "Email", "Plan", "Status", "Tokens Used", "Amount", "Joined"];
    const rows = users.map((u) => [u.fullName, u.email, u.plan, u.status, u.tokensUsed, u.amount, u.joined]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `aisorix-users-page${page}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          />
        </div>
        <Select value={plan} onValueChange={(v) => { setPlan(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All plans" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {PLANS.filter(Boolean).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => { setPage(1); load(); }}>Apply</Button>
        <div className="flex-1" />
        <div className="text-xs text-slate-500">Total: <span className="font-semibold text-slate-900">{total}</span></div>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8" /></TableCell></TableRow>
            ))}
            {!loading && users.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-10">No users found.</TableCell></TableRow>
            )}
            {!loading && users.map((u) => (
              <TableRow key={u.userId}>
                <TableCell className="font-medium">{u.fullName || "—"}</TableCell>
                <TableCell className="text-xs">{u.email}</TableCell>
                <TableCell><Badge variant="outline">{u.plan}</Badge></TableCell>
                <TableCell><Badge variant={u.status === "active" ? "secondary" : "destructive"}>{u.status}</Badge></TableCell>
                <TableCell className="text-right text-xs tabular-nums">{u.tokensUsed.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-slate-500">{new Date(u.joined).toLocaleDateString()}</TableCell>
                <TableCell><Link to={`/admin/users/${u.userId}`} className="text-[#1A6FD8] text-xs font-medium hover:underline">View →</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-500">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
