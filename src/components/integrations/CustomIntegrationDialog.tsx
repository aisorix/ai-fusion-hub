import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCustomIntegrations, type CustomIntegrationInput } from "@/hooks/useCustomIntegrations";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: () => void;
}

const CustomIntegrationDialog: React.FC<Props> = ({ open, onOpenChange, onCreated }) => {
  const { create } = useCustomIntegrations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CustomIntegrationInput>({
    name: "",
    base_url: "",
    auth_header: "Authorization",
    auth_scheme: "Bearer",
    api_key: "",
    description: "",
  });

  const update = <K extends keyof CustomIntegrationInput>(k: K, v: CustomIntegrationInput[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.base_url.trim() || !form.api_key.trim()) {
      toast.error("Name, Base URL and API Key are required");
      return;
    }
    try {
      setSaving(true);
      await create(form);
      toast.success("Custom integration added");
      onOpenChange(false);
      setForm({ name: "", base_url: "", auth_header: "Authorization", auth_scheme: "Bearer", api_key: "", description: "" });
      onCreated?.();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add custom integration</DialogTitle>
          <DialogDescription>
            Connect any REST API. Sorix Agent will be able to call it on your behalf.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Name</Label>
            <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. My CRM" />
          </div>
          <div>
            <Label className="text-xs">Base URL</Label>
            <Input value={form.base_url} onChange={e => update("base_url", e.target.value)} placeholder="https://api.example.com" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Auth header</Label>
              <Input value={form.auth_header} onChange={e => update("auth_header", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Scheme</Label>
              <Input value={form.auth_scheme} onChange={e => update("auth_scheme", e.target.value)} placeholder="Bearer" />
            </div>
          </div>
          <div>
            <Label className="text-xs">API key / token</Label>
            <Input type="password" value={form.api_key} onChange={e => update("api_key", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Description (helps the agent)</Label>
            <Textarea
              value={form.description ?? ""}
              onChange={e => update("description", e.target.value)}
              placeholder="What this API does and which endpoints exist"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomIntegrationDialog;
