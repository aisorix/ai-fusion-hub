import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourcesWidgetProps {
  citations: string[];
  theme: 'light' | 'dark';
}

// Extract domain from URL
const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Get favicon URL
const getFaviconUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return '';
  }
};

const SourcesWidget = memo(({ citations, theme }: SourcesWidgetProps) => {
  if (!citations || citations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mt-4 pt-4 border-t border-border/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Sources ({citations.length})
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {citations.map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              'border hover:shadow-sm',
              theme === 'dark'
                ? 'bg-muted/50 border-border/50 hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground'
                : 'bg-muted/30 border-border/30 hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground'
            )}
          >
            <span className={cn(
              'flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold',
              'bg-primary/10 text-primary'
            )}>
              {index + 1}
            </span>
            <img 
              src={getFaviconUrl(url)} 
              alt="" 
              className="w-3.5 h-3.5 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="max-w-[120px] truncate">
              {getDomain(url)}
            </span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </motion.div>
  );
});

SourcesWidget.displayName = 'SourcesWidget';

export default SourcesWidget;