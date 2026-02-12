import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

      setFullName(data?.full_name || user.user_metadata?.full_name || null);
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  return { avatarUrl, fullName, isLoading };
};

export default useUserProfile;
