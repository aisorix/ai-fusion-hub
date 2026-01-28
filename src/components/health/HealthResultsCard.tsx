import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthResult {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  details?: string[];
}

interface HealthResultsCardProps {
  results: HealthResult[];
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-500',
    title: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-500',
    title: 'text-amber-600 dark:text-amber-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-500',
    title: 'text-red-600 dark:text-red-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-500',
    title: 'text-blue-600 dark:text-blue-400',
  },
};

export const HealthResultsCard: React.FC<HealthResultsCardProps> = ({ results }) => {
  return (
    <div className="space-y-3 mt-4">
      {results.map((result, index) => {
        const Icon = icons[result.type];
        const style = styles[result.type];

        return (
          <Card key={index} className={cn('border', style.border, style.bg)}>
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className={cn('h-4 w-4', style.icon)} />
                <span className={style.title}>{result.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <p className="text-sm text-muted-foreground">{result.description}</p>
              {result.details && result.details.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {result.details.map((detail, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
