import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_type: 'user' | 'employee' | 'system';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  status: 'active' | 'waiting' | 'resolved' | 'archived';
  assigned_employee_id: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

const GUEST_STORAGE_KEY = 'sorix_guest_chat';

const buildLocalMsg = (
  content: string,
  sender_type: 'user' | 'employee',
  conversation_id = 'guest'
): ChatMessage => ({
  id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  conversation_id,
  sender_id: null,
  sender_type,
  content,
  is_read: true,
  created_at: new Date().toISOString(),
});

export const useChat = () => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const aiInFlight = useRef(false);

  // ---------- AUTHENTICATED LOAD ----------
  const loadConversation = useCallback(async () => {
    if (!user) {
      // Guest: load from localStorage
      try {
        const raw = localStorage.getItem(GUEST_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as ChatMessage[];
          if (Array.isArray(parsed)) setMessages(parsed);
        }
      } catch {/* ignore */}
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'waiting'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading conversation:', error);
      }

      if (data) setConversation(data as ChatConversation);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMessages = useCallback(async () => {
    if (!conversation) return;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }
      setMessages((data || []) as ChatMessage[]);
    } catch (err) {
      console.error('Error:', err);
    }
  }, [conversation]);

  const createConversation = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, status: 'active' })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }
      setConversation(data as ChatConversation);
      return data as ChatConversation;
    } catch (err) {
      console.error('Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ---------- AI REPLY ----------
  const fetchAIReply = useCallback(
    async (history: ChatMessage[]) => {
      if (aiInFlight.current) return;
      aiInFlight.current = true;
      try {
        const payload = history.map((m) => ({
          role: m.sender_type === 'employee' ? 'assistant' : 'user',
          content: m.content,
        }));

        const { data, error } = await supabase.functions.invoke('support-chat', {
          body: { messages: payload },
        });

        const reply: string =
          (data as any)?.reply ||
          "Thanks for your message! Could you share a bit more so I can help?\n\n— Sorix Support Team";

        if (error) console.warn('support-chat invoke warning:', error);

        if (user && conversation) {
          // Persist AI reply as 'employee' sender so existing UI works
          const { data: inserted } = await supabase
            .from('chat_messages')
            .insert({
              conversation_id: conversation.id,
              sender_id: null,
              sender_type: 'employee',
              content: reply,
              is_read: true,
            })
            .select()
            .single();

          if (inserted) {
            setMessages((prev) =>
              prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted as ChatMessage]
            );
          } else {
            setMessages((prev) => [...prev, buildLocalMsg(reply, 'employee', conversation.id)]);
          }
        } else {
          // Guest: append locally + persist to localStorage
          setMessages((prev) => {
            const next = [...prev, buildLocalMsg(reply, 'employee')];
            try { localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next)); } catch {/* ignore */}
            return next;
          });
        }
      } catch (err) {
        console.error('AI reply error:', err);
        const fallback = buildLocalMsg(
          "Sorry, I had trouble responding. Please try again, or email **support@aisorix.com**.\n\n— Sorix Support Team",
          'employee',
          conversation?.id || 'guest'
        );
        setMessages((prev) => [...prev, fallback]);
      } finally {
        aiInFlight.current = false;
      }
    },
    [user, conversation]
  );

  // ---------- SEND MESSAGE ----------
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      setSending(true);
      try {
        // ===== GUEST FLOW =====
        if (!user) {
          const userMsg = buildLocalMsg(trimmed, 'user');
          let nextHistory: ChatMessage[] = [];
          setMessages((prev) => {
            nextHistory = [...prev, userMsg];
            try { localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(nextHistory)); } catch {/* ignore */}
            return nextHistory;
          });
          // Wait microtask so state has settled, then call AI with full history
          await new Promise((r) => setTimeout(r, 0));
          await fetchAIReply(nextHistory);
          return;
        }

        // ===== AUTHENTICATED FLOW =====
        let currentConversation = conversation;
        if (!currentConversation) {
          currentConversation = await createConversation();
          if (!currentConversation) return;
        }

        const { data: inserted, error } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: currentConversation.id,
            sender_id: user.id,
            sender_type: 'user',
            content: trimmed,
          })
          .select()
          .single();

        if (error) {
          console.error('Error sending message:', error);
          return;
        }

        const insertedMsg = inserted as ChatMessage;
        let nextHistory: ChatMessage[] = [];
        setMessages((prev) => {
          if (prev.some((m) => m.id === insertedMsg.id)) {
            nextHistory = prev;
            return prev;
          }
          nextHistory = [...prev, insertedMsg];
          return nextHistory;
        });

        // Trigger AI reply (non-blocking for UI but awaited so spinner works)
        await fetchAIReply(nextHistory);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setSending(false);
      }
    },
    [conversation, user, createConversation, fetchAIReply]
  );

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!conversation) return;
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('conversation_id', conversation.id)
      .eq('sender_type', 'employee')
      .eq('is_read', false);
  }, [conversation]);

  // Realtime updates (admin handoff still works)
  useEffect(() => {
    if (!conversation) return;
    const channel = supabase
      .channel(`chat-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage]
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_conversations',
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => setConversation(payload.new as ChatConversation)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversation]);

  useEffect(() => { loadConversation(); }, [loadConversation]);

  useEffect(() => {
    if (conversation) loadMessages();
  }, [conversation, loadMessages]);

  return {
    conversation,
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    createConversation,
  };
};
