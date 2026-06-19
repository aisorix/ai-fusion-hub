import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { History, Save } from "lucide-react";

export default function AdminPrompts() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const [body, setBody] = useState("");
  const [model, setModel] = useState("");
  const [versions, setVersions] = useState<any[]>([]);
  const [showVer, setShowVer] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    invokeAdmin<{ templates: any[] }>("admin-prompts-crud", { action: "list" })
      .then((r) => { setTemplates(r.templates); if (r.templates[0]) selectTemplate(r.templates[0]); })
      .catch((e: any) => toast.error(e.message));
  }, []);

  const selectTemplate = (t: any) => { setActive(t); setBody(t.body); setModel(t.model ?? ""); };
  const save = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const r = await invokeAdmin<{ template: any }>("admin-prompts-crud", { action: "update", id: active.id, body, model });
      toast.success(`Saved v${r.template.current_version}`);
      setTemplates((curr) => curr.map((x) => x.id === r.template.id ? r.template : x));
      setActive(r.template);
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const loadVersions = async () => {
    if (!active) return;
    const r = await invokeAdmin<{ versions: any[] }>("admin-prompts-crud", { action: "versions", template_id: active.id });
    setVersions(r.versions); setShowVer(true);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-3 p-3 bg-card border-border h-fit">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2">Tools</div>
        <div className="space-y-0.5">
          {templates.map((t) => (
            <button key={t.id} onClick={() => selectTemplate(t)} className={`w-full text-left px-2.5 py-2 rounded text-sm ${active?.id === t.id ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted/60"}`}>
              {t.name} <span className="text-xs text-muted-foreground">v{t.current_version}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card className="col-span-9 p-5 bg-card border-border space-y-3">
        {active ? (
          <>
            <div className="flex items-center justify-between">
              <div><h2 className="font-semibold text-foreground">{active.name}</h2><p className="text-xs text-muted-foreground">tool: <span className="font-mono">{active.tool}</span> · current v{active.current_version}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadVersions}><History className="w-4 h-4 mr-1" /> History</Button>
                <Button size="sm" onClick={save} disabled={saving}><Save className="w-4 h-4 mr-1" /> Save</Button>
              </div>
            </div>
            <div><label className="text-xs text-muted-foreground">Model (optional)</label><Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="google/gemini-2.5-flash" /></div>
            <div><label className="text-xs text-muted-foreground">System prompt</label><Textarea rows={18} value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-sm" /></div>
          </>
        ) : <p className="text-sm text-muted-foreground">Select a tool</p>}
      </Card>
      <Sheet open={showVer} onOpenChange={setShowVer}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>Version history</SheetTitle></SheetHeader>
          <div className="space-y-3 mt-4">
            {versions.map((v) => (
              <Card key={v.id} className="p-3 bg-card border-border">
                <div className="flex items-center justify-between text-xs mb-2"><span className="font-semibold text-foreground">v{v.version}</span><span className="text-muted-foreground">{new Date(v.created_at).toLocaleString()}</span></div>
                <pre className="text-xs whitespace-pre-wrap font-mono bg-muted/50 text-foreground p-2 rounded max-h-60 overflow-auto">{v.body}</pre>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setBody(v.body); setShowVer(false); toast.info("Loaded into editor — Save to publish"); }}>Restore</Button>
              </Card>
            ))}
            {!versions.length && <p className="text-sm text-muted-foreground">No prior versions yet.</p>}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
