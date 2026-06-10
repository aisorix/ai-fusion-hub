import { useEffect, useState } from "react";
import { invokeAdmin } from "../lib/adminApi";
import KpiCard from "../components/KpiCard";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { DollarSign, TrendingUp, Users, Repeat, Loader2 } from "lucide-react";

interface Data {
  kpis: { mrr: number; arr: number; arpu: number; active_subscriptions: number; total_paid: number; refunded: number; churn_rate: number };
  mrrTrend: Array<{ month: string; value: number }>;
  planDistribution: Array<{ plan: string; count: number }>;
  paymentMethods: Array<{ method: string; count: number }>;
}

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminRevenue() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { invokeAdmin<Data>("admin-revenue-overview").then((r) => { setData(r); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!data) return <div className="text-slate-500">No data.</div>;

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Revenue Dashboard</h1>
        <p className="text-sm text-slate-500">Real-time MRR, ARR, churn and plan distribution.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="MRR" value={fmt(data.kpis.mrr)} icon={<DollarSign className="w-5 h-5" />} tone="positive" />
        <KpiCard label="ARR" value={fmt(data.kpis.arr)} icon={<TrendingUp className="w-5 h-5" />} />
        <KpiCard label="ARPU" value={`$${data.kpis.arpu}`} icon={<Users className="w-5 h-5" />} />
        <KpiCard label="Active Subs" value={data.kpis.active_subscriptions.toLocaleString()} icon={<Repeat className="w-5 h-5" />} />
        <KpiCard label="Lifetime Paid" value={fmt(data.kpis.total_paid)} />
        <KpiCard label="Refunded" value={fmt(data.kpis.refunded)} tone={data.kpis.refunded > 0 ? "warning" : "default"} />
        <KpiCard label="Churn Rate" value={`${data.kpis.churn_rate}%`} tone={data.kpis.churn_rate > 10 ? "danger" : "default"} />
      </div>

      <Card className="p-5 bg-white border-slate-200">
        <h3 className="font-semibold mb-4">MRR trend (12 months)</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data.mrrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="font-semibold mb-4">Plan distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.planDistribution} dataKey="count" nameKey="plan" outerRadius={90}>
                  {data.planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="font-semibold mb-4">Payment methods</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.paymentMethods}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="method" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
