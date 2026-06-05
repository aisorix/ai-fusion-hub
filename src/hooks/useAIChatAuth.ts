// Auth hook for AI Chat integration
// Wraps the existing AuthContext for use in chat components

import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useChatStore } from '@/stores/chatStore';
import { useEffect } from 'react';

export const useAuth = () => {
  const authContext = useAuthContext();
  const { setUser, user: storeUser } = useChatStore();
  
  // Sync auth user with chat store user
  useEffect(() => {
    if (authContext.user) {
      // Update store user with auth info
      setUser({
        ...storeUser,
        id: authContext.user.id,
        email: authContext.user.email || storeUser.email,
        name: authContext.user.user_metadata?.full_name || storeUser.name,
        avatar: authContext.user.user_metadata?.avatar_url || storeUser.avatar,
      });
    }
  }, [authContext.user]);
  
  return {
    user: authContext.user,
    loading: authContext.loading,
    signIn: authContext.signIn,
    signUp: authContext.signUp,
    signOut: authContext.signOut,
    signInWithGoogle: authContext.signInWithGoogle,
    isAuthenticated: !!authContext.user,
  };
};

export default useAuth;
