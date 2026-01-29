import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Square, MessageSquare } from 'lucide-react';
import { useSpeechRecognition, type VoiceState } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { chatApi } from '@/services/api';
import VoiceVisualizer from './VoiceVisualizer';
import VoicePersonaSelector from './VoicePersonaSelector';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LiveVoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Ultra-fast model for instant voice responses
const VOICE_MODEL = 'google/gemini-2.0-flash-lite';

const VOICE_SYSTEM_PROMPT = `You are Sorix. Reply in 1 short sentence only. Be direct. No markdown.`;

// ChatGPT-style accent color
const ACCENT_COLOR = '#10a37f';

const LiveVoiceOverlay: React.FC<LiveVoiceOverlayProps> = ({ isOpen, onClose }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [personaSelectorOpen, setPersonaSelectorOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const isProcessingRef = useRef(false);
  const hasStartedSpeakingRef = useRef(false);
  const responseBufferRef = useRef('');

  // Speech synthesis hook
  const {
    isSpeaking,
    selectedPersona,
    setSelectedPersona,
    speak,
    stop: stopSpeaking,
    previewVoice,
  } = useSpeechSynthesis({
    onStart: () => setVoiceState('speaking'),
    onEnd: () => {
      setVoiceState('listening');
      // Auto-resume listening after AI finishes speaking
      if (isOpen) {
        setTimeout(() => {
          startListening();
        }, 200);
      }
    },
  });

  // Handle user speech result - INSTANT response
  const handleSpeechResult = useCallback(async (transcript: string) => {
    if (!transcript.trim() || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    hasStartedSpeakingRef.current = false;
    responseBufferRef.current = '';
    setVoiceState('processing');
    setCurrentTranscript(transcript);
    setAiResponse('');

    // Add user message to history
    const newHistory = [
      ...conversationHistory,
      { role: 'user' as const, content: transcript }
    ];
    setConversationHistory(newHistory);

    // Prepare messages - keep context minimal for speed
    const apiMessages = [
      { role: 'system' as const, content: VOICE_SYSTEM_PROMPT },
      ...newHistory.slice(-4) // Less context = faster
    ];

    abortControllerRef.current = new AbortController();

    try {
      let fullResponse = '';
      
      await chatApi.sendMessageStream(
        apiMessages,
        VOICE_MODEL,
        'free',
        (chunk) => {
          fullResponse += chunk;
          responseBufferRef.current = fullResponse;
          setAiResponse(fullResponse);
          
          // START SPEAKING when we have a complete sentence or enough text
          if (!hasStartedSpeakingRef.current && fullResponse.length > 5) {
            const hasSentenceEnd = /[.!?]/.test(fullResponse);
            if (hasSentenceEnd || fullResponse.length > 40) {
              hasStartedSpeakingRef.current = true;
              console.log('[Voice] Starting speech with:', fullResponse);
              speak(fullResponse);
            }
          }
        },
        () => {
          console.log('[Voice] Response complete:', fullResponse);
          setConversationHistory(prev => [
            ...prev,
            { role: 'assistant', content: fullResponse }
          ]);
          
          // If we haven't started speaking yet (very short response), speak now
          if (!hasStartedSpeakingRef.current && fullResponse.trim()) {
            speak(fullResponse);
          }
          
          isProcessingRef.current = false;
        },
        (err) => {
          console.error('[Voice] API Error:', err);
          toast.error('Connection issue');
          setVoiceState('listening');
          isProcessingRef.current = false;
          startListening();
        },
        abortControllerRef.current.signal
      );
    } catch (err) {
      console.error('[Voice] Chat error:', err);
      setVoiceState('listening');
      isProcessingRef.current = false;
    }
  }, [conversationHistory, speak]);

  // Speech recognition hook
  const {
    isListening,
    transcript,
    error: recognitionError,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onSilenceDetected: () => {
      setVoiceState('processing');
    },
    silenceTimeout: 1500,
    autoRestart: true,
  });

  // Update transcript as user speaks
  useEffect(() => {
    if (transcript) {
      setCurrentTranscript(transcript);
    }
  }, [transcript]);

  // Update voice state based on listening
  useEffect(() => {
    if (isListening && voiceState !== 'processing' && voiceState !== 'speaking') {
      setVoiceState('listening');
    }
  }, [isListening, voiceState]);

  // Start listening when overlay opens
  useEffect(() => {
    if (isOpen && isSupported) {
      setTimeout(() => {
        startListening();
        setVoiceState('listening');
      }, 500);
    }
    
    return () => {
      stopListening();
      stopSpeaking();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isOpen, isSupported]);

  const handleClose = useCallback(() => {
    stopListening();
    stopSpeaking();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setVoiceState('idle');
    setCurrentTranscript('');
    setAiResponse('');
    setConversationHistory([]);
    onClose();
  }, [stopListening, stopSpeaking, onClose]);

  const handleInterrupt = useCallback(() => {
    stopSpeaking();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    isProcessingRef.current = false;
    setVoiceState('listening');
    startListening();
  }, [stopSpeaking, startListening]);

  // Get status message
  const getStatusMessage = () => {
    switch (voiceState) {
      case 'listening':
        return currentTranscript || 'Listening...';
      case 'processing':
        return 'Thinking...';
      case 'speaking':
        return aiResponse || 'Speaking...';
      default:
        return 'Tap the mic to start';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col"
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]" />
        
        {/* Subtle ambient glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ backgroundColor: ACCENT_COLOR }}
            animate={{
              opacity: voiceState === 'speaking' ? [0.08, 0.15, 0.08] : 
                       voiceState === 'listening' ? [0.04, 0.08, 0.04] : 0.03,
              scale: voiceState === 'speaking' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: voiceState === 'speaking' ? 0.6 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
        >
          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={cn(
              "p-2.5 rounded-full transition-all duration-200",
              showTranscript
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            )}
            title="Toggle transcript"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="text-center">
            <p className="text-sm font-medium text-white/90">AI Sorix</p>
            <motion.p 
              className="text-sm font-bold text-amber-400 uppercase tracking-wider"
              animate={{
                textShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.5)',
                  '0 0 20px rgba(251, 191, 36, 0.8)',
                  '0 0 10px rgba(251, 191, 36, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Coming Soon
            </motion.p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2.5 rounded-full text-white/40 hover:text-white/90 hover:bg-white/5 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.header>

        {/* Main content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          {/* Voice Visualizer */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-10"
          >
            <VoiceVisualizer state={voiceState} accentColor={ACCENT_COLOR} />
          </motion.div>

          {/* Status message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center max-w-sm px-4"
          >
            <motion.p
              key={getStatusMessage()}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-lg leading-relaxed",
                voiceState === 'listening' && currentTranscript
                  ? "text-white"
                  : voiceState === 'speaking'
                  ? "text-white/90"
                  : "text-white/50"
              )}
            >
              {getStatusMessage()}
            </motion.p>
          </motion.div>

          {/* Transcript panel */}
          <AnimatePresence>
            {showTranscript && conversationHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-8 w-full max-w-md overflow-hidden"
              >
                <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] max-h-40 overflow-y-auto">
                  {conversationHistory.slice(-6).map((msg, i) => (
                    <div key={i} className={cn(
                      "px-4 py-3 text-sm",
                      i !== 0 && "border-t border-white/[0.05]"
                    )}>
                      <span className={cn(
                        "text-xs font-medium uppercase tracking-wide mb-1 block",
                        msg.role === 'user' ? "text-blue-400/70" : "text-emerald-400/70"
                      )}>
                        {msg.role === 'user' ? 'You' : 'Sorix'}
                      </span>
                      <p className="text-white/70 leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          {recognitionError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400/70 text-sm text-center mt-6"
            >
              {recognitionError}
            </motion.p>
          )}

          {/* Not supported message */}
          {!isSupported && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6"
            >
              <p className="text-white/60 text-sm">Voice not supported</p>
              <p className="text-white/30 text-xs mt-1">Use Chrome, Edge, or Safari</p>
            </motion.div>
          )}
        </main>

        {/* Bottom controls */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 pb-10 pt-6 px-6"
        >
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            {/* Main action button */}
            {isSupported && (
              <div className="flex items-center gap-4">
                {/* Stop/Interrupt button */}
                {(voiceState === 'speaking' || voiceState === 'processing') && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={handleInterrupt}
                    className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-all duration-200"
                  >
                    <Square className="w-4 h-4 text-red-400" fill="currentColor" />
                  </motion.button>
                )}

                {/* Main mic button */}
                <motion.button
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "relative w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center",
                    isListening
                      ? "bg-white shadow-lg shadow-white/20"
                      : "bg-white/10 hover:bg-white/15 border border-white/20"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? (
                    <Mic className="w-6 h-6 text-[#0d0d0d]" />
                  ) : (
                    <MicOff className="w-6 h-6 text-white/60" />
                  )}
                  
                  {/* Active pulse */}
                  {isListening && voiceState === 'listening' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white"
                      animate={{
                        scale: [1, 1.3],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  )}
                </motion.button>

                {/* Spacer for symmetry */}
                {(voiceState === 'speaking' || voiceState === 'processing') && (
                  <div className="w-12 h-12" />
                )}
              </div>
            )}

            {/* Voice persona selector */}
            <VoicePersonaSelector
              isOpen={personaSelectorOpen}
              onToggle={() => setPersonaSelectorOpen(!personaSelectorOpen)}
              selectedPersona={selectedPersona}
              onSelect={(persona) => {
                setSelectedPersona(persona);
                setPersonaSelectorOpen(false);
              }}
              onPreview={previewVoice}
            />

            {/* Conversation count */}
            {conversationHistory.length > 0 && (
              <p className="text-white/25 text-xs">
                {Math.ceil(conversationHistory.length / 2)} exchange{conversationHistory.length > 2 ? 's' : ''}
              </p>
            )}
          </div>
        </motion.footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveVoiceOverlay;
