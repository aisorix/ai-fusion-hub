import React, { useState } from "react";
import { Mail, HardDrive, Facebook, MessageCircle, Send, Plug, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useConnections } from "@/hooks/useConnections";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";
import { useCoWorkAgent } from "@/hooks/useCoWorkAgent";
import { useCoWorkStore } from "@/stores/coworkStore";

type Panel = {
  id: string;
  label: string;
  description: string;
  icon: typeof Mail;
  accent: string;
  requiresService: "google" | "facebook" | "whatsapp";
  contextPrefix: string;
  placeholder: string;
};

const PANELS: Panel[] = [
  {
    id: "gmail",
    label: "Google Gmail",
    description: "Send and read email through your Gmail account.",
    icon: Mail,
    accent: "text-red-500",
    requiresService: "google",
    contextPrefix:
      "[Service context: GMAIL ONLY] Use only Gmail tools (gmail_send_email, gmail_list_recent). Do not use Drive, Calendar or any other service. Task: ",
    placeholder: "e.g. Email john@acme.com a follow-up about the proposal",
  },
  {
    id: "drive",
    label: "Google Drive",
    description: "Browse and manage files in your Google Drive.",
    icon: HardDrive,
    accent: "text-emerald-500",
    requiresService: "google",
    contextPrefix:
      "[Service context: GOOGLE DRIVE ONLY] Use only Google Drive tools (drive_list_files). Do not use Gmail, Calendar or any other service. Task: ",
    placeholder: "e.g. List my 10 most recent Drive files",
  },
  {
    id: "facebook",
    label: "Facebook Page",
    description: "Publish and manage posts on your Facebook Page.",
    icon: Facebook,
    accent: "text-blue-600",
    requiresService: "facebook",
    contextPrefix:
      "[Service context: FACEBOOK PAGE ONLY] Use only the facebook_page_post tool. Task: ",
    placeholder: "e.g. Post on my Facebook Page: 'New product launching tomorrow!'",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Business",
    description: "Send WhatsApp messages via the Cloud API.",
    icon: MessageCircle,
    accent: "text-green-600",
    requiresService: "whatsapp",
    contextPrefix:
      "[Service context: WHATSAPP BUSINESS ONLY] Use only the whatsapp_send_message tool. Task: ",
    placeholder: "e.g. Send 'Your order has shipped' to +14155551234",
  },
];

interface Props {
  language: string;
}

const ServicePanels: React.FC<Props> = ({ language }) => {
  const navigate = useNavigate();
  const { connections, refresh, disconnect } = useConnections();
  const { startOAuth, loading: oauthLoading } = useGoogleOAuth({ onSuccess: refresh });
  const { sendMessage } = useCoWorkAgent();
  const { agentStatus } = useCoWorkStore();

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="text-sm font-semibold text-foreground">
          {language === "bn" ? "সার্ভিস ওয়ার্কস্পেস" : "Service Workspaces"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {language === "bn"
            ? "প্রতিটি সার্ভিসের নিচে নিজস্ব চ্যাটবক্স — শুধু সেই সার্ভিসের টুল ব্যবহার হবে।"
            : "Each connected service gets its own chatbox — only that service's tools are used."}
        </p>
      </div>

      {PANELS.map((p) => (
        <ServicePanel
          key={p.id}
          panel={p}
          connected={!!connections.find((c) => c.service === p.requiresService && c.status === "connected")}
          oauthLoading={oauthLoading}
          onStartOAuth={startOAuth}
          onGoToManual={() => navigate("/agent/connections")}
          onDisconnect={() => disconnect(p.requiresService)}
          onSend={(text) => sendMessage(p.contextPrefix + text)}
          disabled={agentStatus !== "idle"}
          language={language}
        />
      ))}
    </div>
  );
};

interface PanelProps {
  panel: Panel;
  connected: boolean;
  oauthLoading: boolean;
  onStartOAuth: () => void;
  onGoToManual: () => void;
  onDisconnect: () => Promise<void> | void;
  onSend: (text: string) => void;
  disabled: boolean;
  language: string;
}

const ServicePanel: React.FC<PanelProps> = ({
  panel, connected, oauthLoading, onStartOAuth, onGoToManual, onDisconnect, onSend, disabled, language,
}) => {
  const [text, setText] = useState("");
  const Icon = panel.icon;
  const isOAuth = panel.requiresService === "google";

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
          <Icon className={cn("w-5 h-5", panel.accent)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-foreground">{panel.label}</h4>
            {connected ? (
              <Badge variant="secondary" className="bg-green-500/15 text-green-600 border-green-500/20 text-[10px] h-5">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {language === "bn" ? "যুক্ত" : "Connected"}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground text-[10px] h-5">
                {language === "bn" ? "যুক্ত নয়" : "Not connected"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{panel.description}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          {connected ? (
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-8 px-2" onClick={() => onDisconnect()}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">{language === "bn" ? "সংযোগ বিচ্ছিন্ন" : "Disconnect"}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={isOAuth ? onStartOAuth : onGoToManual}
              disabled={isOAuth && oauthLoading}
              className="h-8"
            >
              {isOAuth && oauthLoading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Plug className="w-3.5 h-3.5 mr-1.5" />
              )}
              {isOAuth
                ? (language === "bn" ? "Google দিয়ে যুক্ত করুন" : "Connect with Google")
                : (language === "bn" ? "যুক্ত করুন" : "Connect")}
            </Button>
          )}
        </div>
      </div>

      {/* Inline contextual chatbox — only when connected */}
      {connected && (
        <div className="px-4 pb-4">
          <div
            className={cn(
              "relative flex items-end gap-2 rounded-2xl border border-border/50 bg-muted/40 px-3 py-2",
              "focus-within:border-primary/40 focus-within:bg-muted/60 transition-all"
            )}
          >
            <TextareaAutosize
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={panel.placeholder}
              minRows={1}
              maxRows={4}
              disabled={disabled}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/70 py-1.5"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || disabled}
              className={cn(
                "p-2 rounded-full transition-all",
                text.trim() ? "text-foreground hover:bg-background" : "text-muted-foreground opacity-50",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-1.5 px-1">
            {language === "bn"
              ? `এই বক্স থেকে শুধু ${panel.label} টুল চালু হবে।`
              : `Only ${panel.label} tools will be invoked from this box.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicePanels;
