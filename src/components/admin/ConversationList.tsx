import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { type ConversationWithProfile } from '@/hooks/useAdminChat';

interface ConversationListProps {
  conversations: ConversationWithProfile[];
  selectedId: string | null;
  onSelect: (conversation: ConversationWithProfile) => void;
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'waiting':
      return 'bg-yellow-500';
    case 'resolved':
      return 'bg-blue-500';
    default:
      return 'bg-muted';
  }
};

const getInitials = (name: string | null | undefined) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const ConversationList = ({
  conversations,
  selectedId,
  onSelect,
  loading
}: ConversationListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          New chats will appear here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y">
        {conversations.map((conv) => {
          const displayName = conv.user_profile?.full_name || conv.guest_name || 'Anonymous';
          
          return (
            <div
              key={conv.id}
              className={cn(
                'flex items-start gap-3 p-4 cursor-pointer transition-colors',
                'hover:bg-muted/50',
                selectedId === conv.id && 'bg-muted'
              )}
              onClick={() => onSelect(conv)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                    getStatusColor(conv.status)
                  )}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {conv.last_message || 'No messages yet'}
                </p>
                
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      'text-[10px] px-1.5 py-0',
                    conv.status === 'waiting' && 'bg-accent text-accent-foreground'
                  )}
                >
                  {conv.status}
                  </Badge>
                  {(conv.unread_count ?? 0) > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      {conv.unread_count} new
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
