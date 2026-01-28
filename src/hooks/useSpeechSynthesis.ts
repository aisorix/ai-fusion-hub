import { useState, useRef, useCallback, useEffect } from 'react';

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
  color: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  { id: 'sky', name: 'Sky', gender: 'female', description: 'Warm & friendly', color: 'hsl(199, 89%, 55%)' },
  { id: 'ember', name: 'Ember', gender: 'female', description: 'Confident & bold', color: 'hsl(15, 85%, 55%)' },
  { id: 'juniper', name: 'Juniper', gender: 'female', description: 'Calm & soothing', color: 'hsl(150, 70%, 45%)' },
  { id: 'atlas', name: 'Atlas', gender: 'male', description: 'Deep & authoritative', color: 'hsl(220, 80%, 55%)' },
  { id: 'cove', name: 'Cove', gender: 'male', description: 'Casual & relaxed', color: 'hsl(280, 70%, 55%)' },
];

interface UseSpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const useSpeechSynthesis = ({
  onStart,
  onEnd,
  onError,
}: UseSpeechSynthesisOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('[TTS] Loaded voices:', voices.length);
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    const retryTimer = setTimeout(loadVoices, 500);

    return () => {
      speechSynthesis.onvoiceschanged = null;
      clearTimeout(retryTimer);
    };
  }, []);

  const getVoiceForPersona = useCallback((persona: VoicePersona): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) {
      console.log('[TTS] No voices available');
      return null;
    }

    const isEnglish = (voice: SpeechSynthesisVoice) =>
      voice.lang.startsWith('en-') || voice.lang === 'en';

    const englishVoices = availableVoices.filter(isEnglish);
    console.log('[TTS] English voices:', englishVoices.length);

    const genderKeywords = persona.gender === 'female'
      ? ['female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'fiona', 'moira', 'tessa', 'veena', 'susan']
      : ['male', 'man', 'david', 'alex', 'daniel', 'fred', 'tom', 'james', 'oliver', 'richard'];

    const matchingVoice = englishVoices.find(voice =>
      genderKeywords.some(keyword =>
        voice.name.toLowerCase().includes(keyword)
      )
    );

    if (matchingVoice) {
      console.log('[TTS] Using voice:', matchingVoice.name);
      return matchingVoice;
    }

    const voiceIndex = persona.gender === 'female' ? 0 : 1;
    const fallbackVoice = englishVoices[voiceIndex % englishVoices.length] || availableVoices[0];
    console.log('[TTS] Fallback voice:', fallbackVoice?.name);
    return fallbackVoice;
  }, [availableVoices]);

  const speak = useCallback((text: string) => {
    if (!text.trim()) {
      console.log('[TTS] Empty text, skipping');
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('[TTS] Speech synthesis not supported');
      onError?.('Speech synthesis not supported');
      onEnd?.();
      return;
    }

    console.log('[TTS] Speaking:', text.slice(0, 50) + '...');

    try {
      speechSynthesis.cancel();
    } catch (e) {
      console.error('[TTS] Cancel error:', e);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForPersona(selectedPersona);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1.1;
    utterance.pitch = selectedPersona.gender === 'female' ? 1.05 : 0.95;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      console.log('[TTS] Started speaking');
      isSpeakingRef.current = true;
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      console.log('[TTS] Finished speaking');
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('[TTS] Error:', event.error);
      isSpeakingRef.current = false;
      setIsSpeaking(false);

      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        onError?.(event.error);
      }
      onEnd?.();
    };

    utteranceRef.current = utterance;

    setTimeout(() => {
      try {
        speechSynthesis.speak(utterance);
        console.log('[TTS] speak() called');

        setTimeout(() => {
          if (!isSpeakingRef.current && !speechSynthesis.speaking) {
            console.log('[TTS] Speech may have failed, triggering fallback');
            onEnd?.();
          }
        }, 1000);
      } catch (e) {
        console.error('[TTS] Speak error:', e);
        onError?.('Failed to speak');
        onEnd?.();
      }
    }, 50);
  }, [selectedPersona, getVoiceForPersona, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    try {
      speechSynthesis.cancel();
    } catch (e) {
      console.error('[TTS] Stop error:', e);
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  const previewVoice = useCallback((persona: VoicePersona) => {
    if (!isSupported) return;

    try {
      speechSynthesis.cancel();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance("Hello, I'm " + persona.name + ".");
    const voice = getVoiceForPersona(persona);
    if (voice) utterance.voice = voice;
    utterance.rate = 1.1;
    utterance.pitch = persona.gender === 'female' ? 1.05 : 0.95;
    utterance.lang = 'en-US';

    try {
      speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('[TTS] Preview error:', e);
    }
  }, [isSupported, getVoiceForPersona]);

  return {
    isSpeaking,
    isSupported,
    selectedPersona,
    setSelectedPersona,
    availableVoices,
    speak,
    stop,
    previewVoice,
  };
};
