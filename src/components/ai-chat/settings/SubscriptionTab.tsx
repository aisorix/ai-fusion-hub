import React from 'react';
import { CreditCard, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

export const SubscriptionTab: React.FC = () => {
  const { user } = useChatStore();

  const planPrices = {
    free: '৳0',
    basic: '৳499',
    pro: '৳999',
    premium: '৳1,999',
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Subscription</h3>
          <Badge variant={user.plan === 'free' ? 'secondary' : 'default'} className="capitalize">
            {user.plan}
          </Badge>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Monthly Price</p>
              <p className="text-lg font-bold">{planPrices[user.plan]}/month</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Billing Cycle</p>
              <p className="text-sm text-muted-foreground">
                {user.plan === 'free' ? 'No billing' : 'Monthly, renews on the 1st'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Auto-Renewal</p>
              <p className="text-sm text-muted-foreground">
                {user.plan === 'free' ? 'Not applicable' : 'Enabled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {user.plan !== 'premium' && (
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
            Upgrade Plan
          </Button>
        )}
        
        {user.plan !== 'free' && (
          <>
            <Button variant="outline" className="w-full">
              Change Billing Method
            </Button>
            <Button variant="outline" className="w-full text-amber-500 hover:text-amber-600">
              Pause Subscription
            </Button>
          </>
        )}
      </div>

      {/* Cancellation Notice */}
      {user.plan !== 'free' && (
        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Need to cancel?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
              <Button variant="link" className="px-0 text-destructive h-auto mt-2">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
