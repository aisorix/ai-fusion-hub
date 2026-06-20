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
import { Edit3, Plus, Trash2, BookOpen, GripVertical } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "../../components/RoleGate";
import MediaUrlField from "../../components/MediaUrlField";

interface Course {
  id?: string;
  slug: string;
  title: string;
  tagline: string | null;
  level: string | null;
  duration_label: string | null;
  price_bdt: number;
  old_price_bdt: number | null;
  cover_url: string | null;
  banner_url: string | null;
  overview: string | null;
  outcomes: string[];
  instructor: { name?: string; role?: string; bio?: string };
  faqs: { q: string; a: string }[];
  is_published: boolean;
  sort_order: number;
}
interface Module { id?: string; course_id?: string; title: string; sort_order: number; }
interface Lesson { id?: string; module_id?: string; title: string; video_url: string | null; duration_sec: number | null; content_md: string | null; is_preview: boolean; sort_order: number; }

const empty: Course = {
  slug: "", title: "", tagline: "", level: "Beginner", duration_label: "",
  price_bdt: 0, old_price_bdt: null, cover_url: "", banner_url: "", overview: "",
  outcomes: [], instructor: { name: "", role: "", bio: "" }, faqs: [],
  is_published: false, sort_order: 0,
};

export default function AdminScholarsCourses() {
  const [rows, setRows] = useState<Course[] | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase.from("courses").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const openEdit = async (c?: Course) => {
    if (!c) { setEditing({ ...empty }); setModules([]); return; }
    setEditing({ ...c, outcomes: c.outcomes || [], faqs: c.faqs || [], instructor: c.instructor || {} });
    if (c.id) {
      const { data: mods } = await supabase.from("course_modules").select("*").eq("course_id", c.id).order("sort_order");
      const modIds = (mods || []).map((m: any) => m.id);
      let lessons: any[] = [];
      if (modIds.length) {
        const { data: les } = await supabase.from("course_lessons").select("*").in("module_id", modIds).order("sort_order");
        lessons = les || [];
      }
      setModules((mods || []).map((m: any) => ({ ...m, lessons: lessons.filter((l) => l.module_id === m.id) })));
    } else { setModules([]); }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) { toast.error("Slug and title required"); return; }
    setSaving(true);
    const payload = {
      ...editing,
      tagline: editing.tagline || null, level: editing.level || null,
      duration_label: editing.duration_label || null,
      cover_url: editing.cover_url || null, banner_url: editing.banner_url || null,
      overview: editing.overview || null,
      outcomes: editing.outcomes || [], faqs: editing.faqs || [], instructor: editing.instructor || {},
    };
    const result = editing.id
      ? await supabase.from("courses").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("courses").insert(payload).select().single();
    if (result.error) { setSaving(false); return toast.error(result.error.message); }
    const courseId = result.data.id;

    // Sync modules + lessons
    const { data: existingMods } = await supabase.from("course_modules").select("id").eq("course_id", courseId);
    const keepIds = new Set(modules.filter((m) => m.id).map((m) => m.id));
    const toDelete = (existingMods || []).filter((m: any) => !keepIds.has(m.id)).map((m: any) => m.id);
    if (toDelete.length) await supabase.from("course_modules").delete().in("id", toDelete);

    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      let modId = m.id;
      if (modId) {
        await supabase.from("course_modules").update({ title: m.title, sort_order: i }).eq("id", modId);
      } else {
        const { data } = await supabase.from("course_modules").insert({ course_id: courseId, title: m.title, sort_order: i }).select("id").single();
        modId = data?.id;
      }
      if (!modId) continue;
      const { data: existingLes } = await supabase.from("course_lessons").select("id").eq("module_id", modId);
      const keepLesIds = new Set(m.lessons.filter((l) => l.id).map((l) => l.id));
      const delLes = (existingLes || []).filter((l: any) => !keepLesIds.has(l.id)).map((l: any) => l.id);
      if (delLes.length) await supabase.from("course_lessons").delete().in("id", delLes);

      for (let j = 0; j < m.lessons.length; j++) {
        const l = m.lessons[j];
        const lessonRow = {
          module_id: modId, title: l.title, video_url: l.video_url || null,
          duration_sec: l.duration_sec || null, content_md: l.content_md || null,
          is_preview: !!l.is_preview, sort_order: j,
        };
        if (l.id) await supabase.from("course_lessons").update(lessonRow).eq("id", l.id);
        else await supabase.from("course_lessons").insert(lessonRow);
      }
    }
    setSaving(false);
    toast.success("Course saved");
    setEditing(null); load();
  };

  const remove = async (c: Course) => {
    if (!confirm(`Delete course "${c.title}"? This removes modules, lessons, and purchase history.`)) return;
    const { error } = await supabase.from("courses").delete().eq("id", c.id!);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-5">
      <Header title="Courses" subtitle="Manage Sorix Scholars courses, curriculum, pricing, and publishing." icon={BookOpen} onNew={() => openEdit()} />

      <Card className="p-0 bg-card border-border overflow-hidden">
        {rows === null && <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>}
        {rows && rows.length === 0 && (
          <div className="px-5 py-12 text-sm text-muted-foreground text-center">No courses yet.</div>
        )}
        {rows && rows.length > 0 && (
          <div className="divide-y divide-border">
            {rows.map((c) => (
              <div key={c.id} className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground truncate">/{c.slug} · {c.level} · {c.duration_label}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">{c.price_bdt ? `৳${Number(c.price_bdt).toLocaleString()}` : "Free"}</div>
                <Badge variant={c.is_published ? "default" : "outline"}>{c.is_published ? "Published" : "Draft"}</Badge>
                <RoleGate mode="write">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label="Edit"><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c)} aria-label="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </RoleGate>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[92dvh] overflow-y-auto bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit course" : "New course"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <Tabs defaultValue="details" className="mt-2">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v.toLowerCase().replace(/\s+/g, "-") })} />
                  <FieldText label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
                </div>
                <FieldText label="Tagline" value={editing.tagline || ""} onChange={(v) => setEditing({ ...editing, tagline: v })} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Level" value={editing.level || ""} onChange={(v) => setEditing({ ...editing, level: v })} placeholder="Beginner / Intermediate / Advanced" />
                  <FieldText label="Duration label" value={editing.duration_label || ""} onChange={(v) => setEditing({ ...editing, duration_label: v })} placeholder="6 মডিউল" />
                </div>
                <div>
                  <Label>Overview</Label>
                  <Textarea rows={5} value={editing.overview || ""} onChange={(e) => setEditing({ ...editing, overview: e.target.value })} />
                </div>
                <ArrayEditor label="Learning outcomes" values={editing.outcomes} onChange={(v) => setEditing({ ...editing, outcomes: v })} placeholder="Add outcome" />
                <div className="border-t border-border pt-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Instructor</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Name" value={editing.instructor.name || ""} onChange={(e) => setEditing({ ...editing, instructor: { ...editing.instructor, name: e.target.value } })} />
                    <Input placeholder="Role" value={editing.instructor.role || ""} onChange={(e) => setEditing({ ...editing, instructor: { ...editing.instructor, role: e.target.value } })} />
                  </div>
                  <Textarea className="mt-2" rows={3} placeholder="Bio" value={editing.instructor.bio || ""} onChange={(e) => setEditing({ ...editing, instructor: { ...editing.instructor, bio: e.target.value } })} />
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                  <span className="text-sm">Published (visible to public)</span>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-3 pt-4">
                {modules.map((m, mi) => (
                  <Card key={mi} className="p-3 space-y-2 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <Input value={m.title} onChange={(e) => { const n = [...modules]; n[mi].title = e.target.value; setModules(n); }} placeholder="Module title" />
                      <Button variant="ghost" size="icon" onClick={() => { const n = [...modules]; n.splice(mi, 1); setModules(n); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                    <div className="space-y-2 pl-6">
                      {m.lessons.map((l, li) => (
                        <div key={li} className="space-y-1 p-2 bg-background rounded border border-border">
                          <div className="flex items-center gap-2">
                            <Input value={l.title} onChange={(e) => { const n = [...modules]; n[mi].lessons[li].title = e.target.value; setModules(n); }} placeholder="Lesson title" />
                            <Button variant="ghost" size="icon" onClick={() => { const n = [...modules]; n[mi].lessons.splice(li, 1); setModules(n); }}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                          </div>
                          <div className="grid sm:grid-cols-[1fr_140px] gap-2">
                            <MediaUrlField label="Video URL" kind="video" uploadFolder="courses/lessons" value={l.video_url || ""} onChange={(v) => { const n = [...modules]; n[mi].lessons[li].video_url = v; setModules(n); }} placeholder="YouTube, Vimeo, or .mp4" />
                            <div>
                              <Label>Duration (sec)</Label>
                              <Input type="number" placeholder="0" value={l.duration_sec ?? ""} onChange={(e) => { const n = [...modules]; n[mi].lessons[li].duration_sec = e.target.value ? parseInt(e.target.value, 10) : null; setModules(n); }} />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" checked={l.is_preview} onChange={(e) => { const n = [...modules]; n[mi].lessons[li].is_preview = e.target.checked; setModules(n); }} />
                            Free preview lesson
                          </label>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => { const n = [...modules]; n[mi].lessons.push({ title: "", video_url: "", duration_sec: null, content_md: "", is_preview: false, sort_order: n[mi].lessons.length }); setModules(n); }}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add lesson
                      </Button>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" onClick={() => setModules([...modules, { title: "", sort_order: modules.length, lessons: [] }])}>
                  <Plus className="w-4 h-4 mr-1" /> Add module
                </Button>
              </TabsContent>

              <TabsContent value="media" className="space-y-3 pt-4">
                <MediaUrlField label="Cover image URL" kind="image" uploadFolder="courses/covers" value={editing.cover_url || ""} onChange={(v) => setEditing({ ...editing, cover_url: v })} />
                <MediaUrlField label="Banner image URL (detail page hero)" kind="image" uploadFolder="courses/banners" value={editing.banner_url || ""} onChange={(v) => setEditing({ ...editing, banner_url: v })} />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-3 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldText label="Price (BDT)" type="number" value={String(editing.price_bdt)} onChange={(v) => setEditing({ ...editing, price_bdt: parseFloat(v) || 0 })} />
                  <FieldText label="Strikethrough price (optional)" type="number" value={editing.old_price_bdt?.toString() || ""} onChange={(v) => setEditing({ ...editing, old_price_bdt: v ? parseFloat(v) : null })} />
                </div>
                <FieldText label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v, 10) || 0 })} />
              </TabsContent>

              <TabsContent value="faqs" className="space-y-2 pt-4">
                {editing.faqs.map((f, i) => (
                  <Card key={i} className="p-3 space-y-2 bg-muted/30">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input placeholder="Question" value={f.q} onChange={(e) => { const n = [...editing.faqs]; n[i].q = e.target.value; setEditing({ ...editing, faqs: n }); }} />
                        <Textarea rows={2} placeholder="Answer" value={f.a} onChange={(e) => { const n = [...editing.faqs]; n[i].a = e.target.value; setEditing({ ...editing, faqs: n }); }} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => { const n = [...editing.faqs]; n.splice(i, 1); setEditing({ ...editing, faqs: n }); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" onClick={() => setEditing({ ...editing, faqs: [...editing.faqs, { q: "", a: "" }] })}>
                  <Plus className="w-4 h-4 mr-1" /> Add FAQ
                </Button>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save course"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Header({ title, subtitle, icon: Icon, onNew, newLabel = "New" }: any) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">{title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      {onNew && (
        <RoleGate mode="write">
          <Button onClick={onNew} className="gap-2"><Plus className="w-4 h-4" /> {newLabel}</Button>
        </RoleGate>
      )}
    </div>
  );
}

export function FieldText({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function ArrayEditor({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input value={v} onChange={(e) => { const n = [...values]; n[i] = e.target.value; onChange(n); }} placeholder={placeholder} />
            <Button variant="ghost" size="icon" onClick={() => { const n = [...values]; n.splice(i, 1); onChange(n); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...values, ""])}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
      </div>
    </div>
  );
}
