import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Zap, Crown, Gift, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore, type UserPlan } from '@/stores/chatStore';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Model colors for badges
const modelColors: Record<string, string> = {
  'GPT-4o': 'bg-emerald-500',
  'ChatGPT': 'bg-emerald-500',
  'DeepSeek': 'bg-blue-500',
  'Gemini': 'bg-blue-400',
  'Qwen': 'bg-violet-500',
  'Llama': 'bg-indigo-500',
  'Claude': 'bg-amber-500',
  'Grok': 'bg-rose-500',
  'Perplexity': 'bg-teal-500',
  'Sorix': 'bg-cyan-500',
  'Mistral': 'bg-orange-500',
};

interface PlanData {
  id: UserPlan;
  name: string;
  price: number;
  yearlyPrice: number;
  tokens: string;
  modelCount: number;
  models: string[];
  features: { text: string; subtext?: string; included: boolean }[];
  popular?: boolean;
  icon: typeof Gift;
  iconGradient: string;
  buttonText: string;
  buttonStyle: string;
}

const plans: PlanData[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    yearlyPrice: 0,
    tokens: '5K',
    modelCount: 3,
    models: ['GPT-4o', 'DeepSeek', 'Gemini'],
    features: [
      { text: '5K Tokens', subtext: '/month', included: true },
      { text: 'Web Search', included: false },
      { text: 'Projects', included: false },
      { text: 'Voice AI', included: false },
      { text: 'File Upload', included: false },
      { text: 'Image Gen', included: false },
      { text: 'Memory', included: false },
      { text: 'Sorix Legends', included: false },
      { text: 'Sorix Health', included: true },
      { text: 'Sorix Agro', included: true },
    ],
    icon: Gift,
    iconGradient: 'from-slate-500 to-slate-600',
    buttonText: 'Current Plan',
    buttonStyle: 'bg-muted text-muted-foreground',
  },
  {
    id: 'basic',
    name: 'Sorix Basic',
    price: 499,
    yearlyPrice: Math.round(499 * 12 * 0.8),
    tokens: '800K',
    modelCount: 5,
    models: ['ChatGPT', 'Qwen', 'DeepSeek', 'Gemini', 'Llama'],
    features: [
      { text: '800K Tokens', subtext: '/month', included: true },
      { text: 'Web Search (Basic)', included: true },
      { text: 'Voice AI Basic', subtext: '10 min/day', included: true },
      { text: 'File Upload: PDF/DOC', subtext: 'Max 5mb', included: true },
      { text: 'Image Gen', subtext: '20 imgs/month', included: true },
      { text: 'Memory', included: true },
      { text: '2 Projects', included: true },
      { text: '2 Sorix Legends', included: true },
      { text: 'Sorix Health', included: true },
      { text: 'Sorix Agro', included: true },
    ],
    icon: Zap,
    iconGradient: 'from-cyan-500 to-blue-500',
    buttonText: 'Get Started',
    buttonStyle: 'border-2 border-foreground/20 text-foreground hover:bg-muted',
  },
  {
    id: 'pro',
    name: 'Sorix Pro',
    price: 999,
    yearlyPrice: Math.round(999 * 12 * 0.8),
    tokens: '1.5M',
    modelCount: 8,
    models: ['ChatGPT', 'Qwen', 'DeepSeek', 'Gemini', 'Llama', 'Claude', 'Grok', 'Perplexity'],
    features: [
      { text: '1.5M Tokens', subtext: '/month', included: true },
      { text: 'Web Search (Pro)', included: true },
      { text: 'Voice AI High', included: true },
      { text: 'File Upload: PDF/DOC', subtext: 'Max 10mb', included: true },
      { text: 'Image Gen', subtext: '50 imgs/month', included: true },
      { text: 'Memory Long', included: true },
      { text: '5 Projects', included: true },
      { text: '5 Sorix Legends', included: true },
      { text: 'Sorix Health', included: true },
      { text: 'Sorix Agro', included: true },
    ],
    popular: true,
    icon: Sparkles,
    iconGradient: 'from-primary to-blue-600',
    buttonText: 'Get Pro',
    buttonStyle: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    id: 'premium',
    name: 'Sorix Premium',
    price: 1999,
    yearlyPrice: Math.round(1999 * 12 * 0.8),
    tokens: '3M',
    modelCount: 10,
    models: ['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Grok', 'Qwen', 'Llama', 'Sorix', 'Mistral', 'Perplexity'],
    features: [
      { text: '3M Tokens', subtext: '/month', included: true },
      { text: 'Web Search (Premium)', included: true },
      { text: 'Voice AI Unlimited', included: true },
      { text: 'File Upload: PDF/DOC', subtext: 'Max 15mb', included: true },
      { text: 'Image Gen', subtext: '100 imgs/month', included: true },
      { text: 'Memory Ultra', included: true },
      { text: '10 Projects', included: true },
      { text: 'Team Access', subtext: 'Up to 3 members', included: true },
      { text: 'All Sorix Legends', included: true },
      { text: 'Sorix Health', included: true },
      { text: 'Sorix Agro', included: true },
    ],
    icon: Crown,
    iconGradient: 'from-amber-500 to-orange-500',
    buttonText: 'Go Premium',
    buttonStyle: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90',
  },
];

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ isOpen, onClose }) => {
  const { user, setUserPlan } = useChatStore();
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (planId: UserPlan) => {
    setUserPlan(planId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl border border-border w-full max-w-6xl max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 border-b border-border relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Unlock Premium Features
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Choose Your Plan</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Select the perfect plan for your AI needs
            </p>
            
            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center gap-4 mt-4">
              <span className={cn(
                'text-sm font-medium transition-colors',
                !isYearly ? 'text-foreground' : 'text-muted-foreground'
              )}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-7 rounded-full bg-muted p-1 transition-all"
              >
                <div className={cn(
                  'w-5 h-5 rounded-full bg-primary shadow-sm transition-all duration-300',
                  isYearly ? 'translate-x-7' : 'translate-x-0'
                )} />
              </button>
              <span className={cn(
                'text-sm font-medium transition-colors',
                isYearly ? 'text-foreground' : 'text-muted-foreground'
              )}>
                Yearly
              </span>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="p-3 sm:p-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {plans.map((plan) => {
                const isCurrentPlan = user.plan === plan.id;
                const Icon = plan.icon;
                const displayPrice = isYearly && plan.price > 0 
                  ? Math.round(plan.yearlyPrice / 12) 
                  : plan.price;
                
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'relative rounded-2xl border transition-all duration-200 flex flex-col',
                      plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border',
                      isCurrentPlan && 'bg-muted/30'
                    )}
                  >
                    {/* Popular Badge / Your Current Plan Badge */}
                    {plan.popular && !isCurrentPlan && (
                      <div className="absolute -top-0 left-0 right-0 flex justify-center">
                        <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-b-lg flex items-center gap-1.5 border-x border-b border-primary/20">
                          <Sparkles className="w-3 h-3" />
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    {isCurrentPlan && (
                      <div className="absolute -top-0 left-0 right-0 flex justify-center">
                        <div className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-b-lg border-x border-b border-border">
                          Your Current Plan
                        </div>
                      </div>
                    )}

                    <div className={cn('p-4 sm:p-5 flex flex-col flex-1', (plan.popular || isCurrentPlan) && 'pt-8')}>
                      {/* Plan Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br',
                          plan.iconGradient
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{plan.name}</h3>
                          {plan.id === 'free' && (
                            <p className="text-xs text-muted-foreground">Forever free</p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-3xl sm:text-4xl font-black text-foreground">৳{displayPrice}</span>
                          <span className="text-muted-foreground text-sm">/mo</span>
                        </div>
                      </div>

                      {/* AI Models Count */}
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {plan.modelCount} AI MODELS
                      </p>

                      {/* Model Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {plan.models.slice(0, 5).map((model) => (
                          <div key={model} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
                            <span className={cn('w-2 h-2 rounded-full', modelColors[model] || 'bg-primary')} />
                            <span className="text-xs font-medium text-foreground">{model}</span>
                          </div>
                        ))}
                        {plan.models.length > 5 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs font-medium text-foreground">+{plan.models.length - 5}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-5 flex-1">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <span className={cn(
                                'text-sm',
                                feature.included ? 'text-foreground' : 'text-muted-foreground/60'
                              )}>
                                {feature.text}
                              </span>
                              {feature.subtext && feature.included && (
                                <span className="text-xs text-muted-foreground ml-1">({feature.subtext})</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isCurrentPlan}
                        className={cn(
                          'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                          isCurrentPlan
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : plan.buttonStyle
                        )}
                      >
                        {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                        {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer - Powered by AI Models */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Powered by the best AI models
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Grok'].map((model) => (
                  <div key={model} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border/50">
                    <span className={cn('w-2 h-2 rounded-full', modelColors[model] || 'bg-primary')} />
                    <span className="text-xs font-medium text-foreground">{model}</span>
                  </div>
                ))}
                <div className="px-2.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-bold text-primary">+10 more</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradePlanModal;
