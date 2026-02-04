// Window Model Selector with Model Icons
// For multi-window chat mode - shows exclusive models per tier (no duplicates)

import React, { useState } from 'react';
import { ChevronDown, Check, Lock, Zap, Star, Sparkles, Crown } from 'lucide-react';
import { useChatStore, type UserPlan, type Model } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { ModelIcon } from './ModelIcons';
import { toast } from 'sonner';

// Get unique model names for a specific plan tier ONLY (exclusive to that tier)
const getExclusiveModelsForTier = (models: Model[], tier: UserPlan): Model[] => {
  const tierModels = models.filter(m => m.plans.includes(tier));
  
  // Remove duplicates by name within the tier
  const seen = new Set<string>();
  return tierModels.filter(m => {
    if (seen.has(m.name)) return false;
    seen.add(m.name);
    return true;
  });
};

// Plan hierarchy for access checking
const planHierarchy: UserPlan[] = ['free', 'basic', 'pro', 'premium'];

// Get tier info helper
const getTierInfo = (tier: UserPlan) => {
  switch (tier) {
    case 'free':
      return { label: 'Free', icon: Star, color: 'text-emerald-500', dotColor: 'bg-emerald-500' };
    case 'basic':
      return { label: 'Basic', icon: Zap, color: 'text-blue-500', dotColor: 'bg-blue-500' };
    case 'pro':
      return { label: 'Pro', icon: Sparkles, color: 'text-purple-500', dotColor: 'bg-purple-500' };
    case 'premium':
      return { label: 'Premium', icon: Crown, color: 'text-amber-500', dotColor: 'bg-amber-500' };
  }
};

interface WindowModelSelectorProps {
  windowId: string;
  currentModelId?: string;
}

const WindowModelSelector = ({ windowId, currentModelId }: WindowModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { chatWindows, setWindowModel, models, user, theme } = useChatStore();
  
  const window = chatWindows.find(w => w.id === windowId);
  const modelId = currentModelId || window?.modelId;
  
  // Get current model
  const currentModel = models.find(m => m.id === modelId) || models.find(m => m.plans.includes(user.plan));
  const isPaidUser = user.plan !== 'free';

  // Get exclusive models for each tier
  const freeModels = getExclusiveModelsForTier(models, 'free');
  const basicModels = getExclusiveModelsForTier(models, 'basic');
  const proModels = getExclusiveModelsForTier(models, 'pro');
  const premiumModels = getExclusiveModelsForTier(models, 'premium');

  const isModelAccessible = (model: Model) => {
    return model.plans.includes(user.plan);
  };

  const isTierAccessible = (tier: UserPlan) => {
    const userIndex = planHierarchy.indexOf(user.plan);
    const tierIndex = planHierarchy.indexOf(tier);
    return userIndex >= tierIndex;
  };

  const handleSelect = (model: Model) => {
    if (!isModelAccessible(model)) return;
    
    // Show warning for heavy models (multiplier >= 10)
    if (model.multiplier >= 10) {
      toast.warning(`This model uses ${model.multiplier}x tokens per message`, {
        description: 'Heavy AI model - tokens will be deducted at higher rate',
        duration: 4000,
      });
    }
    
    setWindowModel(windowId, model.id);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200',
          'bg-muted/50 hover:bg-muted text-sm',
          isPaidUser && 'border border-primary/20 hover:border-primary/40'
        )}
      >
        <ModelIcon modelId={currentModel?.id || ''} modelName={currentModel?.name || ''} size="sm" showGlow={isPaidUser} theme={theme} />
        <span className="font-medium truncate max-w-[100px]">{currentModel?.name || 'Select'}</span>
        <ChevronDown className={cn(
          'w-3 h-3 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(
            "absolute top-full left-0 mt-1 z-50 w-72 rounded-xl bg-popover border shadow-xl overflow-hidden",
            isPaidUser ? "border-primary/30 shadow-primary/10" : "border-border"
          )}>
            {/* Header */}
            <div className="px-3 py-2 border-b border-border/50 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Choose Model</span>
              {(() => {
                const info = getTierInfo(user.plan);
                const Icon = info.icon;
                return (
                  <div className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1', info.color, 'bg-current/10')}>
                    <Icon className="w-2.5 h-2.5" />
                    {info.label}
                  </div>
                );
              })()}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {/* Free Models */}
              <TierGroup
                tier="free"
                models={freeModels}
                selectedModelId={modelId || ''}
                onSelect={handleSelect}
                theme={theme}
                isAccessible={isTierAccessible('free')}
                isModelAccessible={isModelAccessible}
              />

              {/* Basic Models */}
              <TierGroup
                tier="basic"
                models={basicModels}
                selectedModelId={modelId || ''}
                onSelect={handleSelect}
                theme={theme}
                isAccessible={isTierAccessible('basic')}
                isModelAccessible={isModelAccessible}
              />

              {/* Pro Models */}
              <TierGroup
                tier="pro"
                models={proModels}
                selectedModelId={modelId || ''}
                onSelect={handleSelect}
                theme={theme}
                isAccessible={isTierAccessible('pro')}
                isModelAccessible={isModelAccessible}
              />

              {/* Premium Models */}
              <TierGroup
                tier="premium"
                models={premiumModels}
                selectedModelId={modelId || ''}
                onSelect={handleSelect}
                theme={theme}
                isAccessible={isTierAccessible('premium')}
                isModelAccessible={isModelAccessible}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Tier Group Component
