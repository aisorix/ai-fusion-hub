// Floating "now reading" bar — pairs with useTtsPlayback.
// Speed and voice controls so users can customize narration.
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, X, Volume2, Loader2, Gauge, Mic2, ChevronDown, Check } from 'lucide-react';
import { useTtsPlayback, VOICE_OPTIONS, SPEED_OPTIONS } from '@/hooks/useTtsPlayback';
import { cn } from '@/lib/utils';

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
};

const ReadAloudBar = () => {
  const {
    activeId, status, text, position, duration,
    speed, voice, pause, resume, stop, setSpeed, setVoice,
  } = useTtsPlayback();
  const [openMenu, setOpenMenu] = useState<'none' | 'speed' | 'voice'>('none');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenu === 'none') return;
    const fn = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenMenu('none');
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [openMenu]);

  const visible = !!activeId && status !== 'idle';
  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;
  const activeVoice = VOICE_OPTIONS.find(v => v.id === voice) || VOICE_OPTIONS[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[min(640px,calc(100%-1.5rem))]"
        >
          <div ref={menuRef} className="pointer-events-auto relative rounded-2xl shadow-xl border border-border bg-card/95 backdrop-blur px-3 py-2 flex items-center gap-2">
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
              <div className="text-[11px] text-muted-foreground truncate">
                <span className="font-medium text-foreground mr-1">Reading:</span>
                {text}
              </div>
              <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <span className="hidden sm:inline text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
              {fmt(position)} / {fmt(duration)}
            </span>

            {/* Speed */}
            <div className="relative shrink-0">
              <button
                onClick={() => setOpenMenu(openMenu === 'speed' ? 'none' : 'speed')}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border border-border hover:bg-muted',
                  openMenu === 'speed' && 'bg-muted'
                )}
                title="Playback speed"
              >
                <Gauge className="w-3 h-3" />
                {speed}×
              </button>
              {openMenu === 'speed' && (
                <div className="absolute right-0 bottom-full mb-2 rounded-xl border border-border bg-popover shadow-lg py-1 min-w-[110px] z-10">
                  {SPEED_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSpeed(s); setOpenMenu('none'); }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-1.5 text-[12px] hover:bg-muted',
                        s === speed && 'text-primary font-semibold'
                      )}
                    >
                      <span>{s}×</span>
                      {s === speed && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice */}
            <div className="relative shrink-0">
              <button
                onClick={() => setOpenMenu(openMenu === 'voice' ? 'none' : 'voice')}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border border-border hover:bg-muted',
                  openMenu === 'voice' && 'bg-muted'
                )}
                title="Voice"
              >
                <Mic2 className="w-3 h-3" />
                <span className="hidden sm:inline">{activeVoice.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {openMenu === 'voice' && (
                <div className="absolute right-0 bottom-full mb-2 rounded-xl border border-border bg-popover shadow-lg py-1 min-w-[180px] max-h-[280px] overflow-y-auto z-10">
                  {VOICE_OPTIONS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setVoice(v.id); setOpenMenu('none'); }}
                      className={cn(
                        'w-full flex items-start gap-2 px-3 py-1.5 text-left hover:bg-muted',
                        v.id === voice && 'bg-primary/5'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-[12px] font-medium', v.id === voice ? 'text-primary' : 'text-foreground')}>
                          {v.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{v.desc}</div>
                      </div>
                      {v.id === voice && <Check className="w-3 h-3 text-primary mt-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
