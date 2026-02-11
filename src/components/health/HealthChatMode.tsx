import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, RotateCcw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { healthApi } from '@/services/healthApi';
import type { PatientData, AnalysisResult } from '@/pages/HealthPage';

interface HealthChatModeProps {
  patientData: PatientData | null;
  analysisResult: AnalysisResult | null;
  onStartOver: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const HealthChatMode: React.FC<HealthChatModeProps> = ({ patientData, analysisResult, onStartOver }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage[] = [];
    if (analysisResult) {
      initial.push({
        id: 'initial',
        role: 'assistant',
        content: `${analysisResult.summary}\n\nI've completed the analysis. Feel free to ask me any follow-up questions about your health concerns, medications, test results, or anything else!`,
      });
    } else {
      initial.push({
        id: 'initial',
        role: 'assistant',
        content: `Hello! I'm Sorix Health, your AI medical assistant. ${patientData ? `I see you have some health concerns. ` : ''}How can I help you today?`,
      });
    }
    return initial;
  });
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const buildContext = (): { role: 'system'; content: string } => {
    let ctx = 'You are Sorix Health, an AI medical assistant.';
    if (patientData) {
      ctx += ` Patient: ${patientData.gender}, ${patientData.age} years old, ${patientData.weight}${patientData.weightUnit}, ${patientData.height}${patientData.heightUnit}. Category: ${patientData.patientCategory}. Symptoms: ${patientData.symptoms}`;
    }
    if (analysisResult) {
      ctx += ` Previous analysis summary: ${analysisResult.summary}`;
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

    healthApi.sendMessageStream(
      apiMessages,
      'general',
      (delta) => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + delta } : m
        ));
      },
      () => setIsStreaming(false),
      (error) => {
        console.error('Health chat error:', error);
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: 'Sorry, something went wrong. Please try again.' } : m
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
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'max-w-2xl',
              msg.role === 'user' ? 'ml-auto' : ''
            )}
          >
            <div className={cn(
              'p-4 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-card border border-border rounded-bl-md'
            )}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Sorix Health</span>
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

      {/* Input */}
      <div className="shrink-0 border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Button variant="outline" size="icon" onClick={onStartOver} className="shrink-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question..."
              className="min-h-[44px] max-h-32 pr-12 bg-card resize-none"
              rows={1}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="absolute right-1.5 bottom-1.5 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 text-white"
            >
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthChatMode;
