import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatMessageProps {
  content: string;
  senderType: 'user' | 'employee' | 'system';
  createdAt: string;
  isRead?: boolean;
  showTimestamp?: boolean;
}

export const ChatMessage = ({
  content,
  senderType,
  createdAt,
  isRead,
  showTimestamp = true
}: ChatMessageProps) => {
  const isUser = senderType === 'user';
  const isSystem = senderType === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col max-w-[80%] mb-3',
        isUser ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      <div
        className={cn(
          'px-4 py-2.5 rounded-2xl text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        )}
      >
        {content}
      </div>
      {showTimestamp && (
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-[10px] text-muted-foreground">
            {format(new Date(createdAt), 'HH:mm')}
          </span>
          {isUser && isRead && (
            <span className="text-[10px] text-primary">✓✓</span>
          )}
        </div>
      )}
    </div>
  );
};
