import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Smartphone, Globe, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Payment method logos
import sslcommerzLogo from '@/assets/sslcommerz.png';
import bkashMerchantLogo from '@/assets/bkash-merchant.png';
import stripeLogo from '@/assets/stripe.png';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    displayName: string;
    price: number;
    yearlyPrice: number;
  } | null;
  isYearly: boolean;
  language: string;
}

type PaymentGateway = 'sslcommerz' | 'bkash' | 'stripe';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  isYearly,
  language,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!plan) return null;

  const price = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.price;
  const totalPrice = isYearly ? plan.yearlyPrice : plan.price;
  const billingCycle = isYearly ? 'yearly' : 'monthly';

  const formatPrice = (price: number) => {
    if (language === 'bn') {
      return `৳${price.toLocaleString('bn-BD')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  const gateways = [
    {
      id: 'bkash' as PaymentGateway,
      name: 'bKash',
      description: language === 'en' ? 'Pay with bKash mobile banking' : 'বিকাশ মোবাইল ব্যাংকিং দিয়ে পে করুন',
      logo: bkashMerchantLogo,
      icon: Smartphone,
      color: 'from-pink-500 to-rose-500',
      available: true,
    },
    {
      id: 'sslcommerz' as PaymentGateway,
      name: 'SSLCommerz',
      description: language === 'en' ? 'Cards, Mobile Banking & Net Banking' : 'কার্ড, মোবাইল ব্যাংকিং ও নেট ব্যাংকিং',
      logo: sslcommerzLogo,
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500',
      available: true,
    },
    {
      id: 'stripe' as PaymentGateway,
      name: 'Stripe',
      description: language === 'en' ? 'International cards (Visa, Mastercard)' : 'আন্তর্জাতিক কার্ড (ভিসা, মাস্টারকার্ড)',
      logo: stripeLogo,
      icon: Globe,
      color: 'from-indigo-500 to-purple-500',
      available: true,
    },
  ];

  const handlePayment = async () => {
    if (!selectedGateway) {
      toast.error(language === 'en' ? 'Please select a payment method' : 'একটি পেমেন্ট মেথড নির্বাচন করুন');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(language === 'en' ? 'Please login first' : 'প্রথমে লগইন করুন');
        setIsProcessing(false);
        return;
      }

      const paymentData = {
        userId: user.id,
        planId: plan.name,
        planName: plan.displayName,
        amount: totalPrice,
        currency: '৳',
        customerName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email || '',
        billingCycle,
        origin: window.location.origin,
      };

      let response;

      if (selectedGateway === 'stripe') {
        response = await supabase.functions.invoke('stripe-payment', {
          body: paymentData,
        });

        if (response.data?.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
          return;
        }
      } else if (selectedGateway === 'sslcommerz') {
        response = await supabase.functions.invoke('sslcommerz-payment', {
          body: paymentData,
        });

        if (response.data?.gatewayPageURL) {
          window.location.href = response.data.gatewayPageURL;
          return;
        }
      } else if (selectedGateway === 'bkash') {
        response = await supabase.functions.invoke('bkash-payment', {
          body: {
            action: 'create_payment',
            ...paymentData,
          },
        });

        if (response.data?.bkashURL) {
          window.location.href = response.data.bkashURL;
          return;
        }
      }

      if (response?.error || !response?.data?.success === false) {
        throw new Error(response?.data?.error || 'Payment initialization failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || (language === 'en' ? 'Payment failed. Please try again.' : 'পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {language === 'en' ? 'Complete Your Purchase' : 'আপনার ক্রয় সম্পন্ন করুন'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Choose your preferred payment method' 
              : 'আপনার পছন্দের পেমেন্ট মেথড নির্বাচন করুন'}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Summary */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-foreground">{plan.displayName}</span>
            <span className="text-sm text-muted-foreground">
              {isYearly ? (language === 'en' ? 'Yearly' : 'বাৎসরিক') : (language === 'en' ? 'Monthly' : 'মাসিক')}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{formatPrice(price)}</span>
            <span className="text-sm text-muted-foreground">/{language === 'en' ? 'month' : 'মাস'}</span>
          </div>
          {isYearly && (
            <p className="text-xs text-green-600 mt-1">
              {language === 'en' ? `Total: ${formatPrice(totalPrice)}/year` : `মোট: ${formatPrice(totalPrice)}/বছর`}
            </p>
          )}
        </div>

        {/* Payment Gateway Selection */}
        <div className="space-y-3">
          {gateways.map((gateway) => (
            <button
              key={gateway.id}
              onClick={() => setSelectedGateway(gateway.id)}
              disabled={!gateway.available || isProcessing}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedGateway === gateway.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              } ${!gateway.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
                  <img 
                    src={gateway.logo} 
                    alt={gateway.name} 
                    className="max-h-8 max-w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{gateway.name}</span>
                    {selectedGateway === gateway.id && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{gateway.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={!selectedGateway || isProcessing}
          className="w-full mt-6 h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {language === 'en' ? 'Processing...' : 'প্রসেসিং...'}
            </>
          ) : (
            <>
              {language === 'en' ? `Pay ${formatPrice(isYearly ? totalPrice : price)}` : `${formatPrice(isYearly ? totalPrice : price)} পে করুন`}
            </>
          )}
        </Button>

        {/* Security Note */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          🔒 {language === 'en' ? 'Your payment is 256-bit SSL encrypted and secure' : 'আপনার পেমেন্ট ২৫৬-বিট SSL এনক্রিপ্টেড এবং নিরাপদ'}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
