import React, { useState, useEffect, useRef } from 'react';

interface AnalysisTimerProps {
  isActive: boolean;
}

const AnalysisTimer: React.FC<AnalysisTimerProps> = ({ isActive }) => {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }
    startRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 100) / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <span className="text-xs font-mono text-muted-foreground tabular-nums">
      {elapsed.toFixed(1)}s
    </span>
  );
};

export default AnalysisTimer;
