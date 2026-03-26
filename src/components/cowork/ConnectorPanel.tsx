import React from "react";
import { HardDrive, Mail, Linkedin, Twitter, Plug, Unplug, Facebook, Instagram, MessageCircle, MessageCircleMore, Youtube, Send, Hash, Pin, Music } from "lucide-react";
import { useCoWorkStore, type ConnectorService } from "@/stores/coworkStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ConnectorPanelProps {
  language: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "hard-drive": HardDrive,
  mail: Mail,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  "message-circle": MessageCircle,
  "message-circle-more": MessageCircleMore,
  youtube: Youtube,
  send: Send,
  hash: Hash,
  pin: Pin,
  music: Music,
};

const ConnectorPanel: React.FC<ConnectorPanelProps> = ({ language }) => {
  const { connectors, updateConnector } = useCoWorkStore();

  const handleToggle = (service: ConnectorService, currentStatus: string) => {
    if (currentStatus === "coming_soon") {
      toast.info(language === "bn" ? "শীঘ্রই আসছে!" : "Coming soon!");
      return;
    }
    const newStatus = currentStatus === "connected" ? "disconnected" : "connected";
    updateConnector(service, newStatus);
    toast.success(
      newStatus === "connected"
        ? language === "bn" ? "সংযুক্ত হয়েছে" : "Connected"
        : language === "bn" ? "সংযোগ বিচ্ছিন্ন হয়েছে" : "Disconnected"
    );
  };

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1">
        {language === "bn" ? "কানেক্টর" : "Connectors"}
      </h4>
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
        {connectors.map((connector) => {
          const Icon = iconMap[connector.icon] || Plug;
          return (
            <button
              key={connector.service}
              onClick={() => handleToggle(connector.service, connector.status)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-xs",
                connector.status === "connected"
                  ? "border-cyan-500/30 bg-cyan-500/5 text-foreground"
                  : "border-border/30 bg-card/30 text-muted-foreground hover:bg-muted/30"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", connector.status === "connected" && "text-cyan-400")} />
              <span className="flex-1 font-medium">{connector.label}</span>
              {connector.status === "coming_soon" ? (
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {language === "bn" ? "শীঘ্রই" : "Soon"}
                </span>
              ) : connector.status === "connected" ? (
                <Unplug className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Plug className="w-3.5 h-3.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectorPanel;
