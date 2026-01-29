// Speech Synthesis Hook
// Uses Web Speech API for text-to-speech

import { useState, useCallback, useRef, useEffect } from 'react';

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  voiceName?: string;
  pitch: number;
  rate: number;
  color: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'nova',
    name: 'Nova',
    description: 'Warm and friendly',
    pitch: 1.1,
    rate: 1.0,
    color: '#10a37f',
  },
  {
    id: 'echo',
    name: 'Echo',
    description: 'Calm and measured',
    pitch: 0.9,
    rate: 0.95,
    color: '#6366f1',
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Professional and clear',
    pitch: 1.0,
    rate: 1.05,
    color: '#8b5cf6',
  },
  {
    id: 'spark',
    name: 'Spark',
    description: 'Energetic and upbeat',
    pitch: 1.2,
    rate: 1.1,
    color: '#f59e0b',
  },
];

interface UseSpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  selectedPersona: VoicePersona;
  setSelectedPersona: (persona: VoicePersona) => void;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  previewVoice: (persona: VoicePersona) => void;
}

export const useSpeechSynthesis = ({
  onStart,
  onEnd,
  onError,
}: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported]);

  // Get the best voice for the selected persona
  const getVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // Prefer English voices
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    // If persona has a specific voice name, try to find it
    if (selectedPersona.voiceName) {
      const specificVoice = englishVoices.find(v => 
        v.name.toLowerCase().includes(selectedPersona.voiceName!.toLowerCase())
      );
      if (specificVoice) return specificVoice;
    }

    // Find a good quality voice
    const preferredVoices = englishVoices.filter(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') || 
      v.name.includes('Samantha') ||
      v.name.includes('Alex')
    );

    return preferredVoices[0] || englishVoices[0] || voices[0];
  }, [voices, selectedPersona]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Apply persona settings
    const voice = getVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.pitch = selectedPersona.pitch;
    utterance.rate = selectedPersona.rate;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('[SpeechSynthesis] Error:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
      onError?.(event.error);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedPersona, getVoice, onStart, onEnd, onError]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, [isSupported]);

  const previewVoice = useCallback((persona: VoicePersona) => {
    const previewText = `Hi, I'm ${persona.name}. ${persona.description}.`;
    
    // Temporarily set persona for preview
    const currentPersona = selectedPersona;
    setSelectedPersona(persona);
    
    // Small delay to ensure persona is set
    setTimeout(() => {
      speak(previewText);
      // Restore original persona after preview
      setTimeout(() => {
        setSelectedPersona(currentPersona);
      }, 100);
    }, 50);
  }, [selectedPersona, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSpeaking,
    isPaused,
    isSupported,
    selectedPersona,
    setSelectedPersona,
    speak,
    pause,
    resume,
    stop,
    previewVoice,
  };
};

export default useSpeechSynthesis;
