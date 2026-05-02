import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Plug, Settings2 } from "lucide-react";
import { CONNECTION_SERVICES, type ServiceConfig } from "@/components/connections/connectionConfig";
import ConnectDialog from "@/components/connections/ConnectDialog";
import { useConnections } from "@/hooks/useConnections";
import { cn } from "@/lib/utils";

interface ConnectorPanelProps {
  language: string;
}

const ConnectorPanel: React.FC<ConnectorPanelProps> = ({ language }) => {
  const navigate = useNavigate();
  const { getByService, refresh } = useConnections();
  const [selected, setSelected] = useState<ServiceConfig | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (svc: ServiceConfig) => {
    setSelected(svc);
    setOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {language === "bn" ? "কানেক্টর" : "Connectors"}
        </h4>
        <button
          onClick={() => navigate("/agent/connections")}
          className="text-[10px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
        >
          <Settings2 className="w-3 h-3" /> Manage
        </button>
      </div>
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
        {CONNECTION_SERVICES.map((svc) => {
          const Icon = svc.icon;
          const conn = getByService(svc.id);
          const connected = !!conn;
          return (
            <button
              key={svc.id}
              onClick={() => handleClick(svc)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-xs",
                connected
                  ? "border-cyan-500/30 bg-cyan-500/5 text-foreground"
                  : "border-border/30 bg-card/30 text-muted-foreground hover:bg-muted/30"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", connected && "text-cyan-400")} />
              <span className="flex-1 font-medium truncate">{svc.label}</span>
              {connected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Plug className="w-3.5 h-3.5" />
              )}
            </button>
          );
        })}
      </div>

      <ConnectDialog
        service={selected}
        open={open}
        onOpenChange={setOpen}
        onSuccess={refresh}
      />
    </div>
  );
};

export default ConnectorPanel;
