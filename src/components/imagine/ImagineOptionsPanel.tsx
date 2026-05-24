import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Lock,
  Check,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Image as ImageIcon,
  FileImage,
  Sparkles,
  LayoutGrid,
  Grid2x2,
  Dot,
  Crop,
} from 'lucide-react';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9';
export type Resolution = '1K' | '2K' | '4K';
export type OutputFormat = 'webp' | 'png' | 'jpg';
export type OutputCount = 1 | 2 | 3 | 4;

export const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '4:3', label: '4:3 (Classic)' },
  { value: '3:4', label: '3:4 (Tall)' },
  { value: '3:2', label: '3:2 (Photo)' },
  { value: '2:3', label: '2:3 (Poster)' },
  { value: '21:9', label: '21:9 (Ultrawide)' },
];

const aspectIcon = (v: AspectRatio) => {
  if (v === '1:1') return Square;
  if (v === '9:16' || v === '3:4' || v === '2:3') return RectangleVertical;
  return RectangleHorizontal;
};

const formatIcon = (v: OutputFormat) => (v === 'jpg' ? FileImage : ImageIcon);

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
  <div className="flex items-center gap-1.5 mb-2">
    <span className="w-1 h-1 rounded-full bg-primary/70" />
    <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-foreground/70">
      {children}
    </p>
  </div>
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
      'relative flex-1 h-10 px-3 rounded-xl border text-[12.5px] font-medium transition-all duration-200 flex items-center justify-center gap-1.5',
      active
        ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-primary/50 text-primary ring-1 ring-primary/20 shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.35)]'
        : 'bg-card/60 border-border/60 text-muted-foreground hover:text-foreground hover:bg-card hover:border-primary/30'
    )}
  >
    <span className="flex items-center gap-1.5">{children}</span>
    {locked && (
      <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-background/80 backdrop-blur border border-border/60">
        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
      </span>
    )}
  </button>
);

type DropOpt = { value: string; label: string; icon?: React.ComponentType<{ className?: string }>; tag?: string };

const Dropdown: React.FC<{
  value: string;
  label: string;
  options: DropOpt[];
  onChange: (v: string) => void;
  leadingIcon?: React.ComponentType<{ className?: string }>;
}> = ({ value, label, options, onChange, leadingIcon }) => {
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
  const LeadIcon = leadingIcon || current?.icon || Crop;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full h-10 px-3 rounded-xl border bg-card/60 flex items-center justify-between gap-2 text-[12.5px] transition-all duration-200',
          open
            ? 'border-primary/50 ring-1 ring-primary/20 bg-card shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.25)]'
            : 'border-border/60 hover:border-primary/30 hover:bg-card'
        )}
      >
        <span className="flex items-center gap-2 truncate text-foreground">
          <span
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded-md border border-border/50 transition-colors',
              open ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted/40 text-muted-foreground'
            )}
          >
            <LeadIcon className="w-3.5 h-3.5" />
          </span>
          <span className="truncate font-medium">{current?.label || label}</span>
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-all duration-200',
            open ? 'rotate-180 text-primary' : 'text-muted-foreground'
          )}
        />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-2xl border border-border/80 bg-popover shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    'relative w-full flex items-center justify-between pl-4 pr-3 py-2 text-[12.5px] text-left transition-colors',
                    selected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60 text-foreground'
                  )}
                >
                  {selected && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <span className="flex items-center gap-2.5">
                    {Icon && (
                      <Icon className={cn('w-3.5 h-3.5', selected ? 'text-primary' : 'text-muted-foreground')} />
                    )}
                    <span className="font-medium">{opt.label}</span>
                    {opt.tag && (
                      <span className="text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {opt.tag}
                      </span>
                    )}
                  </span>
                  {selected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
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

  const aspectOptions: DropOpt[] = ASPECT_OPTIONS.map(o => ({
    value: o.value,
    label: o.label,
    icon: aspectIcon(o.value),
  }));

  const formatOptions: DropOpt[] = [
    { value: 'webp', label: 'WebP', icon: ImageIcon, tag: 'Recommended' },
    { value: 'png', label: 'PNG', icon: ImageIcon },
    { value: 'jpg', label: 'JPG', icon: FileImage },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 sm:p-5 space-y-4 shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Row 1: Aspect + Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Aspect Ratio</Label>
          <Dropdown
            value={aspect}
            label="Select aspect"
            options={aspectOptions}
            leadingIcon={aspectIcon(aspect)}
            onChange={(v) => onAspectChange(v as AspectRatio)}
          />
        </div>
        <div>
          <Label>Output Format</Label>
          <Dropdown
            value={format}
            label="Format"
            options={formatOptions}
            leadingIcon={formatIcon(format)}
            onChange={(v) => onFormatChange(v as OutputFormat)}
          />
        </div>
      </div>

      {/* Row 2: Resolution */}
      <div>
        <Label>Resolution</Label>
        <div className="flex gap-2">
          {(['1K', '2K', '4K'] as Resolution[]).map((r) => {
            const locked = (r === '2K' || r === '4K') && !isProPlus;
            return (
              <SegBtn
                key={r}
                active={resolution === r}
                locked={locked}
                onClick={() => handleRes(r)}
              >
                {(r === '2K' || r === '4K') && <Sparkles className="w-3 h-3" />}
                <span className="font-semibold">{r}</span>
              </SegBtn>
            );
          })}
        </div>
      </div>

      {/* Row 3: Number of Outputs */}
      <div>
        <Label>Number of Outputs</Label>
        <div className="flex gap-2">
          {([1, 2, 3, 4] as OutputCount[]).map((c) => {
            const locked = (c === 3 || c === 4) && !isProPlus;
            const Icon = c === 1 ? Dot : c === 2 ? Grid2x2 : LayoutGrid;
            return (
              <SegBtn
                key={c}
                active={count === c}
                locked={locked}
                onClick={() => handleCount(c)}
              >
                <Icon className={cn('w-3.5 h-3.5', c === 1 && 'w-4 h-4 -mx-1')} />
                <span className="font-semibold">{c}</span>
              </SegBtn>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImagineOptionsPanel;
