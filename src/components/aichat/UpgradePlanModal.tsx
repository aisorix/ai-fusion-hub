import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore, type UserPlan } from '@/stores/chatStore';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans: { id: UserPlan; name: string; price: number; tokens: string; models: number; features: string[]; popular?: boolean }[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tokens: '5K',
    models: 3,
    features: ['3 AI Models', 'Basic Chat', 'Web Access'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    tokens: '800K',
    models: 5,
    features: ['5 AI Models', 'Voice AI', 'Sorix Health', 'Sorix Agro', 'Web Search'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    tokens: '1.5M',
    models: 7,
    features: ['7 AI Models', 'Perplexity AI', 'All Code Models', 'Priority Support', 'File Uploads'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    tokens: '3M',
    models: 10,
    features: ['10 AI Models', 'Claude & GPT-5', 'Team Access', 'API Access', 'Dedicated Support'],
  },
];

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ isOpen, onClose }) => {
  const { user, setUserPlan } = useChatStore();

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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Unlock more features with a premium plan
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => {
                const isCurrentPlan = user.plan === plan.id;
                const Icon = plan.id === 'premium' ? Crown : plan.id === 'pro' ? Star : plan.id === 'basic' ? Zap : Sparkles;
                
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'relative rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200',
                      plan.popular && 'border-primary shadow-lg',
                      !plan.popular && 'border-border hover:border-primary/30',
                      isCurrentPlan && 'bg-primary/5'
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Popular
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        plan.id === 'premium' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                        plan.id === 'pro' ? 'bg-gradient-to-br from-primary to-accent' :
                        plan.id === 'basic' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        'bg-muted'
                      )}>
                        <Icon className={cn(
                          'w-5 h-5',
                          plan.id === 'free' ? 'text-muted-foreground' : 'text-white'
                        )} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.tokens} tokens/mo</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-2xl sm:text-3xl font-bold">৳{plan.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>

                    <div className="space-y-2 mb-5">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan}
                      className={cn(
                        'w-full py-2.5 rounded-xl font-medium text-sm transition-all',
                        isCurrentPlan
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : plan.popular
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Contact for Enterprise */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border text-center">
              <p className="text-sm text-muted-foreground">
                Need a custom plan for your team?{' '}
                <a href="mailto:enterprise@aisorix.com" className="text-primary hover:underline font-medium">
                  Contact us for Enterprise pricing
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradePlanModal;