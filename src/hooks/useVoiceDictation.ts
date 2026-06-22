// Voice dictation: MediaRecorder + OpenAI Whisper via edge function.
// Robust on iOS Safari (audio/mp4 fallback) with user-facing error toasts.
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DictationStatus = 'idle' | 'recording' | 'transcribing' | 'error';

interface UseVoiceDictationOptions {
  onTranscript: (text: string) => void;
  language?: string;
  maxSeconds?: number;
}

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4;codecs=mp4a.40.2',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

function pickMime(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  for (const c of MIME_CANDIDATES) {
    try { if (MediaRecorder.isTypeSupported(c)) return c; } catch {}
  }
  return '';
}

export function useVoiceDictation({ onTranscript, language, maxSeconds = 60 }: UseVoiceDictationOptions) {
  const [status, setStatus] = useState<DictationStatus>('idle');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setVolumeLevel(0);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const stop = useCallback(() => {
    const r = mediaRecorderRef.current;
    if (r && r.state !== 'inactive') {
      try { r.stop(); } catch {}
    }
  }, []);

  const start = useCallback(async () => {
    if (status === 'recording' || status === 'transcribing') return;
    setError(null);
    cancelledRef.current = false;

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      toast.error('Microphone not supported in this browser');
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      toast.error('Voice recording is not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const mime = pickMime();
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      } catch {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const wasCancelled = cancelledRef.current;
        const mimeType = recorder.mimeType || mime || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        cleanup();
        if (wasCancelled || blob.size < 600) {
          setStatus('idle');
          setElapsed(0);
          return;
        }
        setStatus('transcribing');
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          if (!accessToken) throw new Error('Please sign in to use voice');

          const form = new FormData();
          const ext = mimeType.includes('mp4') ? 'm4a'
            : mimeType.includes('ogg') ? 'ogg'
            : mimeType.includes('webm') ? 'webm'
            : 'webm';
          form.append('file', blob, `voice.${ext}`);
          if (language) form.append('language', language);

          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stt-transcribe`;
          let res: Response;
          try {
            res = await fetch(url, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
              body: form,
            });
          } catch {
            // Network failure — quiet, just reset state.
            toast.message("Network hiccup — couldn't reach voice service");
            setStatus('idle');
            setElapsed(0);
            return;
          }

          let json: any = {};
          try { json = await res.json(); } catch { /* */ }

          if (!res.ok || json?.fallback) {
            // Premium STT unavailable — no scary error; just nudge user.
            toast.message("Voice transcription is busy — please type or try again");
            setStatus('idle');
            setElapsed(0);
            return;
          }

          const text = (json.text || '').trim();
          if (text) {
            onTranscript(text);
          } else {
            toast.message("Didn't catch that — try again");
          }
          setStatus('idle');
          setElapsed(0);
        } catch (err: any) {
          console.warn('[useVoiceDictation] transcribe', err);
          toast.message("Voice transcription unavailable — please type instead");
          setError(err?.message || 'Transcription failed');
          setStatus('idle');
          setElapsed(0);
        }

      };

      // Volume meter
      try {
        const AC: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          setVolumeLevel(Math.min(1, rms * 2.5));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {/* no analyser */}

      startedAtRef.current = Date.now();
      setElapsed(0);
      timerRef.current = window.setInterval(() => {
        const s = Math.floor((Date.now() - startedAtRef.current) / 1000);
        setElapsed(s);
        if (s >= maxSeconds) stop();
      }, 250);

      recorder.start();
      setStatus('recording');
    } catch (err: any) {
      console.error('[useVoiceDictation] start', err);
      const name = err?.name || '';
      const msg = name === 'NotAllowedError'
        ? 'Microphone access denied. Please allow mic in browser settings.'
        : name === 'NotFoundError'
          ? 'No microphone detected'
          : err?.message || 'Could not start recording';
      toast.error(msg);
      setError(msg);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
      cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, language, maxSeconds, onTranscript, cleanup, stop]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    stop();
  }, [stop]);

  return { status, volumeLevel, elapsed, error, start, stop, cancel };
}
