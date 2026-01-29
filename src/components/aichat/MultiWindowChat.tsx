import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowLeft, Check, MessageSquare, Code, Globe, Cpu, User, Copy, Paperclip, Image as ImageIcon, Volume2, RotateCcw, Share } from 'lucide-react';
import { useChatStore, type ChatWindow, type ModelCategory, type Attachment, type Message } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import MarkdownRenderer from './MarkdownRenderer';
import SourcesWidget from './SourcesWidget';
import WindowModelSelector from './WindowModelSelector';
import { chatApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import sorixLogo from '@/assets/logo.png';
import copy from 'copy-to-clipboard';
import { formatFileForPrompt } from '@/lib/fileParser';
import SharedChatInput from './SharedChatInput';
import { LiveVoiceOverlay } from '@/components/voice';
import ExportDropdown from './ExportDropdown';

// Emoji reactions for rating AI responses
const EMOJI_REACTIONS = [
  { emoji: '👍', label: 'Good', key: 'thumbsup' },
  { emoji: '👎', label: 'Bad', key: 'thumbsdown' },
  { emoji: '❤️', label: 'Love', key: 'heart' },
  { emoji: '🔥', label: 'Fire', key: 'fire' },
  { emoji: '😊', label: 'Nice', key: 'smile' },
];

// Estimate tokens: ~4 characters per token (rough approximation)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

const MultiWindowChat = () => {
  const {
    models,
    chatWindows,
    addChatWindow,
    removeChatWindow,
    setWindowModel,
    addWindowMessage,
    updateWindowLastMessage,
    setWindowLastMessageCitations,
    setWindowStreaming,
    setViewMode,
    user,
    setUser,
    isModelLocked,
    language
  } = useChatStore();
  
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  
  const isAnyStreaming = chatWindows.some(w => w.isStreaming);

  // Update token usage with warnings
  const updateTokenUsage = useCallback((inputTokens: number, outputTokens: number, modelName: string) => {
    const totalTokens = inputTokens + outputTokens;
    const currentUser = useChatStore.getState().user;
    const newUsage = Math.min(currentUser.tokensUsed + totalTokens, currentUser.tokensLimit);
    const prevPercent = currentUser.tokensLimit > 0 ? (currentUser.tokensUsed / currentUser.tokensLimit) * 100 : 0;
    const newPercent = currentUser.tokensLimit > 0 ? (newUsage / currentUser.tokensLimit) * 100 : 0;
    
    if (prevPercent < 80 && newPercent >= 80 && newPercent < 100) {
      toast({
        title: "⚠️ Token Usage Warning",
        description: "You've used 80% of your monthly tokens. Consider upgrading your plan.",
        variant: "default",
      });
    }
    
    if (prevPercent < 100 && newPercent >= 100) {
      toast({
        title: "🚫 Token Limit Reached",
        description: "You've used all your monthly tokens. Upgrade to continue chatting.",
        variant: "destructive",
      });
    }
    
    setUser({
      ...currentUser,
      tokensUsed: newUsage
    });
    
    console.log(`[${modelName}] Token usage: +${totalTokens} (input: ${inputTokens}, output: ${outputTokens}), total: ${newUsage}/${currentUser.tokensLimit} (${newPercent.toFixed(1)}%)`);
  }, [setUser]);
  
  const stopAllStreaming = useCallback(() => {
    abortControllersRef.current.forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current.clear();
    chatWindows.forEach(window => {
      setWindowStreaming(window.id, false);
    });
  }, [chatWindows, setWindowStreaming]);
  
  // Handle send from SharedChatInput - broadcasts to all windows
  const handleSend = useCallback(async (content: string, attachments: Attachment[]) => {
    if (isAnyStreaming) return;
    
    // Check if user has tokens available
    if (user.tokensUsed >= user.tokensLimit && user.tokensLimit > 0) {
      toast({
        title: "🚫 Token Limit Reached",
        description: "You have reached your token limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message and empty assistant message to all windows
    chatWindows.forEach(window => {
      const model = models.find(m => m.id === window.modelId);
      const modelName = model?.name || 'Sorix AI';
      
      const userMessage = {
        id: `${Date.now()}-${window.id}-user`,
        role: 'user' as const,
        content,
        attachments: attachments.length > 0 ? attachments : undefined,
        createdAt: new Date().toISOString()
      };
      addWindowMessage(window.id, userMessage);
      
      const assistantMessage = {
        id: `${Date.now()}-${window.id}-assistant`,
        role: 'assistant' as const,
        content: '',
        modelId: window.modelId,
        modelName: modelName,
        createdAt: new Date().toISOString()
      };
      addWindowMessage(window.id, assistantMessage);
      setWindowStreaming(window.id, true);
    });

    // Separate image and document attachments
    const imageAttachments = attachments.filter(att => att.type === 'image');
    const documentAttachments = attachments.filter(att => att.type === 'file' && att.parsedContent);
    
    // Send to all windows in parallel
    const sendToWindow = async (window: ChatWindow) => {
      const model = models.find(m => m.id === window.modelId);
      const hasAttachments = imageAttachments.length > 0 || documentAttachments.length > 0;
      const backendModel = hasAttachments ? 'openai/gpt-4o-mini' : (model?.backendId || 'deepseek/deepseek-chat');
      const modelName = model?.name || 'Unknown';
      
      // Build user text with file content
      let userText = content;
      
      if (documentAttachments.length > 0) {
        const totalDocs = documentAttachments.length;
        userText += `\n\n📁 ATTACHED FILES (${totalDocs} ${totalDocs === 1 ? 'file' : 'files'}):\n`;
        documentAttachments.forEach((att, index) => {
          userText += formatFileForPrompt({
            name: att.name,
            type: att.fileType || 'unknown',
            mimeType: '',
            size: att.size || 0,
            content: att.parsedContent || '',
            isImage: false
          }, index + 1, totalDocs);
        });
        userText += `\n📁 END OF ATTACHED FILES\n`;
      }

      if (imageAttachments.length > 0) {
        const imageNames = imageAttachments.map(att => att.name).join(', ');
        if (!userText.trim()) {
          userText = `Please analyze ${imageAttachments.length === 1 ? 'this image' : 'these images'}: ${imageNames}`;
        } else {
          userText += `\n\n[Attached ${imageAttachments.length === 1 ? 'image' : 'images'}: ${imageNames}]`;
        }
      }
      
      const contextMessages = window.messages
        .slice(-20)
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      
      const systemPrompt = 'You are Sorix AI, a helpful, intelligent assistant. Be concise but thorough in your responses. Use markdown formatting when appropriate.';
      
      let apiMessages: any[];
      
      if (imageAttachments.length > 0) {
        const multimodalContent: any[] = [];
        if (userText.trim()) {
          multimodalContent.push({ type: 'text', text: userText });
        }
        imageAttachments.forEach(att => {
          if (att.url && att.url.startsWith('data:image')) {
            multimodalContent.push({
              type: 'image_url',
              image_url: { url: att.url, detail: 'high' }
            });
          }
        });
        apiMessages = [
          { role: 'system', content: systemPrompt },
          ...contextMessages.slice(0, -1),
          { role: 'user', content: multimodalContent }
        ];
      } else {
        apiMessages = [
          { role: 'system', content: systemPrompt },
          ...contextMessages,
          { role: 'user', content: userText }
        ];
      }
      
      const inputTokens = apiMessages.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);
      console.log(`[${modelName}] Sending message, estimated input tokens: ${inputTokens}`);
      
      const abortController = new AbortController();
      abortControllersRef.current.set(window.id, abortController);
      
      let fullResponse = '';
      
      try {
        await chatApi.sendMessageStream(
          apiMessages,
          backendModel,
          user.plan,
          (chunk) => {
            fullResponse += chunk;
            updateWindowLastMessage(window.id, chunk);
          },
          (citations) => {
            setWindowStreaming(window.id, false);
            abortControllersRef.current.delete(window.id);
            // Set citations if available (from Perplexity/search models)
            if (citations && citations.length > 0) {
              setWindowLastMessageCitations(window.id, citations);
              console.log(`[${modelName}] 📚 Added ${citations.length} citations`);
            }
            const outputTokens = estimateTokens(fullResponse);
            updateTokenUsage(inputTokens, outputTokens, modelName);
            console.log(`[${modelName}] Streaming complete, response length: ${fullResponse.length}`);
          },
          (err) => {
            console.error(`Error in window ${window.id}:`, err);
            setWindowStreaming(window.id, false);
            abortControllersRef.current.delete(window.id);
            const errorMessage = err.message || 'An error occurred';
            if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
              toast({
                title: "⏳ Rate Limited",
                description: `${modelName}: Too many requests.`,
                variant: "destructive",
              });
            }
          },
          abortController.signal,
          modelName // Pass model name to API
        );
      } catch (err: any) {
        console.error(`Send error in window ${window.id}:`, err);
        setWindowStreaming(window.id, false);
        abortControllersRef.current.delete(window.id);
      }
    };
    
    chatWindows.forEach(window => {
      sendToWindow(window);
    });
  }, [chatWindows, models, user, isAnyStreaming, addWindowMessage, updateWindowLastMessage, setWindowLastMessageCitations, setWindowStreaming, updateTokenUsage]);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setViewMode('single')}
            className={cn(
              'p-2 sm:p-2.5 rounded-xl transition-all duration-200',
              'bg-card border border-border',
              'hover:border-primary/50 hover:shadow-glow'
            )}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={sorixLogo} alt="AI Sorix" className="w-6 h-6 sm:w-8 sm:h-8" />
            <div>
              <h1 className="font-bold text-sm sm:text-lg">Multi-Window Chat</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Compare responses from different models</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={addChatWindow}
          disabled={chatWindows.length >= 4}
          className={cn(
            'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200',
            'bg-gradient-to-r from-primary to-accent text-primary-foreground',
            'hover:shadow-glow disabled:opacity-50 text-sm'
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium hidden sm:inline">Add Window</span>
        </button>
      </header>
      
      {/* Windows Grid */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4">
        <div className={cn(
          'grid gap-2 sm:gap-4 h-full',
          chatWindows.length === 1 && 'grid-cols-1',
          chatWindows.length === 2 && 'grid-cols-1 sm:grid-cols-2',
          chatWindows.length === 3 && 'grid-cols-1 sm:grid-cols-3',
          chatWindows.length === 4 && 'grid-cols-2'
        )}>
          {chatWindows.map((window) => (
            <ChatWindowPanel
              key={window.id}
              window={window}
              canClose={chatWindows.length > 1}
            />
          ))}
        </div>
      </div>
      
      {/* Shared Input - Using SharedChatInput component */}
      <div className="pb-4 sm:pb-6">
        <SharedChatInput
          onSend={handleSend}
          onOpenVoiceMode={() => setVoiceModeOpen(true)}
          isStreaming={isAnyStreaming}
          onStopStreaming={stopAllStreaming}
          placeholder="Ask all models at once..."
          language={language}
          userPlan={user.plan}
        />
        <p className="text-[10px] sm:text-xs text-center mt-2 text-muted-foreground">
          Responses are sent to all windows simultaneously
        </p>
      </div>

      {/* Live Voice Mode Overlay */}
      <LiveVoiceOverlay isOpen={voiceModeOpen} onClose={() => setVoiceModeOpen(false)} />
    </div>
  );
};

// Individual Chat Window Panel
interface ChatWindowPanelProps {
  window: ChatWindow;
  canClose: boolean;
}

const ChatWindowPanel = ({ window, canClose }: ChatWindowPanelProps) => {
  const { models, removeChatWindow, theme, openShareModal } = useChatStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, Set<string>>>({});
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentModel = models.find(m => m.id === window.modelId) || models[0];

  const handleCopy = useCallback((content: string, id: string) => {
    copy(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleReaction = useCallback((messageId: string, reactionKey: string) => {
    setMessageReactions(prev => {
      const currentReactions = prev[messageId] || new Set();
      const newReactions = new Set(currentReactions);
      if (newReactions.has(reactionKey)) {
        newReactions.delete(reactionKey);
      } else {
        newReactions.add(reactionKey);
      }
      return { ...prev, [messageId]: newReactions };
    });
  }, []);

  const getCategoryIcon = (category: ModelCategory) => {
    switch (category) {
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'search': return <Globe className="w-4 h-4" />;
      case 'system': return <Cpu className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getModelColor = (category: ModelCategory) => {
    switch (category) {
      case 'chat': return 'from-purple-500 to-violet-600';
      case 'code': return 'from-emerald-500 to-teal-600';
      case 'search': return 'from-blue-500 to-cyan-500';
      case 'system': return 'from-amber-500 to-orange-500';
      default: return 'from-primary to-accent';
    }
  };
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [window.messages]);
  
  return (
    <div className={cn(
      'flex flex-col rounded-xl sm:rounded-2xl border overflow-hidden',
      'bg-card border-border'
    )}>
      {/* Window Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-muted/30">
        <WindowModelSelector windowId={window.id} currentModelId={window.modelId} />
        
        {canClose && (
          <button
            onClick={() => removeChatWindow(window.id)}
            className={cn(
              'p-1.5 sm:p-2 rounded-lg transition-all duration-200',
              'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {window.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 p-4">
            <div className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white',
              getModelColor(currentModel.category)
            )}>
              {getCategoryIcon(currentModel.category)}
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm text-center">{currentModel.name}</span>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {window.messages.map((message, msgIndex) => {
              const isLastMessage = msgIndex === window.messages.length - 1;
              const isAssistant = message.role === 'assistant';
              const showActions = showActionsFor === message.id && isAssistant && message.content && !window.isStreaming;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    'py-3 sm:py-4 px-3 sm:px-4 group',
                    isAssistant && 'bg-muted/20'
                  )}
                  onMouseEnter={() => isAssistant && setShowActionsFor(message.id)}
                  onMouseLeave={() => setShowActionsFor(null)}
                >
                  <div className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary border border-border flex items-center justify-center">
                          <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className={cn(
                          'w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-gradient-to-br text-white text-xs',
                          getModelColor(currentModel.category)
                        )}>
                          {getCategoryIcon(currentModel.category)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                          {message.role === 'user' ? 'You' : (message.modelName || currentModel.name)}
                        </span>
                        {message.role === 'assistant' && message.modelName && (
                          <span className="px-1 py-0.5 text-[8px] bg-muted text-muted-foreground rounded font-medium">
                            AI
                          </span>
                        )}
                      </div>
                      {message.role === 'user' ? (
                        <div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {message.attachments.map((att, idx) => (
                                <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs">
                                  {att.type === 'image' ? (
                                    <ImageIcon className="w-3 h-3 text-blue-500" />
                                  ) : (
                                    <Paperclip className="w-3 h-3 text-emerald-500" />
                                  )}
                                  <span className="truncate max-w-[100px]">{att.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm prose-sm max-w-none">
                          {message.content ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            window.isStreaming && (
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            )
                          )}
                          {window.isStreaming && isLastMessage && message.content && (
                            <span className="inline-block w-0.5 h-4 ml-0.5 bg-primary animate-pulse rounded-sm align-middle" />
                          )}
                          
                          {/* Sources Widget - Show citations from search models */}
                          {message.citations && message.citations.length > 0 && !window.isStreaming && (
                            <SourcesWidget citations={message.citations} theme={theme} />
                          )}
                          
                          {/* Action Buttons - Show on hover for assistant messages */}
                          {message.content && !window.isStreaming && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: showActions ? 1 : 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center gap-0.5 pt-2"
                            >
                              <button
                                onClick={() => handleCopy(message.content, message.id)}
                                className={cn(
                                  'p-1.5 rounded-lg transition-all duration-150 text-muted-foreground',
                                  theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground',
                                  copiedId === message.id && 'text-green-500'
                                )}
                                title="Copy"
                              >
                                {copiedId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              
                              <button
                                onClick={() => {}}
                                className={cn(
                                  'p-1.5 rounded-lg transition-all duration-150 text-muted-foreground',
                                  theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground'
                                )}
                                title="Read aloud"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              
                              {/* Emoji Reactions */}
                              <div className="relative">
                                <button
                                  onClick={() => setShowEmojiPickerFor(showEmojiPickerFor === message.id ? null : message.id)}
                                  className={cn(
                                    'p-1.5 rounded-lg transition-all duration-150 text-muted-foreground',
                                    theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground',
                                    (messageReactions[message.id]?.size || 0) > 0 && 'text-primary'
                                  )}
                                  title="React"
                                >
                                  <span className="text-sm leading-none">
                                    {(messageReactions[message.id]?.size || 0) > 0 
                                      ? EMOJI_REACTIONS.find(r => messageReactions[message.id]?.has(r.key))?.emoji || '😊'
                                      : '😊'}
                                  </span>
                                </button>
                                
                                <AnimatePresence>
                                  {showEmojiPickerFor === message.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.9, y: 4 }}
                                      transition={{ duration: 0.15 }}
                                      className={cn(
                                        'absolute bottom-full left-0 mb-2 flex items-center gap-0.5 px-1.5 py-1 rounded-xl shadow-lg z-50',
                                        theme === 'dark' ? 'bg-card border border-border' : 'bg-white border border-border shadow-md'
                                      )}
                                    >
                                      {EMOJI_REACTIONS.map((reaction) => (
                                        <button
                                          key={reaction.key}
                                          onClick={() => handleReaction(message.id, reaction.key)}
                                          className={cn(
                                            'p-1 rounded-md transition-all duration-150 hover:scale-110 text-sm',
                                            messageReactions[message.id]?.has(reaction.key) 
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
                              {(messageReactions[message.id]?.size || 0) > 0 && (
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted/50">
                                  {EMOJI_REACTIONS.filter(r => messageReactions[message.id]?.has(r.key)).map(reaction => (
                                    <span key={reaction.key} className="text-xs">{reaction.emoji}</span>
                                  ))}
                                </div>
                              )}
                              
                              <button
                                onClick={() => {}}
                                className={cn(
                                  'p-1.5 rounded-lg transition-all duration-150 text-muted-foreground',
                                  theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground'
                                )}
                                title="Regenerate"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              
                              <ExportDropdown messages={window.messages} theme={theme} />
                              
                              <button
                                onClick={() => openShareModal(message.id)}
                                className={cn(
                                  'p-1.5 rounded-lg transition-all duration-150 text-muted-foreground',
                                  theme === 'dark' ? 'hover:bg-secondary hover:text-foreground' : 'hover:bg-secondary hover:text-foreground'
                                )}
                                title="Share"
                              >
                                <Share className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiWindowChat;
