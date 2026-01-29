// AI Chat Page - Main chat interface
// Protected route that requires authentication

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/chatStore';
import ChatArea from '@/components/aichat/ChatArea';
import ChatSidebar from '@/components/aichat/ChatSidebar';
import MobileHeader from '@/components/aichat/MobileHeader';
import MobileSidebar from '@/components/aichat/MobileSidebar';
import ShareModal from '@/components/aichat/ShareModal';
import MultiWindowChat from '@/components/aichat/MultiWindowChat';
import { LiveVoiceOverlay } from '@/components/voice';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: loading, isAuthenticated } = useAuth();
  const { theme, viewMode, createNewChat, sidebarOpen } = useChatStore();
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleNewChat = () => {
    createNewChat();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className={cn(
      'flex h-screen overflow-hidden transition-colors duration-200',
      'bg-background text-foreground'
    )}>
      <Toaster
        position="top-center"
        toastOptions={{
          className: cn(
            'bg-popover text-popover-foreground border border-border',
            'shadow-lg backdrop-blur-xl'
          )
        }}
      />
      
      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && sidebarOpen && (
        <ChatSidebar onNewChat={handleNewChat} />
      )}

      {/* Mobile Sidebar - Sheet component */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onNewChat={handleNewChat}
      />
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <MobileHeader
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        {viewMode === 'multi' ? (
          <MultiWindowChat />
        ) : (
          <ChatArea onOpenVoiceMode={() => setShowVoiceMode(true)} />
        )}
      </main>
      
      {/* Share Modal */}
      <ShareModal />

      {/* Voice Mode Overlay */}
      <LiveVoiceOverlay isOpen={showVoiceMode} onClose={() => setShowVoiceMode(false)} />
    </div>
  );
};

export default ChatPage;
