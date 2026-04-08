import React from 'react';
import { cn } from '@/lib/utils';
import { Lock, Sparkles, Zap, Star, Cpu } from 'lucide-react';

export interface ImageModel {
  id: string;
  displayName: string;
  modelId: string;
  emoji: string;
  icon: React.ElementType;
  gradient: string;
  proOnly?: boolean;
}

export const imageModels: ImageModel[] = [
  {
    id: 'flux',
    displayName: 'Flux AI',
    modelId: 'black-forest-labs/flux.2-klein-4b',
    emoji: '⚡',
    icon: Zap,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'nano-banana',
    displayName: 'Nano Banana',
    modelId: 'google/gemini-2.5-flash-image',
    emoji: '🍌',
    icon: Sparkles,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'nano-banana-2',
    displayName: 'Nano Banana 2',
    modelId: 'google/gemini-3.1-flash-image-preview',
    emoji: '🍌',
    icon: Star,
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'nano-banana-pro',
    displayName: 'Nano Banana Pro',
    modelId: 'google/gemini-3-pro-image-preview',
    emoji: '🍌',
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    proOnly: true,
  },
  {
    id: 'gpt5-image',
    displayName: 'GPT-5 Image',
    modelId: 'openai/gpt-5-image-mini',
    emoji: '🤖',
    icon: Cpu,
    gradient: 'from-green-500 to-emerald-600',
  },
];

interface Props {
  selectedModelId: string;
  onSelectModel: (model: ImageModel) => void;
  userPlan: string;
  onUpgrade: () => void;
}

const ImagineModelSelector: React.FC<Props> = ({ selectedModelId, onSelectModel, userPlan, onUpgrade }) => {
  const isLocked = (model: ImageModel) => {
    if (!model.proOnly) return false;
    return userPlan === 'free' || userPlan === 'basic';
  };

  return (
    <div className="w-full">
      <h3 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 px-1">
        Model
      </h3>
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
        {imageModels.map((model) => {
          const locked = isLocked(model);
          return (
            <button
              key={model.id}
              onClick={() => locked ? onUpgrade() : onSelectModel(model)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200',
                'border backdrop-blur-sm',
                selectedModelId === model.modelId
                  ? 'border-primary/50 bg-primary/10 text-primary shadow-sm shadow-primary/10'
                  : 'border-border/40 bg-card/40 text-muted-foreground hover:bg-muted/50 hover:border-border/60',
                locked && 'opacity-60'
              )}
            >
              <span className="text-xs">{model.emoji}</span>
              <span className="whitespace-nowrap">{model.displayName}</span>
              {locked && <Lock className="w-3 h-3 ml-0.5 text-muted-foreground" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImagineModelSelector;
