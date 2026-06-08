import { useEffect, useRef, useState } from 'react';
import { cineshootApi, type CineshootJob } from '@/services/cineshootApi';

export interface UseCineshootJobResult {
  job: CineshootJob | null;
  isPolling: boolean;
  error: string | null;
}

/**
 * Polls cineshoot-status until the job is terminal.
 * Backoff: starts at 4s, grows to 8s, with a hard timeout of 8 minutes.
 */
export function useCineshootJob(
  jobId: string | null,
  onTerminal?: (job: CineshootJob) => void
): UseCineshootJobResult {
  const [job, setJob] = useState<CineshootJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const cbRef = useRef(onTerminal);
  cbRef.current = onTerminal;

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let interval = 4000;
    const started = Date.now();
    const HARD_TIMEOUT_MS = 8 * 60 * 1000;

    setIsPolling(true);
    setError(null);
    setJob(null);

    const tick = async () => {
      if (cancelled) return;
      try {
        const snap = await cineshootApi.getJobStatus(jobId);
        if (cancelled) return;
        setJob(snap);

        if (snap.status === 'completed' || snap.status === 'failed') {
          setIsPolling(false);
          cbRef.current?.(snap);
          return;
        }

        if (Date.now() - started > HARD_TIMEOUT_MS) {
          setError('Render is taking longer than expected. Check History in a few minutes.');
          setIsPolling(false);
          return;
        }

        interval = Math.min(8000, interval + 500);
        timer = setTimeout(tick, interval);
      } catch (e: any) {
        if (cancelled) return;
        // Network/transient errors: keep polling
        interval = Math.min(10000, interval + 1000);
        timer = setTimeout(tick, interval);
      }
    };

    timer = setTimeout(tick, 1500);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      setIsPolling(false);
    };
  }, [jobId]);

  return { job, isPolling, error };
}
