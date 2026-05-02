import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceConfig } from "./connectionConfig";

interface Props {
  service: ServiceConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ConnectDialog: React.FC<Props> = ({ service, open, onOpenChange, onSuccess }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (open) setValues({});
  }, [open, service?.id]);

  if (!service) return null;

  const handleGoogleOAuth = async () => {
    try {
      setSubmitting(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        toast.error("Please sign in again");
        return;
      }
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const startUrl = `https://${projectId}.supabase.co/functions/v1/google-oauth-start?token=${encodeURIComponent(token)}`;

      // Open popup
      const popup = window.open(startUrl, "google_oauth", "width=520,height=640");
      if (!popup) {
        toast.error("Popup blocked. Please allow popups for this site.");
        return;
      }

      const messageHandler = (e: MessageEvent) => {
        if (e.data?.type === "google_oauth_result") {
          window.removeEventListener("message", messageHandler);
          if (e.data.ok) {
            toast.success(`Google connected: ${e.data.email || ""}`);
            onSuccess();
            onOpenChange(false);
          } else {
            toast.error(e.data.error || "Google connection failed");
          }
          setSubmitting(false);
        }
      };
      window.addEventListener("message", messageHandler);

      // poll for popup close
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          window.removeEventListener("message", messageHandler);
          setSubmitting(false);
        }
      }, 500);
    } catch (e: any) {
      toast.error(e.message || "Failed to start Google OAuth");
      setSubmitting(false);
    }
  };

  const handleManualSubmit = async () => {
    // validate
    for (const f of service.fields ?? []) {
      if (f.required && !values[f.key]?.trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    try {
      setSubmitting(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        toast.error("Please sign in again");
        return;
      }
      const { data, error } = await supabase.functions.invoke("connection-save", {
        body: { service: service.id, fields: values },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "Failed to save");
      toast.success(`${service.label} connected${data.account_label ? `: ${data.account_label}` : ""}`);
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save connection");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <service.icon className={`w-5 h-5 ${service.accent}`} />
            Connect {service.label}
          </DialogTitle>
          <DialogDescription>{service.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
            <span>Your credentials are stored encrypted in your private account and never shared with the AI model.</span>
          </div>

          {service.helpText && (
            <p className="text-xs text-muted-foreground">
              {service.helpText}{" "}
              {service.helpUrl && (
                <a href={service.helpUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  Open guide <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </p>
          )}

          {service.method === "manual" && (
            <div className="space-y-3">
              {service.fields?.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key} className="text-xs">
                    {f.label} {f.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id={f.key}
                    type={f.type === "password" ? "password" : "text"}
                    placeholder={f.placeholder}
                    value={values[f.key] || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          {service.method === "oauth" ? (
            <Button onClick={handleGoogleOAuth} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Connect with Google
            </Button>
          ) : (
            <Button onClick={handleManualSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save & Verify
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDialog;
