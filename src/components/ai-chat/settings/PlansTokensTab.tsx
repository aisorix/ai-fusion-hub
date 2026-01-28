import React from 'react';
import { Zap, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const planDetails = {
  free: { name: 'Free', color: 'text-muted-foreground', icon: Zap },
  basic: { name: 'Basic', color: 'text-blue-500', icon: TrendingUp },
  pro: { name: 'Pro', color: 'text-purple-500', icon: Sparkles },
  premium: { name: 'Premium', color: 'text-amber-500', icon: Crown },
};

export const PlansTokensTab: React.FC = () => {
  const { user } = useChatStore();

  const plan = planDetails[user.plan];
  const Icon = plan.icon;
  const usagePercent = (user.tokensUsed / user.tokensLimit) * 100;

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-muted/50 to-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10', plan.color)}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{plan.name} Plan</h3>
              <p className="text-sm text-muted-foreground">Your current subscription</p>
            </div>
          </div>
          {user.plan !== 'premium' && (
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* Token Usage */}
      <div className="p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold mb-4">Token Usage</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used this month</span>
            <span className="font-medium">
              {formatTokens(user.tokensUsed)} / {formatTokens(user.tokensLimit)}
            </span>
          </div>
          
          <Progress 
            value={usagePercent} 
            className={cn(
              'h-3',
              usagePercent > 90 ? 'bg-destructive/20' : 
              usagePercent > 70 ? 'bg-amber-500/20' : 
              'bg-primary/20'
            )}
          />
          
          <p className="text-xs text-muted-foreground">
            {usagePercent < 50 
              ? 'You have plenty of tokens remaining this month.'
              : usagePercent < 80
              ? 'You have used more than half of your monthly tokens.'
              : 'You are running low on tokens. Consider upgrading your plan.'}
          </p>
        </div>
      </div>

      {/* Plan Features */}
      <div className="p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
        
        <div className="grid gap-3">
          <FeatureRow 
            label="Monthly Tokens" 
            value={formatTokens(user.tokensLimit)} 
          />
          <FeatureRow 
            label="Available Models" 
            value={user.plan === 'free' ? '3' : user.plan === 'basic' ? '7' : user.plan === 'pro' ? '14' : '23+'} 
          />
          <FeatureRow 
            label="File Upload Limit" 
            value={user.plan === 'free' ? '1 MB' : user.plan === 'basic' ? '5 MB' : user.plan === 'pro' ? '10 MB' : '15 MB'} 
          />
          <FeatureRow 
            label="Voice Mode" 
            value={user.plan === 'free' ? 'Basic' : 'Full'} 
          />
          <FeatureRow 
            label="Health Mode" 
            value={user.plan === 'free' ? 'Limited' : 'Full Access'} 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
