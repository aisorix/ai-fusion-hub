import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DeckDropdownOption<T extends string = string> {
  id: T;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
}

interface Props<T extends string = string> {
  label?: string;
  optional?: boolean;
  value: T;
  options: DeckDropdownOption<T>[];
  onChange: (v: T) => void;
  leadingIcon?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

function DeckDropdown<T extends string = string>({
  label, optional, value, options, onChange, leadingIcon, placeholder, className,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {label && (
        <div className="mb-1.5 text-[12px] font-medium text-muted-foreground">
          {label}{optional && <span className="text-muted-foreground/60"> (Optional)</span>}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full inline-flex items-center justify-between gap-2 h-10 px-3 rounded-xl border bg-card/60 transition-colors text-[13px]',
          open ? 'border-primary/60 bg-card' : 'border-border/60 hover:bg-card hover:border-border'
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          {leadingIcon && <span className="text-primary shrink-0">{leadingIcon}</span>}
          <span className={cn('truncate font-medium', current ? 'text-foreground' : 'text-muted-foreground')}>
            {current?.label ?? placeholder ?? 'Select'}
          </span>
          {current?.hint && (
            <span className="text-[11px] text-muted-foreground shrink-0">{current.hint}</span>
          )}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl z-[120] py-1"
          >
            {options.map((o) => {
              const active = o.id === value;
              return (
                <button
                  key={o.id}
                  onClick={() => { onChange(o.id); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors',
                    active ? 'text-primary bg-primary/5' : 'text-foreground hover:bg-muted'
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {o.icon && <span className="shrink-0">{o.icon}</span>}
                    <span className="truncate">{o.label}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    {o.hint && <span className="text-[11px] text-muted-foreground">{o.hint}</span>}
                    {active && <Check className="w-3.5 h-3.5 text-primary" />}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DeckDropdown;
