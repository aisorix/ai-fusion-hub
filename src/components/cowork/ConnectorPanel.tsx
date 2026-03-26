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
    <div className="space-y-2.5">
      <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-1">
        {language === "bn" ? "কানেক্টর" : "Connectors"}
      </h4>
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
        {connectors.map((connector) => {
          const Icon = iconMap[connector.icon] || Plug;
          const isConnected = connector.status === "connected";
          const isComingSoon = connector.status === "coming_soon";
          
          return (
            <button
              key={connector.service}
              onClick={() => handleToggle(connector.service, connector.status)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 text-xs group",
                isConnected
                  ? "border-cyan-500/25 bg-cyan-500/5 hover:bg-cyan-500/10"
                  : "border-border/30 bg-card/40 hover:bg-muted/40"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                isConnected ? "bg-cyan-500/10" : "bg-muted/50 group-hover:bg-muted"
              )}>
                <Icon className={cn(
                  "w-4 h-4",
                  isConnected ? "text-cyan-500" : "text-muted-foreground"
                )} />
              </div>
              <span className={cn(
                "flex-1 font-medium",
                isConnected ? "text-foreground" : "text-muted-foreground"
              )}>
                {connector.label}
              </span>
              {isComingSoon ? (
                <span className="text-[10px] font-medium bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-md">
                  {language === "bn" ? "শীঘ্রই" : "Soon"}
                </span>
              ) : isConnected ? (
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/30" />
              ) : (
                <Plug className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectorPanel;
