// Floating "now reading" bar — pairs with useTtsPlayback so users always know what's being read.
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, X, Volume2, Loader2 } from 'lucide-react';
import { useTtsPlayback } from '@/hooks/useTtsPlayback';

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
};

const ReadAloudBar = () => {
  const { activeId, status, text, position, duration, pause, resume, stop } = useTtsPlayback();
  const visible = !!activeId && status !== 'idle';
  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[min(560px,calc(100%-2rem))]"
        >
          <div className="pointer-events-auto rounded-full shadow-lg border border-border bg-card/95 backdrop-blur px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>

            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
            ) : status === 'playing' ? (
              <button onClick={pause} className="p-1.5 rounded-full hover:bg-muted text-foreground shrink-0" title="Pause">
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={resume} className="p-1.5 rounded-full hover:bg-muted text-foreground shrink-0" title="Play">
                <Play className="w-4 h-4" />
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground truncate">
                <span className="font-medium text-foreground mr-1">Reading:</span>
                {text}
              </div>
              <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
              {fmt(position)} / {fmt(duration)}
            </span>

            <button onClick={stop} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground shrink-0" title="Stop">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadAloudBar;
