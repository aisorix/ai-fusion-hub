import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Lock, Square, Check } from 'lucide-react';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9';
export type Resolution = '1K' | '2K' | '4K';
export type OutputFormat = 'webp' | 'png' | 'jpg';
export type OutputCount = 1 | 2 | 3 | 4;

export const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Common Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '4:3', label: '4:3 (Classic)' },
  { value: '3:4', label: '3:4 (Tall)' },
  { value: '3:2', label: '3:2 (Photo)' },
  { value: '2:3', label: '2:3 (Poster)' },
  { value: '21:9', label: '21:9 (Ultrawide)' },
];

interface Props {
  aspect: AspectRatio;
  onAspectChange: (v: AspectRatio) => void;
  resolution: Resolution;
  onResolutionChange: (v: Resolution) => void;
  format: OutputFormat;
  onFormatChange: (v: OutputFormat) => void;
  count: OutputCount;
  onCountChange: (v: OutputCount) => void;
  isProPlus: boolean;
  onUpgrade: () => void;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[11px] font-semibold text-foreground/80 mb-1.5">{children}</p>
);

const SegBtn: React.FC<{
  active: boolean;
  locked?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, locked, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex-1 h-9 px-3 rounded-lg border text-[12.5px] font-medium transition-all flex items-center justify-center gap-1.5',
      active
        ? 'bg-primary/10 border-primary/40 text-primary shadow-sm'
        : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
    )}
  >
    {children}
    {locked && <Lock className="w-3 h-3" />}
  </button>
);

const Dropdown: React.FC<{
  value: string;
  label: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}> = ({ value, label, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full h-9 px-3 rounded-lg border bg-card flex items-center justify-between gap-2 text-[12.5px] transition-colors',
          open ? 'border-primary/40' : 'border-border/60 hover:border-border'
        )}
      >
        <span className="flex items-center gap-2 truncate text-foreground">
          <Square className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="truncate">{current?.label || label}</span>
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 rounded-xl border border-border/60 bg-popover shadow-2xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-[12.5px] text-left transition-colors',
                  opt.value === value ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60 text-foreground'
                )}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ImagineOptionsPanel: React.FC<Props> = ({
  aspect, onAspectChange,
  resolution, onResolutionChange,
  format, onFormatChange,
  count, onCountChange,
  isProPlus, onUpgrade,
}) => {
  const handleRes = (r: Resolution) => {
    if ((r === '2K' || r === '4K') && !isProPlus) { onUpgrade(); return; }
    onResolutionChange(r);
  };
  const handleCount = (c: OutputCount) => {
    if ((c === 3 || c === 4) && !isProPlus) { onUpgrade(); return; }
    onCountChange(c);
  };

  return (
    <div className="w-full rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 space-y-4">
      {/* Row 1: Aspect + Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Aspect Ratio</Label>
          <Dropdown
            value={aspect}
            label="Select aspect"
            options={ASPECT_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            onChange={(v) => onAspectChange(v as AspectRatio)}
          />
        </div>
        <div>
          <Label>Output Format</Label>
          <Dropdown
            value={format}
            label="Format"
            options={[
              { value: 'webp', label: 'webp' },
              { value: 'png', label: 'png' },
              { value: 'jpg', label: 'jpg' },
            ]}
            onChange={(v) => onFormatChange(v as OutputFormat)}
          />
        </div>
      </div>

      {/* Row 2: Resolution */}
      <div>
        <Label>Resolution</Label>
        <div className="flex gap-2">
          {(['1K', '2K', '4K'] as Resolution[]).map((r) => (
            <SegBtn
              key={r}
              active={resolution === r}
              locked={(r === '2K' || r === '4K') && !isProPlus}
              onClick={() => handleRes(r)}
            >
              {r}
            </SegBtn>
          ))}
        </div>
      </div>

      {/* Row 3: Number of Outputs */}
      <div>
        <Label>Number of Outputs</Label>
        <div className="flex gap-2">
          {([1, 2, 3, 4] as OutputCount[]).map((c) => (
            <SegBtn
              key={c}
              active={count === c}
              locked={(c === 3 || c === 4) && !isProPlus}
              onClick={() => handleCount(c)}
            >
              {c}
            </SegBtn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagineOptionsPanel;
