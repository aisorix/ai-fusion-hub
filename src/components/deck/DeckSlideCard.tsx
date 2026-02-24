import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Edit3, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from './DeckThemePicker';

interface DeckSlideCardProps {
  slide: Slide;
  theme: DeckTheme;
  index: number;
  onUpdateSlide?: (updated: Slide) => void;
  onRegenerateImage?: (slideIndex: number, imagePrompt: string) => void;
}

const themeClasses: Record<DeckTheme, { card: string; heading: string; text: string; badge: string }> = {
  dark: {
    card: 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700',
    heading: 'text-white',
    text: 'text-gray-300',
    badge: 'bg-cyan-500/20 text-cyan-400',
  },
  'cyan-blue': {
    card: 'bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-500/30',
    heading: 'text-white',
    text: 'text-cyan-100',
    badge: 'bg-white/20 text-white',
  },
  minimalist: {
    card: 'bg-white border-gray-200',
    heading: 'text-gray-900',
    text: 'text-gray-600',
    badge: 'bg-gray-100 text-gray-600',
  },
  sunset: {
    card: 'bg-gradient-to-br from-orange-500 to-purple-700 border-orange-400/30',
    heading: 'text-white',
    text: 'text-orange-100',
    badge: 'bg-white/20 text-white',
  },
};

const DeckSlideCard: React.FC<DeckSlideCardProps> = ({ slide, theme, index, onUpdateSlide, onRegenerateImage }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const tc = themeClasses[theme];

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingField || !onUpdateSlide) return;
    const updated = { ...slide };
    if (editingField === 'heading') {
      updated.heading = editValue;
    } else if (editingField.startsWith('bullet_')) {
      const idx = parseInt(editingField.split('_')[1]);
      updated.bullet_points = [...slide.bullet_points];
      updated.bullet_points[idx] = editValue;
    }
    onUpdateSlide(updated);
    setEditingField(null);
  };

  const renderEditable = (field: string, value: string, className: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-1">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className={cn('bg-black/20 rounded px-1.5 py-0.5 outline-none flex-1 text-sm', className)}
            autoFocus
          />
          <button onClick={saveEdit} className="p-0.5 hover:bg-white/10 rounded">
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }
    return (
      <span
        onClick={() => startEdit(field, value)}
        className={cn('cursor-pointer hover:bg-white/5 rounded px-0.5 transition-colors group/edit inline-flex items-center gap-1', className)}
      >
        {value}
        <Edit3 className="w-3 h-3 opacity-0 group-hover/edit:opacity-50 shrink-0" />
      </span>
    );
  };

  const renderImage = () => {
    if (!slide.image_url) {
      return <Skeleton className="w-full h-full rounded-lg" />;
    }
    return (
      <div className="relative w-full h-full group/img">
        {!imageLoaded && <Skeleton className="absolute inset-0 rounded-lg" />}
        <motion.img
          src={slide.image_url}
          alt={slide.heading}
          className={cn('w-full h-full object-cover rounded-lg', !imageLoaded && 'opacity-0')}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        {onRegenerateImage && imageLoaded && (
          <button
            onClick={() => onRegenerateImage(index, slide.image_prompt)}
            className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-md opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
        )}
      </div>
    );
  };

  if (slide.layout === 'full-image') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn('relative rounded-xl border overflow-hidden aspect-video', tc.card)}
      >
        <div className="absolute inset-0">{renderImage()}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className={cn('absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full', tc.badge)}>
          {slide.slide_number}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {renderEditable('heading', slide.heading, 'text-white')}
          </h3>
        </div>
      </motion.div>
    );
  }

  if (slide.layout === 'text-only') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn('rounded-xl border p-5 md:p-6 aspect-video flex flex-col justify-center', tc.card)}
      >
        <div className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full w-fit mb-3', tc.badge)}>
          {slide.slide_number}
        </div>
        <h3 className={cn('text-lg md:text-xl font-bold mb-3', tc.heading)}>
          {renderEditable('heading', slide.heading, tc.heading)}
        </h3>
        <ul className="space-y-1.5">
          {slide.bullet_points.map((bp, i) => (
            <li key={i} className={cn('text-sm flex items-start gap-2', tc.text)}>
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-50" />
              {renderEditable(`bullet_${i}`, bp, tc.text)}
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  // split layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn('rounded-xl border overflow-hidden grid grid-cols-2 aspect-video', tc.card)}
    >
      <div className="p-4 md:p-5 flex flex-col justify-center">
        <div className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full w-fit mb-3', tc.badge)}>
          {slide.slide_number}
        </div>
        <h3 className={cn('text-base md:text-lg font-bold mb-2', tc.heading)}>
          {renderEditable('heading', slide.heading, tc.heading)}
        </h3>
        <ul className="space-y-1">
          {slide.bullet_points.map((bp, i) => (
            <li key={i} className={cn('text-xs flex items-start gap-1.5', tc.text)}>
              <span className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0 opacity-50" />
              {renderEditable(`bullet_${i}`, bp, tc.text)}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-2">{renderImage()}</div>
    </motion.div>
  );
};

export default DeckSlideCard;
