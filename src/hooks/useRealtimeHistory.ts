// Generic Supabase Realtime subscription for per-user history tables.
// Fires `onChange` whenever an INSERT / UPDATE / DELETE occurs for the current
// user, so consumers can refetch their list instantly across all devices.

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Options {
  table: string;
  userId: string | null | undefined;
  /** Optional extra equality filters, e.g. `{ tool: 'flowbuilder' }`. */
  filter?: Record<string, string>;
  onChange: (event: 'INSERT' | 'UPDATE' | 'DELETE', record: any) => void;
  /** When true the hook stays inert. */
  disabled?: boolean;
}

export function useRealtimeHistory({ table, userId, filter, onChange, disabled }: Options) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!userId || disabled) return;

    const channelName = `rt-${table}-${userId}-${Object.values(filter || {}).join('-')}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          const record = payload.new || payload.old || {};
          // Apply extra filters client-side
          if (filter) {
            for (const [k, v] of Object.entries(filter)) {
              if (String(record[k]) !== v) return;
            }
          }
          onChangeRef.current?.(payload.eventType, record);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, userId, disabled, JSON.stringify(filter || {})]);
}
