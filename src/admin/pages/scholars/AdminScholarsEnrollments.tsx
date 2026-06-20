import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Header } from "./AdminScholarsCourses";

interface Row {
  id: string; user_id: string; kind: string; source_slug: string | null; title: string;
  progress: number; status: string; created_at: string;
  profiles?: { full_name?: string | null };
  cert?: { certificate_number: string | null } | null;
}

export default function AdminScholarsEnrollments() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [kind, setKind] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    setRows(null);
    let query = supabase.from("user_enrollments")
      .select("id, user_id, kind, source_slug, title, progress, status, created_at, profiles:user_id(full_name)")
      .order("created_at", { ascending: false }).limit(500);
    if (kind !== "all") query = query.eq("kind", kind);
    query.then(async ({ data }) => {
      const enrolls = (data as any[]) || [];
      const userIds = Array.from(new Set(enrolls.map((r: any) => r.user_id as string)));
      const slugs = Array.from(new Set(enrolls.map((r: any) => r.source_slug as string).filter(Boolean)));
      const { data: certs } = await supabase.from("user_certificates")
        .select("user_id, source_slug, certificate_number")
        .in("user_id", userIds.length ? userIds : [""])
        .in("source_slug", slugs.length ? slugs : [""]);
      const certMap = new Map((certs || []).map((c: any) => [`${c.user_id}|${c.source_slug}`, c]));
      setRows(enrolls.map((r: any) => ({ ...r, cert: certMap.get(`${r.user_id}|${r.source_slug}`) || null })));
    });
  }, [kind]);

  const filtered = (rows || []).filter((r) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (r.profiles?.full_name || "").toLowerCase().includes(s)
      || r.title.toLowerCase().includes(s)
      || (r.source_slug || "").toLowerCase().includes(s);
  });

  return (
    <div className="space-y-5">
      <Header title="Enrollments" subtitle="Every Scholars enrollment across courses, workshops, and competitions." icon={Users} />

      <Card className="p-3 bg-card border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="competition">Competitions</SelectItem>
            </SelectContent>
          </Select>
          <Input className="flex-1 min-w-[200px]" placeholder="Search by user, title, or slug…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <Card className="p-0 bg-card border-border overflow-hidden">
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>}
        {rows && filtered.length === 0 && <div className="px-5 py-12 text-sm text-muted-foreground text-center">No enrollments match.</div>}
        {rows && filtered.length > 0 && (
          <div className="divide-y divide-border">
            {filtered.map((r) => (
              <div key={r.id} className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{r.profiles?.full_name || "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.title} · /{r.source_slug}</div>
                </div>
                <Badge variant="outline" className="capitalize">{r.kind}</Badge>
                <div className="text-xs tabular-nums text-muted-foreground whitespace-nowrap w-12 text-right">{r.progress}%</div>
                <Badge variant={r.status === "completed" ? "default" : "outline"}>{r.status}</Badge>
                {r.cert?.certificate_number && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">{r.cert.certificate_number}</span>
                )}
                <div className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
