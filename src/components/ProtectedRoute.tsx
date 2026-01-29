import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChatStore, type UserPlan } from "@/stores/chatStore";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setUser, setUserPlan, user: storeUser } = useChatStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      // Fetch profile from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      // Fetch subscription from database to get actual plan
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan_id, status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Determine the user's actual plan from subscription
      const actualPlan: UserPlan = subscription?.plan_id as UserPlan || 'free';

      // Plan token limits
      const planTokenLimits: Record<UserPlan, number> = {
        free: 5000,
        basic: 800000,
        pro: 1500000,
        premium: 3000000,
      };

      // Update store with real user data including actual plan from database
      setUser({
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: profile?.avatar_url || undefined,
        plan: actualPlan,
        tokensUsed: storeUser.tokensUsed,
        tokensLimit: planTokenLimits[actualPlan],
      });
    };

    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [user, isAuthenticated, setUser, setUserPlan, storeUser.tokensUsed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
