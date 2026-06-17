import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, Plus, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "../components/RoleGate";

interface Workshop {
  id?: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  mentor_name: string | null;
  mentor_role: string | null;
  mentor_bio: string | null;
  mentor_avatar_url: string | null;
  duration_hours: number | null;
  price_bdt: number | null;
  starts_at: string | null;
  is_published: boolean;
}

const empty: Workshop = {
  slug: "", title: "", summary: "", description: "", cover_url: "",
  mentor_name: "Rakib Eslam", mentor_role: "Founder & CEO, AI Sorix Limited · Software Engineer",
  mentor_bio: "", mentor_avatar_url: "",
  duration_hours: 2, price_bdt: 0, starts_at: null, is_published: false,
};

export default function AdminWorkshops() {
  const [rows, setRows] = useState<Workshop[] | null>(null);
  const [editing, setEditing] = useState<Workshop | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("workshops")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) { toast.error("Slug and title required"); return; }
    setSaving(true);
    const payload = { ...editing, starts_at: editing.starts_at || null };
    const { error } = editing.id
      ? await supabase.from("workshops").update(payload).eq("id", editing.id)
      : await supabase.from("workshops").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (w: Workshop) => {
    if (!confirm(`Delete workshop "${w.title}"?`)) return;
    const { error } = await supabase.from("workshops").delete().eq("id", w.id!);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Workshops</h2>
            <p className="text-sm text-muted-foreground">Manage Sorix Scholars workshops.</p>
          </div>
        </div>
        <RoleGate mode="write">
          <Button onClick={() => setEditing({ ...empty })} className="gap-2">
            <Plus className="w-4 h-4" /> New workshop
          </Button>
        </RoleGate>
      </div>

      <Card className="p-0 bg-card border-border overflow-hidden">
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>}
        {rows && rows.length === 0 && (
          <div className="px-5 py-12 text-sm text-muted-foreground text-center">No workshops yet. Click <strong>New workshop</strong> to create one.</div>
        )}
        {rows && rows.length > 0 && (
          <div className="divide-y divide-border">
            {rows.map((w) => (
              <div key={w.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{w.title}</div>
                  <div className="text-xs text-muted-foreground truncate">/{w.slug} · {w.mentor_name ?? "—"}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground">
                  {w.price_bdt ? `৳${Number(w.price_bdt).toLocaleString()}` : "Free"}
                </div>
                <Badge variant={w.is_published ? "default" : "outline"}>
                  {w.is_published ? "Published" : "Draft"}
                </Badge>
                <RoleGate mode="write">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(w)} aria-label="Edit">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(w)} aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </RoleGate>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit workshop" : "New workshop"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="prompt-engineering-live" />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Summary (1 line)</Label>
                <Input value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={5} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <Label>Cover image URL</Label>
                <Input value={editing.cover_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <Label>Duration (hours)</Label>
                  <Input type="number" step="0.5" value={editing.duration_hours ?? ""} onChange={(e) => setEditing({ ...editing, duration_hours: e.target.value ? parseFloat(e.target.value) : null })} />
                </div>
                <div>
                  <Label>Price (BDT)</Label>
                  <Input type="number" value={editing.price_bdt ?? 0} onChange={(e) => setEditing({ ...editing, price_bdt: e.target.value ? parseFloat(e.target.value) : 0 })} />
                </div>
                <div>
                  <Label>Starts at</Label>
                  <Input type="datetime-local" value={editing.starts_at?.slice(0, 16) ?? ""} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value || null })} />
                </div>
              </div>
              <div className="border-t border-border pt-3 mt-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mentor</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input placeholder="Mentor name" value={editing.mentor_name ?? ""} onChange={(e) => setEditing({ ...editing, mentor_name: e.target.value })} />
                  <Input placeholder="Mentor role" value={editing.mentor_role ?? ""} onChange={(e) => setEditing({ ...editing, mentor_role: e.target.value })} />
                </div>
                <Textarea className="mt-3" rows={3} placeholder="Mentor bio" value={editing.mentor_bio ?? ""} onChange={(e) => setEditing({ ...editing, mentor_bio: e.target.value })} />
                <Input className="mt-3" placeholder="Mentor avatar URL (optional)" value={editing.mentor_avatar_url ?? ""} onChange={(e) => setEditing({ ...editing, mentor_avatar_url: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                <span className="text-sm">Published (visible to public)</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
