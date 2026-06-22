// Global TTS playback store — OpenAI gpt-4o-mini-tts via edge function.
// Word-level timing, live playback speed and voice switching.
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Status = 'idle' | 'loading' | 'playing' | 'paused';

export interface TtsWord {
  text: string;
  start: number;
  end: number;
  charIndex: number;
  charLength: number;
}

interface TtsState {
  activeId: string | null;
  status: Status;
  text: string;
  position: number;
  duration: number;
  audio: HTMLAudioElement | null;
  voice: string;
  speed: number;
  words: TtsWord[];
  activeWordIndex: number;
  setVoice: (v: string) => void;
  setSpeed: (s: number) => void;
  toggle: (id: string, text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

const VOICE_KEY = 'sorix-tts-voice';
const SPEED_KEY = 'sorix-tts-speed';

const read = (k: string, fallback: string) => {
  try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; }
};

export const VOICE_OPTIONS: { id: string; label: string; desc: string }[] = [
  { id: 'nova',    label: 'Nova',    desc: 'Bright & engaging' },
  { id: 'alloy',   label: 'Alloy',   desc: 'Balanced neutral' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Warm female' },
  { id: 'echo',    label: 'Echo',    desc: 'Smooth male' },
  { id: 'fable',   label: 'Fable',   desc: 'Expressive UK' },
  { id: 'onyx',    label: 'Onyx',    desc: 'Deep authoritative' },
  { id: 'sage',    label: 'Sage',    desc: 'Calm narrator' },
  { id: 'coral',   label: 'Coral',   desc: 'Friendly upbeat' },
];

export const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export function cleanForTts(raw: string): string {
  return (raw || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildWords(text: string): TtsWord[] {
  const out: TtsWord[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ text: m[0], start: 0, end: 0, charIndex: m.index, charLength: m[0].length });
  }
  return out;
}

function assignTimings(words: TtsWord[], duration: number) {
  if (duration <= 0 || words.length === 0) return;
  const weights = words.map(w => w.charLength + 1);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  let cursor = 0;
  for (let i = 0; i < words.length; i++) {
    const portion = (weights[i] / total) * duration;
    words[i].start = cursor;
    words[i].end = cursor + portion;
    cursor += portion;
  }
}

export const useTtsPlayback = create<TtsState>((set, get) => ({
  activeId: null,
  status: 'idle',
  text: '',
  position: 0,
  duration: 0,
  audio: null,
  voice: read(VOICE_KEY, 'nova'),
  speed: parseFloat(read(SPEED_KEY, '1')) || 1,
  words: [],
  activeWordIndex: -1,

  setVoice: (voice) => {
    try { localStorage.setItem(VOICE_KEY, voice); } catch {}
    const state = get();
    set({ voice });
    if (state.activeId && state.text) {
      const id = state.activeId, text = state.text;
      state.stop();
      setTimeout(() => get().toggle(id, text), 60);
    }
  },

  setSpeed: (speed) => {
    try { localStorage.setItem(SPEED_KEY, String(speed)); } catch {}
    const { audio, duration, words } = get();
    set({ speed });
    if (audio) {
      audio.playbackRate = speed;
      const effective = duration / speed;
      const copy = words.map(w => ({ ...w }));
      assignTimings(copy, effective);
      set({ words: copy });
    }
  },

  stop: () => {
    const { audio } = get();
    if (audio) {
      try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch {}
    }
    set({
      activeId: null, status: 'idle', text: '', position: 0, duration: 0,
      audio: null, words: [], activeWordIndex: -1,
    });
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
    state.stop();

    const cleanText = cleanForTts(text);
    if (!cleanText) return;

    // Create audio element synchronously inside the user gesture (iOS chain)
    const audio = new Audio();
    audio.preload = 'auto';
    audio.playbackRate = get().speed;

    set({
      activeId: id, status: 'loading', text: cleanText,
      position: 0, duration: 0, audio,
      words: buildWords(cleanText), activeWordIndex: -1,
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      // Browser-native fallback (used when premium is unavailable or fails).
      const speakWithBrowser = () => {
        try {
          if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            throw new Error('Speech not supported in this browser');
          }
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(cleanText);
          utter.rate = get().speed || 1;
          utter.onstart = () => set({ status: 'playing' });
          utter.onend = () => set({
            activeId: null, status: 'idle', text: '', position: 0, duration: 0,
            audio: null, words: [], activeWordIndex: -1,
          });
          utter.onerror = () => set({ activeId: null, status: 'idle', audio: null });
          window.speechSynthesis.speak(utter);
        } catch (e: any) {
          toast.error(e?.message || 'Read aloud unavailable');
          set({ activeId: null, status: 'idle', audio: null });
        }
      };

      if (!accessToken) { speakWithBrowser(); return; }

      let res: Response;
      try {
        res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts-speak`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ text: cleanText, voice: get().voice }),
          }
        );
      } catch {
        // Network failure → browser fallback, no toast.
        speakWithBrowser();
        return;
      }

      const contentType = res.headers.get('Content-Type') || '';
      if (!res.ok || contentType.includes('application/json')) {
        // Either a structured fallback signal or any non-audio response → browser TTS.
        try { await res.json(); } catch { /* ignore */ }
        speakWithBrowser();
        return;
      }

      const blob = await res.blob();
      if (get().activeId !== id) return;
      if (!blob.type.startsWith('audio') && blob.size < 1024) {
        speakWithBrowser();
        return;
      }

      const objectUrl = URL.createObjectURL(blob);

      audio.addEventListener('loadedmetadata', () => {
        const dur = isFinite(audio.duration) ? audio.duration : 0;
        const effective = dur / (get().speed || 1);
        const ws = get().words.map(w => ({ ...w }));
        assignTimings(ws, effective);
        set({ duration: dur, words: ws });
      });

      audio.addEventListener('timeupdate', () => {
        const t = audio.currentTime;
        const ws = get().words;
        let idx = -1;
        for (let i = 0; i < ws.length; i++) {
          if (t >= ws[i].start && t < ws[i].end) { idx = i; break; }
          if (t < ws[i].start) break;
        }
        if (idx === -1 && ws.length && t >= ws[ws.length - 1].end) idx = ws.length - 1;
        set({ position: t, activeWordIndex: idx });
      });

      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(objectUrl);
        set({
          activeId: null, status: 'idle', text: '', position: 0, duration: 0,
          audio: null, words: [], activeWordIndex: -1,
        });
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        // Don't bother the user — switch to browser TTS silently.
        speakWithBrowser();
      });

      audio.src = objectUrl;
      set({ status: 'playing' });
      await audio.play().catch(() => speakWithBrowser());
    } catch (err: any) {
      console.warn('[useTtsPlayback]', err);
      // Last-resort silent fallback to browser TTS.
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(cleanText);
          utter.rate = get().speed || 1;
          utter.onend = () => set({
            activeId: null, status: 'idle', text: '', position: 0, duration: 0,
            audio: null, words: [], activeWordIndex: -1,
          });
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
          set({ status: 'playing' });
          return;
        }
      } catch { /* ignore */ }
      set({
        activeId: null, status: 'idle', text: '',
        audio: null, words: [], activeWordIndex: -1,
      });
    }
  },
}));

