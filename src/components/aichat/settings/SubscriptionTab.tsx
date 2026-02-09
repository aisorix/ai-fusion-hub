import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  Pause,
  Play,
  XCircle,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  Sparkles,
  Receipt,
  Gift,
  MessageSquare,
  ArrowLeft,
  HeartCrack,
  Frown,
  DollarSign,
  Lightbulb,
  HelpCircle,
  Shield,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useChatStore } from '@/stores/chatStore';
import UpgradePlanModal from '../UpgradePlanModal';
import { supabase } from '@/integrations/supabase/client';

// Plan details
const PLAN_DETAILS: Record<string, { name: string; price: number; features: string[] }> = {
  free: { name: 'Free', price: 0, features: ['50K Tokens', 'Basic AI Models', 'Web Search'] },
  basic: { name: 'Sorix Basic', price: 499, features: ['700K Tokens', '5 AI Models', 'Voice AI'] },
  pro: { name: 'Sorix Pro', price: 999, features: ['1.5M Tokens', 'All Pro Models', 'Priority Support'] },
  premium: { name: 'Sorix Premium', price: 1999, features: ['3M Tokens', 'All Models', 'Team Access'] },
};

// Cancellation reasons
const CANCELLATION_REASONS = [
  { id: 'too_expensive', label: 'Too expensive', icon: DollarSign },
  { id: 'not_using', label: 'Not using it enough', icon: Clock },
  { id: 'missing_features', label: 'Missing features I need', icon: Lightbulb },
  { id: 'found_alternative', label: 'Found an alternative', icon: RefreshCw },
  { id: 'technical_issues', label: 'Technical issues', icon: AlertCircle },
  { id: 'other', label: 'Other reason', icon: MessageSquare },
];

type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';
type CancellationStep = 'reason' | 'offer' | 'feedback' | 'confirm';

interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  pausedAt?: Date;
  cancelledAt?: Date;
}

