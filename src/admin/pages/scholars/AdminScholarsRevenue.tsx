import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, BookOpen, GraduationCap, Trophy, Award } from "lucide-react";
import { Header } from "./AdminScholarsCourses";

export default function AdminScholarsRevenue() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    supabase.rpc("admin_scholars_overview", {
      _from: new Date(Date.now() - 30 * 86400000).toISOString(),
      _to: new Date().toISOString(),
    }).then(({ data, error }) => {
      if (!error) setData(data);
    });
  }, []);

  if (!data) {
    return (
      <div className="space-y-5">
        <Header title="Scholars revenue" subtitle="30-day overview of courses, workshops, and competitions." icon={DollarSign} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const total = Number(data.courses?.revenue || 0) + Number(data.workshops?.revenue || 0) + Number(data.competitions?.revenue || 0);

  return (
    <div className="space-y-5">
      <Header title="Scholars revenue" subtitle="Last 30 days · courses, workshops, competitions." icon={DollarSign} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={DollarSign} label="Total revenue" value={`৳${total.toLocaleString()}`} accent="from-cyan-500 to-teal-500" />
        <Kpi icon={BookOpen} label="Course revenue" value={`৳${Number(data.courses?.revenue || 0).toLocaleString()}`} sub={`${data.courses?.purchases || 0} purchases · ${data.courses?.published || 0} published`} accent="from-blue-500 to-indigo-500" />
        <Kpi icon={GraduationCap} label="Workshop revenue" value={`৳${Number(data.workshops?.revenue || 0).toLocaleString()}`} sub={`${data.workshops?.bookings || 0} bookings · ${data.workshops?.published || 0} published`} accent="from-purple-500 to-pink-500" />
        <Kpi icon={Trophy} label="Competition revenue" value={`৳${Number(data.competitions?.revenue || 0).toLocaleString()}`} sub={`${data.competitions?.registrations || 0} regs · ${data.competitions?.published || 0} published`} accent="from-amber-500 to-orange-500" />
      </div>

      <Card className="p-4 bg-card border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Certificates issued (last 30 days)</div>
          <div className="text-2xl font-bold text-foreground">{data.certificates_issued || 0}</div>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, accent }: any) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center text-white mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl sm:text-2xl font-bold text-foreground truncate">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1 truncate">{sub}</div>}
    </Card>
  );
}
