import { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { CheckCircle, Clock, MessageCircle, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { type ConversationWithProfile, type ChatMessage as MessageType } from '@/hooks/useAdminChat';

interface ChatWindowProps {
  conversation: ConversationWithProfile | null;
  messages: MessageType[];
  sending: boolean;
  onSend: (message: string) => void;
  onUpdateStatus: (conversationId: string, status: 'active' | 'waiting' | 'resolved' | 'archived') => void;
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Quick reply templates
const quickReplies = [
  "Hello! How can I help you today?",
  "Thank you for reaching out. Let me check that for you.",
  "Is there anything else I can help you with?",
  "I understand your concern. Let me assist you.",
  "Thank you for your patience!"
];

export const ChatWindow = ({
  conversation,
  messages,
  sending,
  onSend,
  onUpdateStatus
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Select a Conversation
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Choose a conversation from the list to start responding to customers.
        </p>
      </div>
    );
  }

  const displayName = conversation.user_profile?.full_name || conversation.guest_name || 'Anonymous';
  const userEmail = conversation.guest_email || 'No email provided';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{displayName}</h3>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {format(new Date(conversation.created_at), 'MMM d, yyyy')}
          </Badge>
          
          {conversation.status !== 'resolved' && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1"
              onClick={() => onUpdateStatus(conversation.id, 'resolved')}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Resolve
            </Button>
          )}
          
          {conversation.status === 'resolved' && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1"
              onClick={() => onUpdateStatus(conversation.id, 'active')}
            >
              <Clock className="h-3.5 w-3.5" />
              Reopen
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="text-xs gap-1"
            onClick={() => onUpdateStatus(conversation.id, 'archived')}
          >
            <Archive className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No messages yet</p>
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

      {/* Quick Replies */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => onSend(reply)}
              disabled={sending}
            >
              {reply.slice(0, 30)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <ChatInput 
        onSend={onSend} 
        disabled={sending || conversation.status === 'archived'}
        placeholder={
          conversation.status === 'archived' 
            ? "This conversation is archived" 
            : "Type your response..."
        }
      />
    </div>
  );
};
