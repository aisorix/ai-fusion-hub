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

interface ChatAreaProps {
  onOpenVoiceMode?: () => void;
}

const ChatArea = ({ onOpenVoiceMode }: ChatAreaProps) => {
  const { activeChatId, chats, user } = useChatStore();
  const { sendMessage, isStreaming, error } = useAIChat();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  
  // Derive messages from active chat
  const messages = chats.find(c => c.id === activeChatId)?.messages || [];
  
  const handleSend = async (content: string) => {
    await sendMessage(content);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const showEmptyState = !activeChatId || messages.length === 0;
  
  return (
    <div className="flex-1 flex flex-col h-full bg-background min-w-0">
      {/* Header with Model Selector and Settings */}
      <header className="flex items-center justify-between py-2 sm:py-3 md:py-4 border-b border-border/50 px-2 sm:px-4">
        <div className="w-10" /> {/* Spacer for centering */}
        <ModelSelector />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleSignOut}
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
            )}
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
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
        <div className="mx-4 mb-2 px-4 py-2 bg-destructive/10 text-destructive text-sm rounded-lg">
          {error}
        </div>
      )}
      
      {/* Input */}
      <div className="pb-2 sm:pb-3 md:pb-4 shrink-0">
        <ChatInput onSend={handleSend} disabled={isStreaming} onOpenVoiceMode={onOpenVoiceMode} />
        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
          <span className="text-primary">✦</span>
          Sorix can make mistakes. Check important info.
        </p>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ChatArea;
