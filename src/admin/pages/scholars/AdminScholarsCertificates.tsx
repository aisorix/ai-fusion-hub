import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";
import { Header } from "./AdminScholarsCourses";

export default function AdminScholarsCertificates() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("user_certificates")
      .select("id, certificate_number, recipient_name, title, kind, issued_at, source_slug")
      .order("issued_at", { ascending: false })
      .limit(500)
      .then(({ data }) => setRows(data || []));
  }, []);

  const filtered = useMemo(() => (rows || []).filter((r) =>
    !q || [r.certificate_number, r.recipient_name, r.title, r.source_slug]
      .some((v: any) => (v || "").toLowerCase().includes(q.toLowerCase()))), [rows, q]);

  return (
    <div className="space-y-5">
      <Header title="Certificates" subtitle="All issued Sorix Scholars certificates." icon={Award} />
      <Card className="p-3 bg-card border-border">
        <Input placeholder="Search by SS-number, name, or title…" value={q} onChange={(e) => setQ(e.target.value)} />
      </Card>
      <Card className="p-0 bg-card border-border overflow-hidden">
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>}
        {rows && filtered.length === 0 && <div className="px-5 py-12 text-sm text-muted-foreground text-center">No certificates.</div>}
        {rows && filtered.length > 0 && (
          <div className="divide-y divide-border">
            {filtered.map((c: any) => (
              <a key={c.id} href={`/sorixscholars/verify/${c.certificate_number}`} target="_blank" rel="noreferrer" className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3 hover:bg-muted/40">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{c.recipient_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">{c.certificate_number}</span>
                <Badge variant="outline" className="capitalize">{c.kind}</Badge>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(c.issued_at).toLocaleDateString()}</div>
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
