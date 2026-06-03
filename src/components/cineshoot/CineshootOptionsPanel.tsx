import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown, Lock, Check, Square, RectangleHorizontal, RectangleVertical,
  Clock, Sparkles, Volume2, VolumeX, Crop, MonitorPlay,
} from 'lucide-react';
import type { CineshootModel, VideoAspect, VideoResolution } from './cineshootModels';
import { resolutionOptions } from './cineshootModels';

interface Props {
  model: CineshootModel;
  aspect: VideoAspect;
  onAspectChange: (v: VideoAspect) => void;
  resolution: VideoResolution;
  onResolutionChange: (v: VideoResolution) => void;
  duration: number;
  onDurationChange: (v: number) => void;
  sound: boolean;
  onSoundChange: (v: boolean) => void;
  isProPlus: boolean;
  onUpgrade: () => void;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1.5 mb-2">
    <span className="w-1 h-1 rounded-full bg-primary/70" />
    <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-foreground/70">{children}</p>
  </div>
);

const SegBtn: React.FC<{ active: boolean; locked?: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, locked, onClick, children }) => (
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

const Dropdown: React.FC<{
  value: string; label: string;
  options: { value: string; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  onChange: (v: string) => void;
  leadingIcon?: React.ComponentType<{ className?: string }>;
}> = ({ value, label, options, onChange, leadingIcon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  const current = options.find(o => o.value === value);
  const LeadIcon = leadingIcon || current?.icon || Crop;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full h-10 px-3 rounded-xl border bg-card/60 flex items-center justify-between gap-2 text-[12.5px] transition-all duration-200',
          open ? 'border-primary/50 ring-1 ring-primary/20 bg-card' : 'border-border/60 hover:border-primary/30 hover:bg-card'
        )}
      >
        <span className="flex items-center gap-2 truncate text-foreground">
          <span className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md border border-border/50 transition-colors',
            open ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted/40 text-muted-foreground'
          )}>
            <LeadIcon className="w-3.5 h-3.5" />
          </span>
          <span className="truncate font-medium">{current?.label || label}</span>
        </span>
        <ChevronDown className={cn('w-4 h-4 transition-all duration-200', open ? 'rotate-180 text-primary' : 'text-muted-foreground')} />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-2xl border border-border/80 bg-popover shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1.5">
            {options.map(opt => {
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
                  {selected && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary" />}
                  <span className="flex items-center gap-2.5">
                    {Icon && <Icon className={cn('w-3.5 h-3.5', selected ? 'text-primary' : 'text-muted-foreground')} />}
                    <span className="font-medium">{opt.label}</span>
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

const aspectIcon = (v: VideoAspect) => v === '1:1' ? Square : v === '9:16' ? RectangleVertical : RectangleHorizontal;

const CineshootOptionsPanel: React.FC<Props> = ({
  model, aspect, onAspectChange, resolution, onResolutionChange,
  duration, onDurationChange, sound, onSoundChange, isProPlus, onUpgrade,
}) => {
  const resOptions = resolutionOptions(model);

  const handleRes = (r: VideoResolution) => {
    if ((r === '2K' || r === '4K') && !isProPlus) { onUpgrade(); return; }
    onResolutionChange(r);
  };

  const aspectOpts = [
    { value: '16:9', label: '16:9 (Common Landscape)', icon: RectangleHorizontal },
    { value: '9:16', label: '9:16 (Vertical / Shorts)', icon: RectangleVertical },
    { value: '1:1', label: '1:1 (Square)', icon: Square },
  ];

  const durationOpts = model.durations.map(d => ({ value: String(d), label: `${d}s`, icon: Clock }));

  const [mobileOpen, setMobileOpen] = useState(false);
  const summary = `${aspect} · ${duration}s · ${resolution}${sound && model.supportsSound ? ' · 🔊' : ''}`;

  const Body = (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label>Aspect Ratio</Label>
          <Dropdown
            value={aspect}
            label="Aspect"
            options={aspectOpts}
            leadingIcon={aspectIcon(aspect)}
            onChange={v => onAspectChange(v as VideoAspect)}
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Dropdown
            value={String(duration)}
            label="Duration"
            options={durationOpts}
            leadingIcon={Clock}
            onChange={v => onDurationChange(Number(v))}
          />
        </div>
      </div>

      <div>
        <Label>Resolution</Label>
        <div className="flex gap-2 flex-wrap">
          {(['720p', '1080p', '2K', '4K'] as VideoResolution[]).map(r => {
            const available = resOptions.includes(r);
            const locked = (r === '2K' || r === '4K') && !isProPlus;
            return (
              <SegBtn
                key={r}
                active={resolution === r}
                locked={locked || !available}
                onClick={() => {
                  if (!available) { /* model doesn't support */ return; }
                  handleRes(r);
                }}
              >
                {(r === '2K' || r === '4K') && <Sparkles className="w-3 h-3" />}
                <span className="font-semibold">{r}</span>
              </SegBtn>
            );
          })}
        </div>
        {!resOptions.includes('4K') && (
          <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">Max for this model: {model.maxResolution}</p>
        )}
      </div>

      {model.supportsSound && (
        <div>
          <Label>Include Sound</Label>
          <button
            onClick={() => onSoundChange(!sound)}
            className={cn(
              'w-full h-11 rounded-xl border flex items-center justify-between px-3.5 transition-all',
              sound ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border/60 bg-card/60 text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="flex items-center gap-2 text-[13px] font-medium">
              {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {sound ? 'Native audio enabled' : 'Silent video'}
            </span>
            <span className={cn(
              'w-9 h-5 rounded-full relative transition-colors',
              sound ? 'bg-primary' : 'bg-muted'
            )}>
              <span className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-all',
                sound ? 'left-[18px]' : 'left-0.5'
              )} />
            </span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="relative w-full rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-3.5 sm:p-5 shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)] hidden sm:block">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {Body}
      </div>
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          className="w-full flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/60 px-3.5 py-2.5"
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary">
              <MonitorPlay className="w-3.5 h-3.5" />
            </span>
            <span className="flex flex-col min-w-0 text-left">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Video settings</span>
              <span className="text-[12.5px] font-medium text-foreground truncate">{summary}</span>
            </span>
          </span>
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', mobileOpen && 'rotate-180')} />
        </button>
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-[140] bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="fixed inset-x-0 bottom-0 z-[150] rounded-t-3xl border-t border-border bg-card p-4 pb-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
              {Body}
              <button
                onClick={() => setMobileOpen(false)}
                className="mt-4 w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CineshootOptionsPanel;
