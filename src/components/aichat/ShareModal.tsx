import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Link, UserPlus, Send, MessageCircle, Loader2, Trash2 } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ShareModal = () => {
  const { theme, shareModalOpen, closeShareModal, chats, activeChatId, shareMessageId } = useChatStore();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [sharedChatId, setSharedChatId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'commenter'>('commenter');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const messages = chats.find(c => c.id === activeChatId)?.messages || [];
  const chatTitle = chats.find(c => c.id === activeChatId)?.title || 'Shared Chat';

  // Create or fetch shared chat
  const initializeShare = useCallback(async () => {
    if (!user || !activeChatId) return;
    setLoading(true);

    try {
      // Check if already shared
      const { data: existing } = await supabase
        .from('shared_chats')
        .select('id, share_token')
        .eq('owner_id', user.id)
        .eq('title', chatTitle)
        .maybeSingle();

      if (existing) {
        setShareToken(existing.share_token);
        setSharedChatId(existing.id);
        // Update chat data
        await supabase
          .from('shared_chats')
          .update({ chat_data: messages as any })
          .eq('id', existing.id);
      } else {
        const { data: newShare, error } = await supabase
          .from('shared_chats')
          .insert({
            owner_id: user.id,
            title: chatTitle,
            chat_data: messages as any,
          })
          .select('id, share_token')
          .single();

        if (error) throw error;
        if (newShare) {
          setShareToken(newShare.share_token);
          setSharedChatId(newShare.id);
        }
      }
    } catch (err: any) {
      console.error('Share init error:', err);
      toast.error('Failed to create share link');
    }
    setLoading(false);
  }, [user, activeChatId, chatTitle, messages]);

  // Load members
  useEffect(() => {
    if (!sharedChatId) return;
    const loadMembers = async () => {
      const { data } = await supabase
        .from('shared_chat_members')
        .select('*')
        .eq('shared_chat_id', sharedChatId);
      if (data) setMembers(data);
    };
    loadMembers();
  }, [sharedChatId]);

  useEffect(() => {
    if (shareModalOpen) {
      initializeShare();
    } else {
      setShareToken(null);
      setSharedChatId(null);
      setMembers([]);
      setInviteEmail('');
    }
  }, [shareModalOpen, initializeShare]);

  const shareUrl = shareToken ? `${window.location.origin}/shared/${shareToken}` : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !sharedChatId) return;
    setInviting(true);
    try {
      const { error } = await supabase
        .from('shared_chat_members')
        .insert({
          shared_chat_id: sharedChatId,
          user_email: inviteEmail.trim(),
          role: inviteRole,
        });
      if (error) throw error;
      toast.success(`Invited ${inviteEmail}`);
      setInviteEmail('');
      // Reload members
      const { data } = await supabase
        .from('shared_chat_members')
        .select('*')
        .eq('shared_chat_id', sharedChatId);
      if (data) setMembers(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to invite');
    }
    setInviting(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    await supabase.from('shared_chat_members').delete().eq('id', memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success('Member removed');
  };

  return (
    <AnimatePresence>
      {shareModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeShareModal}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={cn('w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col', 'bg-card')}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Share & Collaborate</h2>
                </div>
                <button onClick={closeShareModal} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Share Link */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Share Link</label>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                        <Link className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input type="text" value={shareUrl} readOnly className="flex-1 bg-transparent text-sm outline-none text-muted-foreground min-w-0" />
                        <button
                          onClick={handleCopyLink}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0',
                            'bg-primary text-primary-foreground hover:bg-primary/90',
                            copied && 'bg-green-500 hover:bg-green-600'
                          )}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Anyone with this link can view the chat and join the discussion
                      </p>
                    </div>

                    {/* Invite by Email */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        <UserPlus className="w-4 h-4 inline mr-1.5" />
                        Invite Members
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter email address"
                          onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value as any)}
                          className="px-2 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
                        >
                          <option value="commenter">Commenter</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={handleInvite}
                          disabled={!inviteEmail.trim() || inviting}
                          className="px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                        >
                          {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Members List */}
                    {members.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Members ({members.length})</label>
                        <div className="space-y-2">
                          {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                                  {member.user_email.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm truncate">{member.user_email}</p>
                                  <p className="text-[10px] text-muted-foreground capitalize">{member.role}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
