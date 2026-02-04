import React, { useState } from 'react';
import { ChevronDown, Lock, Check, X, Zap, Sparkles, Crown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, type UserPlan, type Model } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
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

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, models, setSelectedModel, user, theme } = useChatStore();
  const isMobile = useIsMobile();
  
  // Get available models for current plan
  const availableModels = models.filter(m => m.plans.includes(user.plan));
  const currentModel = models.find(m => m.id === selectedModel) || availableModels[0];
  const isPaidUser = user.plan !== 'free';

  // Get exclusive models for each tier (no duplicates across tiers)
  const freeModels = getExclusiveModelsForTier(models, 'free');
  const basicModels = getExclusiveModelsForTier(models, 'basic');
  const proModels = getExclusiveModelsForTier(models, 'pro');
  const premiumModels = getExclusiveModelsForTier(models, 'premium');

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
    if (!isModelAccessible(model)) {
      return; // Can't select locked models
    }
    
    // Show warning for heavy models (multiplier >= 10)
    if (model.multiplier >= 10) {
      toast.warning(`This model uses ${model.multiplier}x tokens per message`, {
        description: 'Heavy AI model - tokens will be deducted at higher rate',
        duration: 4000,
      });
    }
    
    setSelectedModel(model.id);
    setIsOpen(false);
  };

  // Get tier info
  const getTierInfo = (tier: UserPlan) => {
    switch (tier) {
      case 'free':
        return { 
          label: 'Free', 
          icon: Star, 
          color: 'text-emerald-500', 
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          description: '3 models included'
        };
      case 'basic':
        return { 
          label: 'Basic', 
          icon: Zap, 
          color: 'text-blue-500', 
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          description: '+10 models unlocked'
        };
      case 'pro':
        return { 
          label: 'Pro', 
          icon: Sparkles, 
          color: 'text-purple-500', 
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/30',
          description: '+17 models unlocked'
        };
      case 'premium':
        return { 
          label: 'Premium', 
          icon: Crown, 
          color: 'text-amber-500', 
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          description: '+26 models unlocked'
        };
    }
  };

  const isTierAccessible = (tier: UserPlan) => {
    const userIndex = planHierarchy.indexOf(user.plan);
    const tierIndex = planHierarchy.indexOf(tier);
    return userIndex >= tierIndex;
  };
  
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200',
          'bg-card/80 border backdrop-blur-sm',
          'hover:border-primary/40 hover:bg-card',
          'active:scale-95',
          isPaidUser 
            ? 'border-primary/40 shadow-md shadow-primary/10' 
            : 'border-border/60'
        )}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex items-center justify-center">
          <ModelIcon modelId={currentModel?.id || ''} modelName={currentModel?.name || ''} size="md" showGlow={isPaidUser} theme={theme} />
        </div>
        <span className={cn(
          "font-medium text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate",
          isPaidUser && "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
        )}>{currentModel?.name || 'Select Model'}</span>
        <ChevronDown className={cn(
          'w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile: Centered Modal / Desktop: Dropdown */}
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="fixed inset-x-3 top-1/2 -translate-y-1/2 z-50 max-h-[85vh] rounded-3xl overflow-hidden bg-background border border-border/50 shadow-2xl"
              >
                {/* Header */}
                <div className="relative px-5 py-4 border-b border-border/30 bg-gradient-to-b from-muted/50 to-transparent">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-3 top-3 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <h3 className="text-xl font-bold text-foreground">Choose Model</h3>
                  <p className="text-sm text-muted-foreground mt-1">Select an AI model for your conversation</p>
                </div>

                {/* Current Plan Badge */}
                <div className="px-5 py-3 border-b border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const info = getTierInfo(user.plan);
                        const Icon = info.icon;
                        return (
                          <>
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', info.bgColor)}>
                              <Icon className={cn('w-5 h-5', info.color)} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{info.label} Plan</p>
                              <p className="text-xs text-muted-foreground">
                                {(user.tokensUsed / 1000).toFixed(0)}K / {(user.tokensLimit / 1000).toFixed(0)}K tokens
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    {/* Token Progress */}
                    <div className="w-16">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            (user.tokensUsed / user.tokensLimit) > 0.8 ? "bg-destructive" : "bg-primary"
                          )}
                          style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Models List */}
                <div className="overflow-y-auto max-h-[calc(85vh-200px)] overscroll-contain">
                  {/* Free Tier */}
                  <MobileTierSection 
                    tier="free"
                    models={freeModels}
                    tierInfo={getTierInfo('free')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('free')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />

                  {/* Basic Tier */}
                  <MobileTierSection 
                    tier="basic"
                    models={basicModels}
                    tierInfo={getTierInfo('basic')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('basic')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />

                  {/* Pro Tier */}
                  <MobileTierSection 
                    tier="pro"
                    models={proModels}
                    tierInfo={getTierInfo('pro')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('pro')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />

                  {/* Premium Tier */}
                  <MobileTierSection 
                    tier="premium"
                    models={premiumModels}
                    tierInfo={getTierInfo('premium')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('premium')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />
                </div>

                {/* Safe Area Padding */}
                <div className="h-safe-area-inset-bottom" />
              </motion.div>
            ) : (
              /* Desktop Dropdown */
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={cn(
                  'absolute left-0 top-full mt-2 w-[380px] z-50',
                  'rounded-2xl shadow-2xl shadow-black/20 overflow-hidden',
                  'bg-popover/95 border border-border/80 backdrop-blur-xl'
                )}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold">Choose Model</span>
                      <p className="text-[10px] text-muted-foreground">Token multiplier shown per model</p>
                    </div>
                    {(() => {
                      const info = getTierInfo(user.plan);
                      const Icon = info.icon;
                      return (
                        <div className={cn('px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5', info.bgColor, info.color)}>
                          <Icon className="w-3 h-3" />
                          {info.label}
                        </div>
                      );
                    })()}
                  </div>
                  {/* Token Progress */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          (user.tokensUsed / user.tokensLimit) > 0.8 ? "bg-destructive" : "bg-primary"
                        )}
                        style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {(user.tokensUsed / 1000).toFixed(0)}K / {(user.tokensLimit / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                  {/* Free Tier */}
                  <DesktopTierSection 
                    tier="free"
                    models={freeModels}
                    tierInfo={getTierInfo('free')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('free')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />

                  {/* Basic Tier */}
                  <DesktopTierSection 
                    tier="basic"
                    models={basicModels}
                    tierInfo={getTierInfo('basic')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('basic')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />

                  {/* Pro Tier */}
                  <DesktopTierSection 
                    tier="pro"
                    models={proModels}
                    tierInfo={getTierInfo('pro')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('pro')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />

                  {/* Premium Tier */}
                  <DesktopTierSection 
                    tier="premium"
                    models={premiumModels}
                    tierInfo={getTierInfo('premium')}
                    selectedModelId={selectedModel}
                    isAccessible={isTierAccessible('premium')}
                    isModelAccessible={isModelAccessible}
                    onSelect={handleSelect}
                    theme={theme}
                  />
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Tier Section Component
interface TierSectionProps {
  tier: UserPlan;
  models: Model[];
  tierInfo: ReturnType<typeof getTierInfo>;
  selectedModelId: string;
  isAccessible: boolean;
  isModelAccessible: (model: Model) => boolean;
  onSelect: (model: Model) => void;
  theme: 'light' | 'dark';
}

// Helper to get tier info outside component
const getTierInfo = (tier: UserPlan) => {
  switch (tier) {
    case 'free':
      return { 
        label: 'Free', 
        icon: Star, 
        color: 'text-emerald-500', 
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        description: '3 models included'
      };
    case 'basic':
      return { 
        label: 'Basic', 
        icon: Zap, 
        color: 'text-blue-500', 
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        description: '+10 models unlocked'
      };
    case 'pro':
      return { 
        label: 'Pro', 
        icon: Sparkles, 
        color: 'text-purple-500', 
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        description: '+17 models unlocked'
      };
    case 'premium':
      return { 
        label: 'Premium', 
        icon: Crown, 
        color: 'text-amber-500', 
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        description: '+26 models unlocked'
      };
  }
};

const MobileTierSection = ({ 
  tier, 
  models, 
  tierInfo, 
  selectedModelId, 
  isAccessible, 
  isModelAccessible, 
  onSelect, 
  theme 
}: TierSectionProps) => {
  if (models.length === 0) return null;
  
  const Icon = tierInfo.icon;
  
  return (
    <div className="border-b border-border/20 last:border-b-0">
      {/* Tier Header */}
      <div className={cn(
        'flex items-center justify-between px-5 py-3',
        !isAccessible && 'opacity-60'
      )}>
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', tierInfo.bgColor)}>
            <Icon className={cn('w-4 h-4', tierInfo.color)} />
          </div>
          <div>
            <span className={cn('text-sm font-semibold', tierInfo.color)}>{tierInfo.label}</span>
            <span className="text-xs text-muted-foreground ml-2">{models.length} models</span>
          </div>
        </div>
        {!isAccessible && (
          <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1', tierInfo.bgColor, tierInfo.color)}>
            <Lock className="w-3 h-3" />
            Upgrade
          </div>
        )}
      </div>
      
      {/* Models Grid */}
      <div className="px-4 pb-4 grid grid-cols-1 gap-2">
        {models.map((model) => {
          const canAccess = isModelAccessible(model);
          const isSelected = model.id === selectedModelId;
          
          return (
            <button
              key={model.id}
              onClick={() => canAccess && onSelect(model)}
              disabled={!canAccess}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left',
                canAccess 
                  ? 'hover:bg-muted/50 active:scale-[0.98]' 
                  : 'opacity-50 cursor-not-allowed',
                isSelected && 'bg-primary/10 border border-primary/30'
              )}
            >
              {/* Model Icon */}
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                isSelected ? 'bg-primary/20' : 'bg-muted/50'
              )}>
                <ModelIcon 
                  modelId={model.id} 
                  modelName={model.name} 
                  size="md" 
                  showGlow={isSelected} 
                  theme={theme} 
                />
              </div>
              
              {/* Model Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{model.name}</span>
                  {model.multiplier > 1 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0',
                      model.multiplier >= 10 
                        ? 'bg-amber-500/20 text-amber-500' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {model.multiplier}x
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{model.description}</p>
              </div>
              
              {/* Status Icon */}
              {canAccess ? (
                isSelected && <Check className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DesktopTierSection = ({ 
  tier, 
  models, 
  tierInfo, 
  selectedModelId, 
  isAccessible, 
  isModelAccessible, 
  onSelect, 
  theme 
}: TierSectionProps) => {
  if (models.length === 0) return null;
  
  const Icon = tierInfo.icon;
  
  return (
    <div className="border-b border-border/30 last:border-b-0">
      {/* Tier Header */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2 bg-muted/20',
        !isAccessible && 'opacity-60'
      )}>
        <div className="flex items-center gap-2">
          <Icon className={cn('w-3.5 h-3.5', tierInfo.color)} />
          <span className={cn('text-xs font-semibold uppercase tracking-wide', tierInfo.color)}>
            {tierInfo.label}
          </span>
          <span className="text-[10px] text-muted-foreground">• {models.length} models</span>
        </div>
        {!isAccessible && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Lock className="w-3 h-3" />
            Upgrade
          </div>
        )}
      </div>
      
      {/* Models List */}
      <div className="p-2 space-y-1">
        {models.map((model) => {
          const canAccess = isModelAccessible(model);
          const isSelected = model.id === selectedModelId;
          
          return (
            <button
              key={model.id}
              onClick={() => canAccess && onSelect(model)}
              disabled={!canAccess}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
                canAccess 
                  ? 'hover:bg-muted/60' 
                  : 'opacity-40 cursor-not-allowed',
                isSelected && 'bg-primary/10 border border-primary/20'
              )}
            >
              {/* Model Icon */}
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                isSelected ? 'bg-primary/15' : 'bg-muted/40'
              )}>
                <ModelIcon 
                  modelId={model.id} 
                  modelName={model.name} 
                  size="sm" 
                  showGlow={isSelected} 
                  theme={theme} 
                />
              </div>
              
              {/* Model Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">{model.name}</span>
                  {model.multiplier > 1 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-bold',
                      model.multiplier >= 10 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {model.multiplier}x
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{model.description}</p>
              </div>
              
              {/* Status */}
              {canAccess ? (
                isSelected && <Check className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModelSelector;
