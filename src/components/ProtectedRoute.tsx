import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChatStore } from "@/stores/chatStore";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setUser, user: storeUser } = useChatStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      // Fetch profile from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      // Update store with real user data
      setUser({
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: profile?.avatar_url || undefined,
        plan: storeUser.plan, // Keep existing plan from store
        tokensUsed: storeUser.tokensUsed, // Keep existing usage
        tokensLimit: storeUser.tokensLimit, // Keep existing limit
      });
    };

    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [user, isAuthenticated, setUser, storeUser.plan, storeUser.tokensUsed, storeUser.tokensLimit]);

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
