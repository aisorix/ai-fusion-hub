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
import { Edit3, Plus, Trash2, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "../../components/RoleGate";
import { Header, FieldText } from "./AdminScholarsCourses";
import MediaUrlField from "../../components/MediaUrlField";

interface Workshop {
  id?: string; slug: string; title: string; summary: string | null; description: string | null;
  cover_url: string | null; banner_url: string | null;
  mentor_name: string | null; mentor_role: string | null; mentor_bio: string | null; mentor_avatar_url: string | null;
  duration_hours: number | null; price_bdt: number; starts_at: string | null;
  seats_total: number | null; seats_booked: number; location: string | null; join_url: string | null;
  is_published: boolean;
}
const empty: Workshop = {
  slug: "", title: "", summary: "", description: "", cover_url: "", banner_url: "",
  mentor_name: "Rakib Eslam", mentor_role: "Founder & CEO, AI Sorix Limited", mentor_bio: "", mentor_avatar_url: "",
  duration_hours: 2, price_bdt: 0, starts_at: null,
  seats_total: null, seats_booked: 0, location: "Google Meet", join_url: "",
  is_published: false,
};

export default function AdminScholarsWorkshops() {
  const [rows, setRows] = useState<Workshop[] | null>(null);
  const [editing, setEditing] = useState<Workshop | null>(null);
  const [viewBookings, setViewBookings] = useState<Workshop | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase.from("workshops").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) return toast.error("Slug and title required");
    setSaving(true);
    const payload = { ...editing, starts_at: editing.starts_at || null };
    const { error } = editing.id
      ? await supabase.from("workshops").update(payload).eq("id", editing.id)
      : await supabase.from("workshops").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (w: Workshop) => {
    if (!confirm(`Delete "${w.title}"?`)) return;
    const { error } = await supabase.from("workshops").delete().eq("id", w.id!);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-5">
      <Header title="Workshops" subtitle="Manage live workshops, seats, mentor info, and bookings." icon={GraduationCap} onNew={() => setEditing({ ...empty })} />
      <Card className="p-0 bg-card border-border overflow-hidden">
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>}
        {rows && rows.length === 0 && <div className="px-5 py-12 text-sm text-muted-foreground text-center">No workshops yet.</div>}
        {rows && rows.length > 0 && (
          <div className="divide-y divide-border">
            {rows.map((w) => (
              <div key={w.id} className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{w.title}</div>
                  <div className="text-xs text-muted-foreground truncate">/{w.slug} · {w.mentor_name ?? "—"} {w.seats_total ? `· ${w.seats_booked}/${w.seats_total} seats` : ""}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">{w.price_bdt ? `৳${Number(w.price_bdt).toLocaleString()}` : "Free"}</div>
                <Badge variant={w.is_published ? "default" : "outline"}>{w.is_published ? "Published" : "Draft"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => setViewBookings(w)} aria-label="Bookings"><Users className="w-4 h-4" /></Button>
                <RoleGate mode="write">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(w)} aria-label="Edit"><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(w)} aria-label="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </RoleGate>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[92dvh] overflow-y-auto bg-background">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit workshop" : "New workshop"}</DialogTitle></DialogHeader>
          {editing && (
            <Tabs defaultValue="details" className="mt-2">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="seats">Seats & Pricing</TabsTrigger>
                <TabsTrigger value="mentor">Mentor</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Slug" value={editing.slug} onChange={(v: string) => setEditing({ ...editing, slug: v.toLowerCase().replace(/\s+/g, "-") })} />
                  <FieldText label="Title" value={editing.title} onChange={(v: string) => setEditing({ ...editing, title: v })} />
                </div>
                <FieldText label="Summary" value={editing.summary || ""} onChange={(v: string) => setEditing({ ...editing, summary: v })} />
                <div><Label>Description</Label><Textarea rows={5} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Location" value={editing.location || ""} onChange={(v: string) => setEditing({ ...editing, location: v })} placeholder="Google Meet" />
                  <div><Label>Starts at</Label><Input type="datetime-local" value={editing.starts_at?.slice(0, 16) ?? ""} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value || null })} /></div>
                </div>
                <FieldText label="Join URL (sent to attendees)" value={editing.join_url || ""} onChange={(v: string) => setEditing({ ...editing, join_url: v })} placeholder="https://meet.google.com/..." />
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                  <span className="text-sm">Published</span>
                </div>
              </TabsContent>

              <TabsContent value="seats" className="space-y-3 pt-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <FieldText label="Duration (hours)" type="number" value={editing.duration_hours?.toString() || ""} onChange={(v: string) => setEditing({ ...editing, duration_hours: v ? parseFloat(v) : null })} />
                  <FieldText label="Price (BDT)" type="number" value={String(editing.price_bdt)} onChange={(v: string) => setEditing({ ...editing, price_bdt: parseFloat(v) || 0 })} />
                  <FieldText label="Total seats (blank = unlimited)" type="number" value={editing.seats_total?.toString() || ""} onChange={(v: string) => setEditing({ ...editing, seats_total: v ? parseInt(v, 10) : null })} />
                </div>
                {editing.seats_total && <div className="text-xs text-muted-foreground">Currently booked: <strong>{editing.seats_booked}</strong> / {editing.seats_total}</div>}
              </TabsContent>

              <TabsContent value="mentor" className="space-y-3 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Mentor name" value={editing.mentor_name || ""} onChange={(v: string) => setEditing({ ...editing, mentor_name: v })} />
                  <FieldText label="Mentor role" value={editing.mentor_role || ""} onChange={(v: string) => setEditing({ ...editing, mentor_role: v })} />
                </div>
                <div><Label>Mentor bio</Label><Textarea rows={3} value={editing.mentor_bio || ""} onChange={(e) => setEditing({ ...editing, mentor_bio: e.target.value })} /></div>
                <FieldText label="Mentor avatar URL" value={editing.mentor_avatar_url || ""} onChange={(v: string) => setEditing({ ...editing, mentor_avatar_url: v })} />
              </TabsContent>

              <TabsContent value="media" className="space-y-3 pt-4">
                <FieldText label="Cover image URL" value={editing.cover_url || ""} onChange={(v: string) => setEditing({ ...editing, cover_url: v })} />
                {editing.cover_url && <img src={editing.cover_url} alt="" className="rounded max-h-48 w-full object-cover border border-border" />}
                <FieldText label="Banner image URL" value={editing.banner_url || ""} onChange={(v: string) => setEditing({ ...editing, banner_url: v })} />
                {editing.banner_url && <img src={editing.banner_url} alt="" className="rounded max-h-48 w-full object-cover border border-border" />}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BookingsDialog workshop={viewBookings} onClose={() => setViewBookings(null)} />
    </div>
  );
}

function BookingsDialog({ workshop, onClose }: { workshop: Workshop | null; onClose: () => void }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    if (!workshop?.id) return;
    setRows(null);
    supabase.from("workshop_bookings")
      .select("id, seats, amount_paid, status, created_at, user_id, profiles:user_id(full_name)")
      .eq("workshop_id", workshop.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows(data || []));
  }, [workshop?.id]);

  const exportCsv = () => {
    if (!rows) return;
    const csv = ["name,seats,amount,status,date", ...rows.map((r: any) => `"${r.profiles?.full_name || ""}",${r.seats},${r.amount_paid},${r.status},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${workshop?.slug}-bookings.csv`; a.click();
  };

  return (
    <Dialog open={!!workshop} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85dvh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
            <span>Bookings · {workshop?.title}</span>
            {rows && rows.length > 0 && <Button size="sm" variant="outline" onClick={exportCsv}>Export CSV</Button>}
          </DialogTitle>
        </DialogHeader>
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>}
        {rows && rows.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No bookings yet.</div>}
        {rows && rows.length > 0 && (
          <div className="space-y-1">
            {rows.map((r: any) => (
              <div key={r.id} className="flex flex-wrap items-center gap-2 px-2 py-2 border border-border rounded">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.profiles?.full_name || "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.seats} seat(s) · {new Date(r.created_at).toLocaleDateString()}</div>
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
