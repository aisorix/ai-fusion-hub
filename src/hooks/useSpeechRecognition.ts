// Speech Recognition Hook
// Uses Web Speech API for voice input

import { useState, useCallback, useRef, useEffect } from 'react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onSilenceDetected?: () => void;
  silenceTimeout?: number;
  autoRestart?: boolean;
  continuous?: boolean;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = ({
  onResult,
  onSilenceDetected,
  silenceTimeout = 2000,
  autoRestart = true,
  continuous = true,
  language = 'en-US',
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastResultTimeRef = useRef<number>(Date.now());

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Clear silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Start silence detection timer
  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (transcript.trim() && onSilenceDetected) {
        onSilenceDetected();
        if (onResult) {
          onResult(transcript);
        }
        setTranscript('');
        setInterimTranscript('');
      }
    }, silenceTimeout);
  }, [transcript, silenceTimeout, onSilenceDetected, onResult, clearSilenceTimer]);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      lastResultTimeRef.current = Date.now();
      
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
      setInterimTranscript(interim);

      // Reset silence timer on new speech
      startSilenceTimer();
    };

    recognition.onerror = (event) => {
      console.error('[SpeechRecognition] Error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          // Not really an error, just no speech detected
          break;
        case 'audio-capture':
          setError('No microphone detected');
          break;
        case 'not-allowed':
          setError('Microphone access denied');
          break;
        case 'network':
          setError('Network error');
          break;
        default:
          setError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      
      // Auto restart if enabled and no error
      if (autoRestart && !error) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore start errors during restart
        }
      }
    };

    return () => {
      clearSilenceTimer();
      if (recognition) {
        recognition.abort();
      }
    };
  }, [isSupported, continuous, language, autoRestart, error, startSilenceTimer, clearSilenceTimer]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Recognition might already be running
      console.warn('[SpeechRecognition] Start error:', e);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript: transcript + interimTranscript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
