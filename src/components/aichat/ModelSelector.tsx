import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Lock, Check, X, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore, type UserPlan, type Model, getModelTier } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModelIcon } from "./ModelIcons";
import { toast } from "sonner";
import { useTranslation } from "@/lib/translations";

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { selectedModel, models, setSelectedModel, user, theme, getDailyUsageRemaining, language } = useChatStore();
  const { t } = useTranslation(language as 'en' | 'bn');
  const isMobile = useIsMobile();

  useEffect(() => { setMounted(true); }, []);

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];
  const isPaidUser = user.plan !== "free";

  // Group models by their minimum tier
  const smartAutoModel = models.find(m => m.id === 'smart-auto');
  const freeModels = models.filter(m => m.id !== 'smart-auto' && getModelTier(m) === 'free');
  const basicModels = models.filter(m => getModelTier(m) === 'basic');
  const proModels = models.filter(m => getModelTier(m) === 'pro');
  const premiumModels = models.filter(m => getModelTier(m) === 'premium');

  const isModelAccessible = (model: Model) => model.plans.includes(user.plan);

  const getRequiredPlan = (model: Model): UserPlan | null => {
    if (model.plans.includes("free")) return null;
    if (model.plans.includes("basic")) return "basic";
    if (model.plans.includes("pro")) return "pro";
    return "premium";
  };

  const handleSelect = (model: Model) => {
    if (!isModelAccessible(model)) return;
    setSelectedModel(model.id);
    setIsOpen(false);
  };

  const getPlanLabel = (plan: UserPlan) => {
    switch (plan) { case "basic": return "Basic"; case "pro": return "Pro"; case "premium": return "Premium"; default: return ""; }
  };

  const getPlanColor = (plan: UserPlan) => {
    switch (plan) {
      case "basic": return "bg-blue-500/15 text-blue-500";
      case "pro": return "bg-purple-500/15 text-purple-500";
      case "premium": return "bg-amber-500/15 text-amber-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!mounted) return null;

  const isSmartAuto = selectedModel === 'smart-auto';

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200",
          "bg-card/80 border backdrop-blur-sm",
          "hover:border-primary/40 hover:bg-card active:scale-95",
          isSmartAuto ? "border-primary/50 shadow-md shadow-primary/15" : isPaidUser ? "border-primary/40 shadow-md shadow-primary/10" : "border-border/60",
        )}
      >
        {isSmartAuto ? (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-accent">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
        ) : (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex items-center justify-center">
            <ModelIcon modelId={currentModel?.id || ""} modelName={currentModel?.name || ""} size="md" showGlow={isPaidUser} theme={theme} />
          </div>
        )}
        <span className={cn("font-medium text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate", isPaidUser && "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text")}>
          {currentModel?.name || "Select Model"}
        </span>
        <ChevronDown className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile ? (
              createPortal(
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-0 bottom-0 z-[10000] flex flex-col max-h-[85vh] rounded-t-[32px] overflow-hidden bg-background border-t border-border/60 shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
                    <div className="flex-none flex justify-center pt-3 pb-2 bg-background cursor-grab active:cursor-grabbing" onClick={() => setIsOpen(false)}>
                      <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
                    </div>
                    <div className="flex-none px-6 pb-4 border-b border-border/40 bg-background">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{t('chooseModel')}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{t('selectModelDesc')}</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-muted/40 hover:bg-muted transition-colors">
                          <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto overscroll-contain bg-muted/5">
                      {/* Current Plan Card */}
                      <div className="px-4 py-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/60 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0",
                              user.plan === "free" && "bg-muted border border-border",
                              user.plan === "basic" && "bg-blue-500/10 border border-blue-500/20 text-blue-500",
                              user.plan === "pro" && "bg-purple-500/10 border border-purple-500/20 text-purple-500",
                              user.plan === "premium" && "bg-amber-500/10 border border-amber-500/20 text-amber-500",
                            )}>
                              <Zap className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-foreground truncate">
                                  {user.plan === "free" ? t('freeTrial') : `Sorix ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}`}
                                </p>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background border border-border">{t('current')}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                  <div className={cn("h-full rounded-full transition-all duration-500", user.tokensUsed / user.tokensLimit > 0.8 ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }} />
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{(user.tokensUsed / 1000).toFixed(0)}k {t('used')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-8 space-y-6">
                        {/* Smart Auto */}
                        {smartAutoModel && (
                          <SmartAutoItem model={smartAutoModel} isSelected={selectedModel === 'smart-auto'} onSelect={() => handleSelect(smartAutoModel)} isMobile={true} />
                        )}
                        {freeModels.length > 0 && <ModelSection title={t('freeModels')} titleColor="text-green-500" dotColor="bg-green-500" models={freeModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={true} getDailyUsageRemaining={getDailyUsageRemaining} />}
                        {basicModels.length > 0 && <ModelSection title={t('basicModels')} titleColor="text-blue-500" dotColor="bg-blue-500" models={basicModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={true} getDailyUsageRemaining={getDailyUsageRemaining} />}
                        {proModels.length > 0 && <ModelSection title={t('proModels')} titleColor="text-purple-500" dotColor="bg-purple-500" models={proModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={true} getDailyUsageRemaining={getDailyUsageRemaining} />}
                        {premiumModels.length > 0 && <ModelSection title={t('premiumModelsLabel')} titleColor="text-amber-500" dotColor="bg-amber-500" models={premiumModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={true} getDailyUsageRemaining={getDailyUsageRemaining} />}
                        <div className="h-8" />
                      </div>
                    </div>
                  </motion.div>
                </>,
                document.body,
              )
            ) : (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15, ease: "easeOut" }} className={cn("absolute left-0 top-full mt-2 w-[360px] z-50", "rounded-xl shadow-2xl shadow-black/20 overflow-hidden", "bg-popover/95 border border-border/80 backdrop-blur-xl")}>
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{t('chooseModel')}</span>
                        <p className="text-[10px] text-muted-foreground">{t('tokenMultiplier')}</p>
                      </div>
                      <div className={cn("px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5",
                        user.plan === "free" && "bg-muted text-muted-foreground",
                        user.plan === "basic" && "bg-blue-500/15 text-blue-400",
                        user.plan === "pro" && "bg-purple-500/15 text-purple-400",
                        user.plan === "premium" && "bg-amber-500/15 text-amber-400",
                      )}>
                        <Zap className="w-3 h-3" />
                        {user.plan === "free" ? t('freeTrial') : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", user.tokensUsed / user.tokensLimit > 0.8 ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{(user.tokensUsed / 1000).toFixed(0)}K / {(user.tokensLimit / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2 space-y-3">
                    {/* Smart Auto */}
                    {smartAutoModel && (
                      <SmartAutoItem model={smartAutoModel} isSelected={selectedModel === 'smart-auto'} onSelect={() => handleSelect(smartAutoModel)} isMobile={false} />
                    )}
                    {freeModels.length > 0 && <ModelSection title={t('freeModels')} titleColor="text-green-500" dotColor="bg-green-500" models={freeModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={false} getDailyUsageRemaining={getDailyUsageRemaining} />}
                    {basicModels.length > 0 && <ModelSection title={t('basicModels')} titleColor="text-blue-500" dotColor="bg-blue-500" models={basicModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={false} getDailyUsageRemaining={getDailyUsageRemaining} />}
                    {proModels.length > 0 && <ModelSection title={t('proModels')} titleColor="text-purple-500" dotColor="bg-purple-500" models={proModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={false} getDailyUsageRemaining={getDailyUsageRemaining} />}
                    {premiumModels.length > 0 && <ModelSection title={t('premiumModelsLabel')} titleColor="text-amber-500" dotColor="bg-amber-500" models={premiumModels} selectedModelId={selectedModel} userPlan={user.plan} onSelect={handleSelect} theme={theme} isAccessible={isModelAccessible} getRequiredPlan={getRequiredPlan} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} isMobile={false} getDailyUsageRemaining={getDailyUsageRemaining} />}
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Smart Auto Item Component
const SmartAutoItem = ({ model, isSelected, onSelect, isMobile }: { model: Model; isSelected: boolean; onSelect: () => void; isMobile: boolean }) => (
  <div className="mb-2">
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 transition-all duration-200 text-left rounded-xl",
        isMobile ? "px-4 py-4 active:scale-[0.98]" : "px-3 py-2.5",
        isSelected
          ? "bg-gradient-to-r from-primary/15 to-accent/15 border-2 border-primary/50 shadow-sm"
          : "bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 hover:border-primary/40",
      )}
    >
      <div className={cn("rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent flex-shrink-0", isMobile ? "w-10 h-10" : "w-8 h-8")}>
        <Sparkles className={cn("text-primary-foreground", isMobile ? "w-5 h-5" : "w-4 h-4")} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold", isMobile ? "text-base" : "text-sm")}>{model.name}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary">AUTO</span>
        </div>
        <p className={cn("text-muted-foreground mt-0.5", isMobile ? "text-sm" : "text-[11px]")}>{model.description}</p>
      </div>
      {isSelected && <Check className={cn("text-primary flex-shrink-0", isMobile ? "w-5 h-5" : "w-4 h-4")} />}
    </button>
  </div>
);

// Model Section Component
interface ModelSectionProps {
  title: string;
  titleColor: string;
  dotColor: string;
  models: Model[];
  selectedModelId: string;
  userPlan: UserPlan;
  onSelect: (model: Model) => void;
  theme: "light" | "dark";
  isAccessible: (model: Model) => boolean;
  getRequiredPlan: (model: Model) => UserPlan | null;
  getPlanLabel: (plan: UserPlan) => string;
  getPlanColor: (plan: UserPlan) => string;
  isMobile: boolean;
  getDailyUsageRemaining: (modelId: string) => number | null;
}

const ModelSection = ({ title, titleColor, dotColor, models, selectedModelId, userPlan, onSelect, theme, isAccessible, getRequiredPlan, getPlanLabel, getPlanColor, isMobile, getDailyUsageRemaining }: ModelSectionProps) => (
  <div>
    <div className="flex items-center gap-2 mb-2 px-1">
      <div className={cn("w-2 h-2 rounded-full", dotColor)} />
      <span className={cn("text-[11px] font-semibold uppercase tracking-wider", titleColor)}>{title}</span>
    </div>
    <div className="space-y-1">
      {models.map((model) => {
        const accessible = isAccessible(model);
        const requiredPlan = getRequiredPlan(model);
        const isSelected = selectedModelId === model.id;
        const dailyRemaining = getDailyUsageRemaining(model.id);

        return isMobile ? (
          <MobileModelItem key={model.id} model={model} isSelected={isSelected} isLocked={!accessible} requiredPlan={requiredPlan} onSelect={() => onSelect(model)} theme={theme} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} dailyRemaining={dailyRemaining} />
        ) : (
          <DesktopModelItem key={model.id} model={model} isSelected={isSelected} isLocked={!accessible} requiredPlan={requiredPlan} onSelect={() => onSelect(model)} theme={theme} getPlanLabel={getPlanLabel} getPlanColor={getPlanColor} dailyRemaining={dailyRemaining} />
        );
      })}
    </div>
  </div>
);

interface ModelItemProps {
  model: Model;
  isSelected: boolean;
  isLocked: boolean;
  requiredPlan: UserPlan | null;
  onSelect: () => void;
  theme: "light" | "dark";
  getPlanLabel: (plan: UserPlan) => string;
  getPlanColor: (plan: UserPlan) => string;
  dailyRemaining: number | null;
}

const MobileModelItem = ({ model, isSelected, isLocked, requiredPlan, onSelect, theme, getPlanLabel, getPlanColor, dailyRemaining }: ModelItemProps) => (
  <button
    onClick={onSelect}
    disabled={isLocked}
    className={cn(
      "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 text-left relative overflow-hidden active:scale-[0.98]",
      isSelected ? "bg-primary/10 border-2 border-primary/40 shadow-sm" : isLocked ? "opacity-60 bg-muted/20 border border-transparent" : "bg-card border border-border/40 shadow-sm",
    )}
  >
    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all", isSelected ? "border-primary bg-primary shadow-md" : "border-muted-foreground/30")}>
      {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
    </div>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-background border border-border/50">
      <ModelIcon modelId={model.id} modelName={model.name} size="md" theme={theme} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("font-semibold text-base", isLocked ? "text-muted-foreground" : "text-foreground")}>{model.name}</span>
        {model.multiplier > 1 && (
          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold border", model.multiplier >= 10 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-muted text-muted-foreground border-border/50")}>
            {model.multiplier}x
          </span>
        )}
        {isLocked && requiredPlan && (
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", getPlanColor(requiredPlan))}>
            {getPlanLabel(requiredPlan)}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{model.description}</p>
    </div>
    {isLocked && <Lock className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 absolute right-4 top-4" />}
  </button>
);

const DesktopModelItem = ({ model, isSelected, isLocked, requiredPlan, onSelect, theme, getPlanLabel, getPlanColor, dailyRemaining }: ModelItemProps) => (
  <button
    onClick={onSelect}
    disabled={isLocked}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group",
      isSelected ? "bg-primary/10" : isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50",
    )}
  >
    <div className="flex-shrink-0">
      <ModelIcon modelId={model.id} modelName={model.name} size="sm" theme={theme} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={cn("font-medium text-sm", isLocked && "text-muted-foreground")}>{model.name}</span>
        {model.multiplier > 1 && (
          <span className={cn("px-1 py-0.5 rounded text-[9px] font-bold", model.multiplier >= 10 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground")}>
            {model.multiplier}x
          </span>
        )}
        {isLocked && requiredPlan && (
          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getPlanColor(requiredPlan))}>
            {getPlanLabel(requiredPlan)}
          </span>
        )}
        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
      </div>
      <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">{model.description}</p>
    </div>
    {isLocked && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
  </button>
);

export default ModelSelector;
