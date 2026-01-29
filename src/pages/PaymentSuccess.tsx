import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChatStore, type UserPlan } from '@/stores/chatStore';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { setUserPlan } = useChatStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [planName, setPlanName] = useState<string>('');

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
          }
        } else {
          // No subscription found yet, might still be processing
          console.log('No active subscription found yet');
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [tranId, gateway, setUserPlan]);

  const getPlanDisplayName = (planId: string): string => {
    const names: Record<string, string> = {
      free: 'Free Trial',
      basic: 'Sorix Basic',
      pro: 'Sorix Pro',
      premium: 'Sorix Premium',
    };
    return names[planId] || planId;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <Sparkles className="absolute top-0 right-1/4 w-6 h-6 text-yellow-500 animate-bounce" />
          <Sparkles className="absolute bottom-4 left-1/4 w-4 h-4 text-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          {language === 'en' ? 'Payment Successful!' : 'পেমেন্ট সফল হয়েছে!'}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {language === 'en' 
            ? 'Thank you for your purchase. Your subscription is now active and you have access to all premium features.'
            : 'আপনার ক্রয়ের জন্য ধন্যবাদ। আপনার সাবস্ক্রিপশন এখন সক্রিয় এবং আপনি সমস্ত প্রিমিয়াম ফিচার অ্যাক্সেস করতে পারবেন।'}
        </p>

        {isVerifying ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{language === 'en' ? 'Verifying payment and activating your plan...' : 'পেমেন্ট যাচাই এবং প্ল্যান সক্রিয় করা হচ্ছে...'}</span>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-6 mb-8">
            {verified && planName && (
              <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  {language === 'en' ? `✓ ${planName} activated!` : `✓ ${planName} সক্রিয় করা হয়েছে!`}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'en' ? 'Transaction ID' : 'ট্রানজেকশন আইডি'}
            </p>
            <p className="font-mono text-foreground break-all">{tranId || 'N/A'}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/chat')}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
          >
            {language === 'en' ? 'Start Using Premium' : 'প্রিমিয়াম ব্যবহার শুরু করুন'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
