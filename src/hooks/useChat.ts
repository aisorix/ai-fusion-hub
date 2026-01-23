import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Load existing conversation for authenticated user
  const loadConversation = useCallback(async () => {
    if (!user) return;
    
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

      if (data) {
        setConversation(data as ChatConversation);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load messages for current conversation
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

  // Create new conversation
  const createConversation = useCallback(async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start a chat",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Error",
          description: "Failed to start chat. Please try again.",
          variant: "destructive"
        });
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
  }, [user, toast]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let currentConversation = conversation;
    
    if (!currentConversation) {
      currentConversation = await createConversation();
      if (!currentConversation) return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: currentConversation.id,
          sender_id: user?.id,
          sender_type: 'user',
          content: content.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Optimistically add message
      setMessages(prev => [...prev, data as ChatMessage]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSending(false);
    }
  }, [conversation, user, createConversation, toast]);

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

  // Subscribe to realtime updates
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
          filter: `conversation_id=eq.${conversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_conversations',
          filter: `id=eq.${conversation.id}`
        },
        (payload) => {
          setConversation(payload.new as ChatConversation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation]);

  // Load conversation on mount
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation, loadMessages]);

  return {
    conversation,
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    createConversation
  };
};
