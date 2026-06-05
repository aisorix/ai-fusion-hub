import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  cost: number;
  remaining: number;
  label?: string;
  hint?: string;
  className?: string;
}

/**
 * Prominent token-cost indicator used across Imagine / Cineshoot / Deck / FlowBuilder.
 * Highlights the per-run cost in primary color and warns when balance is insufficient.
 */
const TokenCostChip: React.FC<Props> = ({
  cost,
  remaining,
  label = 'per run',
  hint,
  className,
}) => {
  const insufficient = remaining < cost;

  return (
    <div
      title={hint}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-medium',
        'bg-gradient-to-r from-primary/5 via-card/80 to-primary/5 backdrop-blur-sm',
        insufficient
          ? 'border-amber-500/40 shadow-[0_0_0_3px_hsl(var(--background))]'
          : 'border-primary/25 shadow-[0_2px_10px_-2px_hsl(var(--primary)/0.2)]',
        className
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
          'bg-primary/15 text-primary font-bold'
        )}
      >
        <Zap className="w-3 h-3 fill-current" strokeWidth={2.5} />
        <span className="tabular-nums">{cost.toLocaleString()}</span>
      </span>
      <span className="text-foreground/80">{label}</span>
      <span className="text-muted-foreground/40">·</span>
      <span
        className={cn(
          'inline-flex items-center gap-1 tabular-nums',
          insufficient ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-muted-foreground'
        )}
      >
        {insufficient && <AlertCircle className="w-3 h-3" />}
        {remaining.toLocaleString()} left
      </span>
    </div>
  );
};

export default TokenCostChip;
