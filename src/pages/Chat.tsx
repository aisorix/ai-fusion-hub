import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChatStore } from '@/stores/chatStore';
import { ChatSidebar } from '@/components/ai-chat/ChatSidebar';
import { ChatArea } from '@/components/ai-chat/ChatArea';
import { SettingsModal } from '@/components/ai-chat/SettingsModal';
import { cn } from '@/lib/utils';

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, sidebarOpen, sidebarCollapsed } = useChatStore();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={cn('h-screen flex overflow-hidden bg-background', theme)}>
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <main
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarOpen && !sidebarCollapsed ? 'md:ml-64' : sidebarOpen && sidebarCollapsed ? 'md:ml-16' : ''
        )}
      >
        <ChatArea />
      </main>

      {/* Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export default Chat;
