// Cross-device chat sync hook
// Syncs chats and token usage between Zustand (local) and database

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore, type Chat } from '@/stores/chatStore';

const SYNC_DEBOUNCE_MS = 2000;

export const useChatSync = (userId: string | null) => {
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);
  const lastSyncRef = useRef<string>('');

  // Load chats from database on login
  const loadChatsFromDB = useCallback(async () => {
    if (!userId || isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const { data: dbChats, error } = await supabase
        .from('user_chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50);

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
        lastSyncRef.current = JSON.stringify(mergedChats.map(c => c.id));
      }

      // Load token usage from subscriptions
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
    }
  }, [userId]);

  // Save a chat to database
  const saveChatToDB = useCallback(async (chat: Chat) => {
    if (!userId) return;

    try {
      // Strip base64 images from messages for storage
      const cleanMessages = chat.messages.map(msg => ({
        ...msg,
        attachments: msg.attachments?.map(att => ({
          ...att,
          url: att.type === 'image' ? '' : att.url,
          parsedContent: undefined,
        })) || null,
      }));

      await supabase
        .from('user_chats')
        .upsert({
          id: chat.id,
          user_id: userId,
          title: chat.title,
          messages: cleanMessages as any,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
    } catch (err) {
      console.error('Failed to save chat to DB:', err);
    }
  }, [userId]);

  // Save token usage to subscriptions
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

  // Subscribe to store changes and sync
  useEffect(() => {
    if (!userId) return;

    // Initial load
    loadChatsFromDB();

    // Subscribe to changes with debounce
    const unsubscribe = useChatStore.subscribe((state, prevState) => {
      // Sync chats when they change
      const activeChat = state.chats.find(c => c.id === state.activeChatId);
      const prevActiveChat = prevState.chats.find(c => c.id === prevState.activeChatId);
      
      if (activeChat && activeChat !== prevActiveChat) {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
          saveChatToDB(activeChat);
        }, SYNC_DEBOUNCE_MS);
      }

      // Sync token usage when it changes
      if (state.user.tokensUsed !== prevState.user.tokensUsed) {
        saveTokensToDB(state.user.tokensUsed);
      }
    });

    return () => {
      unsubscribe();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [userId, loadChatsFromDB, saveChatToDB, saveTokensToDB]);
};
