import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CONNECTION_SERVICES, type ServiceConfig } from "@/components/connections/connectionConfig";
import ConnectionCard from "@/components/connections/ConnectionCard";
import ConnectDialog from "@/components/connections/ConnectDialog";
import { useConnections } from "@/hooks/useConnections";

const ConnectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getByService, refresh, disconnect, loading } = useConnections();
  const [selected, setSelected] = useState<ServiceConfig | null>(null);
  const [open, setOpen] = useState(false);

  const handleConnect = (svc: ServiceConfig) => {
    setSelected(svc);
    setOpen(true);
  };

  return (
    <>
      <SEOHead
        title="Connections | Sorix Agent"
        description="Securely connect Google, Facebook, LinkedIn, WhatsApp, and Telegram so Sorix Agent can act on your behalf."
        path="/agent/connections"
      />
      <div className="min-h-[100dvh] bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/agent")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Connections</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Link your accounts so Sorix Agent can send emails, post updates and manage tasks for you.
              </p>
            </div>
          </div>

          {/* Security note */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 p-4 sm:p-5 mb-6 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Your tokens stay private</p>
              <p className="text-muted-foreground mt-0.5">
                Credentials are encrypted in your private workspace and only the agent's secure backend uses them.
                You can disconnect at any time and revoke access from the provider too.
              </p>
            </div>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONNECTION_SERVICES.map((svc) => (
              <ConnectionCard
                key={svc.id}
                service={svc}
                connection={getByService(svc.id)}
                onConnect={() => handleConnect(svc)}
                onDisconnect={() => disconnect(svc.id)}
              />
            ))}
          </div>

          {loading && (
            <p className="text-xs text-muted-foreground mt-6 text-center">Loading your connections…</p>
          )}

          <div className="mt-10 rounded-2xl border border-dashed border-border p-5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">More integrations coming</p>
              <p className="text-muted-foreground mt-0.5">
                Slack, Notion, Twitter/X, Instagram and more are on the roadmap. Need a specific one? Let us know.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConnectDialog
        service={selected}
        open={open}
        onOpenChange={setOpen}
        onSuccess={refresh}
      />
    </>
  );
};

export default ConnectionsPage;
