import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, Sparkles, Crown, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChatStore, type UserPlan } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { setUserPlan, createNewChat } = useChatStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [countdown, setCountdown] = useState(5);

  const tranId = searchParams.get('tran_id');
  const gateway = searchParams.get('gateway');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsVerifying(false);
          return;
        }

        // Wait for webhook to process
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Fetch the user's subscription from the database
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('plan_id, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (subscription && subscription.plan_id) {
          // Update the chatStore with the new plan
          const validPlans: UserPlan[] = ['free', 'basic', 'pro', 'premium'];
          const planId = subscription.plan_id as UserPlan;
          
          if (validPlans.includes(planId)) {
            setUserPlan(planId);
            setPlanName(getPlanDisplayName(planId));
            setVerified(true);
            
            // Start countdown for auto-redirect to chat
            let count = 5;
            const countdownInterval = setInterval(() => {
              count -= 1;
              setCountdown(count);
              if (count <= 0) {
                clearInterval(countdownInterval);
                createNewChat();
                navigate('/chat');
              }
            }, 1000);
          }
        } else {
          console.log('No active subscription found yet');
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [tranId, gateway, setUserPlan, navigate, createNewChat]);

  const getPlanDisplayName = (planId: string): string => {
    const names: Record<string, string> = {
      free: 'Free Trial',
      basic: 'Sorix Basic',
      pro: 'Sorix Pro',
      premium: 'Sorix Premium',
    };
    return names[planId] || planId;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'premium': return <Crown className="w-8 h-8" />;
      case 'pro': return <Zap className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  const handleGoToChat = () => {
    createNewChat();
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full text-center"
      >
        {/* Success Animation */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 relative"
        >
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-32 h-32 rounded-full border-2 border-green-500/30"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="w-32 h-32 rounded-full border-2 border-primary/20"
            />
          </div>
          
          {/* Main icon */}
          <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center backdrop-blur-sm border border-green-500/30">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          
          {/* Floating sparkles */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-1/4"
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-4 left-1/4"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          {language === 'en' ? 'Payment Successful!' : 'পেমেন্ট সফল হয়েছে!'}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8"
        >
          {language === 'en' 
            ? 'Welcome to your premium AI experience. All features are now unlocked!'
            : 'আপনার প্রিমিয়াম AI অভিজ্ঞতায় স্বাগতম। সমস্ত ফিচার আনলক হয়েছে!'}
        </motion.p>

        {isVerifying ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
            </div>
            <span className="text-muted-foreground">
              {language === 'en' ? 'Activating your plan...' : 'প্ল্যান সক্রিয় করা হচ্ছে...'}
            </span>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {verified && planName && (
              <div className={cn(
                'rounded-2xl p-6 mb-6 border backdrop-blur-sm',
                'bg-gradient-to-br from-primary/10 via-background to-accent/10',
                'border-primary/30'
              )}>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-primary/20 text-primary">
                    {getPlanIcon(planName.toLowerCase().replace('sorix ', ''))}
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  {language === 'en' ? `${planName} Activated!` : `${planName} সক্রিয় হয়েছে!`}
                </p>
                
                {/* Auto-redirect countdown */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {language === 'en' 
                      ? `Opening chat in ${countdown}s...` 
                      : `${countdown} সেকেন্ডে চ্যাট খোলা হচ্ছে...`}
                  </span>
                </div>
              </div>
            )}

            {/* Transaction ID */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                {language === 'en' ? 'Transaction ID' : 'ট্রানজেকশন আইডি'}
              </p>
              <p className="font-mono text-sm text-foreground break-all">{tranId || 'N/A'}</p>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mt-6"
        >
          <Button
            onClick={handleGoToChat}
            size="lg"
            className={cn(
              'w-full h-12 text-base font-semibold rounded-xl',
              'bg-gradient-to-r from-primary via-primary to-accent',
              'hover:shadow-lg hover:shadow-primary/30 transition-all duration-300',
              'group'
            )}
          >
            <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {language === 'en' ? 'Start Chatting Now' : 'এখনই চ্যাট শুরু করুন'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
