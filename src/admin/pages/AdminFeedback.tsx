import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import KpiCard from "@/admin/components/KpiCard";
import ChartCard from "@/admin/components/ChartCard";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Smile, Meh, Frown, MessageSquare } from "lucide-react";

export default function AdminFeedback() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { invokeAdmin("admin-feedback-list").then(setData).catch(() => {}); }, []);
  if (!data) return <div className="text-sm text-slate-500">Loading…</div>;
  const npsTone = data.summary.nps >= 30 ? "positive" : data.summary.nps >= 0 ? "default" : "danger";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="NPS Score" value={data.summary.nps} tone={npsTone as any} icon={<Smile className="w-5 h-5" />} hint={`${data.summary.total} responses`} />
        <KpiCard label="Promoters" value={data.summary.promoters} tone="positive" icon={<Smile className="w-5 h-5" />} />
        <KpiCard label="Passives" value={data.summary.passives} icon={<Meh className="w-5 h-5" />} />
        <KpiCard label="Detractors" value={data.summary.detractors} tone="danger" icon={<Frown className="w-5 h-5" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Rating distribution">
          <div className="h-64">
            <ResponsiveContainer><BarChart data={data.ratingDist}><CartesianGrid stroke="#f1f5f9" /><XAxis dataKey="rating" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#1A6FD8" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="By feature">
          <div className="h-64">
            <ResponsiveContainer><BarChart data={data.byFeature} layout="vertical"><CartesianGrid stroke="#f1f5f9" /><XAxis type="number" /><YAxis dataKey="feature" type="category" width={100} /><Tooltip /><Bar dataKey="count" fill="#00B4D8" radius={[0,6,6,0]} /></BarChart></ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Recent comments" subtitle={`${data.recent.length} latest`}>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.recent.filter((r: any) => r.comment).map((r: any) => (
            <Card key={r.id} className="p-3 bg-slate-50 border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><MessageSquare className="w-3 h-3" /> {r.feature} · {r.rating ? `${r.rating}★` : ""} {r.nps != null ? `NPS ${r.nps}` : ""} · {new Date(r.created_at).toLocaleDateString()}</div>
              <p className="text-sm text-slate-700">{r.comment}</p>
            </Card>
          ))}
          {!data.recent.some((r: any) => r.comment) && <p className="text-sm text-slate-500">No comments yet.</p>}
        </div>
      </ChartCard>
    </div>
  );
}
