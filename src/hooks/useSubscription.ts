import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { UserPlan } from "@/stores/chatStore";

interface Subscription {
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_end: string;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  currentPlan: UserPlan;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_id, status, billing_cycle, current_period_end")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned (user has no subscription)
        console.error("Error fetching subscription:", error);
      }

      setSubscription(data || null);
    } catch (err) {
      console.error("Error fetching subscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Determine current plan from subscription
  const currentPlan: UserPlan = subscription?.plan_id as UserPlan || "free";

  return {
    subscription,
    currentPlan,
    isLoading,
    refetch: fetchSubscription,
  };
};
