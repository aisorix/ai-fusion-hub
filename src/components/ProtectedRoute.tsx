import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChatStore, type UserPlan } from "@/stores/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { useChatSync } from "@/hooks/useChatSync";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setUser, setUserPlan, user: storeUser } = useChatStore();

  // Cross-device sync
  useChatSync(user?.id || null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan_id, status, tokens_used")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const actualPlan: UserPlan = subscription?.plan_id as UserPlan || 'free';
      const dbTokensUsed = typeof (subscription as any)?.tokens_used === 'number' ? (subscription as any).tokens_used : storeUser.tokensUsed;

      const planTokenLimits: Record<UserPlan, number> = {
        free: 5000,
        basic: 800000,
        pro: 1500000,
        premium: 3000000,
      };

      setUser({
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: profile?.avatar_url || undefined,
        plan: actualPlan,
        tokensUsed: dbTokensUsed,
        tokensLimit: planTokenLimits[actualPlan],
      });
    };

    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [user, isAuthenticated, setUser, setUserPlan]);

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