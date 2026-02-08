import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Calendar, CreditCard, CheckCircle, XCircle, Clock, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan_id: string;
  billing_cycle: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  premium: 'Premium',
};

const PaymentHistoryTab = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
      } else {
        setPayments(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        styles[status] || 'bg-muted text-muted-foreground border-border'
      )}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Payment History</h3>
          <p className="text-sm text-muted-foreground mt-1">
            View all your past transactions
          </p>
        </div>
        <button
          onClick={fetchPaymentHistory}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'hover:bg-accent text-muted-foreground hover:text-foreground'
          )}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Payment List */}
      {payments.length === 0 ? (
        <div className={cn(
          'rounded-2xl p-8 text-center',
          'bg-muted/30 border border-border'
        )}>
          <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium text-foreground mb-2">No payment history</h4>
          <p className="text-sm text-muted-foreground">
            Your payment transactions will appear here once you make a purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'rounded-xl p-4',
                'bg-card border border-border',
                'hover:border-primary/30 transition-colors'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">
                      {PLAN_NAMES[payment.plan_id] || payment.plan_id} Plan
                    </span>
                    {getStatusBadge(payment.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(payment.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="capitalize">{payment.payment_method}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground/70">
                    Transaction ID: {payment.transaction_id}
                  </div>
                </div>

                {/* Right side - Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-foreground">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {payment.billing_cycle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      {payments.length > 0 && (
        <div className={cn(
          'rounded-xl p-4',
          'bg-muted/30 border border-border'
        )}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total transactions</span>
            <span className="font-medium text-foreground">{payments.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Total spent</span>
            <span className="font-medium text-foreground">
              BDT {payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentHistoryTab;
