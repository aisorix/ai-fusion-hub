// Voice dictation: MediaRecorder + OpenAI Whisper via edge function.
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DictationStatus = 'idle' | 'recording' | 'transcribing' | 'error';

interface UseVoiceDictationOptions {
  onTranscript: (text: string) => void;
  language?: string; // e.g. 'en', 'bn'
  maxSeconds?: number;
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

  const start = useCallback(async () => {
    if (status === 'recording' || status === 'transcribing') return;
    setError(null);
    cancelledRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const wasCancelled = cancelledRef.current;
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        cleanup();
        if (wasCancelled || blob.size < 1200) {
          setStatus('idle');
          setElapsed(0);
          return;
        }
        setStatus('transcribing');
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          if (!accessToken) throw new Error('Not authenticated');

          const form = new FormData();
          const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('ogg') ? 'ogg' : 'mp4';
          form.append('file', blob, `voice.${ext}`);
          if (language) form.append('language', language);

          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stt-transcribe`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: form,
          });
          if (!res.ok) throw new Error(`STT failed: ${res.status}`);
          const json = await res.json();
          const text = (json.text || '').trim();
          if (text) onTranscript(text);
          setStatus('idle');
          setElapsed(0);
        } catch (err: any) {
          console.error('[useVoiceDictation]', err);
          setError(err?.message || 'Transcription failed');
          setStatus('error');
          setTimeout(() => setStatus('idle'), 1500);
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
      setError(err?.message || 'Microphone access denied');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
      cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, language, maxSeconds, onTranscript, cleanup]);

  const stop = useCallback(() => {
    const r = mediaRecorderRef.current;
    if (r && r.state !== 'inactive') {
      try { r.stop(); } catch {}
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    stop();
  }, [stop]);

  return { status, volumeLevel, elapsed, error, start, stop, cancel };
}
