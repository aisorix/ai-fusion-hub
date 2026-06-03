import React from 'react';
import { cn } from '@/lib/utils';
import type { VideoAspect, VideoResolution } from './cineshootModels';

export interface CineshootTemplate {
  id: string;
  title: string;
  prompt: string;
  aspect: VideoAspect;
  duration: number;
  gradient: string;
  emoji: string;
}

export const CINESHOOT_TEMPLATES: CineshootTemplate[] = [
  { id: 'cinematic-product', title: 'Cinematic Product Shot', emoji: '🎬', gradient: 'from-amber-500 to-rose-600',
    prompt: 'A luxury perfume bottle slowly rotating on a black marble surface, dramatic side lighting, swirling golden mist, ultra-cinematic 35mm look', aspect: '16:9', duration: 6 },
  { id: 'anime-fight', title: 'Anime Fight Scene', emoji: '⚔️', gradient: 'from-rose-500 to-fuchsia-600',
    prompt: 'A 90s anime hero charging a glowing blue energy attack on a rooftop at sunset, dynamic camera zoom, speed lines, particle sparks', aspect: '16:9', duration: 5 },
  { id: 'drone-mountains', title: 'Drone Over Mountains', emoji: '🏔️', gradient: 'from-sky-500 to-indigo-600',
    prompt: 'Sweeping aerial drone shot flying over snowy mountain peaks at sunrise, soft pastel sky, cinematic 4K nature footage', aspect: '16:9', duration: 8 },
  { id: 'coffee-pour', title: 'Slow-Mo Coffee Pour', emoji: '☕', gradient: 'from-amber-700 to-orange-800',
    prompt: 'Extreme slow motion close-up of espresso pouring into a white ceramic cup, golden crema swirling, soft natural window light', aspect: '1:1', duration: 5 },
  { id: 'cyberpunk-street', title: 'Cyberpunk Street', emoji: '🌃', gradient: 'from-fuchsia-600 to-cyan-500',
    prompt: 'A neon-soaked Tokyo street at night in the rain, holographic billboards reflecting on wet pavement, lone figure walking with umbrella', aspect: '9:16', duration: 6 },
  { id: 'ghibli-forest', title: 'Studio Ghibli Forest', emoji: '🌳', gradient: 'from-emerald-500 to-green-700',
    prompt: 'A whimsical hand-drawn animated forest with floating glowing pollen, a tiny spirit creature dancing on a mossy log, Studio Ghibli style', aspect: '16:9', duration: 7 },
  { id: 'lofi-room', title: 'Lo-fi Study Room', emoji: '📚', gradient: 'from-violet-500 to-purple-700',
    prompt: 'A cozy lo-fi animated study room at night, rain on the window, a cat sleeping beside an open notebook, slow pan, anime aesthetic', aspect: '16:9', duration: 8 },
  { id: 'spaceship-interior', title: 'Sci-Fi Spaceship', emoji: '🚀', gradient: 'from-slate-700 to-blue-900',
    prompt: 'POV walk through a futuristic spaceship corridor with glowing panels, doors hissing open, cinematic sci-fi lighting', aspect: '21:9' as any, duration: 6 },
  { id: 'vhs-commercial', title: 'Vintage VHS Commercial', emoji: '📼', gradient: 'from-pink-500 to-violet-600',
    prompt: 'A retro 1985 VHS-style soda commercial, smiling teenagers at a diner, chromatic aberration, tape grain, vibrant saturated colors', aspect: '4:3' as any, duration: 5 },
  { id: 'macro-nature', title: 'Macro Nature Shot', emoji: '🌸', gradient: 'from-pink-400 to-rose-500',
    prompt: 'Extreme macro shot of a dewdrop sliding off a cherry blossom petal in slow motion, soft morning light, shallow depth of field', aspect: '1:1', duration: 5 },
];

interface Props {
  onUseTemplate: (t: CineshootTemplate) => void;
}

const CineshootTemplates: React.FC<Props> = ({ onUseTemplate }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {CINESHOOT_TEMPLATES.map(t => (
        <button
          key={t.id}
          onClick={() => onUseTemplate(t)}
          className={cn(
            'group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/40',
            'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all text-left'
          )}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br', t.gradient, 'opacity-90')} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 text-3xl">{t.emoji}</div>
          <div className="absolute inset-x-3 bottom-3">
            <p className="text-white font-semibold text-[13px] leading-tight mb-1">{t.title}</p>
            <p className="text-white/70 text-[10.5px] line-clamp-2">{t.prompt}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">{t.aspect}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">{t.duration}s</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export const CINESHOOT_TEMPLATE_COUNT = CINESHOOT_TEMPLATES.length;
export default CineshootTemplates;
