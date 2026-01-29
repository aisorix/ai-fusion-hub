import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, Code } from 'lucide-react';
import sorixLogo from '@/assets/logo.png';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { translations } from '@/lib/translations';
import { PlanIcon, PlanBadge, type PlanType } from './PlanIcons';

interface EmptyStateProps {
  userName: string;
}

const EmptyState = ({ userName }: EmptyStateProps) => {
  const { language, user, selectedModel, models } = useChatStore();
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
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 overflow-auto bg-background">
      {/* Logo + Greeting Combined */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-6 sm:mb-8 md:mb-10"
      >
        {/* Logo */}
        <div className="relative mb-4 sm:mb-5 md:mb-6">
          <div className="absolute inset-0 rounded-full blur-2xl scale-150 bg-gradient-to-r from-primary/30 to-accent/30" />
          <img 
            src={sorixLogo} 
            alt="AI Sorix" 
            className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain animate-float"
          />
        </div>

        {/* Greeting text */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1.5 sm:mb-2">
          {isBn ? 'হ্যালো, ' : 'Hello, '}
          <span className="gradient-text">{userName}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md px-2">
          {isBn ? 'আজ কী অন্বেষণ করতে চান?' : 'What would you like to explore today?'}
        </p>

        {/* Current Plan Display for paid users */}
        {isPaidUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <PlanIcon plan={user.plan as PlanType} size="md" showLabel />
          </motion.div>
        )}
      </motion.div>

      {/* Quick Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-xs sm:max-w-lg md:max-w-2xl"
      >
        {suggestions.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 bg-card border border-border hover:border-primary/50 hover:shadow-glow group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20">
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground">{item.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Features Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 sm:mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm px-2 text-muted-foreground"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
          <span>ChatGPT</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500" />
          <span>Claude</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500" />
          <span>Gemini</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
          <span>{isBn ? '+১০ আরও' : '+10 more'}</span>
        </div>
        {isPaidUser && (
          <PlanBadge plan={user.plan as PlanType} />
        )}
      </motion.div>
    </div>
  );
};

export default EmptyState;