import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, VolumeX, Settings, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceVisualizer } from './VoiceVisualizer';
import { VoicePersonaSelector, voicePersonas, VoicePersona } from './VoicePersonaSelector';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { cn } from '@/lib/utils';

interface LiveVoiceOverlayProps {
  open: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<string>;
}

export const LiveVoiceOverlay: React.FC<LiveVoiceOverlayProps> = ({
  open,
  onClose,
  onSendMessage,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(voicePersonas[0]);
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscriptResult = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  const {
    isListening: listening,
    isSupported: speechSupported,
    startListening,
    stopListening,
    transcript: liveTranscript,
    clearTranscript: resetTranscript,
  } = useSpeechRecognition({
    onResult: handleTranscriptResult,
    autoRestart: false,
  });

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking: speaking,
    isSupported: synthSupported,
  } = useSpeechSynthesis();

  // Update transcript as user speaks
  useEffect(() => {
    if (liveTranscript) {
      setTranscript(liveTranscript);
    }
  }, [liveTranscript]);

  const handleSend = useCallback(async () => {
    if (!transcript.trim() || isProcessing) return;

    stopListening();
    setIsProcessing(true);
    setResponse('');

    try {
      const aiResponse = await onSendMessage(transcript);
      setResponse(aiResponse);

      if (autoSpeak && synthSupported) {
        speak(aiResponse);
      }
    } catch (error) {
      console.error('Voice chat error:', error);
      setResponse('Sorry, I encountered an error processing your request.');
    } finally {
      setIsProcessing(false);
      setTranscript('');
      resetTranscript();
    }
  }, [transcript, isProcessing, onSendMessage, autoSpeak, synthSupported, speak, selectedPersona, stopListening, resetTranscript]);

  const handleMicToggle = useCallback(() => {
    if (listening) {
      stopListening();
      // Auto-send after stopping if there's transcript
      if (transcript.trim()) {
        handleSend();
      }
    } else {
      stopSpeaking();
      setTranscript('');
      resetTranscript();
      startListening();
    }
  }, [listening, transcript, handleSend, stopListening, stopSpeaking, resetTranscript, startListening]);

  const handleClose = () => {
    stopListening();
    stopSpeaking();
    setTranscript('');
    setResponse('');
    resetTranscript();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center p-6"
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Settings button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => setPersonaModalOpen(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Voice Visualizer */}
        <VoiceVisualizer
          isListening={listening}
          isSpeaking={speaking}
          className="mb-8"
        />

        {/* Transcript display */}
        <div className="w-full max-w-lg text-center mb-8">
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-muted/50 mb-4"
            >
              <p className="text-sm text-muted-foreground mb-1">You said:</p>
              <p className="text-lg">{transcript}</p>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-muted-foreground"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Thinking...</span>
            </motion.div>
          )}

          {response && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-primary/10"
            >
              <p className="text-sm text-muted-foreground mb-1">AI Response:</p>
              <p className="text-base">{response}</p>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Mic button */}
          <Button
            size="lg"
            variant={listening ? 'destructive' : 'default'}
            className={cn(
              'w-16 h-16 rounded-full',
              listening && 'animate-pulse'
            )}
            onClick={handleMicToggle}
            disabled={!speechSupported}
          >
            {listening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          {/* Auto-speak toggle */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'rounded-full',
              autoSpeak && 'bg-primary/10 border-primary'
            )}
            onClick={() => setAutoSpeak(!autoSpeak)}
          >
            {autoSpeak ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>

          {/* Manual send */}
          {transcript && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleSend}
              disabled={isProcessing}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Instructions */}
        <p className="text-sm text-muted-foreground mt-6 text-center">
          {!speechSupported
            ? 'Voice recognition is not supported in your browser'
            : listening
            ? 'Speak now... Click the mic button when done'
            : 'Click the microphone to start speaking'}
        </p>

        {/* Persona selector */}
        <VoicePersonaSelector
          open={personaModalOpen}
          onOpenChange={setPersonaModalOpen}
          selectedPersona={selectedPersona.id}
          onSelect={setSelectedPersona}
        />
      </motion.div>
    </AnimatePresence>
  );
};
