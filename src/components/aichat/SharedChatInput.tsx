// Shared Chat Input for Multi-Window Mode
// A simplified input that broadcasts messages to all windows

import React, { useState, useRef, useCallback } from "react";
import { Send, Square, Loader2, Mic } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore, type Attachment, type UserPlan } from "@/stores/chatStore";
import { cn } from "@/lib/utils";

interface SharedChatInputProps {
  onSend?: (content: string, attachments?: Attachment[]) => void;
  onSendToAll?: (content: string) => void;
  onOpenVoiceMode?: () => void;
  isStreaming?: boolean;
  isAnyStreaming?: boolean;
  onStopStreaming?: () => void;
  placeholder?: string;
  language?: string;
  userPlan?: UserPlan;
}

const SharedChatInput = ({
  onSend,
  onSendToAll,
  onOpenVoiceMode,
  isStreaming,
  isAnyStreaming,
  onStopStreaming,
  placeholder = "Ask all models at once...",
  language,
  userPlan,
}: SharedChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const streaming = isStreaming || isAnyStreaming || false;

  const handleSend = useCallback(() => {
    if (streaming || !input.trim()) return;
    if (onSend) {
      onSend(input.trim(), []);
    }
    if (onSendToAll) {
      onSendToAll(input.trim());
    }
    setInput("");
    textareaRef.current?.focus();
  }, [input, streaming, onSend, onSendToAll]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div
        className={cn(
          "relative flex items-end rounded-2xl border transition-all duration-200",
          "bg-card border-border",
          "focus-within:border-primary/50 focus-within:shadow-lg",
          "shadow-lg",
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={streaming}
          minRows={1}
          maxRows={4}
          className={cn(
            "flex-1 py-4 px-4 bg-transparent resize-none focus:outline-none",
            "text-base text-foreground placeholder:text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        />

        {onOpenVoiceMode && (
          <button
            onClick={onOpenVoiceMode}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              "hover:bg-accent text-muted-foreground hover:text-primary",
            )}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={streaming ? onStopStreaming : handleSend}
          disabled={!streaming && !input.trim()}
          className={cn(
            "p-3 m-1.5 rounded-xl transition-all duration-200",
            input.trim() || streaming
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg"
              : "bg-muted text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {streaming ? <Square className="w-5 h-5" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3">
        Compare responses from multiple AI models side by side
      </p>
    </div>
  );
};

export default SharedChatInput;
