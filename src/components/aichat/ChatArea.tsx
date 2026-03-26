import React, { useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAIChat } from "@/hooks/useAIChat";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ModelSelector from "./ModelSelector";
import EmptyState from "./EmptyState";
import SettingsModal from "./SettingsModal";
import UpgradePlanModal from "./UpgradePlanModal";
import { cn } from "@/lib/utils";
import { Settings, LogOut, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ModelIcon } from "./ModelIcons";
interface ChatAreaProps {
  onOpenVoiceMode?: () => void;
}

const ChatArea = ({ onOpenVoiceMode }: ChatAreaProps) => {
  const { activeChatId, chats, user, selectedModel, models } = useChatStore();
  const { sendMessage, isStreaming, error, stopStreaming } = useAIChat();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // Derive messages from active chat
  const messages = chats.find((c) => c.id === activeChatId)?.messages || [];
  const isPaidUser = user.plan !== "free";
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];
  const handleSend = async (content: string) => {
    // Check token limit before sending
    if (user.tokensUsed >= user.tokensLimit && user.tokensLimit > 0) {
      setShowUpgradeModal(true);
      return;
    }
    await sendMessage(content);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  const showEmptyState = !activeChatId || messages.length === 0;
  return (
    // FIX 1: Added 'overflow-hidden'. This forces the app to NEVER scroll the whole page, keeping the input fixed.

    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden">
      {/* Header */}
      <header className="hidden md:flex items-center justify-between py-3 md:py-4 border-b border-border/50 px-4 shrink-0">
        <div className="w-10" />
        <div className="flex items-center gap-2">
          <ModelSelector />
        </div>
        <button
          onClick={() => navigate("/cowork")}
          title="Sorix Agent"
          className="h-11 w-11 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content Area */}

      {/* FIX 2: Removed 'overflow-y-auto'. This container is now just a layout wrapper (Frame).

          It forces the child (MessageList) to fit exactly in the remaining space. */}
      <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden relative">
        {showEmptyState ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyState userName={user.name.split(" ")[0]} />
          </div>
        ) : (
          /* MessageList handles the scrolling internally now */
          <MessageList />
        )}
      </div>
      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive shrink-0">
          {error}
        </div>
      )}

      {/* Input - FIXED POSITION Logic */}

      {/* FIX 3: 'shrink-0' ensures this never collapses. z-20 keeps it above messages. */}

      <div className="shrink-0 bg-background border-t border-border/40 z-20">
        <div className="pb-2 sm:pb-3 md:pb-4 pt-2">
          <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} onStop={stopStreaming} />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      {/* Upgrade Plan Modal - shown when token limit reached */}
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
};

export default ChatArea;
