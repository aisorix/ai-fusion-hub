// Voice Components Stub
// Placeholder for voice-related components

import React from 'react';

// Live Voice Overlay - placeholder
export const LiveVoiceOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="text-center text-white">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Voice Mode</h3>
        <p className="text-gray-400 mb-6">Voice AI functionality coming soon</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default {
  LiveVoiceOverlay,
};
