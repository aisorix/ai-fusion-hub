import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Link, Twitter, Facebook } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const ShareModal = () => {
  const { theme, shareModalOpen, closeShareModal, chats, activeChatId, shareMessageId } = useChatStore();
  const [copied, setCopied] = React.useState(false);
  
  // Derive messages from active chat
  const messages = chats.find(c => c.id === activeChatId)?.messages || [];
  const message = messages.find(m => m.id === shareMessageId);
  const shareUrl = `https://sorix.ai/share/${shareMessageId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <AnimatePresence>
      {shareModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeShareModal}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={cn(
              'w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden',
              theme === 'dark' ? 'bg-[hsl(0,0%,18%)]' : 'bg-background'
            )}>
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between px-6 py-4 border-b',
                theme === 'dark' ? 'border-white/10' : 'border-black/10'
              )}>
                <h2 className="text-lg font-semibold">Share Chat</h2>
                <button
                  onClick={closeShareModal}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Preview */}
              <div className="p-6">
                <div className={cn(
                  'p-4 rounded-xl mb-6 max-h-48 overflow-y-auto',
                  theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
                )}>
                  <p className="text-sm line-clamp-6 text-muted-foreground">
                    {message?.content || 'No content to share'}
                  </p>
                </div>
                
                {/* Share Link */}
                <div className={cn(
                  'flex items-center gap-2 p-3 rounded-xl',
                  theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
                )}>
                  <Link className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm outline-none text-muted-foreground"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-800',
                      copied && 'bg-green-500 hover:bg-green-600'
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                
                {/* Social Share */}
                <div className="flex items-center gap-3 mt-6">
                  <span className="text-sm text-muted-foreground">Share on:</span>
                  <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
