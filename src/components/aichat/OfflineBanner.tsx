import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { toast } from '@/hooks/use-toast';

const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
    } else if (wasOffline.current) {
      wasOffline.current = false;
      toast({
        title: "✅ Back Online",
        description: "Your internet connection has been restored.",
      });
    }
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">
              You're offline. Please check your internet connection.
            </span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-destructive-foreground/10 hover:bg-destructive-foreground/20 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
