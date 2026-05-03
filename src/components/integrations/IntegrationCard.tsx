import React, { useState } from "react";
import { Loader2, Check, Plug, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IntegrationProvider } from "./integrationsCatalog";
import type { UserIntegration } from "@/hooks/useIntegrations";
import { toast } from "sonner";

type Props = {
  provider: IntegrationProvider;
  connection?: UserIntegration;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
};

const IntegrationCard: React.FC<Props> = ({ provider, connection, onConnect, onDisconnect }) => {
  const [busy, setBusy] = useState(false);
  const Icon = provider.icon;
  const connected = connection?.status === "connected";

  const handleConnect = async () => {
    setBusy(true);
    try { await onConnect(); }
    catch (e: any) { toast.error(e?.message ?? "Failed to start connection"); setBusy(false); }
  };
  const handleDisconnect = async () => {
    setBusy(true);
    try { await onDisconnect(); toast.success(`${provider.label} disconnected`); }
    catch (e: any) { toast.error(e?.message ?? "Failed to disconnect"); }
    finally { setBusy(false); }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 hover:border-cyan-500/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 ${provider.accent}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{provider.label}</h3>
            {connected && (
              <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500 border-0 gap-1">
                <Check className="w-3 h-3" /> Connected
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{provider.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {connected ? (
          <Button variant="ghost" size="sm" onClick={handleDisconnect} disabled={busy} className="text-muted-foreground hover:text-destructive">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            <span className="ml-1.5">Disconnect</span>
          </Button>
        ) : (
          <Button size="sm" onClick={handleConnect} disabled={busy} className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
            <span className="ml-1.5">Connect</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;
