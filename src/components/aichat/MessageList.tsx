import React, { useState, useCallback, useMemo } from "react";
import MessageBubble from "./MessageBubble";
import useAutoScroll from "@/hooks/useAutoScroll";
import { useChatStore } from "@/stores/chatStore";
import { useAIChat } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 100;

const MessageList = () => {
  const { chats, activeChatId, isStreaming, setMessages } = useChatStore();
  const { sendMessage } = useAIChat();
  const allMessages = useMemo(
    () => chats.find((c) => c.id === activeChatId)?.messages || [],
    [chats, activeChatId]
  );
  const [showAll, setShowAll] = useState(false);

  const messages = useMemo(
    () => showAll || allMessages.length <= INITIAL_VISIBLE
      ? allMessages
      : allMessages.slice(-INITIAL_VISIBLE),
    [allMessages, showAll]
  );

  const { containerRef } = useAutoScroll(messages, isStreaming);

  const handleLoadMore = useCallback(() => setShowAll(true), []);

  const handleEditAndResend = useCallback((messageId: string, newContent: string) => {
    const allMsgs = chats.find((c) => c.id === activeChatId)?.messages || [];
    const msgIndex = allMsgs.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;
    // Truncate everything from this message onward, then resend
    const truncated = allMsgs.slice(0, msgIndex);
    setMessages(truncated);
    sendMessage(newContent);
  }, [chats, activeChatId, setMessages, sendMessage]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 h-full w-full overflow-y-auto",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
      )}
      style={{ overscrollBehaviorY: 'contain' }}
    >
      {/* Load earlier messages button */}
      {!showAll && allMessages.length > INITIAL_VISIBLE && (
        <div className="flex justify-center py-3">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-xs rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
          >
            Load {allMessages.length - INITIAL_VISIBLE} earlier messages
          </button>
        </div>
      )}

      <div className="divide-y divide-border/30">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1}
            isLast={index === messages.length - 1}
            onEditAndResend={handleEditAndResend}
          />
        ))}
      </div>
      <div className="h-2 sm:h-4" />
    </div>
  );
};

export default MessageList;
