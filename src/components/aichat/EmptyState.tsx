import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, Code, Crown, Star, Rocket } from 'lucide-react';
import sorixLogo from '@/assets/logo.png';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { translations } from '@/lib/translations';
import { ModelIcon } from './ModelIcons';

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
    <div className={cn(
      "flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 overflow-auto",
      isPaidUser && "bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
    )}>
      {/* Logo + Greeting Combined */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-6 sm:mb-8 md:mb-10"
      >
        {/* Logo with enhanced glow for paid users */}
        <div className="relative mb-4 sm:mb-5 md:mb-6">
          <div className={cn(
            "absolute inset-0 rounded-full blur-2xl scale-150",
            isPaidUser 
              ? "bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 animate-pulse" 
              : "bg-gradient-to-r from-primary/30 to-accent/30"
          )} />
          <img 
            src={sorixLogo} 
            alt="AI Sorix" 
            className={cn(
              "relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain animate-float",
              isPaidUser && "drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)]"
            )}
          />
          {isPaidUser && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
            >
              <Crown className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>

        {/* Greeting text - Enhanced for paid users */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1.5 sm:mb-2">
          {isBn ? 'হ্যালো, ' : 'Hello, '}
          <span className={cn(
            isPaidUser 
              ? "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient" 
              : "gradient-text"
          )}>{userName}</span>
          {isPaidUser && <span className="ml-1">✨</span>}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md px-2">
          {isBn ? 'আজ কী অন্বেষণ করতে চান?' : 'What would you like to explore today?'}
        </p>

        {/* Current Model Display for paid users */}
        {isPaidUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <ModelIcon modelId={currentModel.id} modelName={currentModel.name} size="sm" showGlow />
            <span className="text-sm font-medium">{currentModel.name}</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded font-medium">Active</span>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Suggestions - Enhanced for paid users */}
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
            className={cn(
              'flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200',
              'bg-card border group relative overflow-hidden',
              isPaidUser 
                ? 'border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20' 
                : 'border-border hover:border-primary/50 hover:shadow-glow'
            )}
          >
            {/* Premium shimmer effect */}
            {isPaidUser && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
            <div className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 relative z-10',
              isPaidUser 
                ? 'bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30' 
                : 'bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20'
            )}>
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground relative z-10">{item.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Features Banner - Enhanced for paid users */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={cn(
          "mt-6 sm:mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm px-2",
          isPaidUser ? "text-foreground/80" : "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={cn(
            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
            isPaidUser ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-green-500"
          )} />
          <span>ChatGPT</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={cn(
            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
            isPaidUser ? "bg-purple-500 shadow-lg shadow-purple-500/50" : "bg-purple-500"
          )} />
          <span>Claude</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={cn(
            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
            isPaidUser ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-blue-500"
          )} />
          <span>Gemini</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={cn(
            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
            isPaidUser ? "bg-primary shadow-lg shadow-primary/50" : "bg-primary"
          )} />
          <span>{isBn ? '+১০ আরও' : '+10 more'}</span>
        </div>
        {isPaidUser && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <Crown className="w-3 h-3 text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Premium Active</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyState;