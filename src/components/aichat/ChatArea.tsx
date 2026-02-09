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
    // FIX 1: 'h-[100dvh]' ব্যবহার করা হয়েছে। এটি মোবাইলের অ্যাড্রেস বার সহ পুরো হাইট ক্যালকুলেট করে।
    // 'flex flex-col' নিশ্চিত করে যে ইনপুট বক্স সবসময় নিচে থাকবে।
    <div className="flex flex-col h-[100dvh] w-full bg-background">
      {/* Header - (NO CHANGE HERE as requested) */}
      <header className="hidden md:flex items-center justify-center py-3 md:py-4 border-b border-border/50 px-4 shrink-0">
        <div className="flex items-center gap-2">
          <ModelSelector />
        </div>
      </header>

      {/* Main Content (Scrollable Area) */}
      {/* FIX 2: 'flex-1' মানে এটি বাকি জায়গা নেবে। 'overflow-y-auto' মানে শুধু এই অংশটুকু স্ক্রল হবে। */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {showEmptyState ? (
          <EmptyState userName={user.name.split(" ")[0]} />
        ) : (
          <div className="flex flex-col min-h-full">
            <MessageList />
            {/* মেসেজ লিস্টের নিচে একটু ফাঁকা জায়গা, যাতে ইনপুট বক্সের সাথে লেগে না যায় */}
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

      {/* Input - FIXED POSITION Logic */}
      {/* FIX 3: 'shrink-0' এবং 'z-20' দেওয়া হয়েছে। এটি ফ্লেক্স কন্টেইনারের একদম নিচে ফিক্সড থাকবে। */}
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
