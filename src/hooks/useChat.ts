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

const GUEST_TOKEN_KEY = 'sorix_guest_chat_token';
const GUEST_CONV_KEY = 'sorix_guest_chat_conv_id';

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

const generateGuestToken = () => {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};

export const useChat = () => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [guestToken, setGuestToken] = useState<string | null>(
    () => (typeof window !== 'undefined' ? localStorage.getItem(GUEST_TOKEN_KEY) : null)
  );
  const aiInFlight = useRef(false);

  const isGuest = !user;
  const guestReady = isGuest && !!conversation; // guest info already submitted

  // ---------- LOAD ----------
  const loadConversation = useCallback(async () => {
    if (!user) {
      // Guest: rehydrate from token if present
      const token = localStorage.getItem(GUEST_TOKEN_KEY);
      if (!token) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_guest_conversation', { _token: token });
        if (error) { console.error(error); return; }
        const row = Array.isArray(data) ? data[0] : data;
        if (row) setConversation(row as ChatConversation);
      } finally {
        setLoading(false);
      }
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

      if (error && error.code !== 'PGRST116') console.error(error);
      if (data) setConversation(data as ChatConversation);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMessages = useCallback(async () => {
    if (!conversation) return;
    try {
      if (isGuest && guestToken) {
        const { data, error } = await supabase.rpc('get_guest_messages', { _token: guestToken });
        if (error) { console.error(error); return; }
        setMessages((data || []) as ChatMessage[]);
        return;
      }
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });
      if (error) { console.error(error); return; }
      setMessages((data || []) as ChatMessage[]);
    } catch (err) { console.error(err); }
  }, [conversation, isGuest, guestToken]);

  const createConversation = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, status: 'active' })
        .select()
        .single();
      if (error) { console.error(error); return null; }
      setConversation(data as ChatConversation);
      return data as ChatConversation;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ---------- GUEST: start conversation with name + email ----------
  const startGuestConversation = useCallback(
    async (name: string, email: string): Promise<ChatConversation | null> => {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      if (!trimmedName || !trimmedEmail) return null;
      setLoading(true);
      try {
        const token = generateGuestToken();
        const { data, error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: null,
            guest_name: trimmedName,
            guest_email: trimmedEmail,
            guest_token: token,
            status: 'waiting',
          } as any)
          .select()
          .single();
        if (error) { console.error('Guest conversation error:', error); return null; }
        localStorage.setItem(GUEST_TOKEN_KEY, token);
        localStorage.setItem(GUEST_CONV_KEY, (data as any).id);
        setGuestToken(token);
        setConversation(data as ChatConversation);
        return data as ChatConversation;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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

        if (isGuest && guestToken) {
          const { data: inserted, error: insErr } = await supabase.rpc('send_guest_message', {
            _token: guestToken,
            _content: reply,
            _sender_type: 'employee',
          });
          if (insErr) console.error(insErr);
          const msg = Array.isArray(inserted) ? inserted[0] : inserted;
          if (msg) {
            setMessages((prev) =>
              prev.some((m) => m.id === (msg as any).id) ? prev : [...prev, msg as ChatMessage]
            );
          } else {
            setMessages((prev) => [...prev, buildLocalMsg(reply, 'employee', conversation?.id || 'guest')]);
          }
        } else if (user && conversation) {
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
    [user, conversation, isGuest, guestToken]
  );

  // ---------- SEND MESSAGE ----------
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      setSending(true);
      try {
        // ===== GUEST FLOW =====
        if (isGuest) {
          if (!conversation || !guestToken) {
            console.warn('Guest tried to send before submitting name/email');
            return;
          }
          const { data: inserted, error } = await supabase.rpc('send_guest_message', {
            _token: guestToken,
            _content: trimmed,
            _sender_type: 'user',
          });
          if (error) { console.error('Guest send error:', error); return; }
          const msg = Array.isArray(inserted) ? inserted[0] : inserted;
          let nextHistory: ChatMessage[] = [];
          setMessages((prev) => {
            if (msg && prev.some((m) => m.id === (msg as any).id)) {
              nextHistory = prev;
              return prev;
            }
            nextHistory = msg
              ? [...prev, msg as ChatMessage]
              : [...prev, buildLocalMsg(trimmed, 'user', conversation.id)];
            return nextHistory;
          });
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
            sender_id: user!.id,
            sender_type: 'user',
            content: trimmed,
          })
          .select()
          .single();

        if (error) { console.error(error); return; }

        const insertedMsg = inserted as ChatMessage;
        let nextHistory: ChatMessage[] = [];
        setMessages((prev) => {
          if (prev.some((m) => m.id === insertedMsg.id)) { nextHistory = prev; return prev; }
          nextHistory = [...prev, insertedMsg];
          return nextHistory;
        });
        await fetchAIReply(nextHistory);
      } finally {
        setSending(false);
      }
    },
    [conversation, user, isGuest, guestToken, createConversation, fetchAIReply]
  );

  const markAsRead = useCallback(async () => {
    if (!conversation || isGuest) return;
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('conversation_id', conversation.id)
      .eq('sender_type', 'employee')
      .eq('is_read', false);
  }, [conversation, isGuest]);

  // Realtime updates (works for both authed and guest since channel is by conversation id)
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
    // guest extras
    isGuest,
    guestReady,
    startGuestConversation,
  };
};
