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
    // FIX 1: MOBILE KEYBOARD FIX
    // - Mobile: 'fixed inset-0 z-50' forces the app to resize when the keyboard opens.
    // - Desktop: 'md:static md:h-[100dvh]' keeps the layout you liked for PC/Tab.
    <div className="flex flex-col w-full bg-background overflow-hidden fixed inset-0 z-50 md:static md:z-auto md:h-[100dvh]">
      {/* Header */}
      <header className="hidden md:flex items-center justify-center py-3 md:py-4 border-b border-border/50 px-4 shrink-0">
        <div className="flex items-center gap-2">
          <ModelSelector />
        </div>
      </header>

      {/* Main Content Area */}
      {/* Container is rigid (overflow-hidden) so MessageList handles scrolling */}
      <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden relative">
        {showEmptyState ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyState userName={user.name.split(" ")[0]} />
          </div>
        ) : (
          /* MessageList handles the scrolling internally */
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
      {/* shrink-0 ensures this never collapses when keyboard opens */}
      <div className="shrink-0 bg-background border-t border-border/40 z-20">
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
