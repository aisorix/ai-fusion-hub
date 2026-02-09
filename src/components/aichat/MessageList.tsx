import React from "react";
import MessageBubble from "./MessageBubble";
import useAutoScroll from "@/hooks/useAutoScroll";
import { useChatStore } from "@/stores/chatStore";
import { cn } from "@/lib/utils";

const MessageList = () => {
  const { chats, activeChatId, isStreaming, theme } = useChatStore();
  const messages = chats.find((c) => c.id === activeChatId)?.messages || [];
  const { containerRef } = useAutoScroll(messages, isStreaming);

  return (
    <div
      ref={containerRef}
      className={cn(
        // FIX: 'h-full w-full' ensures it fills the available space exactly
        "flex-1 h-full w-full overflow-y-auto",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
      )}
    >
      <div className="divide-y divide-border/30">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
      {/* Bottom padding for input breathing room */}
      <div className="h-2 sm:h-4" />
    </div>
  );
};

export default MessageList;
