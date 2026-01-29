import React, { useState } from 'react';
import { Sparkles, Zap, Check, Heart, Leaf, Gamepad2, RotateCcw } from 'lucide-react';
import { useChatStore, type UserPlan } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/translations';
import { toast } from '@/hooks/use-toast';
import UpgradePlanModal from '../UpgradePlanModal';

// Helper to format token numbers
const formatTokens = (tokens: number): string => {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1).replace('.0', '')}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return tokens.toString();
};

const planFeatures: Record<UserPlan, { name: string; models: number; tokens: string; features: string[] }> = {
  free: { name: 'Free Trial', models: 3, tokens: '5K', features: ['3 AI Models', 'Basic Chat Only'] },
  basic: { name: 'Sorix Basic', models: 5, tokens: '800K', features: ['5 AI Models', 'Code Models', 'Sorix Health', 'Sorix Agro'] },
  pro: { name: 'Sorix Pro', models: 7, tokens: '1.5M', features: ['7 AI Models', 'Perplexity', 'All Code Models'] },
  premium: { name: 'Sorix Premium', models: 10, tokens: '3M', features: ['10 AI Models', 'Premium Search', 'All Models', 'Priority Support'] },
};

const PlansTokensTab = () => {
  const { user, language, setUser } = useChatStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const currentPlan = planFeatures[user.plan];
  const usagePercent = user.tokensLimit > 0 ? (user.tokensUsed / user.tokensLimit) * 100 : 0;

  const handleResetUsage = () => {
    setUser({ ...user, tokensUsed: 0 });
    toast({
      title: "✅ Usage Reset",
      description: "Your token usage has been reset to 0 for testing.",
    });
  };
  
  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Plans & Credits</h3>
          <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
            Manage your subscription and token usage
          </p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-3 sm:space-y-4">
          {/* Current Plan Card */}
          <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
            {/* Plan Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center bg-primary/10">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">You're on</p>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">{currentPlan.name}</h4>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Monthly Limit</p>
                <p className="font-medium text-sm sm:text-base text-foreground">{formatTokens(user.tokensLimit)} tokens</p>
              </div>
            </div>
            
            {/* Token Usage */}
            {user.tokensLimit > 0 && (
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Token usage</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                    {formatTokens(user.tokensUsed)} / {formatTokens(user.tokensLimit)}
                  </span>
                </div>
                
                <div className="h-2 sm:h-2.5 rounded-full overflow-hidden bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
                
                {/* Reset Button for Testing */}
                <button
                  onClick={handleResetUsage}
                  className={cn(
                    'mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all',
                    'bg-muted hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Usage (Testing)
                </button>
              </div>
            )}
            
            {/* Features */}
            <div className="mb-4 sm:mb-5">
              <p className="text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">Included in your plan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upgrade Button */}
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className={cn(
                'w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90 hover:shadow-glow'
              )}
            >
              {user.plan === 'premium' ? 'Manage Plan' : 'Upgrade'}
            </button>
          </div>
          
          {/* Sorix Tools Section */}
          <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
            <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Free Tools for Everyone</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-xs sm:text-sm">Sorix Health</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Health assistance for all</p>
                </div>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap">
                  Free
                </span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-xs sm:text-sm">Sorix Agro</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Agricultural guidance for all</p>
                </div>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap">
                  Free
                </span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50 opacity-60">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-xs sm:text-sm">Sorix Legends</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Premium AI characters</p>
                </div>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                  Premium
                </span>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="p-3 sm:p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">Need more tokens?</span>
            </div>
            <p className="text-[10px] sm:text-sm text-muted-foreground">
              Token calculation is based on the model used. Upgrade your plan for more tokens.
            </p>
          </div>

          {/* Support Contact */}
          <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Questions about plans? Contact us at{' '}
              <a 
                href="mailto:support@aisorix.com" 
                className="text-primary hover:underline font-medium"
              >
                support@aisorix.com
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
};

export default PlansTokensTab;