interface TierGroupProps {
  tier: UserPlan;
  models: Model[];
  selectedModelId: string;
  onSelect: (model: Model) => void;
  theme: 'light' | 'dark';
  isAccessible: boolean;
  isModelAccessible: (model: Model) => boolean;
}

const TierGroup = ({ 
  tier, 
  models, 
  selectedModelId, 
  onSelect, 
  theme,
  isAccessible,
  isModelAccessible
}: TierGroupProps) => {
  if (models.length === 0) return null;
  
  const tierInfo = getTierInfo(tier);
  const Icon = tierInfo.icon;
  
  return (
    <div className="border-b border-border/30 last:border-b-0">
      {/* Tier Header */}
      <div className={cn(
        'flex items-center justify-between px-3 py-1.5 bg-muted/20',
        !isAccessible && 'opacity-60'
      )}>
        <div className="flex items-center gap-1.5">
          <div className={cn('w-1.5 h-1.5 rounded-full', tierInfo.dotColor)} />
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider', tierInfo.color)}>
            {tierInfo.label}
          </span>
          <span className="text-[9px] text-muted-foreground">• {models.length}</span>
        </div>
        {!isAccessible && (
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <Lock className="w-2.5 h-2.5" />
          </div>
        )}
      </div>
      
      {/* Models */}
      <div className="p-1.5 space-y-0.5">
        {models.map((model) => {
          const accessible = isModelAccessible(model);
          const isSelected = selectedModelId === model.id;
          
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              disabled={!accessible}
              className={cn(
                'w-full flex items-center gap-2 px-2.5 py-2 text-left text-sm transition-colors rounded-lg',
                isSelected
                  ? 'bg-primary/10 text-primary'
                  : accessible
                    ? 'hover:bg-muted'
                    : 'opacity-40 cursor-not-allowed'
              )}
            >
              <ModelIcon modelId={model.id} modelName={model.name} size="sm" theme={theme} />
              <span className="flex-1 truncate font-medium text-xs">{model.name}</span>
              {model.multiplier > 1 && (
                <span className={cn(
                  'px-1 py-0.5 rounded text-[8px] font-bold',
                  model.multiplier >= 10 
                    ? 'bg-amber-500/20 text-amber-500' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {model.multiplier}x
                </span>
              )}
              {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
              {!accessible && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WindowModelSelector;
