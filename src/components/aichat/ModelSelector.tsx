import React, { useState } from 'react';
import { ChevronDown, Lock, Check, X, Zap, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModelIcon } from './ModelIcons';

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, models, setSelectedModel, user, isModelLocked, theme } = useChatStore();
  const isMobile = useIsMobile();
  
  // Get available models for current plan (no duplicates)
  const availableModels = models.filter(m => m.plans.includes(user.plan));
  const lockedModels = models.filter(m => !m.plans.includes(user.plan));
  
  const currentModel = models.find(m => m.id === selectedModel) || availableModels[0];
  const isPaidUser = user.plan !== 'free';

  const getRequiredPlan = (model: typeof models[0]) => {
    if (model.plans.includes('free')) return null;
    if (model.plans.includes('basic')) return 'Basic';
    if (model.plans.includes('pro')) return 'Pro';
    return 'Premium';
  };

  const handleSelect = (modelId: string, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedModel(modelId);
      setIsOpen(false);
    }
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
        {isPaidUser && (
          <span className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 rounded-md font-medium">
            <Crown className="w-2.5 h-2.5" />
          </span>
        )}
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
            
            {/* Mobile: Bottom Sheet / Desktop: Dropdown */}
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-3xl overflow-hidden bg-background border-t border-border shadow-2xl"
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Choose Model</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Select an AI model for your chat</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Current Plan Badge */}
                <div className="px-5 py-3 bg-muted/30 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      user.plan === 'free' && 'bg-muted',
                      user.plan === 'basic' && 'bg-blue-500/15',
                      user.plan === 'pro' && 'bg-purple-500/15',
                      user.plan === 'premium' && 'bg-amber-500/15'
                    )}>
                      <Zap className={cn(
                        'w-5 h-5',
                        user.plan === 'free' && 'text-muted-foreground',
                        user.plan === 'basic' && 'text-blue-400',
                        user.plan === 'pro' && 'text-purple-400',
                        user.plan === 'premium' && 'text-amber-400'
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {user.plan === 'free' ? 'Free Plan' : `Sorix ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(user.tokensUsed / 1000).toFixed(0)}K / {(user.tokensLimit / 1000).toFixed(0)}K tokens
                      </p>
                    </div>
                    <div className="w-16">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
                <div className="overflow-y-auto max-h-[calc(85vh-200px)] overscroll-contain p-4">
                  <div className="space-y-1">
                    {availableModels.map((model) => (
                      <MobileModelItem
                        key={model.id}
                        model={model}
                        isSelected={selectedModel === model.id}
                        isLocked={false}
                        requiredPlan={null}
                        onSelect={() => handleSelect(model.id, false)}
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>

                {/* Safe Area Padding for iOS */}
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
                  'absolute left-0 top-full mt-2 w-[320px] z-50',
                  'rounded-xl shadow-2xl shadow-black/20 overflow-hidden',
                  'bg-popover/95 border border-border/80 backdrop-blur-xl'
                )}
              >
                {/* Header with Plan Info */}
                <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Select Model</span>
                    <div className={cn(
                      'px-2 py-0.5 rounded-md text-xs font-medium',
                      user.plan === 'free' && 'bg-muted text-muted-foreground',
                      user.plan === 'basic' && 'bg-blue-500/15 text-blue-400',
                      user.plan === 'pro' && 'bg-purple-500/15 text-purple-400',
                      user.plan === 'premium' && 'bg-amber-500/15 text-amber-400'
                    )}>
                      {user.plan === 'free' ? 'Free' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-1.5">
                  {availableModels.map((model) => (
                    <DesktopModelItem
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.id}
                      isLocked={false}
                      requiredPlan={null}
                      onSelect={() => handleSelect(model.id, false)}
                      theme={theme}
                    />
                  ))}
                </div>

                {/* Token Usage Footer */}
                <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tokens Used</span>
                    <span className="font-medium">
                      {(user.tokensUsed / 1000).toFixed(0)}K / {(user.tokensLimit / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        (user.tokensUsed / user.tokensLimit) > 0.8 ? "bg-destructive" : "bg-primary"
                      )}
                      style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ModelItemProps {
  model: {
    id: string;
    name: string;
    description: string;
    multiplier?: number;
  };
  isSelected: boolean;
  isLocked: boolean;
  requiredPlan: string | null;
  onSelect: () => void;
  theme: 'light' | 'dark';
}

// Mobile Model Item
const MobileModelItem = ({ model, isSelected, isLocked, requiredPlan, onSelect, theme }: ModelItemProps) => (
  <button
    onClick={onSelect}
    disabled={isLocked}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150 text-left',
      isSelected
        ? 'bg-primary/10 border border-primary/30'
        : isLocked
          ? 'opacity-50'
          : 'bg-muted/30 active:bg-muted/50 border border-transparent'
    )}
  >
    <div className="flex-shrink-0">
      <ModelIcon modelId={model.id} modelName={model.name} size="md" theme={theme} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={cn(
          "font-medium text-sm",
          isLocked ? "text-muted-foreground" : "text-foreground"
        )}>
          {model.name}
        </span>
        {isLocked && requiredPlan && (
          <span className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-medium',
            requiredPlan === 'Basic' && 'bg-blue-500/15 text-blue-400',
            requiredPlan === 'Pro' && 'bg-purple-500/15 text-purple-400',
            requiredPlan === 'Premium' && 'bg-amber-500/15 text-amber-400'
          )}>
            {requiredPlan}
          </span>
        )}
        {isSelected && (
          <Check className="w-4 h-4 text-primary" />
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
        {model.description}
      </p>
    </div>

    {isLocked && <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
  </button>
);

// Desktop Model Item
const DesktopModelItem = ({ model, isSelected, isLocked, requiredPlan, onSelect, theme }: ModelItemProps) => (
  <button
    onClick={onSelect}
    disabled={isLocked}
    className={cn(
      'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 text-left group',
      isSelected
        ? 'bg-primary/10'
        : isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-accent/50'
    )}
  >
    <div className="flex-shrink-0">
      <ModelIcon modelId={model.id} modelName={model.name} size="sm" theme={theme} />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={cn(
          "font-medium text-sm",
          isLocked && "text-muted-foreground"
        )}>
          {model.name}
        </span>
        {isLocked && requiredPlan && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
            {requiredPlan}
          </span>
        )}
        {isSelected && (
          <Check className="w-3.5 h-3.5 text-primary" />
        )}
      </div>
      <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
        {model.description}
      </p>
    </div>
    {isLocked && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
  </button>
);

export default ModelSelector;
