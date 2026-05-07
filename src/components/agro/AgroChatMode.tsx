import React, { useState, useRef, useEffect } from 'react';
import { useAutoFocusInput } from '@/hooks/useAutoFocusInput';
import { motion } from 'framer-motion';
import { Send, Loader2, RotateCcw, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { agroApi } from '@/services/agroApi';
import type { CropData, AgroResult } from '@/pages/AgroPage';

interface AgroChatModeProps {
  cropData: CropData | null;
  analysisResult: AgroResult | null;
  onStartOver: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AgroChatMode: React.FC<AgroChatModeProps> = ({ cropData, analysisResult, onStartOver }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage[] = [];
    if (analysisResult) {
      initial.push({
        id: 'initial',
        role: 'assistant',
        content: `${analysisResult.diagnosis}\n\nআমি বিশ্লেষণ সম্পন্ন করেছি। আপনার ফসলের সমস্যা সম্পর্কে আরও প্রশ্ন করতে পারেন!`,
      });
    } else {
      initial.push({
        id: 'initial',
        role: 'assistant',
        content: `আসসালামু আলাইকুম! আমি Sorix Agro, আপনার AI কৃষি সহকারী। ${cropData ? 'আপনার ফসলের সমস্যা সম্পর্কে ' : ''}কিভাবে সাহায্য করতে পারি?`,
      });
    }
    return initial;
  });
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoFocusInput(textareaRef, [isStreaming], isStreaming, true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const buildContext = (): { role: 'system'; content: string } => {
    let ctx = 'You are Sorix Agro, an AI agricultural assistant specialized for Bangladeshi farmers. Respond in a mix of Bangla and English.';
    if (cropData) {
      ctx += ` Crop: ${cropData.cropType}. Region: ${cropData.region}. Season: ${cropData.season}. Problem: ${cropData.problemDescription}`;
    }
    if (analysisResult) {
      ctx += ` Previous diagnosis: ${analysisResult.diagnosis}. Severity: ${analysisResult.severity}.`;
    }
    return { role: 'system', content: ctx };
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: input.trim() };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    const apiMessages = [
      buildContext(),
      ...messages.filter(m => m.id !== 'initial').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userMsg.content },
    ];

    agroApi.sendMessageStream(
      apiMessages,
      (delta) => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + delta } : m
        ));
      },
      () => setIsStreaming(false),
      (error) => {
        console.error('Agro chat error:', error);
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: 'দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।' } : m
        ));
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
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
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Leaf className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Sorix Agro</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
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

      <div className="shrink-0 border-t border-border p-4 pb-safe">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Button variant="outline" size="icon" onClick={onStartOver} className="shrink-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="আরও প্রশ্ন করুন..."
              className="min-h-[44px] max-h-32 pr-12 bg-card resize-none"
              rows={1}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="absolute right-1.5 bottom-1.5 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white"
            >
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgroChatMode;
