import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Cpu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoWorkStore, type AgentStatus } from "@/stores/coworkStore";
import { useCoWorkAgent } from "@/hooks/useCoWorkAgent";
import AgentMessage from "./AgentMessage";
import SmartClipboard from "./SmartClipboard";
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
  idle: { color: "bg-emerald-500", label: "Ready", labelBn: "প্রস্তুত" },
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/30 bg-background/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-teal-500/15 flex items-center justify-center border border-cyan-500/10">
              <Bot className="w-[18px] h-[18px] text-cyan-500" />
            </div>
            <span className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background", status.color)} />
          </div>
          <div>
            <h2 className="text-sm font-semibold leading-tight">{language === "bn" ? "কমান্ড সেন্টার" : "Command Center"}</h2>
            <p className="text-[10px] text-muted-foreground leading-tight">{language === "bn" ? status.labelBn : status.label}</p>
          </div>
        </div>

        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-card/60 hover:bg-muted/60 transition-all border border-border/40 shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>{currentModel.short}</span>
            <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", showModelPicker && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showModelPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border/40 bg-popover/95 backdrop-blur-xl shadow-xl z-50 p-1.5"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 text-xs rounded-xl transition-all font-medium",
                        selectedModel === m.id
                          ? "bg-cyan-500/10 text-cyan-500"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4">
              {/* Hero */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="relative mb-7"
              >
                <div className="w-[88px] h-[88px] rounded-[28px] bg-gradient-to-br from-cyan-500/12 to-teal-500/12 flex items-center justify-center border border-cyan-500/10">
                  <Bot className="w-11 h-11 text-cyan-500/80" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-background shadow-sm shadow-emerald-500/20"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-2xl font-bold tracking-tight">Sorix Agent</h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed mx-auto">
                  {language === "bn"
                    ? "আপনার ব্যক্তিগত AI এজেন্ট। জটিল কাজ দিন, ধাপে ধাপে নির্ভুলভাবে সম্পন্ন করব।"
                    : "Your personal AI agent. Delegate complex tasks and I'll handle them step by step with precision."}
                </p>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl"
              >
                {([
                  { icon: "📝", text: language === "bn" ? "আমার প্রজেক্ট নিয়ে একটি রিপোর্ট তৈরি করো" : "Write a detailed report about my project" },
                  { icon: "📱", text: language === "bn" ? "সোশ্যাল মিডিয়ার জন্য কন্টেন্ট তৈরি করো" : "Create social media content for my brand" },
                  { icon: "📊", text: language === "bn" ? "ডেটা এনালাইসিস করো এবং সামারি দাও" : "Analyze this data and summarize findings" },
                  { icon: "✉️", text: language === "bn" ? "ইমেইল ড্রাফট তৈরি করো" : "Draft a professional email response" },
                ]).map((suggestion, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput(suggestion.text)}
                    className="group flex items-start gap-3 text-left text-[13px] px-4 py-4 rounded-2xl border border-border/40 bg-card/50 hover:bg-accent/40 hover:border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span className="text-lg mt-0.5 shrink-0">{suggestion.icon}</span>
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

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-border/30 bg-background/70 backdrop-blur-md shrink-0">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "bn" ? "আপনার টাস্ক লিখুন..." : "Describe your task..."}
              className="w-full resize-none rounded-2xl border border-border/40 bg-card/50 px-4 py-3.5 pr-14 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 focus:border-cyan-500/30 transition-all shadow-sm"
              minRows={1}
              maxRows={5}
              disabled={agentStatus !== "idle"}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || agentStatus !== "idle"}
              className="absolute right-2 bottom-2 h-9 w-9 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-md shadow-cyan-500/15 disabled:opacity-25 transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/30 text-center mt-2.5">
          {language === "bn" ? "Sorix Agent ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।" : "Sorix Agent can make mistakes. Verify important information."}
        </p>
      </div>
    </div>
  );
};

export default CommandCenter;
