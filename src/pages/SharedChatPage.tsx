import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MarkdownRenderer from '@/components/aichat/MarkdownRenderer';
import { ModelIcon } from '@/components/aichat/ModelIcons';
import { cn } from '@/lib/utils';
import { Send, ArrowLeft, MessageCircle, Loader2, User } from 'lucide-react';
import sorixLogo from '@/assets/logo.png';

interface SharedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelId?: string;
  modelName?: string;
}

interface Comment {
  id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  created_at: string;
}

const SharedChatPage = () => {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<SharedMessage[]>([]);
  const [title, setTitle] = useState('Shared Chat');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sending, setSending] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Load shared chat
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      const { data: rows, error } = await supabase
        .rpc('get_shared_chat_by_token', { _token: token });
      const data = Array.isArray(rows) ? rows[0] : rows;

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setMessages(Array.isArray(data.chat_data) ? (data.chat_data as any[]) : []);

      // Load comments
      const { data: commentsData } = await supabase
        .from('shared_chat_comments')
        .select('*')
        .eq('shared_chat_id', data.id)
        .order('created_at', { ascending: true });

      if (commentsData) setComments(commentsData);
      setLoading(false);

      // Subscribe to realtime comments
      const channel = supabase
        .channel(`comments-${data.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'shared_chat_comments', filter: `shared_chat_id=eq.${data.id}` },
          (payload) => {
            setComments((prev) => [...prev, payload.new as Comment]);
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    };
    load();
  }, [token]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSendComment = useCallback(async () => {
    if (!newComment.trim() || !user || !token || sending) return;
    setSending(true);

    // Get shared chat id
    const { data: chat } = await supabase
      .from('shared_chats')
      .select('id')
      .eq('share_token', token)
      .single();

    if (!chat) { setSending(false); return; }

    const { error } = await supabase
      .from('shared_chat_comments')
      .insert({
        shared_chat_id: chat.id,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        content: newComment.trim(),
      });

    if (!error) setNewComment('');
    setSending(false);
  }, [newComment, user, token, sending]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold">Chat Not Found</h1>
        <p className="text-muted-foreground">This shared chat link is invalid or has been removed.</p>
        <Link to="/" className="text-primary hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Chat View - Left Side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border bg-card/50">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <img src={sorixLogo} alt="AI Sorix" className="w-7 h-7" />
          <div>
            <h1 className="font-bold text-sm sm:text-base">{title}</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Shared conversation</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border/30">
            {messages.map((msg, i) => (
              <div key={msg.id || i} className={cn('py-4 sm:py-6 px-4 sm:px-6', msg.role === 'assistant' && 'bg-muted/10')}>
                <div className="max-w-3xl mx-auto flex gap-3">
                  {msg.role === 'assistant' ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                      <ModelIcon modelId={msg.modelId || ''} modelName={msg.modelName || 'AI'} size="lg" theme="dark" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold mb-1 block">
                      {msg.role === 'assistant' ? (msg.modelName || 'AI') : 'User'}
                    </span>
                    {msg.role === 'assistant' ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      <p className="text-[15px] whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discussion Sidebar - Right Side */}
      <div className="w-80 border-l border-border flex flex-col bg-card hidden md:flex">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            Discussion ({comments.length})
          </h2>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              No comments yet. Start the discussion!
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                {comment.user_avatar ? (
                  <img src={comment.user_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (comment.user_name || '?').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{comment.user_name || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm mt-0.5 whitespace-pre-wrap break-words">{comment.content}</p>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input */}
        {user ? (
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendComment()}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim() || sending}
                className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-border">
            <Link to="/login" className="block text-center text-sm text-primary hover:underline py-2">
              Sign in to join the discussion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedChatPage;
