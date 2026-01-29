import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, Code } from 'lucide-react';
import sorixLogo from '@/assets/logo.png';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { translations } from '@/lib/translations';
import { ModelIcon } from './ModelIcons';
import { PlanBadge, type PlanType } from './PlanIcons';

interface EmptyStateProps {
  userName: string;
}

const EmptyState = ({ userName }: EmptyStateProps) => {
  const { language, user, selectedModel, models, theme } = useChatStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  const isBn = language === 'bn';
  const isPaidUser = user.plan !== 'free';
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  
  const suggestions = [
    { 
      icon: Code, 
      label: isBn ? 'কোড লিখুন' : 'Write code', 
      prompt: isBn ? 'একটি React কম্পোনেন্ট লিখতে সাহায্য করুন' : 'Help me write a React component' 
    },
    { 
      icon: MessageSquare, 
      label: isBn ? 'ব্যাখ্যা করুন' : 'Explain', 
      prompt: isBn ? 'কোয়ান্টাম কম্পিউটিং সহজভাবে ব্যাখ্যা করুন' : 'Explain quantum computing simply' 
    },
    { 
      icon: Zap, 
      label: isBn ? 'আইডিয়া' : 'Brainstorm', 
      prompt: isBn ? 'AI-তে স্টার্টআপ আইডিয়া দিন' : 'Give me startup ideas in AI' 
    },
    { 
      icon: Sparkles, 
      label: isBn ? 'তৈরি করুন' : 'Create', 
      prompt: isBn ? 'মহাকাশ নিয়ে একটি ছোট গল্প লিখুন' : 'Write a short story about space' 
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 overflow-auto bg-background">
      {/* Logo + Greeting Combined */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-6 sm:mb-8"
      >
        {/* Logo with Model Icon */}
        <div className="relative mb-4 sm:mb-5">
          <div className="absolute inset-0 rounded-full blur-2xl scale-150 bg-gradient-to-r from-primary/20 to-accent/20" />
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
            <ModelIcon 
              modelId={selectedModel} 
              modelName={currentModel.name} 
              size="lg" 
              className="w-full h-full"
              showGlow={isPaidUser}
              theme={theme}
            />
          </div>
        </div>

        {/* Greeting text */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-1">
          {isBn ? 'হ্যালো, ' : 'Hello, '}
          <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xs sm:max-w-sm px-2">
          {isBn ? 'আজ কী অন্বেষণ করতে চান?' : 'How can I help you today?'}
        </p>

        {/* Current Model Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/50"
        >
          <ModelIcon modelId={selectedModel} modelName={currentModel.name} size="xs" theme={theme} />
          <span className="text-xs text-muted-foreground">{currentModel.name}</span>
          {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
        </motion.div>
      </motion.div>

      {/* Quick Suggestions - 2x2 grid on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-xs sm:max-w-md"
      >
        {suggestions.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/30 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 bg-primary/10 group-hover:bg-primary/20">
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground">{item.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Features Banner with Model Icons - Hidden on mobile for cleaner look */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="hidden sm:flex mt-8 flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <ModelIcon modelId="chatgpt" modelName="ChatGPT" size="xs" theme={theme} />
          <span>ChatGPT</span>
        </div>
        <div className="flex items-center gap-2">
          <ModelIcon modelId="claude" modelName="Claude" size="xs" theme={theme} />
          <span>Claude</span>
        </div>
        <div className="flex items-center gap-2">
          <ModelIcon modelId="gemini" modelName="Gemini" size="xs" theme={theme} />
          <span>Gemini</span>
        </div>
        <div className="flex items-center gap-2">
          <ModelIcon modelId="deepseek" modelName="DeepSeek" size="xs" theme={theme} />
          <span>{isBn ? '+১০ আরও' : '+10 more'}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;