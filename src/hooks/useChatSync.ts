// Cross-device chat sync hook
// Bidirectional sync of single chats + multi-window state with Supabase Realtime

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore, type Chat, type ChatWindow } from '@/stores/chatStore';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const SYNC_DEBOUNCE_MS = 300;
const WINDOWS_DEBOUNCE_MS = 400;

// Track which changes originated from this device to avoid echo
const localChangeIds = new Set<string>();
let localWindowsTouchAt = 0;

// Keep image/file attachment URLs that are durable across devices (http/https/data).
// Drop blob: URLs (device-local) and oversized data: URLs to keep row size sane.
const MAX_DATA_URL_BYTES = 600 * 1024; // 600 KB per attachment hard cap

const sanitizeAttachmentForDB = (att: any) => {
  if (!att) return att;
  const url: string | undefined = att.url;
  let safeUrl = url;
  if (typeof url === 'string') {
    if (url.startsWith('blob:')) {
      safeUrl = '';
    } else if (url.startsWith('data:') && url.length > MAX_DATA_URL_BYTES) {
      safeUrl = '';
    }
  }
  return {
    ...att,
    url: safeUrl,
    // parsedContent can be huge — keep up to 200 KB so other devices still see context
    parsedContent:
      typeof att.parsedContent === 'string' && att.parsedContent.length > 200_000
        ? att.parsedContent.slice(0, 200_000)
        : att.parsedContent,
  };
};

const cleanMessagesForDB = (messages: Chat['messages']) =>
  messages.map((msg) => ({
    ...msg,
    attachments: msg.attachments?.map(sanitizeAttachmentForDB) || null,
  }));

const cleanWindowsForDB = (windows: ChatWindow[]) =>
  windows.map((w) => ({
    id: w.id,
    modelId: w.modelId,
    isStreaming: false,
    // Cap each window to last 40 messages to keep payload small
    messages: (w.messages || []).slice(-40).map((m: any) => ({
      ...m,
      attachments: m.attachments?.map(sanitizeAttachmentForDB) || null,
    })),
  }));

