import React, { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAIChat } from '@/hooks/useAIChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import EmptyState from './EmptyState';
import SettingsModal from './SettingsModal';
import { cn } from '@/lib/utils';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlanBadge, type PlanType } from './PlanIcons';

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
    <div className="flex-1 flex flex-col h-full min-w-0 bg-background">
      {/* Header with Model Selector */}
      <header className="flex items-center justify-center py-2 sm:py-3 md:py-4 border-b border-border/50 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <ModelSelector />
          {isPaidUser && (
            <PlanBadge plan={user.plan as PlanType} />
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
      
      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}
      
      {/* Input */}
      <div className="pb-2 sm:pb-3 md:pb-4 shrink-0">
        <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} />
      </div>
      
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatArea;
