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
    // FIX 1: Mobile e 'fixed inset-0' & 'h-[100dvh]' dewa hoyeche jate keyboard/address bar ashle layout na nare.
    // Desktop (md) e 'static' & 'h-full' rakha hoyeche jate ager motoi thake.
    <div className="fixed inset-0 z-0 flex flex-col h-[100dvh] bg-background md:static md:inset-auto md:h-full md:z-auto">
      {/* Header with Model Selector - Desktop only (Your code remains same) */}
      <header className="hidden md:flex items-center justify-center py-3 md:py-4 border-b border-border/50 px-4 shrink-0">
        <div className="flex items-center gap-2">
          <ModelSelector />
        </div>
      </header>

      {/* Main Content (Scrollable Area) */}
      {/* FIX 2: 'flex-1' & 'overflow-y-auto' ensures ONLY this part scrolls */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full scroll-smooth">
        {showEmptyState ? (
          <EmptyState userName={user.name.split(" ")[0]} />
        ) : (
          <div className="flex flex-col min-h-full">
            <MessageList />
            {/* Ektu space dewa holo jate last message input box er niche chapa na pore */}
            <div className="h-4 shrink-0" />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive shrink-0">
          {error}
        </div>
      )}

      {/* Input - Fixed at Bottom */}
      {/* FIX 3: 'shrink-0' ensures input box never disappears when chat is long */}
      <div className="shrink-0 bg-background z-20 border-t border-border/40 md:border-t-0 w-full">
        <div className="pb-2 sm:pb-3 md:pb-4 pt-2 md:pt-0">
          <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatArea;
