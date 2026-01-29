import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  RotateCcw,
  Share,
  Volume2,
  User,
  MoreHorizontal
} from 'lucide-react';
import copy from 'copy-to-clipboard';
import MarkdownRenderer from './MarkdownRenderer';
import ExportDropdown from './ExportDropdown';
import SourcesWidget from './SourcesWidget';
import { useChatStore, type Message } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import sorixLogo from '@/assets/logo.png';

// Emoji reactions for rating AI responses
const EMOJI_REACTIONS = [
  { emoji: '👍', label: 'Good', key: 'thumbsup' },
  { emoji: '👎', label: 'Bad', key: 'thumbsdown' },
  { emoji: '❤️', label: 'Love', key: 'heart' },
  { emoji: '🔥', label: 'Fire', key: 'fire' },
  { emoji: '😊', label: 'Nice', key: 'smile' },
];

interface MessageBubbleProps {
  message: Message;
  isStreaming: boolean;
  isLast: boolean;
}

const MessageBubble = memo(({ message, isStreaming, isLast }: MessageBubbleProps) => {
  const { theme, openShareModal, chats, activeChatId } = useChatStore();
  const [copied, setCopied] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReaction = useCallback((key: string) => {
    setSelectedReactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);
  
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  
  // Get all messages from the current chat for export
  const currentMessages = chats.find(c => c.id === activeChatId)?.messages || [];
  
  const handleCopy = useCallback(() => {
    copy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'group relative w-full',
        isUser ? 'py-4' : 'py-6',
        isAssistant && (theme === 'dark' ? 'bg-muted/20' : 'bg-muted/40')
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="max-w-3xl mx-auto px-4">
        {isUser ? (
          // User message - compact bubble style
          <div className="flex justify-end">
            <div className={cn(
              'max-w-[85%] px-4 py-3 rounded-2xl',
              theme === 'dark' 
                ? 'bg-primary/20 border border-primary/30' 
                : 'bg-primary/10 border border-primary/20'
            )}>
              <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                {message.content}
              </p>
              
              {/* Image Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.attachments.map((att, index) => (
                    att.type === 'image' && (
                      <img
                        key={index}
                        src={att.url}
                        alt="Attachment"
                        className="max-w-[250px] max-h-[250px] rounded-xl cursor-pointer hover:opacity-90 transition-opacity border border-border"
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Assistant message - full width with avatar
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center overflow-hidden',
                'bg-gradient-to-br from-primary/30 to-accent/30',
                'border border-primary/30 shadow-sm'
              )}>
                <img 
                  src={sorixLogo} 
                  alt="AI" 
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Role Label */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Sorix AI
                </span>
                {isStreaming && isLast && (
                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full animate-pulse">
                    Thinking...
                  </span>
                )}
              </div>
              
              {/* Message Content */}
              <div className="text-foreground">
                {message.content ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  isStreaming && (
                    <div className="flex items-center gap-1.5 py-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )
                )}
                {/* Streaming cursor */}
                {isStreaming && isLast && message.content && (
                  <span className="inline-block w-0.5 h-5 ml-1 bg-primary animate-pulse rounded-sm align-middle" />
                )}
              </div>
              
              {/* Sources Widget - Show citations from search models */}
              {message.citations && message.citations.length > 0 && !isStreaming && (
                <SourcesWidget citations={message.citations} theme={theme} />
              )}
              
              {/* Action Buttons - Show on hover for assistant messages */}
              {message.content && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showActions ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-0.5 pt-2"
                >
                  <ActionButton
                    onClick={handleCopy}
                    active={copied}
                    activeColor="text-green-500"
                    tooltip="Copy"
                    theme={theme}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => {}}
                    tooltip="Read aloud"
                    theme={theme}
                  >
                    <Volume2 className="w-4 h-4" />
                  </ActionButton>
                  
                  {/* Emoji Reactions */}
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={cn(
                        'p-2 rounded-lg transition-all duration-150 text-muted-foreground',
                        theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground',
                        selectedReactions.size > 0 && 'text-primary'
                      )}
                      title="React"
                    >
                      {selectedReactions.size > 0 ? (
                        <span className="text-base leading-none">
                          {EMOJI_REACTIONS.find(r => selectedReactions.has(r.key))?.emoji || '😊'}
                        </span>
                      ) : (
                        <span className="text-base leading-none">😊</span>
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            'absolute bottom-full left-0 mb-2 flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-lg z-50',
                            theme === 'dark' ? 'bg-card border border-border' : 'bg-white border border-border shadow-md'
                          )}
                        >
                          {EMOJI_REACTIONS.map((reaction) => (
                            <button
                              key={reaction.key}
                              onClick={() => handleReaction(reaction.key)}
                              className={cn(
                                'p-1.5 rounded-lg transition-all duration-150 hover:scale-110 text-lg',
                                selectedReactions.has(reaction.key) 
                                  ? 'bg-primary/20 scale-110' 
                                  : 'hover:bg-muted'
                              )}
                              title={reaction.label}
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Selected Reactions Display */}
                  {selectedReactions.size > 0 && (
                    <div className="flex items-center gap-0.5 ml-1 px-2 py-1 rounded-full bg-muted/50">
                      {EMOJI_REACTIONS.filter(r => selectedReactions.has(r.key)).map(reaction => (
                        <span key={reaction.key} className="text-sm">{reaction.emoji}</span>
                      ))}
                    </div>
                  )}
                  
                  <ActionButton
                    onClick={() => {}}
                    tooltip="Regenerate"
                    theme={theme}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </ActionButton>
                  
                  <ExportDropdown messages={currentMessages} theme={theme} />
                  
                  <ActionButton
                    onClick={() => openShareModal(message.id)}
                    tooltip="Share"
                    theme={theme}
                  >
                    <Share className="w-4 h-4" />
                  </ActionButton>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Action Button Component
interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  tooltip: string;
  active?: boolean;
  activeColor?: string;
  theme: 'light' | 'dark';
}

const ActionButton = memo(({ onClick, children, tooltip, active, activeColor, theme }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      'p-2 rounded-lg transition-all duration-150',
      'text-muted-foreground',
      theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground',
      active && activeColor
    )}
    title={tooltip}
  >
    {children}
  </button>
));

ActionButton.displayName = 'ActionButton';
MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
