// Cross-device chat sync hook
// Full bidirectional sync with Supabase Realtime

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore, type Chat } from '@/stores/chatStore';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const SYNC_DEBOUNCE_MS = 2000;

// Track which changes originated from this device to avoid echo
let localChangeIds = new Set<string>();

const cleanMessagesForDB = (messages: Chat['messages']) =>
  messages.map(msg => ({
    ...msg,
    attachments: msg.attachments?.map(att => ({
      ...att,
      url: att.type === 'image' ? '' : att.url,
      parsedContent: undefined,
    })) || null,
  }));

export const useChatSync = (userId: string | null) => {
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);
  const initialLoadDone = useRef(false);

  // ── Save a single chat to DB ──
  const saveChatToDB = useCallback(async (chat: Chat) => {
    if (!userId) return;
    try {
      localChangeIds.add(chat.id);
      await supabase.from('user_chats').upsert({
        id: chat.id,
        user_id: userId,
        title: chat.title,
        messages: cleanMessagesForDB(chat.messages) as any,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
      // Clear after a delay so realtime echo is suppressed
      setTimeout(() => localChangeIds.delete(chat.id), 3000);
    } catch (err) {
      console.error('Failed to save chat to DB:', err);
    }
  }, [userId]);

  // ── Delete a chat from DB ──
  const deleteChatFromDB = useCallback(async (chatId: string) => {
    if (!userId) return;
    try {
      localChangeIds.add(chatId);
      await supabase.from('user_chats').delete().eq('id', chatId).eq('user_id', userId);
      setTimeout(() => localChangeIds.delete(chatId), 3000);
    } catch (err) {
      console.error('Failed to delete chat from DB:', err);
    }
  }, [userId]);

  // ── Save token usage ──
  const saveTokensToDB = useCallback(async (tokensUsed: number) => {
    if (!userId) return;
    try {
      await supabase
        .from('subscriptions')
        .update({ tokens_used: tokensUsed })
        .eq('user_id', userId)
        .eq('status', 'active');
    } catch (err) {
      console.error('Failed to save tokens to DB:', err);
    }
  }, [userId]);

  // ── Load all chats from DB on login ──
  const loadChatsFromDB = useCallback(async () => {
    if (!userId || isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const { data: dbChats, error } = await supabase
        .from('user_chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to load chats from DB:', error);
        return;
      }

      if (dbChats && dbChats.length > 0) {
        const chats: Chat[] = dbChats.map((c: any) => ({
          id: c.id,
          title: c.title,
          messages: (c.messages as any[]) || [],
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));

        const store = useChatStore.getState();
        // Merge: DB chats take priority, but keep local-only chats
        const dbChatIds = new Set(chats.map(c => c.id));
        const localOnlyChats = store.chats.filter(c => !dbChatIds.has(c.id));
        const mergedChats = [...chats, ...localOnlyChats].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        useChatStore.setState({ chats: mergedChats });
      }

      // Load token usage
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('tokens_used, plan_id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sub && typeof sub.tokens_used === 'number') {
        const store = useChatStore.getState();
        useChatStore.setState({
          user: { ...store.user, tokensUsed: sub.tokens_used }
        });
      }
    } catch (err) {
      console.error('Chat sync load error:', err);
    } finally {
      isLoadingRef.current = false;
      initialLoadDone.current = true;
    }
  }, [userId]);

  // ── Main effect: load, subscribe to store changes, subscribe to Realtime ──
  useEffect(() => {
    if (!userId) return;

    // Initial load
    loadChatsFromDB();

    // ─── Store subscription: detect local changes and push to DB ───
    const unsubscribeStore = useChatStore.subscribe((state, prevState) => {
      if (!initialLoadDone.current) return;

      // Detect new chat created (exists in state but not in prev)
      const newChats = state.chats.filter(
        c => !prevState.chats.find(pc => pc.id === c.id)
      );
      for (const chat of newChats) {
        saveChatToDB(chat);
      }

      // Detect deleted chats
      const deletedChats = prevState.chats.filter(
        pc => !state.chats.find(c => c.id === pc.id)
      );
      for (const chat of deletedChats) {
        deleteChatFromDB(chat.id);
      }

      // Detect active chat content change (debounced)
      const activeChat = state.chats.find(c => c.id === state.activeChatId);
      const prevActiveChat = prevState.chats.find(c => c.id === prevState.activeChatId);
      if (
        activeChat &&
        prevActiveChat &&
        activeChat.id === prevActiveChat.id &&
        (activeChat.messages.length !== prevActiveChat.messages.length ||
         activeChat.title !== prevActiveChat.title ||
         activeChat.updatedAt !== prevActiveChat.updatedAt)
      ) {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
          saveChatToDB(activeChat);
        }, SYNC_DEBOUNCE_MS);
      }

      // Sync token usage
      if (state.user.tokensUsed !== prevState.user.tokensUsed) {
        saveTokensToDB(state.user.tokensUsed);
      }
    });

    // ─── Realtime: listen for changes from OTHER devices ───
    const channel = supabase
      .channel(`user-chats-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_chats',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const record = (payload.new as any) || {};
          const oldRecord = (payload.old as any) || {};
          const chatId = record.id || oldRecord.id;

          // Skip if this change originated from this device
          if (localChangeIds.has(chatId)) return;

          const store = useChatStore.getState();

          if (payload.eventType === 'INSERT') {
            // Another device created a chat
            const exists = store.chats.find(c => c.id === record.id);
            if (!exists) {
              const newChat: Chat = {
                id: record.id,
                title: record.title,
                messages: record.messages || [],
                createdAt: record.created_at,
                updatedAt: record.updated_at,
              };
              useChatStore.setState({
                chats: [newChat, ...store.chats],
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Another device updated a chat
            const updatedChat: Chat = {
              id: record.id,
              title: record.title,
              messages: record.messages || [],
              createdAt: record.created_at,
              updatedAt: record.updated_at,
            };
            useChatStore.setState({
              chats: store.chats.map(c =>
                c.id === record.id ? updatedChat : c
              ),
            });
          } else if (payload.eventType === 'DELETE') {
            // Another device deleted a chat
            useChatStore.setState({
              chats: store.chats.filter(c => c.id !== oldRecord.id),
              activeChatId:
                store.activeChatId === oldRecord.id
                  ? store.chats.find(c => c.id !== oldRecord.id)?.id || null
                  : store.activeChatId,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const record = payload.new as any;
          if (record && typeof record.tokens_used === 'number') {
            const store = useChatStore.getState();
            if (store.user.tokensUsed !== record.tokens_used) {
              useChatStore.setState({
                user: { ...store.user, tokensUsed: record.tokens_used },
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      unsubscribeStore();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [userId, loadChatsFromDB, saveChatToDB, deleteChatFromDB, saveTokensToDB]);
};
