// AI Chat Page - Main chat interface
// Protected route that requires authentication

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/chatStore';
import ChatArea from '@/components/aichat/ChatArea';
import ShareModal from '@/components/aichat/ShareModal';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: loading, isAuthenticated } = useAuth();
  const { theme } = useChatStore();
  
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
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatArea />
      </main>
      
      {/* Share Modal */}
      <ShareModal />
    </div>
  );
};

export default ChatPage;
