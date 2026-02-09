import React, { useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAIChat } from "@/hooks/useAIChat";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ModelSelector from "./ModelSelector";
import EmptyState from "./EmptyState";
import SettingsModal from "./SettingsModal";
import { cn } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ModelIcon } from "./ModelIcons";

interface ChatAreaProps {
  onOpenVoiceMode?: () => void;
}

const ChatArea = ({ onOpenVoiceMode }: ChatAreaProps) => {
  const { activeChatId, chats, user, selectedModel, models } = useChatStore();
  const { sendMessage, isStreaming, error } = useAIChat();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  // Derive messages from active chat
  const messages = chats.find((c) => c.id === activeChatId)?.messages || [];
  const isPaidUser = user.plan !== "free";
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  const handleSend = async (content: string) => {
    await sendMessage(content);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const showEmptyState = !activeChatId || messages.length === 0;

  return (
    // FIX 1: h-[100dvh] ensures it fits exactly in mobile viewport regardless of address bar
    // FIX 2: fixed inset-0 prevents the layout from being pushed around
    <div className="fixed inset-0 flex flex-col h-[100dvh] bg-background w-full">
      {/* Header with Model Selector - Desktop only (mobile has MobileHeader) */}
      {/* shrink-0 ensures header never collapses */}
      <header className="hidden md:flex items-center justify-center py-3 md:py-4 border-b border-border/50 px-4 shrink-0">
        <div className="flex items-center gap-2">
          <ModelSelector />
        </div>
      </header>

      {/* Main Content Area */}
      {/* FIX 3: Changed 'overflow-hidden' to 'overflow-y-auto'. 
         This makes ONLY the messages scroll, keeping header/footer fixed. */}
      <div className="flex-1 overflow-y-auto w-full min-h-0 scroll-smooth">
        {showEmptyState ? (
          <EmptyState userName={user.name.split(" ")[0]} />
        ) : (
          <div className="flex flex-col min-h-full">
            <MessageList />
            {/* Small spacer at bottom of messages so they don't look cramped against input */}
            <div className="h-2 shrink-0" />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive shrink-0">
          {error}
        </div>
      )}

      {/* Input - FIXED AT BOTTOM */}
      {/* shrink-0 ensures input box never shrinks or gets pushed down */}
      <div className="shrink-0 bg-background border-t border-border/40 z-20 pb-safe-area-bottom">
        <div className="pb-2 sm:pb-3 md:pb-4 pt-2">
          <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatArea;
