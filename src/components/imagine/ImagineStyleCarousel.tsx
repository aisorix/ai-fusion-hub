import React from 'react';
import { cn } from '@/lib/utils';

export interface StyleOption {
  id: string;
  name: string;
  modifier: string;
  emoji: string;
  gradient: string;
}

export const trendingStyles: StyleOption[] = [
  { id: 'none', name: 'No Style', modifier: '', emoji: '✨', gradient: 'from-gray-500 to-gray-600' },
  { id: 'caricature', name: 'Caricature', modifier: 'in caricature cartoon style, exaggerated features', emoji: '🎭', gradient: 'from-orange-500 to-red-500' },
  { id: 'flower-petals', name: 'Flower Petals', modifier: 'surrounded by delicate flower petals, dreamy floral aesthetic', emoji: '🌸', gradient: 'from-pink-400 to-rose-500' },
  { id: 'gold', name: 'Gold Luxury', modifier: 'golden luxury aesthetic, gold leaf, metallic shine', emoji: '✨', gradient: 'from-yellow-500 to-amber-600' },
  { id: 'crayon', name: 'Crayon Art', modifier: 'in crayon drawing style, childlike colorful art', emoji: '🖍️', gradient: 'from-green-400 to-teal-500' },
  { id: 'neon-glow', name: 'Neon Glow', modifier: 'neon glow aesthetic, vibrant neon lights, cyberpunk atmosphere', emoji: '💜', gradient: 'from-purple-500 to-pink-500' },
  { id: 'anime', name: 'Anime', modifier: 'anime art style, Japanese animation aesthetic', emoji: '🎌', gradient: 'from-blue-400 to-indigo-500' },
  { id: 'watercolor', name: 'Watercolor', modifier: 'watercolor painting style, soft washes of color', emoji: '🎨', gradient: 'from-cyan-400 to-blue-500' },
  { id: 'cyberpunk', name: 'Cyberpunk', modifier: 'cyberpunk dystopian style, neon city, futuristic tech', emoji: '🤖', gradient: 'from-violet-500 to-fuchsia-500' },
  { id: 'oil-painting', name: 'Oil Painting', modifier: 'classic oil painting style, rich texture, Renaissance', emoji: '🖼️', gradient: 'from-amber-600 to-orange-700' },
  { id: 'pixel-art', name: 'Pixel Art', modifier: 'pixel art retro gaming style, 8-bit aesthetic', emoji: '👾', gradient: 'from-emerald-500 to-green-600' },
  { id: 'clouds', name: 'Dreamy Clouds', modifier: 'surreal cloud aesthetic, dreamy sky, soft ethereal atmosphere', emoji: '☁️', gradient: 'from-sky-300 to-blue-400' },
];

interface Props {
  selectedStyle: string;
  onSelectStyle: (style: StyleOption) => void;
}

const ImagineStyleCarousel: React.FC<Props> = ({ selectedStyle, onSelectStyle }) => {
  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
        Trending Styles
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {trendingStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style)}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
              'border backdrop-blur-sm hover:scale-105',
              selectedStyle === style.id
                ? 'border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/10'
                : 'border-border/50 bg-card/50 text-foreground/70 hover:bg-muted/50 hover:border-border'
            )}
          >
            <span>{style.emoji}</span>
            <span className="whitespace-nowrap">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImagineStyleCarousel;
