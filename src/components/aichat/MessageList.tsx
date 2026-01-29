import React from 'react';
import MessageBubble from './MessageBubble';
import useAutoScroll from '@/hooks/useAutoScroll';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const MessageList = () => {
  const { chats, activeChatId, isStreaming, theme } = useChatStore();
  const messages = chats.find(c => c.id === activeChatId)?.messages || [];
  const { containerRef } = useAutoScroll(messages, isStreaming);
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto',
        'scrollbar-thin'
      )}
    >
      <div className="divide-y divide-border/50">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
      {/* Bottom padding for input */}
      <div className="h-4" />
    </div>
  );
};

export default MessageList;
