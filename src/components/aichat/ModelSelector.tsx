import React, { useState } from "react";
import { ChevronDown, Lock, Check, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore, type UserPlan, type Model } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModelIcon } from "./ModelIcons";
import { toast } from "sonner";

// Get all models organized by tier for display
const getAllModelsGrouped = () => {
  const { models } = useChatStore.getState();

  // Group by display name to avoid duplicates in the same tier
  const freeModels = models.filter((m) => m.plans.includes("free"));
  const basicModels = models.filter((m) => m.plans.includes("basic") && !m.plans.includes("free"));
  const proModels = models.filter(
    (m) => m.plans.includes("pro") && !m.plans.includes("basic") && !m.plans.includes("free"),
  );
  const premiumModels = models.filter(
    (m) =>
      m.plans.includes("premium") &&
      !m.plans.includes("pro") &&
      !m.plans.includes("basic") &&
      !m.plans.includes("free"),
  );

  return { freeModels, basicModels, proModels, premiumModels };
};

// Get unique models by name to avoid duplicates
const getUniqueModelsByName = (models: Model[]): Model[] => {
  const seen = new Set<string>();
  return models.filter((m) => {
    if (seen.has(m.name)) return false;
    seen.add(m.name);
    return true;
  });
};

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, models, setSelectedModel, user, theme } = useChatStore();
  const isMobile = useIsMobile();

  // Get available models for current plan
  const availableModels = models.filter((m) => m.plans.includes(user.plan));
  const currentModel = models.find((m) => m.id === selectedModel) || availableModels[0];
  const isPaidUser = user.plan !== "free";

  // Get all models grouped by tier
  const freeModels = getUniqueModelsByName(models.filter((m) => m.plans.includes("free")));
  const basicModels = getUniqueModelsByName(
    models.filter((m) => m.plans.includes("basic") && !m.plans.includes("free")),
  );
  const proModels = getUniqueModelsByName(models.filter((m) => m.plans.includes("pro") && !m.plans.includes("basic")));
  const premiumModels = getUniqueModelsByName(
    models.filter((m) => m.plans.includes("premium") && !m.plans.includes("pro")),
  );

  const isModelAccessible = (model: Model) => {
    return model.plans.includes(user.plan);
  };

  const getRequiredPlan = (model: Model): UserPlan | null => {
    if (model.plans.includes("free")) return null;
    if (model.plans.includes("basic")) return "basic";
    if (model.plans.includes("pro")) return "pro";
    return "premium";
  };

  const handleSelect = (model: Model) => {
    if (!isModelAccessible(model)) {
      return; // Can't select locked models
    }

    // Show warning for heavy models (multiplier >= 10)
    if (model.multiplier >= 10) {
      toast.warning(`This model uses ${model.multiplier}x tokens per message`, {
        description: "Heavy AI model - tokens will be deducted at higher rate",
        duration: 4000,
      });
    }

    setSelectedModel(model.id);
    setIsOpen(false);
  };

  const getPlanLabel = (plan: UserPlan) => {
    switch (plan) {
      case "basic":
        return "Basic";
      case "pro":
        return "Pro";
      case "premium":
        return "Premium";
      default:
        return "";
    }
  };

  const getPlanColor = (plan: UserPlan) => {
    switch (plan) {
      case "basic":
        return "bg-blue-500/15 text-blue-500";
      case "pro":
        return "bg-purple-500/15 text-purple-500";
      case "premium":
        return "bg-amber-500/15 text-amber-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200",
          "bg-card/80 border backdrop-blur-sm",
          "hover:border-primary/40 hover:bg-card",
          "active:scale-95",
          isPaidUser ? "border-primary/40 shadow-md shadow-primary/10" : "border-border/60",
        )}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex items-center justify-center">
          <ModelIcon
            modelId={currentModel?.id || ""}
            modelName={currentModel?.name || ""}
            size="md"
            showGlow={isPaidUser}
            theme={theme}
          />
        </div>
        <span
          className={cn(
            "font-medium text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate",
            isPaidUser && "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text",
          )}
        >
          {currentModel?.name || "Select Model"}
        </span>
        <ChevronDown
          className={cn(
            "w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
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

            {/* Mobile: Centered Modal (FIXED LAYOUT) */}
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col h-[85vh] max-h-[800px] rounded-3xl overflow-hidden bg-background border border-border/60 shadow-2xl"
              >
                {/* Header - Fixed Height */}
                <div className="flex-none relative px-5 py-4 border-b border-border/40 bg-gradient-to-b from-muted/40 to-transparent">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 p-2.5 rounded-xl bg-muted/60 hover:bg-muted transition-colors active:scale-95"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <h3 className="text-xl font-bold text-foreground">Choose Model</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Select an AI model for your conversation</p>
                </div>

                {/* Current Plan Card - Fixed Height */}
                <div className="flex-none px-4 pt-4 pb-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/40">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0",
                          user.plan === "free" && "bg-muted border border-border",
                          user.plan === "basic" &&
                            "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
                          user.plan === "pro" &&
                            "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
                          user.plan === "premium" &&
                            "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
                        )}
                      >
                        <Zap
                          className={cn(
                            "w-6 h-6",
                            user.plan === "free" && "text-muted-foreground",
                            user.plan === "basic" && "text-blue-400",
                            user.plan === "pro" && "text-purple-400",
                            user.plan === "premium" && "text-amber-400",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-foreground truncate">
                          {user.plan === "free"
                            ? "Free Trial"
                            : `Sorix ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                user.tokensUsed / user.tokensLimit > 0.8 ? "bg-red-500" : "bg-primary",
                              )}
                              style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {(user.tokensUsed / 1000).toFixed(0)}k used
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Models List - SCROLLABLE AREA (Flex Grow) */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-2 space-y-5 scrollbar-hide">
                  {/* Free Models */}
                  {freeModels.length > 0 && (
                    <ModelSection
                      title="FREE MODELS"
                      titleColor="text-green-500"
                      dotColor="bg-green-500"
                      models={freeModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={true}
                    />
                  )}

                  {/* Basic Models */}
                  {basicModels.length > 0 && (
                    <ModelSection
                      title="BASIC MODELS"
                      titleColor="text-blue-500"
                      dotColor="bg-blue-500"
                      models={basicModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={true}
                    />
                  )}

                  {/* Pro Models */}
                  {proModels.length > 0 && (
                    <ModelSection
                      title="PRO MODELS"
                      titleColor="text-purple-500"
                      dotColor="bg-purple-500"
                      models={proModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={true}
                    />
                  )}

                  {/* Premium Models */}
                  {premiumModels.length > 0 && (
                    <ModelSection
                      title="PREMIUM MODELS"
                      titleColor="text-amber-500"
                      dotColor="bg-amber-500"
                      models={premiumModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={true}
                    />
                  )}

                  {/* Bottom Spacer */}
                  <div className="h-6" />
                </div>
              </motion.div>
            ) : (
              /* Desktop Dropdown */
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={cn(
                  "absolute left-0 top-full mt-2 w-[360px] z-50",
                  "rounded-xl shadow-2xl shadow-black/20 overflow-hidden",
                  "bg-popover/95 border border-border/80 backdrop-blur-xl",
                )}
              >
                {/* Header with Plan Info */}
                <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Choose Model</span>
                      <p className="text-[10px] text-muted-foreground">Token multiplier affects usage</p>
                    </div>
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5",
                        user.plan === "free" && "bg-muted text-muted-foreground",
                        user.plan === "basic" && "bg-blue-500/15 text-blue-400",
                        user.plan === "pro" && "bg-purple-500/15 text-purple-400",
                        user.plan === "premium" && "bg-amber-500/15 text-amber-400",
                      )}
                    >
                      <Zap className="w-3 h-3" />
                      {user.plan === "free" ? "Free Trial" : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </div>
                  </div>
                  {/* Token Progress */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          user.tokensUsed / user.tokensLimit > 0.8 ? "bg-destructive" : "bg-primary",
                        )}
                        style={{ width: `${Math.min((user.tokensUsed / user.tokensLimit) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {(user.tokensUsed / 1000).toFixed(0)}K / {(user.tokensLimit / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2 space-y-3">
                  {/* Free Models */}
                  {freeModels.length > 0 && (
                    <ModelSection
                      title="FREE MODELS"
                      titleColor="text-green-500"
                      dotColor="bg-green-500"
                      models={freeModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={false}
                    />
                  )}

                  {/* Basic Models */}
                  {basicModels.length > 0 && (
                    <ModelSection
                      title="BASIC MODELS"
                      titleColor="text-blue-500"
                      dotColor="bg-blue-500"
                      models={basicModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={false}
                    />
                  )}

                  {/* Pro Models */}
                  {proModels.length > 0 && (
                    <ModelSection
                      title="PRO MODELS"
                      titleColor="text-purple-500"
                      dotColor="bg-purple-500"
                      models={proModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={false}
                    />
                  )}

                  {/* Premium Models */}
                  {premiumModels.length > 0 && (
                    <ModelSection
                      title="PREMIUM MODELS"
                      titleColor="text-amber-500"
                      dotColor="bg-amber-500"
                      models={premiumModels}
                      selectedModelId={selectedModel}
                      userPlan={user.plan}
                      onSelect={handleSelect}
                      theme={theme}
                      isAccessible={isModelAccessible}
                      getRequiredPlan={getRequiredPlan}
                      getPlanLabel={getPlanLabel}
                      getPlanColor={getPlanColor}
                      isMobile={false}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

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
}

const ModelSection = ({
  title,
  titleColor,
  dotColor,
  models,
  selectedModelId,
  userPlan,
  onSelect,
  theme,
  isAccessible,
  getRequiredPlan,
  getPlanLabel,
  getPlanColor,
  isMobile,
}: ModelSectionProps) => (
  <div>
    <div className="flex items-center gap-2 mb-2 px-1">
      <div className={cn("w-2 h-2 rounded-full", dotColor)} />
      <span className={cn("text-[11px] font-semibold uppercase tracking-wider", titleColor)}>{title}</span>
    </div>
    <div className="space-y-1">
      {models.map((model) => {
        const accessible = isAccessible(model);
        const requiredPlan = getRequiredPlan(model);
        const isSelected =
          selectedModelId === model.id ||
          (accessible && models.find((m) => m.id === selectedModelId)?.name === model.name);

        return isMobile ? (
          <MobileModelItem
            key={model.id}
            model={model}
            isSelected={isSelected}
            isLocked={!accessible}
            requiredPlan={requiredPlan}
            onSelect={() => onSelect(model)}
            theme={theme}
            getPlanLabel={getPlanLabel}
            getPlanColor={getPlanColor}
          />
        ) : (
          <DesktopModelItem
            key={model.id}
            model={model}
            isSelected={isSelected}
            isLocked={!accessible}
            requiredPlan={requiredPlan}
            onSelect={() => onSelect(model)}
            theme={theme}
            getPlanLabel={getPlanLabel}
            getPlanColor={getPlanColor}
          />
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
}

// Mobile Model Item
const MobileModelItem = ({
  model,
  isSelected,
  isLocked,
  requiredPlan,
  onSelect,
  theme,
  getPlanLabel,
  getPlanColor,
}: ModelItemProps) => (
  <button
    onClick={onSelect}
    disabled={isLocked}
    className={cn(
      "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 text-left",
      "active:scale-[0.98]",
      isSelected
        ? "bg-primary/10 border-2 border-primary/40 shadow-sm"
        : isLocked
          ? "opacity-50 bg-muted/20 border border-transparent"
          : "bg-muted/30 hover:bg-muted/50 border border-border/40",
    )}
  >
    {/* Selection Radio - Larger for mobile */}
    <div
      className={cn(
        "w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
        isSelected ? "border-primary bg-primary shadow-md" : "border-muted-foreground/30",
      )}
    >
      {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
    </div>

    {/* Model Icon - Larger for mobile */}
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
      <ModelIcon modelId={model.id} modelName={model.name} size="md" theme={theme} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("font-semibold text-base", isLocked ? "text-muted-foreground" : "text-foreground")}>
          {model.name}
        </span>
        {/* Show multiplier badge only for heavy models (10x+) */}
        {model.multiplier >= 10 && (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
            {model.multiplier}x
          </span>
        )}
        {isLocked && requiredPlan && (
          <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", getPlanColor(requiredPlan))}>
            {getPlanLabel(requiredPlan)}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{model.description}</p>
    </div>

    {isLocked && <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
  </button>
);

// Desktop Model Item
const DesktopModelItem = ({
  model,
  isSelected,
  isLocked,
  requiredPlan,
  onSelect,
  theme,
  getPlanLabel,
  getPlanColor,
}: ModelItemProps) => (
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
        {/* Show multiplier badge only for heavy models (10x+) */}
        {model.multiplier >= 10 && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
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
