import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthResultsCardProps {
  type: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  children: React.ReactNode;
}

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const styleMap = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-500',
    title: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-500',
    title: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-500',
    title: 'text-amber-600 dark:text-amber-400',
  },
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-500',
    title: 'text-red-600 dark:text-red-400',
  },
};

const HealthResultsCard: React.FC<HealthResultsCardProps> = ({
  type,
  title,
  children,
}) => {
  const Icon = iconMap[type];
  const styles = styleMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-4 my-3",
        styles.bg,
        styles.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-sm mb-2", styles.title)}>
            {title}
          </h4>
          <div className="text-sm text-foreground/80">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthResultsCard;
