import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Cpu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoWorkStore, type AgentStatus } from "@/stores/coworkStore";
import { useCoWorkAgent } from "@/hooks/useCoWorkAgent";
import AgentMessage from "./AgentMessage";
import SmartClipboard from "./SmartClipboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
              <Bot className="w-4.5 h-4.5 text-cyan-400" />
            </div>
            <span className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background", status.color)} />
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
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
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
                      selectedModel === m.id && "bg-cyan-500/10 text-cyan-400"
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
              {/* Animated Hero Icon */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative mb-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/15 to-teal-500/15 flex items-center justify-center border border-cyan-500/10 shadow-lg shadow-cyan-500/5">
                  <Bot className="w-10 h-10 text-cyan-500" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-background"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="text-xl font-bold mb-2 tracking-tight">
                  {language === "bn" ? "Sorix Agent" : "Sorix Agent"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  {language === "bn"
                    ? "আমি আপনার AI এজেন্ট। জটিল কাজ দিন, আমি ধাপে ধাপে সম্পন্ন করব।"
                    : "Your personal AI agent. Delegate complex tasks and I'll handle them step by step with precision."}
                </p>
              </motion.div>

              {/* Suggestion Cards */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg"
              >
                {([
                  { icon: "📝", text: language === "bn" ? "আমার প্রজেক্ট নিয়ে একটি রিপোর্ট তৈরি করো" : "Write a detailed report about my project" },
                  { icon: "📱", text: language === "bn" ? "সোশ্যাল মিডিয়ার জন্য কন্টেন্ট তৈরি করো" : "Create social media content for my brand" },
                  { icon: "📊", text: language === "bn" ? "ডেটা এনালাইসিস করো এবং সামারি দাও" : "Analyze this data and summarize findings" },
                  { icon: "✉️", text: language === "bn" ? "ইমেইল ড্রাফট তৈরি করো" : "Draft a professional email response" },
                ]).map((suggestion, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput(suggestion.text)}
                    className="group flex items-start gap-3 text-left text-sm px-4 py-3.5 rounded-2xl border border-border/40 bg-card/50 hover:bg-accent/50 hover:border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span className="text-base mt-0.5 shrink-0">{suggestion.icon}</span>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                      {suggestion.text}
                    </span>
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
