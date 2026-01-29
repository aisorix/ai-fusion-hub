import React, { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAIChat } from '@/hooks/useAIChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import EmptyState from './EmptyState';
import SettingsModal from './SettingsModal';
import { cn } from '@/lib/utils';
import { Settings, LogOut, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ModelIcon } from './ModelIcons';

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
  const messages = chats.find(c => c.id === activeChatId)?.messages || [];
  const isPaidUser = user.plan !== 'free';
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  
  const handleSend = async (content: string) => {
    await sendMessage(content);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const showEmptyState = !activeChatId || messages.length === 0;
  
  return (
    <div className={cn(
      "flex-1 flex flex-col h-full min-w-0",
      isPaidUser 
        ? "bg-gradient-to-br from-background via-background to-primary/5" 
        : "bg-background"
    )}>
      {/* Header with Model Selector - Enhanced for paid users */}
      <header className={cn(
        "flex items-center justify-center py-2 sm:py-3 md:py-4 border-b px-2 sm:px-4 relative",
        isPaidUser 
          ? "border-primary/20 bg-gradient-to-r from-transparent via-primary/5 to-transparent" 
          : "border-border/50"
      )}>
        {/* Premium glow effect */}
        {isPaidUser && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50" />
        )}
        <div className="relative z-10 flex items-center gap-2">
          <ModelSelector />
          {isPaidUser && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <Crown className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-medium text-yellow-600 dark:text-yellow-400">
                {user.plan.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {showEmptyState ? (
          <EmptyState userName={user.name.split(' ')[0]} />
        ) : (
          <MessageList />
        )}
      </div>
      
      {/* Error Display - Enhanced styling */}
      {error && (
        <div className={cn(
          "mx-4 mb-2 px-4 py-2 text-sm rounded-lg",
          isPaidUser 
            ? "bg-destructive/15 text-destructive border border-destructive/30" 
            : "bg-destructive/10 text-destructive"
        )}>
          {error}
        </div>
      )}
      
      {/* Input - Enhanced for paid users */}
      <div className={cn(
        "pb-2 sm:pb-3 md:pb-4 shrink-0",
        isPaidUser && "bg-gradient-to-t from-primary/5 to-transparent pt-2"
      )}>
        <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} />
      </div>
      
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatArea;
