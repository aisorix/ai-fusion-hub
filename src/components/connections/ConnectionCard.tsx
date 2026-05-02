import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Plug, Loader2, Trash2 } from "lucide-react";
import type { ServiceConfig } from "./connectionConfig";
import type { UserConnection } from "@/hooks/useConnections";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  service: ServiceConfig;
  connection?: UserConnection;
  onConnect: () => void;
  onDisconnect: () => Promise<void>;
}

const ConnectionCard: React.FC<Props> = ({ service, connection, onConnect, onDisconnect }) => {
  const [testing, setTesting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const Icon = service.icon;
  const isConnected = !!connection;

  const accountLabel =
    connection?.external_account_id ||
    connection?.metadata?.page_name ||
    connection?.metadata?.bot_username ||
    connection?.metadata?.phone_number_id ||
    "Connected";

  const handleTest = async () => {
    try {
      setTesting(true);
      const { data, error } = await supabase.functions.invoke("connection-test", {
        body: { service: service.id },
      });
      if (error) throw error;
      if (data?.ok) toast.success(`${service.label} is working`);
      else toast.error(data?.error || "Connection test failed");
    } catch (e: any) {
      toast.error(e?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${service.label}?`)) return;
    setDisconnecting(true);
    try {
      await onDisconnect();
      toast.success(`${service.label} disconnected`);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${service.accent}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{service.label}</h3>
            {isConnected ? (
              <Badge variant="secondary" className="bg-green-500/15 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Not connected</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
          {isConnected && (
            <p className="text-xs text-muted-foreground mt-2 truncate">
              <span className="font-medium text-foreground">{accountLabel}</span>
              {connection?.scopes?.length ? <span> · {connection.scopes.length} scopes</span> : null}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {isConnected ? (
          <>
            <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : null}
              Test
            </Button>
            <Button size="sm" variant="outline" onClick={onConnect}>
              Reconnect
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleDisconnect} disabled={disconnecting}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={onConnect}>
            <Plug className="w-3.5 h-3.5 mr-1.5" /> Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