export const useChatSync = (userId: string | null) => {
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);
  const initialLoadDone = useRef(false);

  // ── Save a single chat to DB ──
  const saveChatToDB = useCallback(async (chat: Chat) => {
    if (!userId) return;
    try {
      localChangeIds.add(chat.id);
      await supabase.from('user_chats').upsert(
        {
          id: chat.id,
          user_id: userId,
          title: chat.title,
          messages: cleanMessagesForDB(chat.messages) as any,
          is_starred: !!chat.isStarred,
          project_id: chat.projectId ?? null,
          title_manually_set: !!chat.titleManuallySet,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: 'id' }
      );
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

  // ── Save multi-window state ──
  const saveWindowsToDB = useCallback(async (windows: ChatWindow[]) => {
    if (!userId) return;
    try {
      localWindowsTouchAt = Date.now();
      await supabase.from('user_chat_windows' as any).upsert(
        {
          user_id: userId,
          windows: cleanWindowsForDB(windows) as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } catch (err) {
      console.error('Failed to save chat windows to DB:', err);
    }
  }, [userId]);

  // ── Load everything from DB on login ──
  const loadChatsFromDB = useCallback(async () => {
    if (!userId || isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const [{ data: dbChats, error }, { data: dbWindows }, { data: sub }] = await Promise.all([
        supabase
          .from('user_chats')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(100),
        supabase
          .from('user_chat_windows' as any)
          .select('windows')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('subscriptions')
          .select('tokens_used, plan_id')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (error) console.error('Failed to load chats from DB:', error);

      const store = useChatStore.getState();

      if (dbChats && dbChats.length > 0) {
        const chats: Chat[] = dbChats.map((c: any) => ({
          id: c.id,
          title: c.title,
          messages: (c.messages as any[]) || [],
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          isStarred: !!c.is_starred,
          projectId: c.project_id ?? null,
          titleManuallySet: !!c.title_manually_set,
        }));
        const dbChatIds = new Set(chats.map((c) => c.id));
        const localOnlyChats = store.chats.filter((c) => !dbChatIds.has(c.id));
        const mergedChats = [...chats, ...localOnlyChats].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        useChatStore.setState({ chats: mergedChats });
      }

      // Hydrate multi-window state if remote exists and locally we are at defaults
      const remoteWindows = (dbWindows as any)?.windows as ChatWindow[] | undefined;
      if (Array.isArray(remoteWindows) && remoteWindows.length > 0) {
        const localIsDefault =
          store.chatWindows.length <= 2 &&
          store.chatWindows.every((w) => (w.messages || []).length === 0);
        // Always replace with remote — multi-window is intended to follow the user
        const normalized: ChatWindow[] = remoteWindows.map((w: any, i: number) => ({
          id: w.id || `${Date.now()}-${i}`,
          modelId: w.modelId || 'gpt-4o',
          messages: Array.isArray(w.messages) ? w.messages : [],
          isStreaming: false,
        }));
        useChatStore.setState({ chatWindows: normalized });
      }

      if (sub && typeof (sub as any).tokens_used === 'number') {
        useChatStore.setState({
          user: { ...useChatStore.getState().user, tokensUsed: (sub as any).tokens_used },
        });
      }
    } catch (err) {
      console.error('Chat sync load error:', err);
    } finally {
      isLoadingRef.current = false;
      initialLoadDone.current = true;
    }
  }, [userId]);

  // ── Main effect: load, subscribe to store, subscribe to Realtime ──
  useEffect(() => {
    if (!userId) return;

    loadChatsFromDB();

    const unsubscribeStore = useChatStore.subscribe((state, prevState) => {
      if (!initialLoadDone.current) return;

      // New chats → save
      const newChats = state.chats.filter(
        (c) => !prevState.chats.find((pc) => pc.id === c.id)
      );
      for (const chat of newChats) saveChatToDB(chat);

      // Deleted chats → delete
      const deletedChats = prevState.chats.filter(
        (pc) => !state.chats.find((c) => c.id === pc.id)
      );
      for (const chat of deletedChats) deleteChatFromDB(chat.id);

      // Active chat changed → debounced save for content, immediate for structural
      const activeChat = state.chats.find((c) => c.id === state.activeChatId);
      const prevActiveChat = prevState.chats.find((c) => c.id === prevState.activeChatId);
      if (
        activeChat &&
        prevActiveChat &&
        activeChat.id === prevActiveChat.id &&
        (activeChat.messages.length !== prevActiveChat.messages.length ||
          activeChat.title !== prevActiveChat.title ||
          activeChat.isStarred !== prevActiveChat.isStarred ||
          activeChat.projectId !== prevActiveChat.projectId ||
          activeChat.updatedAt !== prevActiveChat.updatedAt)
      ) {
        const structural =
          activeChat.title !== prevActiveChat.title ||
          activeChat.isStarred !== prevActiveChat.isStarred ||
          activeChat.projectId !== prevActiveChat.projectId;
        if (structural) {
          if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
          saveChatToDB(activeChat);
        } else {
          if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
          syncTimeoutRef.current = setTimeout(() => saveChatToDB(activeChat), SYNC_DEBOUNCE_MS);
        }
      }

      // Star/project changes for non-active chats → immediate save
      for (const c of state.chats) {
        const prev = prevState.chats.find((pc) => pc.id === c.id);
        if (!prev || c.id === state.activeChatId) continue;
        if (c.isStarred !== prev.isStarred || c.projectId !== prev.projectId || c.title !== prev.title) {
          saveChatToDB(c);
        }
      }

      // Tokens
      if (state.user.tokensUsed !== prevState.user.tokensUsed) {
        saveTokensToDB(state.user.tokensUsed);
      }

      // Multi-window changed → debounced save (ignore isStreaming-only changes)
      if (state.chatWindows !== prevState.chatWindows) {
        const stripStream = (w: ChatWindow[]) =>
          w.map(({ isStreaming, ...rest }) => rest);
        if (
          JSON.stringify(stripStream(state.chatWindows)) !==
          JSON.stringify(stripStream(prevState.chatWindows))
        ) {
          if (windowsTimeoutRef.current) clearTimeout(windowsTimeoutRef.current);
          windowsTimeoutRef.current = setTimeout(
            () => saveWindowsToDB(state.chatWindows),
            WINDOWS_DEBOUNCE_MS
          );
        }
      }
    });

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
          if (localChangeIds.has(chatId)) return;

          const store = useChatStore.getState();

          if (payload.eventType === 'INSERT') {
            if (!store.chats.find((c) => c.id === record.id)) {
              const newChat: Chat = {
                id: record.id,
                title: record.title,
                messages: record.messages || [],
                createdAt: record.created_at,
                updatedAt: record.updated_at,
                isStarred: !!record.is_starred,
                projectId: record.project_id ?? null,
                titleManuallySet: !!record.title_manually_set,
              };
              useChatStore.setState({ chats: [newChat, ...store.chats] });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedChat: Chat = {
              id: record.id,
              title: record.title,
              messages: record.messages || [],
              createdAt: record.created_at,
              updatedAt: record.updated_at,
              isStarred: !!record.is_starred,
              projectId: record.project_id ?? null,
              titleManuallySet: !!record.title_manually_set,
            };
            useChatStore.setState({
              chats: store.chats.map((c) => (c.id === record.id ? updatedChat : c)),
            });
          } else if (payload.eventType === 'DELETE') {
            useChatStore.setState({
              chats: store.chats.filter((c) => c.id !== oldRecord.id),
              activeChatId:
                store.activeChatId === oldRecord.id
                  ? store.chats.find((c) => c.id !== oldRecord.id)?.id || null
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_chat_windows',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          // Ignore our own writes (within 4s)
          if (Date.now() - localWindowsTouchAt < 4000) return;
          const record = payload.new as any;
          if (!record?.windows || !Array.isArray(record.windows)) return;
          const normalized: ChatWindow[] = record.windows.map((w: any, i: number) => ({
            id: w.id || `${Date.now()}-${i}`,
            modelId: w.modelId || 'gpt-4o',
            messages: Array.isArray(w.messages) ? w.messages : [],
            isStreaming: false,
          }));
          useChatStore.setState({ chatWindows: normalized });
        }
      )
      .subscribe();

    return () => {
      unsubscribeStore();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (windowsTimeoutRef.current) clearTimeout(windowsTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [userId, loadChatsFromDB, saveChatToDB, deleteChatFromDB, saveTokensToDB, saveWindowsToDB]);
};
