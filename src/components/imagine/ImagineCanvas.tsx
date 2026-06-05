import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ImagineActions from './ImagineActions';
import AnalysisTimer from '@/components/shared/AnalysisTimer';
import { cn } from '@/lib/utils';
import type { AspectRatio } from './ImagineOptionsPanel';

interface Props {
  imageUrls: string[];
  isGenerating: boolean;
  prompt: string;
  aspect: AspectRatio;
  count: number;
  onGenerateVideo?: (url: string, prompt: string) => void;
}

const aspectToClass = (a: AspectRatio): string => {
  switch (a) {
    case '1:1': return 'aspect-square';
    case '16:9': return 'aspect-[16/9]';
    case '9:16': return 'aspect-[9/16]';
    case '4:3': return 'aspect-[4/3]';
    case '3:4': return 'aspect-[3/4]';
    case '3:2': return 'aspect-[3/2]';
    case '2:3': return 'aspect-[2/3]';
    case '21:9': return 'aspect-[21/9]';
    default: return 'aspect-square';
  }
};

const Skeleton: React.FC<{ aspectClass: string; index: number }> = ({ aspectClass, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    className={cn(
      'relative w-full rounded-2xl overflow-hidden',
      'bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60',
      'shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.25),0_0_0_1px_hsl(var(--border)/0.4)]',
      aspectClass
    )}
  >
    {/* Soft ambient glow */}
    <motion.div
      className="absolute -inset-8 rounded-3xl opacity-40 blur-3xl pointer-events-none"
      style={{
        background:
          'radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.4), transparent 60%), radial-gradient(circle at 70% 70%, hsl(330 80% 60% / 0.35), transparent 60%)',
      }}
      animate={{ opacity: [0.3, 0.55, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Shimmer sweep */}
    <motion.div
      className="absolute inset-y-0 -left-1/3 w-1/3"
      style={{
        background:
          'linear-gradient(90deg, transparent, hsl(var(--foreground)/0.08) 50%, transparent)',
      }}
      animate={{ x: ['0%', '400%'] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
    />

    {/* Pulsing ring border */}
    <motion.div
      className="absolute inset-0 rounded-2xl border-2 border-primary/30 pointer-events-none"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Center sparkle */}
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }}
        className="p-3 rounded-full bg-background/60 backdrop-blur-md shadow-lg"
      >
        <Sparkles className="w-5 h-5 text-primary" />
      </motion.div>
    </div>
  </motion.div>
);

const ImagineCanvas: React.FC<Props> = ({ imageUrls, isGenerating, prompt, aspect, count, onGenerateVideo }) => {
  const aspectClass = aspectToClass(aspect);
  const gridCols = count === 1 ? 'grid-cols-1' : count === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2';

  if (isGenerating) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-5">
        <div className={cn('w-full grid gap-4', gridCols)}>
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} aspectClass={aspectClass} index={i} />
          ))}
        </div>
        <div className="text-center max-w-md">
          <p className="text-sm font-semibold bg-gradient-to-r from-primary via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Painting your vision…
          </p>
          {prompt && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">"{prompt}"</p>
          )}
          <AnalysisTimer isActive={isGenerating} />
        </div>
      </div>
    );
  }

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-2 py-8">
        <p className="text-sm font-medium bg-gradient-to-r from-primary via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Describe anything. We'll create it.
        </p>
        <p className="text-[11px] text-muted-foreground/50">Powered by Sorix Imagine</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={cn('grid gap-4', gridCols)}>
        {imageUrls.map((url, i) => (
          <motion.div
            key={url + i}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={cn(
              'relative rounded-2xl overflow-hidden p-px',
              'bg-gradient-to-br from-primary/30 via-transparent to-pink-500/20',
              'shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)]'
            )}
          >
            <div className="rounded-2xl overflow-hidden bg-background">
              <img src={url} alt={prompt} className={cn('w-full object-cover', aspectClass)} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4">
        <ImagineActions imageUrl={imageUrls[0]} prompt={prompt} />
      </div>
    </div>
  );
};

export default ImagineCanvas;
