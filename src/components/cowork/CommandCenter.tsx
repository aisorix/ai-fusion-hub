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
  LayoutGrid,
  ChevronRight,
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
import { useConnections } from "@/hooks/useConnections";
import { useCustomIntegrations } from "@/hooks/useCustomIntegrations";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import ToolsMenu from "@/components/aichat/ToolsMenu";
import { useAutoFocusInput } from "@/hooks/useAutoFocusInput";

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
  const [attachments, setAttachments] = useState<{ name: string; size: number }[]>([]);

  const { messages, agentStatus, selectedModel, setSelectedModel } = useCoWorkStore();
  const { sendMessage } = useCoWorkAgent();
  const { connections } = useConnections();
  const { items: customItems } = useCustomIntegrations();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useAutoFocusInput(
    inputRef,
    [attachments.length, showAttachMenu, showToolsMenu, showModelPicker],
    agentStatus !== "idle",
    true,
  );

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
  const connectedCount = connections.filter((c) => c.status === "connected").length + customItems.length;

  const closeAllPopovers = () => {
    setShowAttachMenu(false);
    setShowModelPicker(false);
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
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
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
                className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-[20rem] sm:max-w-sm"
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
                    className="flex flex-col items-center gap-2 py-3.5 px-2 sm:py-5 sm:px-3 rounded-2xl border border-border/50 bg-card/60 hover:bg-accent/50 hover:border-border/70 transition-all duration-200 shadow-sm text-center"
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />
                    <span className="text-[12px] sm:text-sm font-medium text-foreground leading-tight">{item.label}</span>
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
      <div className="shrink-0 p-2 sm:p-4 border-t border-border/30 backdrop-blur-md bg-background/60">
        <div className="w-full max-w-3xl mx-auto sm:px-2 relative">
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
              <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
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

                {/* Tools pill - real Sorix Tools menu */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => {
                      closeAllPopovers();
                      setShowToolsMenu((v) => !v);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 p-2 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-full transition-all duration-200",
                      "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background",
                      "text-sm font-medium whitespace-nowrap",
                      showToolsMenu && "bg-background text-foreground border-border"
                    )}
                    aria-label="Tools"
                  >
                    <Settings2 className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">{language === "bn" ? "টুলস" : "Tools"}</span>
                  </button>
                  <ToolsMenu open={showToolsMenu} onClose={() => setShowToolsMenu(false)} />
                </div>

                {/* Apps pill — opens Connections page */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => navigate("/agent/connections")}
                    className={cn(
                      "flex items-center gap-1.5 p-2 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-full transition-all duration-200",
                      "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background",
                      "text-sm font-medium whitespace-nowrap"
                    )}
                    aria-label="Apps"
                  >
                    <Plug className="w-4 h-4 text-cyan-500" />
                    <span className="hidden sm:inline">{language === "bn" ? "অ্যাপস" : "Apps"}</span>
                    {connectedCount > 0 && (
                      <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-500">
                        {connectedCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Model picker pill */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => {
                      closeAllPopovers();
                      setShowModelPicker((v) => !v);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 p-2 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-full transition-all duration-200",
                      "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background",
                      "text-sm font-medium whitespace-nowrap",
                      showModelPicker && "bg-background text-foreground border-border"
                    )}
                    aria-label="Model"
                  >
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">{currentModel.short}</span>
                    <ChevronDown className="w-3.5 h-3.5 hidden sm:inline" />
                  </button>

                  <AnimatePresence>
                    {showModelPicker && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowModelPicker(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden z-[100] bg-popover border border-border backdrop-blur-xl min-w-[220px]"
                        >
                          {MODELS.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setSelectedModel(m.id);
                                setShowModelPicker(false);
                              }}
                              className={cn(
                                "flex items-center justify-between gap-3 px-4 py-2.5 w-full transition-colors hover:bg-accent text-left",
                                selectedModel === m.id && "bg-accent/60"
                              )}
                            >
                              <span className="text-sm">{m.label}</span>
                              {selectedModel === m.id && (
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right cluster: Mic + Send */}
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || agentStatus !== "idle"}
                  className={cn(
                    "p-2 rounded-full transition-all duration-200",
                    input.trim()
                      ? "text-foreground hover:bg-background"
                      : "text-muted-foreground opacity-50",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center mt-1.5 sm:mt-2 px-2">
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
