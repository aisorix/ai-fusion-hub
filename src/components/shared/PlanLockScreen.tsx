import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Sparkles, Lock, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PLAN_DISPLAY_NAMES, type RequiredPlan } from "@/lib/planAccess";
import UpgradePlanModal from "@/components/aichat/UpgradePlanModal";

export interface PlanLockScreenProps {
  toolName: string;
  tagline: string;
  description?: string;
  requiredPlan: RequiredPlan;
  accentGradient: string; // tailwind gradient classes, e.g. "from-fuchsia-500 to-pink-500"
  icon: LucideIcon;
  features: string[];
}

const PlanLockScreen: React.FC<PlanLockScreenProps> = ({
  toolName,
  tagline,
  description,
  requiredPlan,
  accentGradient,
  icon: Icon,
  features,
}) => {
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const requiredName = PLAN_DISPLAY_NAMES[requiredPlan] ?? requiredPlan;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Top bar */}
      <header className="shrink-0 border-b border-border/40 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br shadow-md",
                accentGradient
              )}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-foreground truncate">{toolName}</h1>
              <p className="hidden sm:block text-[10px] text-muted-foreground truncate">{tagline}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn("absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full blur-[120px] opacity-30 bg-gradient-to-br", accentGradient)} />
          <div className={cn("absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full blur-[120px] opacity-20 bg-gradient-to-br", accentGradient)} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8"
        >
          {/* Required badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Requires {requiredName}
            </div>
          </div>

          {/* Icon halo */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className={cn("absolute inset-0 rounded-3xl blur-2xl opacity-60 bg-gradient-to-br", accentGradient)} />
              <div className={cn("relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br shadow-xl", accentGradient)}>
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-center text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Unlock {toolName}
          </h2>
          <p className="text-center text-sm sm:text-base text-muted-foreground mt-2 max-w-md mx-auto">
            {description ||
              `${toolName} is included with ${requiredName} and above. Upgrade your plan to start creating.`}
          </p>

          {/* Feature list */}
          <ul className="mt-6 grid grid-cols-1 gap-2.5 max-w-md mx-auto">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5"
              >
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br shrink-0 mt-0.5", accentGradient)}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-foreground">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <button
              onClick={() => setShowUpgrade(true)}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r",
                accentGradient
              )}
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Plan
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-border/60 hover:bg-muted transition-all text-foreground"
            >
              Go Back
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] text-muted-foreground">
            Questions about plans? Email{" "}
            <a href="mailto:support@aisorix.com" className="text-primary hover:underline">
              support@aisorix.com
            </a>
          </p>
        </motion.div>
      </main>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default PlanLockScreen;
