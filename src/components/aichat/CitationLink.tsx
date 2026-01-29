import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface CitationLinkProps {
  index: number;
  url: string;
  theme: 'light' | 'dark';
}

const CitationLink = memo(({ index, url, theme }: CitationLinkProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-semibold',
        'transition-all hover:scale-110',
        theme === 'dark'
          ? 'bg-primary/20 text-primary hover:bg-primary/30'
          : 'bg-primary/10 text-primary hover:bg-primary/20'
      )}
      title={`Source ${index}: ${url}`}
    >
      {index}
    </a>
  );
});

CitationLink.displayName = 'CitationLink';

export default CitationLink;