// Plan Icons Component - Displays plan-specific icons (Basic, Pro, Premium)
import React from 'react';
import { Zap, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlanType = 'free' | 'basic' | 'pro' | 'premium';

interface PlanIconProps {
  plan: PlanType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const PlanIcon = ({ plan, size = 'md', className, showLabel = false }: PlanIconProps) => {
  const getIconConfig = () => {
    switch (plan) {
      case 'basic':
        return {
          icon: Zap,
          bgClass: 'bg-gradient-to-br from-cyan-400 to-teal-500',
          label: 'Sorix Basic',
        };
      case 'pro':
        return {
          icon: Sparkles,
          bgClass: 'bg-gradient-to-br from-cyan-400 to-teal-500',
          label: 'Sorix Pro',
        };
      case 'premium':
        return {
          icon: Crown,
          bgClass: 'bg-gradient-to-br from-pink-400 to-rose-500',
          label: 'Sorix Premium',
        };
      default:
        return {
          icon: Zap,
          bgClass: 'bg-gradient-to-br from-gray-400 to-gray-500',
          label: 'Sorix Free',
        };
    }
  };

  const { icon: Icon, bgClass, label } = getIconConfig();

  if (showLabel) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn(
          'rounded-xl flex items-center justify-center shadow-md',
          sizeClasses[size],
          bgClass
        )}>
          <Icon className={cn('text-white', iconSizeClasses[size])} />
        </div>
        <span className={cn('font-medium text-foreground', textSizeClasses[size])}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center shadow-md flex-shrink-0',
      sizeClasses[size],
      bgClass,
      className
    )}>
      <Icon className={cn('text-white', iconSizeClasses[size])} />
    </div>
  );
};

// Plan Badge - smaller inline badge for headers
export const PlanBadge = ({ plan, className }: { plan: PlanType; className?: string }) => {
  if (plan === 'free') return null;

  const getBadgeConfig = () => {
    switch (plan) {
      case 'basic':
        return {
          label: 'BASIC',
          bgClass: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        };
      case 'pro':
        return {
          label: 'PRO',
          bgClass: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        };
      case 'premium':
        return {
          label: 'PREMIUM',
          bgClass: 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30',
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  return (
    <span className={cn(
      'px-1.5 py-0.5 text-[10px] font-semibold rounded border',
      config.bgClass,
      className
    )}>
      {config.label}
    </span>
  );
};

export default PlanIcon;
