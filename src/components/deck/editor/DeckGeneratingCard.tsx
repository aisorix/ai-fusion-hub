import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeckTheme } from '../DeckThemePicker';

const themeClasses: Record<string, { card: string; heading: string; text: string; badge: string; line: string }> = {
  dark:        { card: 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700', heading: 'text-white',     text: 'text-gray-300', badge: 'bg-cyan-500/20 text-cyan-300', line: 'bg-white/15' },
  minimalist:  { card: 'bg-white border-gray-200',                                    heading: 'text-gray-900',  text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600',     line: 'bg-gray-200' },
  pearl:       { card: 'bg-gray-100 border-gray-200',                                 heading: 'text-gray-900',  text: 'text-gray-600', badge: 'bg-gray-200 text-gray-600',     line: 'bg-gray-300' },
  creme:       { card: 'bg-stone-200 border-stone-300',                               heading: 'text-stone-800', text: 'text-stone-500',badge: 'bg-stone-300 text-stone-600',    line: 'bg-stone-300' },
  default:     { card: 'bg-card border-border',                                       heading: 'text-foreground',text: 'text-muted-foreground', badge: 'bg-primary/10 text-primary', line: 'bg-foreground/15' },
};

const pick = (t: DeckTheme) => themeClasses[t] || themeClasses.default;

interface Props {
  theme: DeckTheme;
  index: number;
  visibleLines?: number; // 0..5
  className?: string;
}

const LINE_WIDTHS = ['75%', '92%', '68%', '85%', '60%'];

const DeckGeneratingCard: React.FC<Props> = ({ theme, index, visibleLines = 0, className }) => {
  const tc = pick(theme);
  const headingVisible = visibleLines >= 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 4) * 0.06 }}
      className={cn(
        'relative rounded-2xl border overflow-hidden aspect-video p-5 md:p-8 flex flex-col gap-4',
        tc.card,
        className,
      )}
    >
      {/* Top row: slide number + AI generating badge */}
      <div className="flex items-center justify-between">
        <div className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full w-fit', tc.badge)}>
          {index + 1}
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium text-primary bg-primary/10 border border-primary/20 backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          AI generating
          <span className="ml-0.5 w-1 h-1 rounded-full bg-primary deck-pulse-dot" />
        </span>
      </div>

      {/* Heading skeleton */}
      <div className="relative">
        {headingVisible ? (
          <div className={cn('h-7 md:h-9 rounded-md deck-shimmer')} style={{ width: '70%' }} />
        ) : (
          <div className={cn('h-7 md:h-9 rounded-md', tc.line, 'opacity-40')} style={{ width: '40%' }} />
        )}
      </div>


      {/* Body lines */}
      <div className="flex flex-col gap-2.5 mt-1">
        {LINE_WIDTHS.map((w, i) => {
          const reveal = visibleLines >= i + 2;
          if (!reveal) {
            return <div key={i} className={cn('h-3 rounded-full opacity-15', tc.line)} style={{ width: w }} />;
          }
          return (
            <div
              key={i}
              className={cn('h-3 rounded-full deck-shimmer deck-line')}
              style={{ ['--w' as any]: w }}
            />
          );
        })}
      </div>

      {/* Image area shimmer */}
      <div className="mt-auto h-2/5 rounded-xl deck-shimmer opacity-90" />
    </motion.div>
  );
};

export default DeckGeneratingCard;