// Mock subscription for demo
const mockSubscription: Subscription = {
  id: 'sub_demo_123',
  planId: 'pro',
  status: 'active',
  billingCycle: 'monthly',
  amount: 999,
  currency: '৳',
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

const SubscriptionTab: React.FC = () => {
  const { user } = useChatStore();
  const [subscription, setSubscription] = useState<Subscription | null>(
    user.plan !== 'free' ? mockSubscription : null
  );
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    action: 'pause' | 'cancel' | 'resume' | 'renew';
    open: boolean;
  }>({ action: 'pause', open: false });
  
  // Cancellation flow state
  const [showCancellationFlow, setShowCancellationFlow] = useState(false);
  const [cancellationStep, setCancellationStep] = useState<CancellationStep>('reason');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [acceptedOffer, setAcceptedOffer] = useState(false);

  const planDetails = PLAN_DETAILS[user.plan] || PLAN_DETAILS.free;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const diff = subscription.currentPeriodEnd.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const sendEmailNotification = async (
    type: 'payment_confirmation' | 'renewal_reminder' | 'cancellation_notice' | 'pause_notice' | 'resume_notice',
    email: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-subscription-email', {
        body: {
          type,
          email,
          planName: planDetails.name,
          amount: subscription?.amount,
          currency: subscription?.currency,
          nextBillingDate: subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : undefined,
          userName: user.name || 'Valued Customer',
        },
      });

      if (error) {
        console.error('Email notification error:', error);
      } else {
        console.log('Email notification sent:', type);
      }
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  };

  const resetCancellationFlow = () => {
    setShowCancellationFlow(false);
    setCancellationStep('reason');
    setSelectedReason(null);
    setFeedbackText('');
    setAcceptedOffer(false);
  };

  const handleAcceptOffer = async () => {
    setIsLoading('offer');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: '🎉 Discount Applied!',
      description: 'You\'ve received 30% off your next 3 months. Thank you for staying with us!',
    });
    
    resetCancellationFlow();
    setIsLoading(null);
  };

  const handleConfirmCancellation = async () => {
    setIsLoading('cancel');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userEmail = user.email || 'user@example.com';

    if (subscription) {
      setSubscription({
        ...subscription,
        status: 'cancelled',
        cancelledAt: new Date(),
      });
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will end at the current billing period. We\'re sorry to see you go.',
      });
      sendEmailNotification('cancellation_notice', userEmail);
    }

    resetCancellationFlow();
    setIsLoading(null);
  };

  const handleAction = async (action: 'pause' | 'resume' | 'cancel' | 'renew') => {
    if (action === 'cancel') {
      setShowCancellationFlow(true);
      setShowConfirmModal({ action, open: false });
      return;
    }

    setIsLoading(action);
    setShowConfirmModal({ action, open: false });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userEmail = user.email || 'user@example.com';

    if (subscription) {
      switch (action) {
        case 'pause':
          setSubscription({
            ...subscription,
            status: 'paused',
            pausedAt: new Date(),
          });
          toast({
            title: '⏸️ Subscription Paused',
            description: 'Your subscription has been paused. You can resume anytime.',
          });
          sendEmailNotification('pause_notice', userEmail);
          break;
        case 'resume':
          setSubscription({
            ...subscription,
            status: 'active',
            pausedAt: undefined,
          });
          toast({
            title: '▶️ Subscription Resumed',
            description: 'Welcome back! Your subscription is now active.',
          });
          sendEmailNotification('resume_notice', userEmail);
          break;
        case 'renew':
          setSubscription({
            ...subscription,
            status: 'active',
            cancelledAt: undefined,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
          toast({
            title: '🎉 Subscription Renewed',
            description: 'Your subscription has been renewed successfully!',
          });
          sendEmailNotification('payment_confirmation', userEmail);
          break;
      }
    }

    setIsLoading(null);
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    const badges = {
      active: { label: 'Active', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
      paused: { label: 'Paused', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Pause },
      cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
      expired: { label: 'Expired', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: AlertCircle },
    };
    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', badge.color)}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  // Cancellation Flow Modal
  const CancellationFlowModal = () => {
    if (!showCancellationFlow) return null;

    const renderStep = () => {
      switch (cancellationStep) {
        case 'reason':
          return (
            <motion.div
              key="reason"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <HeartCrack className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">We're sad to see you go</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Please tell us why you're leaving so we can improve
                </p>
              </div>

              <div className="space-y-2">
                {CANCELLATION_REASONS.map((reason) => {
                  const Icon = reason.icon;
                  const isSelected = selectedReason === reason.id;
                  
                  return (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 text-left',
                        'border-2',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/30'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <Icon className={cn(
                          'w-5 h-5',
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>
                      <span className={cn(
                        'font-medium',
                        isSelected ? 'text-primary' : 'text-foreground'
                      )}>
                        {reason.label}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetCancellationFlow}
                  className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Never mind
                </button>
                <button
                  onClick={() => setCancellationStep('offer')}
                  disabled={!selectedReason}
                  className={cn(
                    'flex-1 px-4 py-3 rounded-xl font-medium transition-all',
                    selectedReason
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          );

        case 'offer':
          return (
            <motion.div
              key="offer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <button
                onClick={() => setCancellationStep('reason')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Wait! We have a special offer</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  We'd love for you to stay. How about this?
                </p>
              </div>

              {/* Special Offer Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary">Limited Time Offer</span>
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    30% OFF
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  Get 30% off for the next 3 months
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue enjoying {planDetails.name} at a discounted price of{' '}
                  <span className="text-foreground font-semibold">
                    ৳{Math.round(planDetails.price * 0.7)}/month
                  </span>
                </p>
                <ul className="space-y-2 mb-4">
                  {planDetails.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleAcceptOffer}
                  disabled={isLoading === 'offer'}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading === 'offer' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      Accept Offer & Stay
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setCancellationStep('feedback')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  No thanks, I still want to cancel
                </button>
              </div>
            </motion.div>
          );

        case 'feedback':
          return (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <button
                onClick={() => setCancellationStep('offer')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Help us improve</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Any additional feedback would be greatly appreciated
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Additional comments (optional)
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm resize-none',
                    'bg-muted border border-border',
                    'placeholder:text-muted-foreground',
                    'focus:outline-none focus:border-primary/50 focus:shadow-glow'
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetCancellationFlow}
                  className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={() => setCancellationStep('confirm')}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
                >
                  Continue to Cancel
                </button>
              </div>
            </motion.div>
          );

        case 'confirm':
          return (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <button
                onClick={() => setCancellationStep('feedback')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Confirm Cancellation</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Please review what you'll lose
                </p>
              </div>

              {/* What you'll lose */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3">
                <h4 className="text-sm font-semibold text-red-500">You will lose access to:</h4>
                <ul className="space-y-2">
                  {planDetails.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Access until */}
              <div className="p-4 rounded-xl bg-muted border border-border">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Access until</p>
                    <p className="text-xs text-muted-foreground">
                      {subscription ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetCancellationFlow}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleConfirmCancellation}
                  disabled={isLoading === 'cancel'}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading === 'cancel' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </button>
              </div>
            </motion.div>
          );
      }
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          onClick={resetCancellationFlow}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl border border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              {['reason', 'offer', 'feedback', 'confirm'].map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    ['reason', 'offer', 'feedback', 'confirm'].indexOf(cancellationStep) >= index
                      ? 'bg-red-500'
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Confirmation Modal (for pause/resume/renew - not cancel)
  const ConfirmModal = () => {
    if (!showConfirmModal.open || showConfirmModal.action === 'cancel') return null;

    const actionDetails = {
      pause: {
        title: 'Pause Subscription',
        description: 'Your subscription will be paused. You won\'t be charged until you resume.',
        confirmText: 'Pause Subscription',
        icon: Pause,
        color: 'bg-yellow-500',
      },
      resume: {
        title: 'Resume Subscription',
        description: 'Your subscription will be reactivated immediately.',
        confirmText: 'Resume Subscription',
        icon: Play,
        color: 'bg-green-500',
      },
      cancel: {
        title: 'Cancel Subscription',
        description: 'You\'ll lose access to premium features at the end of your billing period.',
        confirmText: 'Cancel Subscription',
        icon: XCircle,
        color: 'bg-red-500',
      },
      renew: {
        title: 'Renew Subscription',
        description: 'Your subscription will be renewed for another billing cycle.',
        confirmText: 'Renew Now',
        icon: RefreshCw,
        color: 'bg-primary',
      },
    };

    const details = actionDetails[showConfirmModal.action];
    const Icon = details.icon;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          onClick={() => setShowConfirmModal({ ...showConfirmModal, open: false })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl border border-border p-6 max-w-md w-full"
          >
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', details.color + '/10')}>
              <Icon className={cn('w-6 h-6', details.color.replace('bg-', 'text-'))} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{details.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{details.description}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal({ ...showConfirmModal, open: false })}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(showConfirmModal.action)}
                disabled={isLoading !== null}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2',
                  details.color,
                  'hover:opacity-90'
                )}
              >
                {isLoading === showConfirmModal.action ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  details.confirmText
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{planDetails.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.plan === 'free' ? 'Free forever' : `৳${planDetails.price}/month`}
                </p>
              </div>
            </div>
            {subscription && getStatusBadge(subscription.status)}
          </div>
        </div>

        {subscription && (
          <div className="p-5 space-y-4">
            {/* Billing Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Next Billing</span>
                </div>
                <p className="font-semibold text-foreground">
                  {subscription.status === 'cancelled' 
                    ? 'N/A' 
                    : formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Days Remaining</span>
                </div>
                <p className="font-semibold text-foreground">{getDaysRemaining()} days</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {subscription.status === 'active' && (
                <>
                  <button
                    onClick={() => setShowConfirmModal({ action: 'pause', open: true })}
                    disabled={isLoading !== null}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
                  >
                    {isLoading === 'pause' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
                    Pause
                  </button>
                  <button
                    onClick={() => setShowConfirmModal({ action: 'cancel', open: true })}
                    disabled={isLoading !== null}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                  >
                    {isLoading === 'cancel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Cancel
                  </button>
                </>
              )}
              {subscription.status === 'paused' && (
                <button
                  onClick={() => setShowConfirmModal({ action: 'resume', open: true })}
                  disabled={isLoading !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  {isLoading === 'resume' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Resume Subscription
                </button>
              )}
              {(subscription.status === 'cancelled' || subscription.status === 'expired') && (
                <button
                  onClick={() => setShowConfirmModal({ action: 'renew', open: true })}
                  disabled={isLoading !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  {isLoading === 'renew' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Renew Subscription
                </button>
              )}
            </div>

            {/* Pause Info */}
            {subscription.status === 'paused' && subscription.pausedAt && (
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⏸️ Paused on {formatDate(subscription.pausedAt)}. Resume anytime to continue your subscription.
                </p>
              </div>
            )}

            {/* Cancel Info */}
            {subscription.status === 'cancelled' && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-600 dark:text-red-400">
                  ❌ Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. Renew to keep your premium features.
                </p>
              </div>
            )}
          </div>
        )}

        {!subscription && (
          <div className="p-5">
            <p className="text-sm text-muted-foreground mb-4">
              You're on the free plan. Upgrade to unlock premium features!
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Plan
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground px-1">Quick Actions</h4>
        
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Change Plan</p>
              <p className="text-xs text-muted-foreground">Upgrade or downgrade your subscription</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Payment History</p>
              <p className="text-xs text-muted-foreground">View past transactions and invoices</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Support Contact */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Need help with your subscription? Contact us at{' '}
          <a 
            href="mailto:support@aisorix.com" 
            className="text-primary hover:underline font-medium"
          >
            support@aisorix.com
          </a>
        </p>
      </div>

      {/* Upgrade Modal */}
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      {/* Confirm Modal */}
      <ConfirmModal />

      {/* Cancellation Flow Modal */}
      <CancellationFlowModal />
    </div>
  );
};

export default SubscriptionTab;
