import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Slide } from '@/services/deckApi';

type Layout = Slide['layout'];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onGenerate: (prompt: string, layout: Layout) => Promise<void> | void;
}

const LAYOUTS: { id: Layout; label: string; hint: string }[] = [
  { id: 'split',      label: 'Split',      hint: 'Text + image' },
  { id: 'text-only',  label: 'Text only',  hint: 'Heading + bullets' },
  { id: 'full-image', label: 'Full image', hint: 'Hero visual' },
];

const DeckAiSlidePromptDialog: React.FC<Props> = ({ open, onOpenChange, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [layout, setLayout] = useState<Layout>('split');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    try {
      await onGenerate(prompt.trim(), layout);
      setPrompt('');
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4 text-primary" />
            Add slide with AI
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Describe what this slide should cover — heading, bullets, and a matching image are generated for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <TextareaAutosize
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A slide about how AI improves customer onboarding..."
            minRows={3}
            maxRows={6}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
            }}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none"
            autoFocus
          />

          <div>
            <div className="text-[11px] font-medium text-muted-foreground mb-1.5">Layout</div>
            <div className="grid grid-cols-3 gap-1.5">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={cn(
                    'flex flex-col items-start text-left rounded-lg border px-2.5 py-2 transition-colors',
                    layout === l.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-foreground hover:bg-muted',
                  )}
                >
                  <span className="text-[12px] font-semibold">{l.label}</span>
                  <span className="text-[10px] text-muted-foreground">{l.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!prompt.trim() || busy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12.5px] font-medium disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Generate slide
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeckAiSlidePromptDialog;
