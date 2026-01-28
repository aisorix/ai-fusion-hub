import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  className,
}) => {
  const active = isListening || isSpeaking;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer glow rings */}
      <motion.div
        className={cn(
          'absolute rounded-full',
          isListening ? 'bg-primary/20' : 'bg-emerald-500/20'
        )}
        animate={{
          width: active ? [120, 160, 120] : 100,
          height: active ? [120, 160, 120] : 100,
          opacity: active ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={cn(
          'absolute rounded-full',
          isListening ? 'bg-primary/30' : 'bg-emerald-500/30'
        )}
        animate={{
          width: active ? [100, 130, 100] : 80,
          height: active ? [100, 130, 100] : 80,
          opacity: active ? [0.4, 0.7, 0.4] : 0.3,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />

      {/* Main orb */}
      <motion.div
        className={cn(
          'relative w-24 h-24 rounded-full flex items-center justify-center',
          'bg-gradient-to-br shadow-lg',
          isListening 
            ? 'from-primary to-primary/60 shadow-primary/30' 
            : 'from-emerald-500 to-emerald-600 shadow-emerald-500/30'
        )}
        animate={{
          scale: active ? [1, 1.08, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner wave bars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-white/80"
              animate={{
                height: active 
                  ? [8, 24 + Math.random() * 16, 8] 
                  : 8,
              }}
              transition={{
                duration: 0.3 + Math.random() * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className={cn(
          'absolute bottom-0 px-3 py-1 rounded-full text-xs font-medium',
          isListening 
            ? 'bg-primary text-primary-foreground' 
            : isSpeaking 
            ? 'bg-emerald-500 text-white'
            : 'bg-muted text-muted-foreground'
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
      </motion.div>
    </div>
  );
};
