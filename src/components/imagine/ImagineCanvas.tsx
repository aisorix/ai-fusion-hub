import React from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Sparkles } from 'lucide-react';
import ImagineActions from './ImagineActions';

interface Props {
  imageUrl: string | null;
  isGenerating: boolean;
  prompt: string;
}

const ImagineCanvas: React.FC<Props> = ({ imageUrl, isGenerating, prompt }) => {
  if (isGenerating) {
    return (
      <div className="w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 animate-pulse [animation-delay:500ms]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>
          <div className="text-center px-6">
            <p className="text-sm font-medium text-foreground">Creating your image...</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">"{prompt}"</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full max-w-lg mx-auto aspect-square rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-3 bg-muted/10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Your creation will appear here</p>
          <p className="text-xs text-muted-foreground/60 mt-1">12,000 tokens per image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/30"
      >
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full aspect-square object-cover"
        />
      </motion.div>
      <div className="mt-4">
        <ImagineActions imageUrl={imageUrl} prompt={prompt} />
      </div>
    </div>
  );
};

export default ImagineCanvas;
