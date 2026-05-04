import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ArrowLeft, X, Plus, Image as ImageIcon, Camera, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import { legendsApi } from '@/services/legendsApi';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { parseFile, getAcceptedFileTypes, getFileType } from '@/lib/fileParser';
import FileChip from '@/components/aichat/FileChip';
import { toast } from 'sonner';
import type { Persona } from './LegendCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';

interface LegendChatProps {
  persona: Persona;
  onBack: () => void;
  initialMessages?: ChatMessage[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

const LegendChat: React.FC<LegendChatProps> = ({ persona, onBack, initialMessages }) => {
  const { user: authUser } = useAuth();
  const { user } = useChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialMessages && initialMessages.length > 0) return initialMessages;
    return [{
      id: 'initial',
      role: 'assistant',
      content: getGreeting(persona.id, persona.name),
    }];
  });
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const hasSaved = useRef(false);

  const FILE_SIZE_LIMITS: Record<string, number> = { free: 1*1024*1024, basic: 5*1024*1024, pro: 10*1024*1024, premium: 15*1024*1024 };
  const sizeLimit = FILE_SIZE_LIMITS[user.plan] || FILE_SIZE_LIMITS.free;
  const formatSize = (bytes: number): string => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/(1024*1024)).toFixed(0)} MB`;

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsParsing(true);
    for (const file of files) {
      if (file.size > sizeLimit) { toast.error(`${file.name} exceeds ${formatSize(sizeLimit)} limit`); continue; }
      try {
        const fileType = getFileType(file.name);
        if (fileType === 'image' || file.type.startsWith('image/')) {
          const parsed = await parseFile(file);
          setAttachments(prev => [...prev, { type: 'image', url: parsed.content, name: file.name, size: file.size, fileType: 'image' }]);
        } else {
          const parsed = await parseFile(file);
          if (parsed.content.length >= 10) {
            setAttachments(prev => [...prev, { type: 'file', url: '', name: file.name, size: file.size, parsedContent: parsed.content, fileType: parsed.type }]);
          } else { toast.error(`${file.name} appears empty`); }
        }
      } catch { toast.error(`Failed to process ${file.name}`); }
    }
    setIsParsing(false);
  }, [sizeLimit]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Save to history when conversation has substance
  useEffect(() => {
    if (hasSaved.current) return;
    const userMsgs = messages.filter(m => m.role === 'user');
    const assistantMsgs = messages.filter(m => m.role === 'assistant' && m.id !== 'initial');
    if (userMsgs.length >= 1 && assistantMsgs.length >= 1 && authUser) {
      hasSaved.current = true;
      const lastMessages = messages.slice(-3).map(m => m.content.slice(0, 100));
      supabase.from('analysis_history' as any).insert({
        user_id: authUser.id,
        tool: 'legends',
        title: persona.name,
        input_data: { personaId: persona.id, lastMessages },
        result_data: { messages: messages.map(m => ({ role: m.role, content: m.content })) },
      }).then(() => {});
    }
  }, [messages, authUser, persona]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    // Check token limit before sending
    if (user.tokensLimit > 0 && user.tokensUsed >= user.tokensLimit) {
      setShowUpgradeModal(true);
      return;
    }

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: input.trim(), image: pendingImage || undefined };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setPendingImage(null);
    setIsStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    // Build messages for API
    const apiMessages: any[] = messages
      .filter(m => m.id !== 'initial')
      .map(m => ({ role: m.role, content: m.content }));

    // If image attached, send multimodal
    if (userMsg.image) {
      apiMessages.push({
        role: 'user',
        content: [
          { type: 'text', text: userMsg.content },
          { type: 'image_url', image_url: { url: userMsg.image } },
        ],
      });
    } else {
      apiMessages.push({ role: 'user', content: userMsg.content });
    }

    let totalContent = '';

    legendsApi.sendMessageStream(
      apiMessages,
      persona.id,
      (delta) => {
        totalContent += delta;
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + delta } : m
        ));
      },
      () => {
        setIsStreaming(false);
        // 3x token deduction
        const estimatedTokens = (input.length / 4) + (totalContent.length / 4);
        const deduction = Math.ceil(estimatedTokens * 3);
        const newUsed = user.tokensUsed + deduction;
        useChatStore.setState(state => ({
          user: { ...state.user, tokensUsed: state.user.tokensUsed + deduction }
        }));
        // Show upgrade modal if limit now reached
        if (user.tokensLimit > 0 && newUsed >= user.tokensLimit) {
          setShowUpgradeModal(true);
        }
      },
      (error) => {
        console.error('Legend chat error:', error);
        if (error.message === 'TOKEN_LIMIT_REACHED') {
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          setShowUpgradeModal(true);
        } else {
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: 'Sorry, something went wrong. Please try again.' } : m
          ));
        }
        setIsStreaming(false);
      },
      abort.signal,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-3 flex items-center gap-3 bg-card/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/30 shadow">
          <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-foreground text-sm truncate">{persona.name}</h2>
          <p className="text-[10px] text-muted-foreground truncate">{persona.role}</p>
        </div>
        <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
          3x Tokens
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('max-w-2xl', msg.role === 'user' ? 'ml-auto' : '')}
          >
            <div className={cn(
              'p-4 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-card border border-border rounded-bl-md'
            )}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src={persona.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{persona.name}</span>
                </div>
              )}
              {msg.image && (
                <img src={msg.image} alt="Uploaded" className="max-w-[200px] rounded-lg mb-2" />
              )}
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
              {msg.role === 'assistant' && msg.content === '' && isStreaming && (
                <div className="flex gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-4 pb-safe">
        {/* Hidden inputs */}
        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={async (e) => { await processFiles(Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))); e.target.value = ''; setShowAttachMenu(false); }} />
        <input ref={documentInputRef} type="file" accept={getAcceptedFileTypes()} multiple className="hidden"
          onChange={async (e) => { await processFiles(Array.from(e.target.files || [])); e.target.value = ''; setShowAttachMenu(false); }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={async (e) => { await processFiles(Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))); e.target.value = ''; setShowAttachMenu(false); }} />

        {/* Attachment previews */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 mb-3 max-w-2xl mx-auto">
              {attachments.map((att, i) => (
                <FileChip key={i} name={att.name} type={att.fileType || 'unknown'} size={att.size}
                  previewUrl={att.type === 'image' ? att.url : undefined}
                  onRemove={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {isParsing && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm max-w-2xl mx-auto">
            <Loader2 className="w-4 h-4 animate-spin" />Processing files...
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className={cn(
            'relative flex flex-col rounded-3xl border transition-all duration-200',
            'bg-muted/40 border-border/50',
            'focus-within:border-primary/40 focus-within:bg-muted/60',
            'shadow-sm px-2 sm:px-3 pt-1 pb-1.5'
          )}>
            <TextareaAutosize
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${persona.name.split(' ').pop()}...`}
              disabled={isStreaming}
              minRows={1}
              maxRows={6}
              className={cn(
                'w-full px-2 sm:px-3 pt-2.5 pb-1 bg-transparent resize-none focus:outline-none',
                'text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground/70',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />

            <div className="flex items-center justify-between gap-1 mt-1">
              {/* Attach */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  disabled={isStreaming}
                  className={cn(
                    'p-2 rounded-full transition-all duration-200',
                    'hover:bg-background text-muted-foreground hover:text-foreground',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    showAttachMenu && 'bg-background text-foreground'
                  )}
                  aria-label="Attach"
                >
                  <Plus className={cn('w-5 h-5 transition-transform duration-200', showAttachMenu && 'rotate-45')} />
                </button>
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 rounded-xl shadow-xl overflow-hidden bg-popover border border-border backdrop-blur-xl min-w-[220px] z-[100]"
                    >
                      <div className="px-4 py-2 border-b border-border bg-muted/50">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">Max file size</span>
                          <span className={cn(
                            'text-xs font-medium px-1.5 py-0.5 rounded',
                            user.plan === 'premium' && 'bg-amber-500/10 text-amber-500',
                            user.plan === 'pro' && 'bg-purple-500/10 text-purple-500',
                            user.plan === 'basic' && 'bg-blue-500/10 text-blue-500',
                            user.plan === 'free' && 'bg-muted text-muted-foreground'
                          )}>
                            {formatSize(sizeLimit)}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-blue-500" /></div>
                        <span className="text-sm">Upload Image</span>
                      </button>
                      <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Camera className="w-4 h-4 text-purple-500" /></div>
                        <span className="text-sm">Take Photo</span>
                      </button>
                      <button onClick={() => documentInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><Paperclip className="w-4 h-4 text-green-500" /></div>
                        <span className="text-sm">Attach File</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Send */}
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  'p-2 sm:p-2.5 rounded-full transition-all duration-200',
                  input.trim()
                    ? 'bg-foreground text-background hover:opacity-90'
                    : 'bg-muted text-muted-foreground opacity-50',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
              >
                {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
};

function getGreeting(id: string, name: string): string {
  const greetings: Record<string, string> = {
    jc_bose: "Namaskar! I am Jagadish Chandra Bose. I proved that plants have feelings — imagine what else nature hides! What scientific mystery shall we explore together?",
    humayun: "Assalamu Alaikum! Ami Humayun Ahmed. Himu-r moton ghure berai, Misir Ali-r moton bhabi... Bolo, ki golpo shunbe? 😊",
    nazrul: "বিদ্রোহী আমি! আমি কাজী নজরুল ইসলাম — জাগো, জাগো! তোমার মনে কি আগুন আছে? বলো, কোন বিপ্লবের কথা শুনতে চাও!",
    jobs: "Hey. I'm Steve Jobs. Here's the thing — the people who are crazy enough to think they can change the world are the ones who do. So... what are you building?",
    einstein: "Hallo! Albert Einstein here. You know, imagination is more important than knowledge. So don't be afraid to ask the 'stupid' questions — those are usually the best ones! What's puzzling you?",
    tesla: "Greetings! I am Nikola Tesla. The present is theirs, but the future — for which I really worked — is mine. What invention or technology shall we discuss?",
    kalam: "My dear young friend! I am APJ Abdul Kalam. Dream, dream, dream! Dreams transform into thoughts, and thoughts result in action. Tell me, what is YOUR dream?",
    bcs_coach: "আসসালামু আলাইকুম! আমি আপনার BCS Preparation Coach। সাধারণ জ্ঞান, বাংলা ব্যাকরণ, English Grammar, Math — যেকোনো বিষয়ে প্রশ্ন করুন। আজকে কোন বিষয় নিয়ে আলোচনা করবেন?",
    legal_bot: "আসসালামু আলাইকুম! আমি আপনার আইনি পরামর্শদাতা। জমি, পারিবারিক, দেওয়ানি বা ফৌজদারি — যেকোনো আইনি প্রশ্নে সাহায্য করতে পারি। কী বিষয়ে জানতে চান?",
    finance_bot: "আসসালামু আলাইকুম! আমি আপনার Financial Advisor। সঞ্চয়পত্র, শেয়ার বাজার, ব্যাংক ডিপোজিট, বিনিয়োগ — যেকোনো আর্থিক বিষয়ে পরামর্শ দিতে পারি। কীভাবে সাহায্য করতে পারি?",
  };
  return greetings[id] || `Hello! I am ${name}. How can I help you today?`;
}

export default LegendChat;
