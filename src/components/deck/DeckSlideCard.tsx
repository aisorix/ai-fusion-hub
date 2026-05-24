import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Edit3, Check, Plus, X as XIcon, Upload, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from './DeckThemePicker';

interface DeckSlideCardProps {
  slide: Slide;
  theme: DeckTheme;
  index: number;
  onUpdateSlide?: (updated: Slide) => void;
  onRegenerateImage?: (slideIndex: number, imagePrompt: string) => void;
  /** Force edit affordances always visible (used in editor canvas) */
  editable?: boolean;
}

const themeClasses: Record<DeckTheme, { card: string; heading: string; text: string; badge: string }> = {
  dark: { card: 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700', heading: 'text-white', text: 'text-gray-300', badge: 'bg-cyan-500/20 text-cyan-400' },
  'cyan-blue': { card: 'bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-500/30', heading: 'text-white', text: 'text-cyan-100', badge: 'bg-white/20 text-white' },
  minimalist: { card: 'bg-white border-gray-200', heading: 'text-gray-900', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' },
  sunset: { card: 'bg-gradient-to-br from-orange-500 to-purple-700 border-orange-400/30', heading: 'text-white', text: 'text-orange-100', badge: 'bg-white/20 text-white' },
  pearl: { card: 'bg-gray-100 border-gray-200', heading: 'text-gray-900', text: 'text-gray-600', badge: 'bg-gray-200 text-gray-600' },
  vortex: { card: 'bg-black border-gray-800', heading: 'text-white', text: 'text-gray-400', badge: 'bg-white/10 text-white' },
  clementa: { card: 'bg-amber-100 border-amber-200', heading: 'text-amber-800', text: 'text-amber-600', badge: 'bg-amber-200 text-amber-700' },
  stratos: { card: 'bg-slate-900 border-slate-700', heading: 'text-white', text: 'text-slate-300', badge: 'bg-slate-700 text-slate-300' },
  nova: { card: 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-400/30', heading: 'text-white', text: 'text-blue-100', badge: 'bg-white/20 text-white' },
  twilight: { card: 'bg-gradient-to-br from-rose-200 to-slate-400 border-rose-300/50', heading: 'text-rose-900', text: 'text-rose-700', badge: 'bg-rose-300/30 text-rose-800' },
  creme: { card: 'bg-stone-200 border-stone-300', heading: 'text-stone-800', text: 'text-stone-500', badge: 'bg-stone-300 text-stone-600' },
  lux: { card: 'bg-teal-900 border-teal-700', heading: 'text-emerald-200', text: 'text-emerald-400', badge: 'bg-emerald-800 text-emerald-300' },
  marine: { card: 'bg-teal-800 border-teal-600', heading: 'text-white', text: 'text-teal-200', badge: 'bg-teal-700 text-teal-200' },
  consultant: { card: 'bg-gray-100 border-gray-200', heading: 'text-gray-800', text: 'text-gray-500', badge: 'bg-gray-200 text-gray-600' },
  lavender: { card: 'bg-violet-200 border-violet-300', heading: 'text-violet-900', text: 'text-violet-600', badge: 'bg-violet-300 text-violet-700' },
  indigo: { card: 'bg-indigo-900 border-indigo-700', heading: 'text-white', text: 'text-indigo-300', badge: 'bg-indigo-800 text-indigo-300' },
  gamma: { card: 'bg-rose-50 border-rose-200', heading: 'text-orange-600', text: 'text-gray-600', badge: 'bg-orange-100 text-orange-600' },
  founder: { card: 'bg-purple-900 border-purple-700', heading: 'text-white', text: 'text-gray-300', badge: 'bg-purple-800 text-purple-300' },
  atmosphere: { card: 'bg-gradient-to-br from-pink-300 to-pink-500 border-pink-400/30', heading: 'text-white', text: 'text-pink-100', badge: 'bg-white/20 text-white' },
  blueberry: { card: 'bg-purple-900 border-purple-700', heading: 'text-white', text: 'text-purple-300', badge: 'bg-purple-800 text-purple-300' },
  sage: { card: 'bg-green-100 border-green-200', heading: 'text-green-900', text: 'text-green-600', badge: 'bg-green-200 text-green-700' },
  coal: { card: 'bg-teal-900 border-gray-700', heading: 'text-white', text: 'text-gray-400', badge: 'bg-gray-700 text-gray-300' },
};

const DeckSlideCard: React.FC<DeckSlideCardProps> = ({ slide, theme, index, onUpdateSlide, onRegenerateImage, editable }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const tc = themeClasses[theme] || themeClasses.dark;
  const canEdit = !!onUpdateSlide;

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

  const addBullet = () => {
    if (!onUpdateSlide) return;
    const updated = { ...slide, bullet_points: [...slide.bullet_points, 'New point'] };
    onUpdateSlide(updated);
  };

  const deleteBullet = (i: number) => {
    if (!onUpdateSlide) return;
    const updated = { ...slide, bullet_points: slide.bullet_points.filter((_, idx) => idx !== i) };
    onUpdateSlide(updated);
  };

  const handleReplaceImage = async (file: File) => {
    if (!onUpdateSlide) return;
    if (file.size > 8 * 1024 * 1024) { toast.error('Image too large (max 8MB)'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      onUpdateSlide({ ...slide, image_url: data });
    };
    reader.readAsDataURL(file);
  };

  const renderEditable = (field: string, value: string, className: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-1">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') setEditingField(null);
            }}
            onBlur={saveEdit}
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
        onClick={() => canEdit && startEdit(field, value)}
        className={cn(
          'rounded px-0.5 transition-colors group/edit inline-flex items-center gap-1',
          canEdit && 'cursor-pointer hover:bg-white/5',
          className,
        )}
      >
        {value || <span className="opacity-50 italic">Click to edit</span>}
        {canEdit && (
          <Edit3 className={cn('w-3 h-3 shrink-0 transition-opacity', editable ? 'opacity-30' : 'opacity-0 group-hover/edit:opacity-50')} />
        )}
      </span>
    );
  };

  const renderImage = () => {
    if (!slide.image_url) {
      return (
        <div className="relative w-full h-full">
          <Skeleton className="w-full h-full rounded-lg" />
          {canEdit && (
            <div className={cn(
              'absolute inset-0 flex items-center justify-center gap-1.5 transition-opacity',
              editable ? 'opacity-100' : 'opacity-0 hover:opacity-100',
            )}>
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px]"
              >
                <Upload className="w-3 h-3" /> Upload
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleReplaceImage(e.target.files[0])}
          />
        </div>
      );
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
        {canEdit && imageLoaded && (
          <div className={cn(
            'absolute top-2 right-2 flex items-center gap-1 transition-opacity',
            editable ? 'opacity-90' : 'opacity-0 group-hover/img:opacity-100',
          )}>
            {onRegenerateImage && (
              <button
                onClick={() => onRegenerateImage(index, slide.image_prompt)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-md hover:bg-black/80"
                title="Regenerate"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-md hover:bg-black/80"
              title="Replace image"
            >
              <Upload className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                const next = prompt('Edit image prompt', slide.image_prompt || '');
                if (next != null && onUpdateSlide) onUpdateSlide({ ...slide, image_prompt: next });
              }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-md hover:bg-black/80"
              title="Edit prompt"
            >
              <Wand2 className="w-3 h-3" />
            </button>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleReplaceImage(e.target.files[0])}
        />
      </div>
    );
  };

  const renderBulletList = (sizeClass: string, gapClass: string) => (
    <ul className={cn('space-y-1', gapClass)}>
      {slide.bullet_points.map((bp, i) => (
        <li key={i} className={cn(sizeClass, 'flex items-start gap-1.5 md:gap-2 group/bullet', tc.text)}>
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-50" />
          <span className="flex-1 min-w-0">{renderEditable(`bullet_${i}`, bp, tc.text)}</span>
          {canEdit && slide.bullet_points.length > 1 && (
            <button
              onClick={() => deleteBullet(i)}
              className={cn(
                'shrink-0 p-0.5 rounded hover:bg-black/10 transition-opacity',
                editable ? 'opacity-40 hover:opacity-100' : 'opacity-0 group-hover/bullet:opacity-60',
              )}
              title="Delete point"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}
        </li>
      ))}
      {canEdit && (
        <li>
          <button
            onClick={addBullet}
            className={cn(
              'inline-flex items-center gap-1 text-[10.5px] md:text-[11px] px-1.5 py-0.5 rounded border border-dashed transition-opacity',
              tc.text,
              'border-current/30',
              editable ? 'opacity-50 hover:opacity-100' : 'opacity-0 hover:opacity-100 group-hover/card:opacity-50',
            )}
          >
            <Plus className="w-3 h-3" /> Add point
          </button>
        </li>
      )}
    </ul>
  );

  if (slide.layout === 'full-image') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        className={cn('group/card relative rounded-xl border overflow-hidden aspect-video', tc.card)}
      >
        <div className="absolute inset-0">{renderImage()}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className={cn('absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full', tc.badge)}>
          {slide.slide_number}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
          <h3 className="text-base md:text-2xl font-bold text-white">
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
        transition={{ delay: index * 0.06 }}
        className={cn('group/card rounded-xl border p-4 md:p-6 aspect-video flex flex-col justify-center', tc.card)}
      >
        <div className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full w-fit mb-2 md:mb-3', tc.badge)}>
          {slide.slide_number}
        </div>
        <h3 className={cn('text-sm md:text-xl font-bold mb-2 md:mb-3', tc.heading)}>
          {renderEditable('heading', slide.heading, tc.heading)}
        </h3>
        {renderBulletList('text-xs md:text-sm', 'md:space-y-1.5')}
      </motion.div>
    );
  }

  // split layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn('group/card rounded-xl border overflow-hidden grid grid-cols-2', tc.card)}
    >
      <div className="p-3 md:p-5 flex flex-col justify-center order-1">
        <div className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full w-fit mb-2 md:mb-3', tc.badge)}>
          {slide.slide_number}
        </div>
        <h3 className={cn('text-sm md:text-lg font-bold mb-1.5 md:mb-2', tc.heading)}>
          {renderEditable('heading', slide.heading, tc.heading)}
        </h3>
        {renderBulletList('text-[11px] md:text-xs', 'md:space-y-1')}
      </div>
      <div className="p-2 order-2 aspect-video md:aspect-auto">{renderImage()}</div>
    </motion.div>
  );
};

export default DeckSlideCard;
