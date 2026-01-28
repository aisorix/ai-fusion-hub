import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface UseSpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  onSilenceDetected?: () => void;
  silenceTimeout?: number;
  autoRestart?: boolean;
}

export const useSpeechRecognition = ({
  onResult,
  onSilenceDetected,
  silenceTimeout = 1500,
  autoRestart = true,
}: UseSpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestartRef = useRef(false);
  const isActiveRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (transcript.trim() && isActiveRef.current) {
        onSilenceDetected?.();
        onResult(transcript.trim());
        setTranscript('');
      }
    }, Math.min(silenceTimeout, 800));
  }, [transcript, silenceTimeout, onResult, onSilenceDetected, clearSilenceTimer]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    isActiveRef.current = false;
    clearSilenceTimer();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    console.log('[Speech] Starting recognition...');

    recognition.onstart = () => {
      console.log('[Speech] Recognition started');
      setIsListening(true);
      setError(null);
      isActiveRef.current = true;
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          console.log('[Speech] Final transcript:', finalTranscript);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      console.log('[Speech] Heard:', fullTranscript);
      setTranscript(fullTranscript);

      if (finalTranscript.trim()) {
        clearSilenceTimer();
        onResult(finalTranscript.trim());
        setTranscript('');
        return;
      }

      if (fullTranscript.trim()) {
        startSilenceTimer();
      }
    };

    recognition.onerror = (event: any) => {
      console.error('[Speech] Recognition error:', event.error);

      if (event.error === 'no-speech') {
        console.log('[Speech] No speech detected, restarting...');
        if (autoRestart && shouldRestartRef.current && isActiveRef.current) {
          setTimeout(() => {
            if (shouldRestartRef.current && isActiveRef.current) {
              startListening();
            }
          }, 100);
        }
        return;
      }

      if (event.error === 'aborted') {
        console.log('[Speech] Recognition aborted');
        return;
      }

      console.error('[Speech] Error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended');
      setIsListening(false);

      if (autoRestart && shouldRestartRef.current && isActiveRef.current) {
        console.log('[Speech] Auto-restarting...');
        setTimeout(() => {
          if (shouldRestartRef.current && isActiveRef.current) {
            startListening();
          }
        }, 200);
      }
    };

    shouldRestartRef.current = autoRestart;
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start speech recognition');
    }
  }, [isSupported, autoRestart, startSilenceTimer, clearSilenceTimer, onResult]);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      isActiveRef.current = false;
      clearSilenceTimer();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [clearSilenceTimer]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript: () => setTranscript(''),
  };
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
