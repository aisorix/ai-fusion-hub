import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChatStore } from '@/stores/chatStore';

interface UserProfile {
  avatarUrl: string | null;
  fullName: string | null;
  isLoading: boolean;
}

export const useUserProfile = (): UserProfile => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      setFullName(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('user_id', user.id)
        .single();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      } else if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      } else {
        setAvatarUrl(null);
      }

      const name = data?.full_name || user.user_metadata?.full_name || null;
      setFullName(name);

      // Sync to Zustand store immediately
      const store = useChatStore.getState();
      store.setUser({
        ...store.user,
        name: name || store.user.name,
        avatar: data?.avatar_url || user.user_metadata?.avatar_url || store.user.avatar,
      });

      setIsLoading(false);
    };

    fetchProfile();

    // Realtime subscription for profile changes
    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated.avatar_url !== undefined) setAvatarUrl(updated.avatar_url || null);
          if (updated.full_name !== undefined) setFullName(updated.full_name || null);

          // Sync to Zustand store
          const store = useChatStore.getState();
          store.setUser({
            ...store.user,
            name: updated.full_name || store.user.name,
            avatar: updated.avatar_url || store.user.avatar,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { avatarUrl, fullName, isLoading };
};

export default useUserProfile;
