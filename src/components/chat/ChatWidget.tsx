import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface ChatWidgetRef {
  openChat: () => void;
}

export const ChatWidget = forwardRef<ChatWidgetRef>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    conversation,
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead
  } = useChat();

  // Count unread messages from employees
  const unreadCount = messages.filter(
    m => m.sender_type === 'employee' && !m.is_read
  ).length;

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Mark messages as read when opening
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAsRead();
    }
  }, [isOpen, unreadCount, markAsRead]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  useImperativeHandle(ref, () => ({
    openChat
  }));

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)]',
          'bg-background border rounded-xl shadow-2xl',
          'transition-all duration-300 ease-in-out origin-bottom-right',
          isOpen && !isMinimized
            ? 'scale-100 opacity-100'
            : 'scale-0 opacity-0 pointer-events-none'
        )}
        style={{ height: isMinimized ? 'auto' : '500px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Sorix Support</h3>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online — AI Support
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea 
          className="flex-1 p-4" 
          style={{ height: 'calc(500px - 140px)' }}
          ref={scrollRef}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Hi! I'm your AI Sorix assistant 👋
              </h4>
              <p className="text-sm text-muted-foreground">
                Ask anything — features, pricing, how-tos. I'm here 24/7. For payments, email <span className="text-primary">support@aisorix.com</span>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  content={msg.content}
                  senderType={msg.sender_type}
                  createdAt={msg.created_at}
                  isRead={msg.is_read}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <ChatInput 
          onSend={sendMessage} 
          disabled={sending}
          placeholder="Type your message..."
        />
      </div>

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div
          className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium text-sm">AI Sorix Support</span>
            {unreadCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        size="icon"
        className={cn(
          'fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg',
          'transition-all duration-300 hover:scale-110',
          isOpen && 'rotate-0'
        )}
        onClick={handleToggle}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && !isOpen && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </Button>
    </>
  );
});

ChatWidget.displayName = 'ChatWidget';
