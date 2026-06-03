import { Cpu, Sparkles, Zap, Flame, Star, Wand2, Film, Video, Tv, Camera, Aperture } from 'lucide-react';

export type CineshootTier = 'basic' | 'pro' | 'premium';
export type VideoResolution = '720p' | '1080p' | '2K' | '4K';
export type VideoAspect = '16:9' | '9:16' | '1:1';

export interface CineshootModel {
  id: string;
  displayName: string;
  shortName: string;
  modelId: string;
  emoji: string;
  icon: React.ElementType;
  gradient: string;
  tier: CineshootTier;
  /** Base USD cost per second (real cost). We charge 2× this. */
  pricePerSecond: number;
  /** Allowed durations in seconds. */
  durations: number[];
  /** Max resolution the model supports. */
  maxResolution: VideoResolution;
  /** Supports image-to-video / first frame input. */
  supportsImageInput?: boolean;
  /** Supports native audio generation. */
  supportsSound?: boolean;
  tagline?: string;
}

// Helper: all durations 4..15
const D = (min: number, max: number, step = 1): number[] => {
  const out: number[] = [];
  for (let i = min; i <= max; i += step) out.push(i);
  return out;
};

export const cineshootModels: CineshootModel[] = [
  {
    id: 'grok-imagine-video',
    displayName: 'Grok Imagine Video',
    shortName: 'Grok Imagine',
    modelId: 'x-ai/grok-imagine-video',
    emoji: '⚡',
    icon: Zap,
    gradient: 'from-slate-600 to-zinc-800',
    tier: 'basic',
    pricePerSecond: 0.07,
    durations: D(4, 10),
    maxResolution: '720p',
    supportsImageInput: true,
    supportsSound: false,
    tagline: 'Fast · 720p',
  },
  {
    id: 'kling-o1',
    displayName: 'Kling Video O1',
    shortName: 'Kling O1',
    modelId: 'kwaivgi/kling-video-o1',
    emoji: '🎬',
    icon: Film,
    gradient: 'from-sky-500 to-indigo-600',
    tier: 'basic',
    pricePerSecond: 0.112,
    durations: [5, 10],
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
    tagline: 'Cinematic',
  },
  {
    id: 'kling-v3-std',
    displayName: 'Kling Video v3.0 Standard',
    shortName: 'Kling v3 Std',
    modelId: 'kwaivgi/kling-v3.0-std',
    emoji: '🎬',
    icon: Film,
    gradient: 'from-blue-500 to-violet-600',
    tier: 'pro',
    pricePerSecond: 0.126,
    durations: D(3, 15),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
  },
  {
    id: 'kling-v3-pro',
    displayName: 'Kling Video v3.0 Pro',
    shortName: 'Kling v3 Pro',
    modelId: 'kwaivgi/kling-v3.0-pro',
    emoji: '🎬',
    icon: Star,
    gradient: 'from-violet-500 to-fuchsia-600',
    tier: 'premium',
    pricePerSecond: 0.21,
    durations: D(3, 15),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
  },
  {
    id: 'seedance-fast',
    displayName: 'Seedance 2.0 Fast',
    shortName: 'Seedance Fast',
    modelId: 'bytedance/seedance-2.0-fast',
    emoji: '🌱',
    icon: Wand2,
    gradient: 'from-lime-500 to-green-600',
    tier: 'basic',
    pricePerSecond: 0.0538,
    durations: D(4, 12),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: false,
    tagline: 'Cheapest',
  },
  {
    id: 'seedance-2',
    displayName: 'Seedance 2.0',
    shortName: 'Seedance 2.0',
    modelId: 'bytedance/seedance-2.0',
    emoji: '🌱',
    icon: Aperture,
    gradient: 'from-green-500 to-emerald-600',
    tier: 'basic',
    pricePerSecond: 0.06726,
    durations: D(4, 12),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
  },
  {
    id: 'seedance-1-5-pro',
    displayName: 'Seedance 1.5 Pro',
    shortName: 'Seedance 1.5 Pro',
    modelId: 'bytedance/seedance-1-5-pro',
    emoji: '🌱',
    icon: Star,
    gradient: 'from-emerald-500 to-teal-600',
    tier: 'pro',
    pricePerSecond: 0.02306,
    durations: D(4, 12),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
    tagline: 'Lip sync',
  },
  {
    id: 'veo-3-1-lite',
    displayName: 'Veo 3.1 Lite',
    shortName: 'Veo 3.1 Lite',
    modelId: 'google/veo-3.1-lite',
    emoji: '🅖',
    icon: Video,
    gradient: 'from-blue-400 to-sky-500',
    tier: 'basic',
    pricePerSecond: 0.05,
    durations: D(4, 8),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
  },
  {
    id: 'veo-3-1-fast',
    displayName: 'Veo 3.1 Fast',
    shortName: 'Veo 3.1 Fast',
    modelId: 'google/veo-3.1-fast',
    emoji: '🅖',
    icon: Video,
    gradient: 'from-cyan-500 to-blue-600',
    tier: 'basic',
    pricePerSecond: 0.10,
    durations: D(4, 10),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: true,
  },
  {
    id: 'veo-3-1',
    displayName: 'Veo 3.1',
    shortName: 'Veo 3.1',
    modelId: 'google/veo-3.1',
    emoji: '🅖',
    icon: Star,
    gradient: 'from-indigo-500 to-blue-700',
    tier: 'pro',
    pricePerSecond: 0.40,
    durations: D(4, 10),
    maxResolution: '4K',
    supportsImageInput: true,
    supportsSound: true,
    tagline: 'State-of-the-art',
  },
  {
    id: 'sora-2-pro',
    displayName: 'Sora 2 Pro',
    shortName: 'Sora 2 Pro',
    modelId: 'openai/sora-2-pro',
    emoji: '🤖',
    icon: Cpu,
    gradient: 'from-emerald-600 to-cyan-700',
    tier: 'pro',
    pricePerSecond: 0.30,
    durations: D(4, 12),
    maxResolution: '4K',
    supportsImageInput: true,
    supportsSound: true,
    tagline: 'OpenAI flagship',
  },
  {
    id: 'hailuo-2-3',
    displayName: 'Hailuo 2.3',
    shortName: 'Hailuo 2.3',
    modelId: 'minimax/hailuo-2.3',
    emoji: '🔥',
    icon: Flame,
    gradient: 'from-orange-500 to-rose-600',
    tier: 'basic',
    pricePerSecond: 0.0817,
    durations: D(4, 10),
    maxResolution: '1080p',
    supportsImageInput: true,
    supportsSound: false,
  },
];

export const TOKENS_PER_USD = 30000; // matches Imagine pricing scale
export const MARKUP = 2; // 2× real cost

const RES_MULT: Record<VideoResolution, number> = { '720p': 1, '1080p': 1, '2K': 1.25, '4K': 1.5 };

export const estimateTokens = (model: CineshootModel, durationSec: number, resolution: VideoResolution): number => {
  const usd = model.pricePerSecond * durationSec * MARKUP * (RES_MULT[resolution] || 1);
  return Math.ceil(usd * TOKENS_PER_USD);
};

export const resolutionOptions = (model: CineshootModel): VideoResolution[] => {
  const order: VideoResolution[] = ['720p', '1080p', '2K', '4K'];
  const max = order.indexOf(model.maxResolution);
  return order.slice(0, max + 1);
};

export const tierRank: Record<CineshootTier, number> = { basic: 1, pro: 2, premium: 3 };
export const planRank: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 };

export const isModelLocked = (model: CineshootModel, userPlan: string): boolean => {
  return (planRank[userPlan] ?? 0) < tierRank[model.tier];
};
