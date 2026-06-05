import React from 'react';
import { motion } from 'framer-motion';
import { Film, Download, Share2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AnalysisTimer from '@/components/shared/AnalysisTimer';
import type { VideoAspect } from './cineshootModels';

interface Props {
  videoUrl: string | null;
  isGenerating: boolean;
  prompt: string;
  aspect: VideoAspect;
  onGenerateImage?: (prompt: string) => void;
}

const aspectToClass = (a: VideoAspect) =>
  a === '1:1' ? 'aspect-square' : a === '9:16' ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-[16/9]';

const downloadVideo = async (url: string) => {
  // Try blob-based download first (works when CORS allows)
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('fetch failed');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `sorix-cineshoot-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    toast.success('Downloaded');
    return;
  } catch {
    // Fallback: open in new tab so the browser handles save
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.info('Opening video in a new tab — right-click to save');
  }
};

const CineshootCanvas: React.FC<Props> = ({ videoUrl, isGenerating, prompt, aspect }) => {
  const cls = aspectToClass(aspect);
  const [copied, setCopied] = React.useState(false);

  if (isGenerating) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'relative w-full rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60',
            'shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.25),0_0_0_1px_hsl(var(--border)/0.4)]',
            cls
          )}
        >
          <motion.div
            className="absolute -inset-8 rounded-3xl opacity-40 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.4), transparent 60%), radial-gradient(circle at 70% 70%, hsl(280 80% 60% / 0.35), transparent 60%)' }}
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-y-0 -left-1/3 w-1/3"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--foreground)/0.08) 50%, transparent)' }}
            animate={{ x: ['0%', '400%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/30 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }}
              className="p-3 rounded-full bg-background/60 backdrop-blur-md shadow-lg"
            >
              <Film className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
        </motion.div>
        <div className="text-center max-w-md">
          <p className="text-sm font-semibold bg-gradient-to-r from-primary via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Rendering your video…
          </p>
          {prompt && <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">"{prompt}"</p>}
          <AnalysisTimer isActive={isGenerating} />
          <p className="text-[10.5px] text-muted-foreground/60 mt-1">Video generation can take 1–3 minutes</p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="w-full flex flex-col items-center gap-2 py-8">
        <p className="text-sm font-medium bg-gradient-to-r from-primary via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Describe anything. We'll bring it to life.
        </p>
        <p className="text-[11px] text-muted-foreground/50">Powered by Sorix Cineshoot</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'relative rounded-2xl overflow-hidden p-px',
          'bg-gradient-to-br from-primary/30 via-transparent to-pink-500/20',
          'shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)]'
        )}
      >
        <div className="rounded-2xl overflow-hidden bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            className={cn('w-full', cls, 'object-contain bg-black')}
          />
        </div>
      </motion.div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={() => downloadVideo(videoUrl)}>
          <Download className="w-3.5 h-3.5" /> Download MP4
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={async () => {
          if (navigator.share) { try { await navigator.share({ title: 'Sorix Cineshoot', text: prompt, url: videoUrl }); } catch {} }
          else { await navigator.clipboard.writeText(videoUrl); toast.success('Link copied'); }
        }}>
          <Share2 className="w-3.5 h-3.5" /> Share
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={async () => {
          await navigator.clipboard.writeText(videoUrl);
          setCopied(true); toast.success('Link copied'); setTimeout(() => setCopied(false), 2000);
        }}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
};

export default CineshootCanvas;
