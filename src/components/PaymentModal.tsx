import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, Tag, X, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import sslcommerzLogo from '@/assets/sslcommerz.png';

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

interface AppliedCoupon {
  code: string;
  discount: number;
  final_amount: number;
  percent_off?: number | null;
  amount_off?: number | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  isYearly,
  language,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCouponCode('');
      setAppliedCoupon(null);
      setAgreed(false);
    }
  }, [isOpen]);

  if (!plan) return null;

  const baseMonthly = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.price;
  const baseTotal = isYearly ? plan.yearlyPrice : plan.price;
  const billingCycle = isYearly ? 'yearly' : 'monthly';

  const totalAfterDiscount = appliedCoupon ? appliedCoupon.final_amount : baseTotal;

  const formatPrice = (value: number) => {
    if (language === 'bn') return `৳${value.toLocaleString('bn-BD')}`;
    return `৳${value.toLocaleString()}`;
  };

  async function applyCoupon() {
    const code = couponCode.trim();
    if (!code) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { code, amount: baseTotal },
      });
      if (error) throw new Error(error.message);
      if (!data?.valid) {
        toast.error(data?.error || (language === 'en' ? 'Invalid coupon' : 'অবৈধ কুপন'));
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon({
        code: data.code,
        discount: Number(data.discount) || 0,
        final_amount: Number(data.final_amount) || baseTotal,
        percent_off: data.percent_off,
        amount_off: data.amount_off,
      });
      toast.success(language === 'en' ? 'Coupon applied' : 'কুপন প্রয়োগ করা হয়েছে');
    } catch (e: any) {
      toast.error(e.message || (language === 'en' ? 'Could not validate coupon' : 'কুপন যাচাই করা যায়নি'));
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
  }

  const handlePayment = async () => {
    if (!agreed) {
      toast.error(
        language === 'en'
          ? 'Please accept the Terms, Refund and Privacy policies to continue'
          : 'চালিয়ে যেতে শর্তাবলী, রিফান্ড ও প্রাইভেসি নীতি গ্রহণ করুন',
      );
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
        amount: totalAfterDiscount,
        currency: '৳',
        customerName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email || '',
        billingCycle,
        origin: window.location.origin,
        couponCode: appliedCoupon?.code ?? null,
      };

      const response = await supabase.functions.invoke('sslcommerz-payment', {
        body: paymentData,
      });

      if (response.data?.gatewayPageURL) {
        window.location.href = response.data.gatewayPageURL;
        return;
      }

      throw new Error(response?.data?.error || response?.error?.message || 'Payment initialization failed');
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(
        error.message ||
          (language === 'en' ? 'Payment failed. Please try again.' : 'পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto z-[200]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {language === 'en' ? 'Complete Your Purchase' : 'আপনার ক্রয় সম্পন্ন করুন'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en'
              ? 'Secure checkout powered by SSLCommerz — cards, mobile banking, and net banking.'
              : 'SSLCommerz দ্বারা চালিত নিরাপদ চেকআউট — কার্ড, মোবাইল ব্যাংকিং এবং নেট ব্যাংকিং।'}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Summary */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-foreground">{plan.displayName}</span>
            <span className="text-sm text-muted-foreground">
              {isYearly ? (language === 'en' ? 'Yearly' : 'বাৎসরিক') : (language === 'en' ? 'Monthly' : 'মাসিক')}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{formatPrice(baseMonthly)}</span>
            <span className="text-sm text-muted-foreground">/{language === 'en' ? 'month' : 'মাস'}</span>
          </div>
          {isYearly && (
            <p className="text-xs text-green-600 mt-1">
              {language === 'en' ? `Total: ${formatPrice(baseTotal)}/year` : `মোট: ${formatPrice(baseTotal)}/বছর`}
            </p>
          )}

          {appliedCoupon && (
            <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5">
              <div className="flex items-center justify-between text-sm text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {appliedCoupon.code}
                  {appliedCoupon.percent_off ? ` (-${appliedCoupon.percent_off}%)` : ''}
                </span>
                <span>− {formatPrice(appliedCoupon.discount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>{language === 'en' ? 'Total due' : 'মোট প্রদেয়'}</span>
                <span>{formatPrice(totalAfterDiscount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* SSLCommerz card */}
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 flex items-center gap-4">
          <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
            <img src={sslcommerzLogo} alt="SSLCommerz" className="max-h-8 max-w-full object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">SSLCommerz</span>
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'en'
                ? 'Visa, Mastercard, AMEX, bKash, Nagad, Rocket, Net Banking'
                : 'Visa, Mastercard, AMEX, bKash, Nagad, Rocket, নেট ব্যাংকিং'}
            </p>
          </div>
        </div>

        {/* Coupon section */}
        <div className="mt-4">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {language === 'en' ? 'Have a coupon? (optional)' : 'কুপন আছে? (ঐচ্ছিক)'}
          </label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-emerald-700 font-medium">
                <Tag className="w-3.5 h-3.5" />
                {appliedCoupon.code}
              </span>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-muted-foreground hover:text-foreground"
                aria-label={language === 'en' ? 'Remove coupon' : 'কুপন সরান'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder={language === 'en' ? 'Enter code' : 'কোড লিখুন'}
                disabled={couponLoading || isProcessing}
                className="h-10"
                maxLength={64}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCoupon();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={applyCoupon}
                disabled={couponLoading || !couponCode.trim() || isProcessing}
                className="h-10 shrink-0"
              >
                {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'en' ? 'Apply' : 'প্রয়োগ')}
              </Button>
            </div>
          )}
        </div>

        {/* Consent */}
        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 p-3">
          <Checkbox
            id="consent"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            disabled={isProcessing}
            className="mt-0.5"
          />
          <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            {language === 'en' ? (
              <>
                I have read and agree to the{' '}
                <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Terms & Conditions</Link>,{' '}
                <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Refund Policy</Link>, and{' '}
                <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                I understand my subscription will auto-renew at the end of each billing cycle unless cancelled.
              </>
            ) : (
              <>
                আমি{' '}
                <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">শর্তাবলী</Link>,{' '}
                <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">রিফান্ড নীতি</Link> এবং{' '}
                <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">প্রাইভেসি নীতি</Link> পড়েছি ও সম্মত হয়েছি।
                আমি বুঝতে পেরেছি বাতিল না করা পর্যন্ত আমার সাবস্ক্রিপশন প্রতিটি বিলিং চক্র শেষে স্বয়ংক্রিয়ভাবে নবায়ন হবে।
              </>
            )}
          </label>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !agreed}
          className="w-full mt-5 h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {language === 'en' ? 'Processing...' : 'প্রসেসিং...'}
            </>
          ) : (
            <>{language === 'en' ? `Pay ${formatPrice(totalAfterDiscount)}` : `${formatPrice(totalAfterDiscount)} পে করুন`}</>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          {language === 'en'
            ? '256-bit SSL encrypted • PCI-DSS compliant via SSLCommerz'
            : '২৫৬-বিট SSL এনক্রিপ্টেড • SSLCommerz-এর মাধ্যমে PCI-DSS সম্মত'}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
