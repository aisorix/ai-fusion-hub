import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployeeRole = () => {
  const { user } = useAuth();
  const [isEmployee, setIsEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsEmployee(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking role:', error);
          setIsEmployee(false);
          setIsAdmin(false);
        } else {
          const roles = data?.map(r => r.role) || [];
          setIsEmployee(roles.includes('employee') || roles.includes('admin'));
          setIsAdmin(roles.includes('admin'));
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return { isEmployee, isAdmin, loading };
};
