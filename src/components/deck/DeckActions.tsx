import React from 'react';
import { Download } from 'lucide-react';
import type { Slide } from '@/services/deckApi';

interface DeckActionsProps {
  slides: Slide[];
  title: string;
}

const DeckActions: React.FC<DeckActionsProps> = ({ slides, title }) => {
  if (slides.length === 0) return null;

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify({ title, slides }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadJSON}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 text-foreground transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Download JSON
      </button>
    </div>
  );
};

export default DeckActions;
