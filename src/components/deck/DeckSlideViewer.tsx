import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AnalysisTimer from '@/components/shared/AnalysisTimer';
import DeckSlideCard from './DeckSlideCard';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from './DeckThemePicker';

interface DeckSlideViewerProps {
  slides: Slide[];
  theme: DeckTheme;
  isGenerating: boolean;
  skeletonCount: number;
  onUpdateSlide?: (index: number, updated: Slide) => void;
  onRegenerateImage?: (slideIndex: number, imagePrompt: string) => void;
}

const DeckSlideViewer: React.FC<DeckSlideViewerProps> = ({
  slides,
  theme,
  isGenerating,
  skeletonCount,
  onUpdateSlide,
  onRegenerateImage,
}) => {
  if (isGenerating && slides.length === 0) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Generating presentation</span>
          <AnalysisTimer isActive={true} />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-video rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="w-full grid gap-4">
      {slides.map((slide, i) => (
        <DeckSlideCard
          key={i}
          slide={slide}
          theme={theme}
          index={i}
          onUpdateSlide={onUpdateSlide ? (updated) => onUpdateSlide(i, updated) : undefined}
          onRegenerateImage={onRegenerateImage}
        />
      ))}
    </div>
  );
};

export default DeckSlideViewer;
