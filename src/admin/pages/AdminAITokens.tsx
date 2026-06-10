import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { Loader2 } from "lucide-react";

interface Data {
  series: Array<{ day: string; tokens: number }>;
  models: Array<{ model: string; tokens: number }>;
  topUsers: Array<{ user_id: string; tokens: number; full_name: string | null }>;
}

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#84cc16"];

export default function AdminAITokens() {
  const [data, setData] = useState<Data | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    invokeAdmin<Data>(`admin-ai-tokens?days=${days}`).then((r) => { setData(r); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!data) return <div className="text-slate-500">No data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Token Usage</h1>
          <p className="text-sm text-slate-500">Aggregate consumption across all AI features and models.</p>
        </div>
        <select value={days} onChange={(e) => setDays(parseInt(e.target.value, 10))} className="bg-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
        </select>
      </div>

      <Card className="p-5 bg-white border-slate-200">
        <h3 className="font-semibold mb-4">Daily token consumption</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
              <Line type="monotone" dataKey="tokens" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="font-semibold mb-4">By model</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.models} dataKey="tokens" nameKey="model" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {data.models.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 bg-white border-slate-200">
          <h3 className="font-semibold mb-4">Top users</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead>User</TableHead><TableHead className="text-right">Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topUsers.map((u) => (
                <TableRow key={u.user_id} className="border-slate-200">
                  <TableCell>
                    <Link to={`/admin/users/${u.user_id}`} className="text-indigo-400 hover:underline">{u.full_name ?? u.user_id.slice(0, 8)}</Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{u.tokens.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {data.topUsers.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-slate-500 py-6">No data yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
