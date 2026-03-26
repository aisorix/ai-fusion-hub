import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Cpu, ChevronDown, Code2, MessageSquare, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoWorkStore, type AgentStatus } from "@/stores/coworkStore";
import { useCoWorkAgent } from "@/hooks/useCoWorkAgent";
import AgentMessage from "./AgentMessage";
import SmartClipboard from "./SmartClipboard";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";

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
  const [input, setInput] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const { messages, agentStatus, selectedModel, setSelectedModel } = useCoWorkStore();
  const { sendMessage } = useCoWorkAgent();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || agentStatus !== "idle") return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const status = statusConfig[agentStatus];
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="flex flex-col h-full bg-background/30">
      {/* Header - compact with model selector */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <span className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-background", status.color)} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{language === "bn" ? "কমান্ড সেন্টার" : "Command Center"}</h2>
            <p className="text-[10px] text-muted-foreground">{language === "bn" ? status.labelBn : status.label}</p>
          </div>
        </div>

        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-muted/50 hover:bg-muted transition-colors border border-border/30"
          >
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>{currentModel.short}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          <AnimatePresence>
            {showModelPicker && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border/50 bg-popover/95 backdrop-blur-xl shadow-xl z-50"
              >
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 text-xs hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                      selectedModel === m.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="font-medium">{m.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              {/* Avatar Circle */}
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

              {/* Greeting */}
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
                {language === "bn" ? "আজ আমি কীভাবে সাহায্য করতে পারি?" : "How can I help you today?"}
              </motion.p>

              {/* Model Badge */}
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

              {/* 2x2 Suggestion Grid */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3 w-full max-w-sm"
              >
                {([
                  { icon: Code2, label: language === "bn" ? "কোড লিখুন" : "Write code", color: "text-sky-500" },
                  { icon: MessageSquare, label: language === "bn" ? "ব্যাখ্যা করুন" : "Explain", color: "text-sky-500" },
                  { icon: Zap, label: language === "bn" ? "ব্রেইনস্টর্ম" : "Brainstorm", color: "text-sky-500" },
                  { icon: Sparkles, label: language === "bn" ? "তৈরি করুন" : "Create", color: "text-sky-500" },
                ]).map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setInput(item.label)}
                    className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-border/50 bg-card/60 hover:bg-accent/50 hover:border-border/70 transition-all duration-200 shadow-sm"
                  >
                    <item.icon className={cn("w-6 h-6", item.color)} />
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

      {/* Input - ChatGPT style matching main chat */}
      <div className="p-3 sm:p-4 border-t border-border/30 backdrop-blur-md bg-background/60">
        <div className="w-full max-w-3xl mx-auto">
          <div className={cn(
            "relative flex items-end rounded-2xl sm:rounded-3xl border transition-all duration-200",
            "bg-muted/40 border-border/50",
            "focus-within:border-primary/40 focus-within:bg-muted/60",
            "shadow-sm"
          )}>
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "bn" ? "আপনার টাস্ক লিখুন..." : "Describe your task..."}
              className={cn(
                "flex-1 py-3 px-4 bg-transparent resize-none focus:outline-none",
                "text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground/70",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              minRows={1}
              maxRows={5}
              disabled={agentStatus !== "idle"}
            />
            <div className="flex items-center gap-0.5 p-1">
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
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center mt-2">
            {language === "bn" ? "Sorix Agent ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।" : "Sorix Agent can make mistakes. Verify important information."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
