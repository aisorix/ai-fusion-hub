import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  RotateCcw,
  Share,
  Volume2,
  Pencil
} from 'lucide-react';
import copy from 'copy-to-clipboard';
import MarkdownRenderer from './MarkdownRenderer';
import ExportDropdown from './ExportDropdown';
import SourcesWidget from './SourcesWidget';
import { useChatStore, type Message } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { ModelIcon } from './ModelIcons';

// Emoji reactions for rating AI responses
const EMOJI_REACTIONS = [
  { emoji: '👍', label: 'Good', key: 'thumbsup' },
  { emoji: '👎', label: 'Bad', key: 'thumbsdown' },
  { emoji: '❤️', label: 'Love', key: 'heart' },
  { emoji: '🔥', label: 'Fire', key: 'fire' },
  { emoji: '😊', label: 'Nice', key: 'smile' },
];

// Thinking Timer Component
const ThinkingTimer = memo(({ isActive }: { isActive: boolean }) => {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 100) / 10);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <span className="ml-2 text-xs text-muted-foreground font-mono tabular-nums">
      {elapsed.toFixed(1)}s
    </span>
  );
});

ThinkingTimer.displayName = 'ThinkingTimer';

interface MessageBubbleProps {
  message: Message;
  isStreaming: boolean;
  isLast: boolean;
}

const MessageBubble = memo(({ message, isStreaming, isLast }: MessageBubbleProps) => {
  const { theme, openShareModal, chats, activeChatId, user, selectedModel, models } = useChatStore();
  const [copied, setCopied] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const isPaidUser = user.plan !== 'free';
  
  // Get model info - use message's stored model or fallback to current selected
  const messageModelId = message.modelId || selectedModel;
  const messageModelName = message.modelName || models.find(m => m.id === messageModelId)?.name || 'Sorix AI';

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

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditContent(message.content);
  }, [message.content]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditContent(message.content);
  }, [message.content]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'group relative w-full',
        isUser ? 'py-3 sm:py-4' : 'py-4 sm:py-6',
        isAssistant && (theme === 'dark' ? 'bg-muted/10' : 'bg-muted/30')
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {isUser ? (
          // User message - clean bubble style with edit/copy
          <div className="flex justify-end">
            <div className="relative max-w-[90%] sm:max-w-[85%]">
              {/* Edit/Copy buttons for user messages */}
              <AnimatePresence>
                {showActions && !isEditing && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center gap-1"
                  >
                    <button
                      onClick={handleEdit}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "p-1.5 rounded-lg hover:bg-muted transition-colors",
                        copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Copy"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-w-[200px] px-3.5 py-2.5 rounded-2xl bg-muted border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className={cn(
                  'px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl',
                  theme === 'dark' 
                    ? 'bg-primary/20 text-foreground' 
                    : 'bg-primary/10 text-foreground'
                )}>
                  <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                    {message.content}
                  </p>
                  
                  {/* Image Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.attachments.map((att, index) => (
                        att.type === 'image' && (
                          <img
                            key={index}
                            src={att.url}
                            alt="Attachment"
                            className="max-w-[200px] sm:max-w-[250px] max-h-[200px] sm:max-h-[250px] rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Assistant message - shows real model icon and name
          <div className="flex gap-3 sm:gap-4">
            {/* Model-specific Avatar Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden">
                <ModelIcon 
                  modelId={messageModelId} 
                  modelName={messageModelName} 
                  size="lg" 
                  showGlow={false}
                  theme={theme}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Model Name Label */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {messageModelName}
                </span>
                {isStreaming && isLast && !message.content && (
                  <div className="flex items-center">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                      Thinking
                    </span>
                    <ThinkingTimer isActive={true} />
                  </div>
                )}
                {isStreaming && isLast && message.content && (
                  <div className="flex items-center">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-500">
                      Writing
                    </span>
                  </div>
                )}
              </div>
              
              {/* Message Content */}
              <div className="text-foreground">
                {message.content ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  isStreaming && (
                    <div className="flex items-center gap-2 py-2">
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )
                )}
                {/* Streaming cursor - smooth blinking */}
                {isStreaming && isLast && message.content && (
                  <span className="inline-block w-[3px] h-5 ml-0.5 bg-primary rounded-sm align-middle animate-[pulse_0.8s_ease-in-out_infinite]" />
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
