import { useEffect, useState } from "react";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, DollarSign, Cpu, MessageSquare, UserPlus } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const COLORS = ["#1A6FD8", "#00B4D8", "#10B981", "#FBBF24", "#EF4444", "#8B5CF6", "#64748B"];

interface Overview {
  kpis: {
    totalUsers: number; newToday: number; mrr: number; totalTokens: number;
    ticketsOpen: number; activeToday: number;
  };
  planDistribution: { plan: string; count: number; revenue: number }[];
  growth: { date: string; count: number }[];
  features: { name: string; count: number }[];
  recentSignups: any[];
  recentTickets: any[];
}

function KpiCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card className="p-5 border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    invokeAdmin<Overview>("admin-dashboard-overview").then(setData).catch((e) => setErr(e.message));
  }, []);

  if (err) return <Card className="p-6 border-red-200 bg-red-50 text-red-700">Failed to load dashboard: {err}</Card>;
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  const k = data.kpis;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <KpiCard icon={Users} label="Total Users" value={k.totalUsers.toLocaleString()} accent="bg-[#1A6FD8]" />
        <KpiCard icon={Activity} label="Active Today" value={k.activeToday.toLocaleString()} accent="bg-[#00B4D8]" />
        <KpiCard icon={DollarSign} label="MRR (BDT)" value={`৳${k.mrr.toLocaleString()}`} accent="bg-emerald-500" />
        <KpiCard icon={Cpu} label="Tokens Used" value={k.totalTokens.toLocaleString()} accent="bg-amber-500" />
        <KpiCard icon={MessageSquare} label="Open Tickets" value={k.ticketsOpen} accent="bg-red-500" />
        <KpiCard icon={UserPlus} label="New Today" value={k.newToday} accent="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-5 lg:col-span-3">
          <h3 className="text-base font-semibold mb-4">User Growth — Last 30 Days</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={data.growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1A6FD8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-base font-semibold mb-4">Plan Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.planDistribution} dataKey="count" nameKey="plan" innerRadius={50} outerRadius={80}>
                  {data.planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-base font-semibold mb-4">Top AI Features — Last 30 Days</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={data.features}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#00B4D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-base font-semibold mb-4">Recent Signups</h3>
          <div className="space-y-2">
            {data.recentSignups.length === 0 && <div className="text-sm text-slate-500">No signups yet.</div>}
            {data.recentSignups.map((u: any) => (
              <div key={u.user_id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <div className="text-sm font-medium">{u.full_name || "Unnamed"}</div>
                  <div className="text-xs text-slate-500">{u.country_code}</div>
                </div>
                <div className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-base font-semibold mb-4">Recent Tickets</h3>
          <div className="space-y-2">
            {data.recentTickets.length === 0 && <div className="text-sm text-slate-500">No tickets yet.</div>}
            {data.recentTickets.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <div className="text-sm font-medium">{t.subject || "(No subject)"}</div>
                  <div className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</div>
                </div>
                <Badge variant={t.status === "waiting" ? "destructive" : "secondary"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
