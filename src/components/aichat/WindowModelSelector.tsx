// Window Model Selector with Model Icons
// For multi-window chat mode - shows all available models grouped by tier

import React, { useState } from 'react';
import { ChevronDown, Check, Lock, Zap } from 'lucide-react';
import { useChatStore, type UserPlan, type Model } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { ModelIcon } from './ModelIcons';
import { toast } from 'sonner';

// Get unique models by name to avoid duplicates
const getUniqueModelsByName = (models: Model[]): Model[] => {
  const seen = new Set<string>();
  return models.filter(m => {
    if (seen.has(m.name)) return false;
    seen.add(m.name);
    return true;
  });
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

  // Get all models grouped by tier
  const freeModels = getUniqueModelsByName(models.filter(m => m.plans.includes('free')));
  const basicModels = getUniqueModelsByName(models.filter(m => m.plans.includes('basic') && !m.plans.includes('free')));
  const proModels = getUniqueModelsByName(models.filter(m => m.plans.includes('pro') && !m.plans.includes('basic')));
  const premiumModels = getUniqueModelsByName(models.filter(m => m.plans.includes('premium') && !m.plans.includes('pro')));

  const isModelAccessible = (model: Model) => {
    return model.plans.includes(user.plan);
  };

  const getRequiredPlan = (model: Model): UserPlan | null => {
    if (model.plans.includes('free')) return null;
    if (model.plans.includes('basic')) return 'basic';
    if (model.plans.includes('pro')) return 'pro';
    return 'premium';
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

  const getPlanColor = (plan: UserPlan) => {
    switch (plan) {
      case 'basic': return 'text-blue-400 bg-blue-500/15';
      case 'pro': return 'text-purple-400 bg-purple-500/15';
      case 'premium': return 'text-amber-400 bg-amber-500/15';
      default: return 'text-muted-foreground bg-muted';
    }
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
              <div className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1',
                user.plan === 'free' && 'bg-muted text-muted-foreground',
                user.plan === 'basic' && 'bg-blue-500/15 text-blue-400',
                user.plan === 'pro' && 'bg-purple-500/15 text-purple-400',
                user.plan === 'premium' && 'bg-amber-500/15 text-amber-400'
              )}>
                <Zap className="w-2.5 h-2.5" />
                {user.plan === 'free' ? 'Free' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-3">
              {/* Free Models */}
              {freeModels.length > 0 && (
                <ModelGroup
                  title="FREE"
                  dotColor="bg-green-500"
                  models={freeModels}
                  selectedModelId={modelId || ''}
                  onSelect={handleSelect}
                  theme={theme}
                  isAccessible={isModelAccessible}
                  getRequiredPlan={getRequiredPlan}
                  getPlanColor={getPlanColor}
                />
              )}

              {/* Basic Models */}
              {basicModels.length > 0 && (
                <ModelGroup
                  title="BASIC"
                  dotColor="bg-blue-500"
                  models={basicModels}
                  selectedModelId={modelId || ''}
                  onSelect={handleSelect}
                  theme={theme}
                  isAccessible={isModelAccessible}
                  getRequiredPlan={getRequiredPlan}
                  getPlanColor={getPlanColor}
                />
              )}

              {/* Pro Models */}
              {proModels.length > 0 && (
                <ModelGroup
                  title="PRO"
                  dotColor="bg-purple-500"
                  models={proModels}
                  selectedModelId={modelId || ''}
                  onSelect={handleSelect}
                  theme={theme}
                  isAccessible={isModelAccessible}
                  getRequiredPlan={getRequiredPlan}
                  getPlanColor={getPlanColor}
                />
              )}

              {/* Premium Models */}
              {premiumModels.length > 0 && (
                <ModelGroup
                  title="PREMIUM"
                  dotColor="bg-amber-500"
                  models={premiumModels}
                  selectedModelId={modelId || ''}
                  onSelect={handleSelect}
                  theme={theme}
                  isAccessible={isModelAccessible}
                  getRequiredPlan={getRequiredPlan}
                  getPlanColor={getPlanColor}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Model Group Component
interface ModelGroupProps {
  title: string;
  dotColor: string;
  models: Model[];
  selectedModelId: string;
  onSelect: (model: Model) => void;
  theme: 'light' | 'dark';
  isAccessible: (model: Model) => boolean;
  getRequiredPlan: (model: Model) => UserPlan | null;
  getPlanColor: (plan: UserPlan) => string;
}

const ModelGroup = ({ 
  title, 
  dotColor, 
  models, 
  selectedModelId, 
  onSelect, 
  theme,
  isAccessible,
  getRequiredPlan,
  getPlanColor
}: ModelGroupProps) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1 px-1">
      <div className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
    </div>
    <div className="space-y-0.5">
      {models.map((model) => {
        const accessible = isAccessible(model);
        const requiredPlan = getRequiredPlan(model);
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
                  : 'opacity-50 cursor-not-allowed'
            )}
          >
            <ModelIcon modelId={model.id} modelName={model.name} size="sm" theme={theme} />
            <span className="flex-1 truncate font-medium">{model.name}</span>
            {model.multiplier >= 10 && (
              <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-500">
                {model.multiplier}x
              </span>
            )}
            {!accessible && requiredPlan && (
              <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-medium', getPlanColor(requiredPlan))}>
                {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
              </span>
            )}
            {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            {!accessible && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  </div>
);

export default WindowModelSelector;
