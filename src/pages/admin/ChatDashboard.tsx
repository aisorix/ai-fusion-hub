import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminChat } from '@/hooks/useAdminChat';
import { ConversationList } from '@/components/admin/ConversationList';
import { ChatWindow } from '@/components/admin/ChatWindow';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, MessageSquare, Users, CheckCircle } from 'lucide-react';

const ChatDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    sending,
    isEmployee,
    setSelectedConversation,
    sendMessage,
    updateConversationStatus,
    refreshConversations
  } = useAdminChat();

  // Redirect if not authenticated or not an employee
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Show access denied if not employee
  if (!isEmployee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the support dashboard. 
            This area is only for employees and administrators.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const waitingCount = conversations.filter(c => c.status === 'waiting').length;
  const activeCount = conversations.filter(c => c.status === 'active').length;
  const resolvedCount = conversations.filter(c => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold">Support Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-accent-foreground" />
                <span className="text-muted-foreground">Waiting:</span>
                <span className="font-medium">{waitingCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Active:</span>
                <span className="font-medium">{activeCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Resolved:</span>
                <span className="font-medium">{resolvedCount}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshConversations}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Conversation List - Sidebar */}
        <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r bg-muted/20 flex-shrink-0 flex-col`}>
          <div className="p-3 border-b">
            <h2 className="text-sm font-medium text-muted-foreground">
              Conversations ({conversations.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id || null}
              onSelect={setSelectedConversation}
              loading={loading}
            />
          </div>
        </div>

        {/* Chat Window - Main Area */}
        <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0`}>
          {selectedConversation && (
            <button
              onClick={() => setSelectedConversation(null)}
              className="md:hidden flex items-center gap-2 px-3 py-2 border-b text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to conversations
            </button>
          )}
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            sending={sending}
            onSend={sendMessage}
            onUpdateStatus={updateConversationStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
