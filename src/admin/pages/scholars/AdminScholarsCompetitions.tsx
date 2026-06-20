import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, Plus, Trash2, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "../../components/RoleGate";
import { Header, FieldText } from "./AdminScholarsCourses";
import MediaUrlField from "../../components/MediaUrlField";

interface Competition {
  id?: string;
  slug: string; title: string; tagline: string | null;
  cover_url: string | null; banner_url: string | null;
  overview: string | null;
  rules: string[]; prizes: { place: string; reward: string }[];
  tracks: { title: string; desc: string }[]; criteria: { title: string; desc: string }[];
  timeline: { date: string; title: string; desc: string }[]; faqs: { q: string; a: string }[];
  entry_fee_bdt: number; prize_label: string | null; status_label: string | null;
  starts_at: string | null; deadline_at: string | null; max_participants: number | null;
  is_published: boolean; sort_order: number;
}
const empty: Competition = {
  slug: "", title: "", tagline: "", cover_url: "", banner_url: "", overview: "",
  rules: [], prizes: [], tracks: [], criteria: [], timeline: [], faqs: [],
  entry_fee_bdt: 0, prize_label: "", status_label: "Applications open",
  starts_at: null, deadline_at: null, max_participants: null, is_published: false, sort_order: 0,
};

export default function AdminScholarsCompetitions() {
  const [rows, setRows] = useState<Competition[] | null>(null);
  const [editing, setEditing] = useState<Competition | null>(null);
  const [viewRegs, setViewRegs] = useState<Competition | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase.from("competitions").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) { toast.error("Slug and title required"); return; }
    setSaving(true);
    const payload = {
      ...editing,
      rules: editing.rules || [], prizes: editing.prizes || [],
      tracks: editing.tracks || [], criteria: editing.criteria || [],
      timeline: editing.timeline || [], faqs: editing.faqs || [],
      starts_at: editing.starts_at || null, deadline_at: editing.deadline_at || null,
    };
    const { error } = editing.id
      ? await supabase.from("competitions").update(payload).eq("id", editing.id)
      : await supabase.from("competitions").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (c: Competition) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    const { error } = await supabase.from("competitions").delete().eq("id", c.id!);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-5">
      <Header title="Competitions" subtitle="Manage Scholars competitions, prizes, rules, and registrations." icon={Trophy} onNew={() => setEditing({ ...empty })} />
      <Card className="p-0 bg-card border-border overflow-hidden">
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>}
        {rows && rows.length === 0 && <div className="px-5 py-12 text-sm text-muted-foreground text-center">No competitions yet.</div>}
        {rows && rows.length > 0 && (
          <div className="divide-y divide-border">
            {rows.map((c) => (
              <div key={c.id} className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground truncate">/{c.slug} · {c.prize_label}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">{c.entry_fee_bdt ? `৳${Number(c.entry_fee_bdt).toLocaleString()}` : "Free"}</div>
                <Badge variant={c.is_published ? "default" : "outline"}>{c.is_published ? "Published" : "Draft"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => setViewRegs(c)} aria-label="Registrations"><Users className="w-4 h-4" /></Button>
                <RoleGate mode="write">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(c)} aria-label="Edit"><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c)} aria-label="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </RoleGate>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[92dvh] overflow-y-auto bg-background text-foreground">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit competition" : "New competition"}</DialogTitle></DialogHeader>
          {editing && (
            <Tabs defaultValue="details" className="mt-2">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="structure">Tracks/Criteria</TabsTrigger>
                <TabsTrigger value="schedule">Timeline/Prizes</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="faqs">Rules & FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Slug" value={editing.slug} onChange={(v: string) => setEditing({ ...editing, slug: v.toLowerCase().replace(/\s+/g, "-") })} />
                  <FieldText label="Title" value={editing.title} onChange={(v: string) => setEditing({ ...editing, title: v })} />
                </div>
                <FieldText label="Tagline" value={editing.tagline || ""} onChange={(v: string) => setEditing({ ...editing, tagline: v })} />
                <div>
                  <Label>Overview</Label>
                  <Textarea rows={4} value={editing.overview || ""} onChange={(e) => setEditing({ ...editing, overview: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Prize label" value={editing.prize_label || ""} onChange={(v: string) => setEditing({ ...editing, prize_label: v })} placeholder="$15,000 prize pool" />
                  <FieldText label="Status label" value={editing.status_label || ""} onChange={(v: string) => setEditing({ ...editing, status_label: v })} placeholder="Applications open" />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <FieldText label="Entry fee (BDT)" type="number" value={String(editing.entry_fee_bdt)} onChange={(v: string) => setEditing({ ...editing, entry_fee_bdt: parseFloat(v) || 0 })} />
                  <FieldText label="Max participants" type="number" value={editing.max_participants?.toString() || ""} onChange={(v: string) => setEditing({ ...editing, max_participants: v ? parseInt(v, 10) : null })} />
                  <FieldText label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v: string) => setEditing({ ...editing, sort_order: parseInt(v, 10) || 0 })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Starts at</Label><Input type="datetime-local" value={editing.starts_at?.slice(0, 16) ?? ""} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value || null })} /></div>
                  <div><Label>Deadline</Label><Input type="datetime-local" value={editing.deadline_at?.slice(0, 16) ?? ""} onChange={(e) => setEditing({ ...editing, deadline_at: e.target.value || null })} /></div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                  <span className="text-sm">Published</span>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="space-y-3 pt-4">
                <ObjListEditor label="Tracks" items={editing.tracks} onChange={(v) => setEditing({ ...editing, tracks: v })} fields={["title", "desc"]} placeholders={["Track title", "Description"]} />
                <ObjListEditor label="Judging criteria" items={editing.criteria} onChange={(v) => setEditing({ ...editing, criteria: v })} fields={["title", "desc"]} placeholders={["Criterion", "Description"]} />
              </TabsContent>

              <TabsContent value="schedule" className="space-y-3 pt-4">
                <ObjListEditor label="Timeline" items={editing.timeline} onChange={(v) => setEditing({ ...editing, timeline: v })} fields={["date", "title", "desc"]} placeholders={["Week 1", "Milestone", "Description"]} />
                <ObjListEditor label="Prizes" items={editing.prizes} onChange={(v) => setEditing({ ...editing, prizes: v })} fields={["place", "reward"]} placeholders={["Grand prize", "$8,000 + credits"]} />
              </TabsContent>

              <TabsContent value="media" className="space-y-3 pt-4">
                <MediaUrlField label="Cover image URL" kind="image" uploadFolder="competitions/covers" value={editing.cover_url || ""} onChange={(v: string) => setEditing({ ...editing, cover_url: v })} />
                <MediaUrlField label="Banner image URL" kind="image" uploadFolder="competitions/banners" value={editing.banner_url || ""} onChange={(v: string) => setEditing({ ...editing, banner_url: v })} />
              </TabsContent>

              <TabsContent value="faqs" className="space-y-3 pt-4">
                <StrListEditor label="Rules" values={editing.rules} onChange={(v) => setEditing({ ...editing, rules: v })} />
                <ObjListEditor label="FAQs" items={editing.faqs} onChange={(v) => setEditing({ ...editing, faqs: v })} fields={["q", "a"]} placeholders={["Question", "Answer"]} textareaIdx={1} />
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RegistrationsDialog comp={viewRegs} onClose={() => setViewRegs(null)} />
    </div>
  );
}

function ObjListEditor({ label, items, onChange, fields, placeholders, textareaIdx }: { label: string; items: any[]; onChange: (v: any[]) => void; fields: string[]; placeholders: string[]; textareaIdx?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <Card key={i} className="p-3 bg-muted/30 space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                {fields.map((f, fi) => (
                  fi === textareaIdx
                    ? <Textarea key={f} rows={2} placeholder={placeholders[fi]} value={it[f] || ""} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], [f]: e.target.value }; onChange(n); }} />
                    : <Input key={f} placeholder={placeholders[fi]} value={it[f] || ""} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], [f]: e.target.value }; onChange(n); }} />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={() => { const n = [...items]; n.splice(i, 1); onChange(n); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...items, fields.reduce((a, f) => ({ ...a, [f]: "" }), {})])}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
      </div>
    </div>
  );
}

function StrListEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input value={v} onChange={(e) => { const n = [...values]; n[i] = e.target.value; onChange(n); }} />
            <Button variant="ghost" size="icon" onClick={() => { const n = [...values]; n.splice(i, 1); onChange(n); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...values, ""])}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
      </div>
    </div>
  );
}

function RegistrationsDialog({ comp, onClose }: { comp: Competition | null; onClose: () => void }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    if (!comp?.id) return;
    setRows(null);
    supabase.from("competition_registrations")
      .select("id, team_name, amount_paid, status, created_at, user_id, profiles:user_id(full_name)")
      .eq("competition_id", comp.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows(data || []));
  }, [comp?.id]);

  const exportCsv = () => {
    if (!rows) return;
    const csv = ["name,team,amount,status,date", ...rows.map((r) => `"${(r as any).profiles?.full_name || ""}","${r.team_name || ""}",${r.amount_paid},${r.status},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${comp?.slug}-registrations.csv`; a.click();
  };

  return (
    <Dialog open={!!comp} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85dvh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
            <span>Registrations · {comp?.title}</span>
            {rows && rows.length > 0 && <Button size="sm" variant="outline" onClick={exportCsv}>Export CSV</Button>}
          </DialogTitle>
        </DialogHeader>
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>}
        {rows && rows.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No registrations yet.</div>}
        {rows && rows.length > 0 && (
          <div className="space-y-1">
            {rows.map((r: any) => (
              <div key={r.id} className="flex flex-wrap items-center gap-2 px-2 py-2 border border-border rounded">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.profiles?.full_name || "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.team_name || "—"} · {new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground">৳{Number(r.amount_paid).toLocaleString()}</div>
                <Badge variant={r.status === "confirmed" ? "default" : "outline"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
