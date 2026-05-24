// Reusable mic button: idle → recording (live waveform) → transcribing.
import { Mic, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceDictation } from '@/hooks/useVoiceDictation';

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language?: string;
  className?: string;
  size?: 'sm' | 'md';
  title?: string;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const VoiceDictationButton = ({ onTranscript, disabled, language, className, size = 'md', title }: Props) => {
  const { status, volumeLevel, elapsed, start, stop, cancel } = useVoiceDictation({
    onTranscript,
    language,
  });

  const isRecording = status === 'recording';
  const isTranscribing = status === 'transcribing';
  const padding = size === 'sm' ? 'p-2' : 'p-2 sm:p-2.5';

  if (isTranscribing) {
    return (
      <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary', className)}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs font-medium">
          {language === 'bn' ? 'রূপান্তর হচ্ছে…' : 'Transcribing…'}
        </span>
      </div>
    );
  }

  if (isRecording) {
    // 5-bar live waveform
    const bars = Array.from({ length: 5 }, (_, i) => {
      const seed = 0.3 + Math.abs(Math.sin((i + 1) * 1.2)) * 0.4;
      const h = Math.max(0.18, Math.min(1, seed * 0.4 + volumeLevel * 1.4));
      return h;
    });
    return (
      <div className={cn('flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full bg-destructive/10 border border-destructive/30', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
        <div className="flex items-end gap-[2px] h-5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-destructive transition-[height] duration-75"
              style={{ height: `${Math.round(h * 100)}%` }}
            />
          ))}
        </div>
        <span className="text-[11px] font-mono tabular-nums text-destructive">{fmt(elapsed)}</span>
        <button
          type="button"
          onClick={stop}
          className="ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-destructive text-destructive-foreground hover:opacity-90"
          title={language === 'bn' ? 'সম্পন্ন' : 'Done'}
        >
          {language === 'bn' ? 'সম্পন্ন' : 'Done'}
        </button>
        <button
          type="button"
          onClick={cancel}
          className="p-1 rounded-full text-destructive hover:bg-destructive/20"
          title={language === 'bn' ? 'বাতিল' : 'Cancel'}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={disabled}
      className={cn(
        padding,
        'rounded-full transition-all duration-200 relative',
        'hover:bg-background text-muted-foreground hover:text-primary',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      title={title || (language === 'bn' ? 'ভয়েস থেকে টেক্সট' : 'Voice to text')}
      aria-label="Voice to text"
    >
      <Mic className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
    </button>
  );
};

export default VoiceDictationButton;
