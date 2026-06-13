import { useEffect, useState } from "react";
import { invokeAdmin } from "../lib/adminApi";
import { useAdminRange } from "../context/AdminRangeContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, DollarSign, Cpu, MessageSquare, UserPlus, Globe, Eye, Smartphone, FileText as FileTextIcon } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend, Area, AreaChart,
} from "recharts";
import WorldUsersMap from "../components/WorldUsersMap";

const COLORS = ["hsl(189 95% 43%)", "hsl(213 87% 50%)", "hsl(161 73% 44%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(258 90% 66%)", "hsl(215 16% 47%)"];

interface Overview {
  kpis: { totalUsers: number; newToday: number; mrr: number; totalTokens: number; ticketsOpen: number; activeToday: number };
  planDistribution: { plan: string; count: number; revenue: number }[];
  growth: { date: string; count: number }[];
  features: { name: string; count: number }[];
  recentSignups: any[];
  recentTickets: any[];
  usersByCountry?: Record<string, number>;
}

interface Traffic {
  kpis: { visitors: number; pageViews: number; viewsPerVisit: number; visitDuration: string; bounceRate: number };
  trend: { date: string; views: number }[];
  bySource: { name: string; count: number }[];
  byPage: { name: string; count: number }[];
  byDevice: { name: string; count: number }[];
  byCountry: { code: string; name: string; count: number }[];
}

function KpiCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold text-foreground mt-2">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-4 py-3 border-r border-border last:border-r-0 flex-1 min-w-[120px]">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold text-foreground mt-0.5">{value}</div>
    </div>
  );
}

function BreakdownTable({ title, rows, valueLabel = "Visitors" }: { title: string; rows: { name: string; count: number }[]; valueLabel?: string }) {
  const max = Math.max(1, ...rows.map(r => r.count));
  return (
    <Card className="p-0 bg-card border-border overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
        <span>{title}</span>
        <span>{valueLabel}</span>
      </div>
      <div className="divide-y divide-border">
        {rows.length === 0 && <div className="px-4 py-6 text-xs text-muted-foreground text-center">No data yet</div>}
        {rows.slice(0, 10).map((r) => (
          <div key={r.name} className="px-4 py-2 flex items-center gap-3 text-sm">
            <div className="flex-1 min-w-0 relative">
              <div className="absolute inset-y-0 left-0 rounded bg-primary/10" style={{ width: `${(r.count / max) * 100}%` }} />
              <div className="relative truncate">{r.name}</div>
            </div>
            <div className="tabular-nums text-muted-foreground">{r.count.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { range } = useAdminRange();
  const [data, setData] = useState<Overview | null>(null);
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setData(null); setTraffic(null); setErr(null);
    invokeAdmin<Overview>("admin-dashboard-overview", { from: range.from, to: range.to }).then(setData).catch((e) => setErr(e.message));
    invokeAdmin<Traffic>("admin-traffic-overview", { from: range.from, to: range.to }).then(setTraffic).catch(() => {});
  }, [range.from, range.to]);

  if (err) return <Card className="p-6 border-destructive/50 bg-destructive/10 text-destructive">Failed to load dashboard: {err}</Card>;
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  const k = data.kpis;
  const countryMap: Record<string, number> = {};
  (traffic?.byCountry ?? []).forEach((c) => { countryMap[c.code] = c.count; });

  return (
    <div className="space-y-6">
      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <KpiCard icon={Users} label="Total Users" value={k.totalUsers.toLocaleString()} accent="bg-blue-600" />
        <KpiCard icon={Activity} label="Active Today" value={k.activeToday.toLocaleString()} accent="bg-cyan-500" />
        <KpiCard icon={DollarSign} label="MRR (BDT)" value={`৳${k.mrr.toLocaleString()}`} accent="bg-emerald-500" />
        <KpiCard icon={Cpu} label="Tokens Used" value={k.totalTokens.toLocaleString()} accent="bg-amber-500" />
        <KpiCard icon={MessageSquare} label="Open Tickets" value={k.ticketsOpen} accent="bg-red-500" />
        <KpiCard icon={UserPlus} label="New Today" value={k.newToday} accent="bg-violet-500" />
      </div>

      {/* Web traffic (live) */}
      <Card className="p-0 bg-card border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Web traffic</h3>
          <Badge variant="outline" className="text-[10px]">LIVE</Badge>
        </div>
        <div className="flex flex-wrap border-b border-border">
          <MiniStat label="Visitors" value={traffic?.kpis.visitors.toLocaleString() ?? "—"} />
          <MiniStat label="Page views" value={traffic?.kpis.pageViews.toLocaleString() ?? "—"} />
          <MiniStat label="Views per visit" value={traffic?.kpis.viewsPerVisit.toFixed(2) ?? "—"} />
          <MiniStat label="Visit duration" value={traffic?.kpis.visitDuration ?? "—"} />
          <MiniStat label="Bounce rate" value={traffic?.kpis.bounceRate != null ? `${traffic.kpis.bounceRate.toFixed(0)}%` : "—"} />
        </div>
        <div className="h-56 p-3">
          <ResponsiveContainer>
            <AreaChart data={traffic?.trend ?? []}>
              <defs>
                <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(213 87% 50%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(213 87% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke="hsl(213 87% 50%)" strokeWidth={2} fill="url(#trafficFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Breakdown */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Traffic breakdown</div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <BreakdownTable title="Source"  rows={traffic?.bySource ?? []} />
          <BreakdownTable title="Page"    rows={traffic?.byPage ?? []} />
          <BreakdownTable title="Device"  rows={traffic?.byDevice ?? []} />
          <BreakdownTable title="Country" rows={(traffic?.byCountry ?? []).map(c => ({ name: c.name || c.code, count: c.count }))} />
        </div>
      </div>

      {/* World map */}
      <WorldUsersMap byCountry={countryMap} />

      {/* User growth + plan distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-5 lg:col-span-3 bg-card border-border">
          <h3 className="text-base font-semibold mb-4 text-foreground">User Growth</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={data.growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                <Line type="monotone" dataKey="count" stroke="hsl(213 87% 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2 bg-card border-border">
          <h3 className="text-base font-semibold mb-4 text-foreground">Plan Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.planDistribution} dataKey="count" nameKey="plan" innerRadius={50} outerRadius={80}>
                  {data.planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-card border-border">
        <h3 className="text-base font-semibold mb-4 text-foreground">Top AI Features</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={data.features}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
              <Bar dataKey="count" fill="hsl(189 95% 43%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-border">
          <h3 className="text-base font-semibold mb-4">Recent Signups</h3>
          <div className="space-y-2">
            {data.recentSignups.length === 0 && <div className="text-sm text-muted-foreground">No signups yet.</div>}
            {data.recentSignups.map((u: any) => (
              <div key={u.user_id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{u.full_name || "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground">{u.country_code}</div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 bg-card border-border">
          <h3 className="text-base font-semibold mb-4">Recent Tickets</h3>
          <div className="space-y-2">
            {data.recentTickets.length === 0 && <div className="text-sm text-muted-foreground">No tickets yet.</div>}
            {data.recentTickets.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{t.subject || "(No subject)"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
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
