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
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 flex items-center justify-center mb-4"
              >
                <Bot className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-1">
                {language === "bn" ? "Sorix Agent" : "Sorix Agent"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {language === "bn"
                  ? "আমি আপনার AI এজেন্ট। জটিল কাজ দিন, আমি ধাপে ধাপে সম্পন্ন করব।"
                  : "I'm your AI agent. Give me complex tasks and I'll complete them step by step."}
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {[
                  language === "bn" ? "আমার প্রজেক্ট নিয়ে একটি রিপোর্ট তৈরি করো" : "Write a detailed report about my project",
                  language === "bn" ? "সোশ্যাল মিডিয়ার জন্য কন্টেন্ট তৈরি করো" : "Create social media content for my brand",
                  language === "bn" ? "ডেটা এনালাইসিস করো এবং সামারি দাও" : "Analyze this data and summarize findings",
                  language === "bn" ? "ইমেইল ড্রাফট তৈরি করো" : "Draft a professional email response",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-left text-xs px-3 py-2.5 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
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
      <div className="p-3 border-t border-border/30 backdrop-blur-sm">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "bn" ? "আপনার টাস্ক লিখুন..." : "Type your task..."}
              className="w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur-sm"
              minRows={1}
              maxRows={5}
              disabled={agentStatus !== "idle"}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || agentStatus !== "idle"}
              className="absolute right-1.5 bottom-1.5 h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
