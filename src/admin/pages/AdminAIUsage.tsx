import { useEffect, useState } from "react";
import { invokeAdmin } from "../lib/adminApi";
import KpiCard from "../components/KpiCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Activity, AlertTriangle, Users, Zap } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Overview {
  totals: { calls: number; tokens: number; errors: number; unique_users: number };
  features: Array<{ feature: string; calls: number; errors: number; error_rate: number; tokens: number; users: number; avg_tokens: number }>;
  series: Array<{ day: string; calls: number; tokens: number; errors: number }>;
  models: Array<{ model: string; calls: number; tokens: number }>;
}

export default function AdminAIUsage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    invokeAdmin<Overview>(`admin-ai-overview?days=${days}`).then((r) => { setData(r); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!data) return <div className="text-slate-500">No data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Feature Usage</h1>
          <p className="text-sm text-slate-500">Across Chat, Imagine, Cineshoot, Deck, Agent, Health, Agro and more.</p>
        </div>
        <select value={days} onChange={(e) => setDays(parseInt(e.target.value, 10))} className="bg-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Total Calls" value={data.totals.calls.toLocaleString()} icon={<Activity className="w-5 h-5" />} />
        <KpiCard label="Tokens" value={data.totals.tokens.toLocaleString()} icon={<Zap className="w-5 h-5" />} />
        <KpiCard label="Errors" value={data.totals.errors.toLocaleString()} tone={data.totals.errors > 0 ? "warning" : "default"} icon={<AlertTriangle className="w-5 h-5" />} />
        <KpiCard label="Unique Users" value={data.totals.unique_users.toLocaleString()} icon={<Users className="w-5 h-5" />} />
      </div>

      <Card className="p-5 bg-white border-slate-200">
        <h3 className="font-semibold mb-4">Daily Activity</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
              <Legend />
              <Bar dataKey="calls" fill="#6366f1" name="Calls" />
              <Bar dataKey="errors" fill="#ef4444" name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5 bg-white border-slate-200">
        <h3 className="font-semibold mb-4">Per-feature breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead>Feature</TableHead><TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Tokens</TableHead><TableHead className="text-right">Avg Tokens</TableHead>
              <TableHead className="text-right">Users</TableHead><TableHead className="text-right">Error %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.features.sort((a, b) => b.calls - a.calls).map((f) => (
              <TableRow key={f.feature} className="border-slate-200">
                <TableCell className="font-medium">{f.feature}</TableCell>
                <TableCell className="text-right tabular-nums">{f.calls.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{f.tokens.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{f.avg_tokens.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{f.users}</TableCell>
                <TableCell className={`text-right tabular-nums ${f.error_rate > 5 ? "text-rose-400" : "text-slate-300"}`}>{f.error_rate}%</TableCell>
              </TableRow>
            ))}
            {data.features.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">No events yet — usage will appear as users interact with AI tools.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
