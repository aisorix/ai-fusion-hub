import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ImagineActions from './ImagineActions';

interface Props {
  imageUrl: string | null;
  isGenerating: boolean;
  prompt: string;
}

const ImagineCanvas: React.FC<Props> = ({ imageUrl, isGenerating, prompt }) => {
  if (isGenerating) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <div className="text-center max-w-xs">
          <p className="text-sm font-medium text-foreground">Creating your image…</p>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 italic">"{prompt}"</p>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full flex flex-col items-center gap-2 py-6">
        <p className="text-sm font-medium bg-gradient-to-r from-primary via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Describe anything. We'll create it.
        </p>
        <p className="text-[11px] text-muted-foreground/40">Powered by Flux AI</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 p-px bg-gradient-to-br from-primary/30 via-transparent to-pink-500/20"
      >
        <div className="rounded-2xl overflow-hidden bg-background">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full aspect-square object-cover"
          />
        </div>
      </motion.div>
      <div className="mt-4">
        <ImagineActions imageUrl={imageUrl} prompt={prompt} />
      </div>
    </div>
  );
};

export default ImagineCanvas;
