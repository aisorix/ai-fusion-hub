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

export interface ConversationWithProfile extends ChatConversation {
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  unread_count?: number;
  last_message?: string;
}

export const useAdminChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationWithProfile[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  // Check if user is employee/admin
  const checkEmployeeRole = useCallback(async () => {
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['employee', 'admin']);

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }

    const hasRole = data && data.length > 0;
    setIsEmployee(hasRole);
    return hasRole;
  }, [user]);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .in('status', ['active', 'waiting', 'resolved'])
        .order('last_message_at', { ascending: false });

      if (convError) {
        console.error('Error loading conversations:', convError);
        return;
      }

      // Get user profiles and message counts for each conversation
      const enrichedConversations = await Promise.all(
        (convData || []).map(async (conv) => {
          let userProfile = null;
          
          if (conv.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('user_id', conv.user_id)
              .single();
            userProfile = profile;
          }

          // Get unread count
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('sender_type', 'user')
            .eq('is_read', false);

          // Get last message
          const { data: lastMsg } = await supabase
            .from('chat_messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            user_profile: userProfile,
            unread_count: count || 0,
            last_message: lastMsg?.content || ''
          } as ConversationWithProfile;
        })
      );

      setConversations(enrichedConversations);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for selected conversation
  const loadMessages = useCallback(async () => {
    if (!selectedConversation) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages((data || []) as ChatMessage[]);

      // Mark user messages as read
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', selectedConversation.id)
        .eq('sender_type', 'user')
        .eq('is_read', false);

      // Update local unread count
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversation.id
            ? { ...c, unread_count: 0 }
            : c
        )
      );
    } catch (err) {
      console.error('Error:', err);
    }
  }, [selectedConversation]);

  // Send message as employee
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          sender_type: 'employee',
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

      // Update conversation status to active if it was waiting
      if (selectedConversation.status === 'waiting') {
        await supabase
          .from('chat_conversations')
          .update({ 
            status: 'active',
            assigned_employee_id: user.id 
          })
          .eq('id', selectedConversation.id);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSending(false);
    }
  }, [selectedConversation, user, toast]);

  // Update conversation status
  const updateConversationStatus = useCallback(async (
    conversationId: string, 
    status: 'active' | 'waiting' | 'resolved' | 'archived'
  ) => {
    const { error } = await supabase
      .from('chat_conversations')
      .update({ status })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation status.",
        variant: "destructive"
      });
      return;
    }

    // Update local state
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, status } : c
      )
    );

    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => prev ? { ...prev, status } : null);
    }

    toast({
      title: "Status Updated",
      description: `Conversation marked as ${status}`,
    });
  }, [selectedConversation, toast]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!isEmployee) return;

    const channel = supabase
      .channel('admin-chat')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          // Reload conversations on any change
          loadConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // If it's for the selected conversation, add it
          if (selectedConversation && newMessage.conversation_id === selectedConversation.id) {
            setMessages(prev => {
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
          }

          // Update conversation's unread count and last message
          setConversations(prev =>
            prev.map(c => {
              if (c.id === newMessage.conversation_id) {
                return {
                  ...c,
                  last_message: newMessage.content,
                  unread_count: newMessage.sender_type === 'user' && 
                    selectedConversation?.id !== c.id
                    ? (c.unread_count || 0) + 1 
                    : c.unread_count
                };
              }
              return c;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isEmployee, selectedConversation, loadConversations]);

  // Check role on mount
  useEffect(() => {
    checkEmployeeRole();
  }, [checkEmployeeRole]);

  // Load conversations when employee role is confirmed
  useEffect(() => {
    if (isEmployee) {
      loadConversations();
    }
  }, [isEmployee, loadConversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversation, loadMessages]);

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    sending,
    isEmployee,
    setSelectedConversation,
    sendMessage,
    updateConversationStatus,
    refreshConversations: loadConversations
  };
};
