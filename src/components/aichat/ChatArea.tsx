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
    // FIX 1: Changed h-full to h-[100dvh] for mobile address bar handling
    <div className="flex-1 flex flex-col h-[100dvh] min-w-0 bg-background">
      {/* Header with Model Selector - Desktop only (Your original code kept exactly same) */}
      <header className="hidden md:flex items-center justify-center py-3 md:py-4 border-b border-border/50 px-4 shrink-0">
        <div className="flex items-center gap-2">
          <ModelSelector />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
        {/* FIX 2: Wrapped content in a specific scrollable div */}
        <div className="flex-1 overflow-y-auto w-full">
          {showEmptyState ? <EmptyState userName={user.name.split(" ")[0]} /> : <MessageList />}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive shrink-0">
          {error}
        </div>
      )}

      {/* Input - Full width on mobile */}
      {/* FIX 3: Added shrink-0 and z-20 to keep it fixed at bottom */}
      <div className="shrink-0 bg-background z-20 border-t border-border/40 sm:border-t-0">
        <div className="pb-2 sm:pb-3 md:pb-4 pt-2 sm:pt-0">
          <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatArea;
