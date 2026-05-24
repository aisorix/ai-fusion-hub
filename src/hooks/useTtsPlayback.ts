// Global TTS playback store — single audio element, OpenAI gpt-4o-mini-tts via edge function.
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

type Status = 'idle' | 'loading' | 'playing' | 'paused';

interface TtsState {
  activeId: string | null;
  status: Status;
  text: string;
  position: number;
  duration: number;
  audio: HTMLAudioElement | null;
  voice: string;
  setVoice: (v: string) => void;
  toggle: (id: string, text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

const VOICE_KEY = 'sorix-tts-voice';

function getStoredVoice(): string {
  try {
    return localStorage.getItem(VOICE_KEY) || 'nova';
  } catch {
    return 'nova';
  }
}

export const useTtsPlayback = create<TtsState>((set, get) => ({
  activeId: null,
  status: 'idle',
  text: '',
  position: 0,
  duration: 0,
  audio: null,
  voice: getStoredVoice(),

  setVoice: (voice) => {
    try { localStorage.setItem(VOICE_KEY, voice); } catch {}
    set({ voice });
  },

  stop: () => {
    const { audio } = get();
    if (audio) {
      try { audio.pause(); audio.src = ''; } catch {}
    }
    set({ activeId: null, status: 'idle', text: '', position: 0, duration: 0, audio: null });
  },

  pause: () => {
    const { audio } = get();
    if (audio && !audio.paused) audio.pause();
    set({ status: 'paused' });
  },

  resume: () => {
    const { audio } = get();
    if (audio && audio.paused) audio.play().catch(() => {});
    set({ status: 'playing' });
  },

  toggle: async (id, text) => {
    const state = get();
    if (state.activeId === id) {
      if (state.status === 'playing') return state.pause();
      if (state.status === 'paused') return state.resume();
      if (state.status === 'loading') return state.stop();
    }
    // start fresh
    state.stop();

    const cleanText = (text || '').replace(/```[\s\S]*?```/g, ' ').replace(/[*_#>`]/g, '').trim();
    if (!cleanText) return;

    set({ activeId: id, status: 'loading', text: cleanText, position: 0, duration: 0 });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('Not authenticated');

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts-speak`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ text: cleanText, voice: get().voice }),
      });
      if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
      const blob = await res.blob();
      // Ensure we weren't superseded while loading
      if (get().activeId !== id) {
        return;
      }
      const objectUrl = URL.createObjectURL(blob);
      const audio = new Audio(objectUrl);
      audio.preload = 'auto';
      audio.addEventListener('loadedmetadata', () => {
        set({ duration: isFinite(audio.duration) ? audio.duration : 0 });
      });
      audio.addEventListener('timeupdate', () => {
        set({ position: audio.currentTime });
      });
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(objectUrl);
        set({ activeId: null, status: 'idle', text: '', position: 0, duration: 0, audio: null });
      });
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        set({ activeId: null, status: 'idle', audio: null });
      });
      set({ audio, status: 'playing' });
      await audio.play();
    } catch (err) {
      console.error('[useTtsPlayback]', err);
      set({ activeId: null, status: 'idle', text: '', audio: null });
    }
  },
}));
