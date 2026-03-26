import React from "react";
import { motion } from "framer-motion";
import { Bot, User, Wrench, Copy, Check } from "lucide-react";
import type { CoWorkMessage } from "@/stores/coworkStore";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface AgentMessageProps {
  message: CoWorkMessage;
  language: string;
}

const AgentMessage: React.FC<AgentMessageProps> = ({ message, language }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser
            ? "bg-primary/20 text-primary"
            : "bg-gradient-to-br from-cyan-500/20 to-teal-500/20 text-cyan-400"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className={cn("max-w-[80%] space-y-2", isUser ? "items-end" : "items-start")}>
        {/* Tool calls indicator */}
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {message.tool_calls.map((tool, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  tool.status === "running"
                    ? "bg-cyan-500/10 text-cyan-400 animate-pulse"
                    : tool.status === "done"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                )}
              >
                <Wrench className="w-3 h-3" />
                {tool.name}
              </span>
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted/50 backdrop-blur-sm border border-border/50 rounded-tl-sm"
          )}
        >
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs">{language === "bn" ? "চিন্তা করছে..." : "Thinking..."}</span>
            </div>
          ) : isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isUser && message.content && !message.isStreaming && (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {message.model && (
              <span className="text-[10px] text-muted-foreground/60">{message.model.split("/").pop()}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AgentMessage;
