import React from 'react';
import { Download, CheckCircle, XCircle, Clock, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Mock payment history data
const paymentHistory = [
  {
    id: '1',
    date: '2025-01-15',
    amount: '৳999',
    plan: 'Pro',
    status: 'completed',
    method: 'bKash',
  },
  {
    id: '2',
    date: '2024-12-15',
    amount: '৳999',
    plan: 'Pro',
    status: 'completed',
    method: 'bKash',
  },
  {
    id: '3',
    date: '2024-11-15',
    amount: '৳499',
    plan: 'Basic',
    status: 'completed',
    method: 'Stripe',
  },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

export const PaymentHistoryTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="text-2xl font-bold mt-1">৳2,497</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold mt-1">৳999</p>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {paymentHistory.map((payment) => {
              const status = statusConfig[payment.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', status.bg)}>
                      <StatusIcon className={cn('h-5 w-5', status.color)} />
                    </div>
                    <div>
                      <p className="font-medium">{payment.plan} Plan</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      {payment.method}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {paymentHistory.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
