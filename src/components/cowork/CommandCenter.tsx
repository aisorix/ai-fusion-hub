import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  Bot,
  Cpu,
  ChevronDown,
  Mail,
  Calendar,
  Facebook,
  MessageCircle,
  Plus,
  Mic,
  Settings2,
  Plug,
  Image as ImageIcon,
  Camera,
  Paperclip,
  Search,
  CheckCircle2,
  Loader2,
  Globe2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCoWorkStore, type AgentStatus } from "@/stores/coworkStore";
import { useCoWorkAgent } from "@/hooks/useCoWorkAgent";
import AgentMessage from "./AgentMessage";
import SmartClipboard from "./SmartClipboard";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { INTEGRATIONS } from "@/components/integrations/integrationsCatalog";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useCustomIntegrations } from "@/hooks/useCustomIntegrations";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import ToolsMenu from "@/components/aichat/ToolsMenu";

interface CommandCenterProps {
  language: string;
}

const MODELS = [
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", short: "Gemini" },
  { id: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4", short: "Claude" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", short: "GPT-5" },
  { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B", short: "Llama" },
];

const statusConfig: Record<AgentStatus, { color: string; label: string; labelBn: string }> = {
  idle: { color: "bg-emerald-400", label: "Ready", labelBn: "প্রস্তুত" },
  thinking: { color: "bg-amber-400 animate-pulse", label: "Thinking", labelBn: "চিন্তা করছে" },
  working: { color: "bg-cyan-400 animate-pulse", label: "Working", labelBn: "কাজ করছে" },
  blocked: { color: "bg-red-400", label: "Blocked", labelBn: "ব্লক" },
};

const CommandCenter: React.FC<CommandCenterProps> = ({ language }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [input, setInput] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; size: number }[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [intQuery, setIntQuery] = useState("");

  const { messages, agentStatus, selectedModel, setSelectedModel } = useCoWorkStore();
  const { sendMessage } = useCoWorkAgent();
  const { items: connections, getByProvider, startConnect, disconnect } = useIntegrations();
  const { items: customItems } = useCustomIntegrations();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || agentStatus !== "idle") return;
    let prompt = input;
    if (attachments.length) {
      prompt = `${input}\n\n[Attached: ${attachments.map((a) => a.name).join(", ")}]`;
    }
    sendMessage(prompt);
    setInput("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).map((f) => ({ name: f.name, size: f.size }));
    setAttachments((prev) => [...prev, ...arr]);
    setShowAttachMenu(false);
  };

  const status = statusConfig[agentStatus];
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const connectedCount = connections.length + customItems.length;

  const filteredIntegrations = useMemo(() => {
    const q = intQuery.trim().toLowerCase();
    if (!q) return INTEGRATIONS;
    return INTEGRATIONS.filter(
      (i) => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
  }, [intQuery]);

  const handleToggleIntegration = async (providerId: string, connected: boolean) => {
    try {
      setBusyId(providerId);
      if (connected) await disconnect(providerId);
      else await startConnect(providerId);
    } catch (e: any) {
      toast.error(e?.message ?? "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const closeAllPopovers = () => {
    setShowAttachMenu(false);
    setShowModelPicker(false);
    setShowIntegrations(false);
    setShowToolsMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-background/30">
      {/* Header - clean, no model picker */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 backdrop-blur-sm relative z-[100]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-background",
                status.color
              )}
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              {language === "bn" ? "কমান্ড সেন্টার" : "Command Center"}
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {language === "bn" ? status.labelBn : status.label}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-0 text-center px-4 pt-8">
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-5"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-1"
              >
                <h3 className="text-xl font-bold tracking-tight">
                  {language === "bn" ? "হ্যালো!" : "Hello!"}
                </h3>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-muted-foreground mb-4"
              >
                {language === "bn" ? "আজ কোন কাজ দিতে চান?" : "What task can I handle for you?"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 mb-8"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">S</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Smart Auto</span>
                <span className="text-xs">🤖</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3 w-full max-w-sm"
              >
                {[
                  {
                    icon: MessageCircle,
                    label: language === "bn" ? "Telegram মেসেজ পাঠাও" : "Send a Telegram message",
                    prompt:
                      language === "bn" ? "Telegram এ একটি মেসেজ পাঠাও " : "Send a Telegram message to ",
                  },
                  {
                    icon: Mail,
                    label: language === "bn" ? "ইমেইল পাঠাও" : "Send an email",
                    prompt: language === "bn" ? "একটি ইমেইল পাঠাও " : "Send an email to ",
                  },
                  {
                    icon: Calendar,
                    label: language === "bn" ? "মিটিং সেট করো" : "Schedule a meeting",
                    prompt:
                      language === "bn"
                        ? "আগামীকাল ৩টায় একটি মিটিং সেট করো "
                        : "Schedule a meeting tomorrow at 3pm with ",
                  },
                  {
                    icon: Facebook,
                    label: language === "bn" ? "Facebook এ পোস্ট করো" : "Post on Facebook Page",
                    prompt:
                      language === "bn"
                        ? "Facebook Page এ পোস্ট করো: "
                        : "Post on my Facebook Page: ",
                  },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setInput(item.prompt);
                      inputRef.current?.focus();
                    }}
                    className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-border/50 bg-card/60 hover:bg-accent/50 hover:border-border/70 transition-all duration-200 shadow-sm"
                  >
                    <item.icon className="w-6 h-6 text-sky-500" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id}>
                <AgentMessage message={msg} language={language} />
                {msg.role === "assistant" && !msg.isStreaming && msg.content.length > 100 && (
                  <div className="ml-11">
                    <SmartClipboard content={msg.content} language={language} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input - main-chat style */}
      <div className="p-3 sm:p-4 border-t border-border/30 backdrop-blur-md bg-background/60">
        <div className="w-full max-w-3xl mx-auto px-1 sm:px-2 relative">
          {/* hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={docInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Attachment chips */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-2"
              >
                {attachments.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border/40 text-xs"
                  >
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-[140px]">{a.name}</span>
                    <button
                      onClick={() => setAttachments((p) => p.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "relative flex flex-col rounded-3xl border transition-all duration-200",
              "bg-muted/40 border-border/50",
              "focus-within:border-primary/40 focus-within:bg-muted/60",
              "shadow-sm px-2 sm:px-3 pt-1 pb-1.5"
            )}
          >
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "bn" ? "আপনার টাস্ক লিখুন..." : "Describe your task..."}
              className={cn(
                "w-full px-2 sm:px-3 pt-2.5 pb-1 bg-transparent resize-none focus:outline-none",
                "text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground/70",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              minRows={1}
              maxRows={6}
              disabled={agentStatus !== "idle"}
            />

            {/* Bottom controls */}
            <div className="flex items-center justify-between gap-1 mt-1">
              {/* Left cluster */}
              <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-none">
                {/* Plus / attach */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllPopovers();
                      setShowAttachMenu((v) => !v);
                    }}
                    className={cn(
                      "p-2 rounded-full transition-all duration-200 shrink-0",
                      "hover:bg-background text-muted-foreground hover:text-foreground",
                      showAttachMenu && "bg-background text-foreground"
                    )}
                    aria-label="Attach"
                  >
                    <Plus
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        showAttachMenu && "rotate-45"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {showAttachMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowAttachMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden z-[100] bg-popover border border-border backdrop-blur-xl min-w-[220px]"
                        >
                          <div className="px-4 py-2 border-b border-border bg-muted/50">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-muted-foreground">
                                {language === "bn" ? "সর্বোচ্চ ফাইল সাইজ" : "Max file size"}
                              </span>
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
                                15 MB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-accent"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm whitespace-nowrap">
                              {language === "bn" ? "ছবি আপলোড করুন" : "Upload Image"}
                            </span>
                          </button>
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-accent"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Camera className="w-4 h-4 text-purple-500" />
                            </div>
                            <span className="text-sm whitespace-nowrap">
                              {language === "bn" ? "ক্যামেরা থেকে ছবি" : "Take Photo"}
                            </span>
                          </button>
                          <button
                            onClick={() => docInputRef.current?.click()}
                            className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-accent"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                              <Paperclip className="w-4 h-4 text-green-500" />
                            </div>
                            <span className="text-sm whitespace-nowrap">
                              {language === "bn" ? "ফাইল সংযুক্ত করুন" : "Attach File"}
                            </span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tools pill (placeholder, agent-specific) */}
                <button
                  onClick={() => toast.message(language === "bn" ? "শীঘ্রই আসছে" : "Agent tools coming soon")}
                  className={cn(
                    "flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 shrink-0",
                    "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background",
                    "text-sm font-medium whitespace-nowrap"
                  )}
                  aria-label="Tools"
                >
                  <Settings2 className="w-4 h-4 shrink-0" />
                  <span>{language === "bn" ? "টুলস" : "Tools"}</span>
                </button>

                {/* Model selector pill */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => {
                      closeAllPopovers();
                      setShowModelPicker((v) => !v);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full transition-all duration-200",
                      "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background",
                      "text-sm font-medium whitespace-nowrap",
                      showModelPicker && "bg-background text-foreground border-border"
                    )}
                  >
                    <Cpu className="w-4 h-4 text-primary" />
                    <span>{currentModel.short}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {showModelPicker && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowModelPicker(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-border bg-popover backdrop-blur-xl shadow-2xl z-[100] overflow-hidden"
                        >
                          {MODELS.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setSelectedModel(m.id);
                                setShowModelPicker(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2.5 text-xs hover:bg-accent transition-colors",
                                selectedModel === m.id && "bg-primary/10 text-primary"
                              )}
                            >
                              <span className="font-medium">{m.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Integrations pill */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => {
                      closeAllPopovers();
                      setShowIntegrations((v) => !v);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full transition-all duration-200",
                      "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background",
                      "text-sm font-medium whitespace-nowrap",
                      showIntegrations && "bg-background text-foreground border-border"
                    )}
                    aria-label="Integrations"
                  >
                    <Plug className="w-4 h-4 text-cyan-500" />
                    <span>{language === "bn" ? "অ্যাপস" : "Apps"}</span>
                    {connectedCount > 0 && (
                      <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-500">
                        {connectedCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showIntegrations && (
                      <>
                        <div
                          className={cn(
                            "fixed inset-0 z-40",
                            isMobile && "bg-black/40 backdrop-blur-sm"
                          )}
                          onClick={() => setShowIntegrations(false)}
                        />
                        <motion.div
                          initial={
                            isMobile
                              ? { opacity: 0, y: "100%" }
                              : { opacity: 0, y: 5 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            isMobile
                              ? { opacity: 0, y: "100%" }
                              : { opacity: 0, y: 5 }
                          }
                          transition={{ type: "spring", damping: 28, stiffness: 320 }}
                          className={cn(
                            "z-[100] bg-popover backdrop-blur-xl shadow-2xl overflow-hidden border border-border",
                            isMobile
                              ? "fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[80vh] flex flex-col"
                              : "absolute bottom-full left-0 mb-2 w-80 rounded-2xl max-h-[60vh] flex flex-col"
                          )}
                        >
                          {isMobile && (
                            <div className="flex justify-center py-2 shrink-0">
                              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                            </div>
                          )}
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 shrink-0">
                            <div className="flex items-center gap-2">
                              <Plug className="w-4 h-4 text-cyan-500" />
                              <h3 className="text-sm font-semibold">
                                {language === "bn" ? "ইন্টিগ্রেশন" : "Integrations"}
                              </h3>
                            </div>
                            <button
                              onClick={() => {
                                setShowIntegrations(false);
                                navigate("/agent/integrations");
                              }}
                              className="text-[11px] text-cyan-500 hover:text-cyan-400 inline-flex items-center gap-1"
                            >
                              <Settings2 className="w-3 h-3" /> Manage
                            </button>
                          </div>

                          <div className="px-3 pt-2 pb-1 shrink-0">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                              <input
                                value={intQuery}
                                onChange={(e) => setIntQuery(e.target.value)}
                                placeholder={language === "bn" ? "অ্যাপ খুঁজুন…" : "Search apps…"}
                                className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-muted/40 border border-border/40 outline-none focus:border-cyan-500/40"
                              />
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
                            {filteredIntegrations.map((p) => {
                              const Icon = p.icon;
                              const conn = getByProvider(p.id);
                              const connected = !!conn;
                              const busy = busyId === p.id;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => handleToggleIntegration(p.id, connected)}
                                  disabled={busy}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all text-xs disabled:opacity-60",
                                    connected
                                      ? "border-cyan-500/30 bg-cyan-500/5 text-foreground"
                                      : "border-border/30 bg-card/30 text-muted-foreground hover:bg-muted/30"
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "w-4 h-4 shrink-0",
                                      connected ? "text-cyan-400" : p.accent
                                    )}
                                  />
                                  <span className="flex-1 font-medium truncate">{p.label}</span>
                                  {busy ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : connected ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <Plug className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              );
                            })}

                            {customItems.length > 0 && (
                              <div className="pt-2 mt-2 border-t border-border/40">
                                <h5 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1 mb-1.5">
                                  {language === "bn" ? "কাস্টম" : "Custom"}
                                </h5>
                                {customItems.map((c) => (
                                  <div
                                    key={c.id}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs"
                                  >
                                    <Globe2 className="w-4 h-4 shrink-0 text-cyan-400" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-foreground truncate">{c.name}</div>
                                      <div className="text-[10px] text-muted-foreground truncate">
                                        {c.base_url}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mic - left side, agent-specific */}
                <button
                  onClick={() =>
                    toast.message(language === "bn" ? "ভয়েস মোড শীঘ্রই" : "Voice mode coming soon")
                  }
                  className={cn(
                    "p-2 rounded-full transition-all duration-200 shrink-0 relative",
                    "hover:bg-background text-muted-foreground hover:text-primary"
                  )}
                  title={language === "bn" ? "ভয়েস মোড" : "Voice mode"}
                  aria-label="Voice"
                >
                  <Mic className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                </button>
              </div>

              {/* Right cluster: send */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || agentStatus !== "idle"}
                  className={cn(
                    "p-2 sm:p-2.5 rounded-full transition-all duration-200",
                    input.trim()
                      ? "bg-foreground text-background hover:opacity-90"
                      : "bg-muted text-muted-foreground opacity-50",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center mt-2">
            {language === "bn"
              ? "Sorix Agent ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।"
              : "Sorix Agent can make mistakes. Verify important information."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
