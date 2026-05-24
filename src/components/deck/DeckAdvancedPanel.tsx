import React, { useState } from 'react';
import { ChevronDown, LayoutTemplate, Frame, Users, MessageSquare, Sparkles, Briefcase, PencilLine } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import DeckFormatPicker, { type DeckFormat } from './DeckFormatPicker';
import DeckAspectRatioPicker, { type DeckAspectRatio } from './DeckAspectRatioPicker';
import DeckDropdown from './DeckDropdown';

export type DeckCardSize = 'default' | 'traditional' | 'tall';
export type DeckScenario = 'auto' | 'teaching' | 'work-summary' | 'work-plan' | 'project-report' | 'solution' | 'research-report' | 'general';
export type DeckAudience = 'auto' | 'students' | 'educator' | 'manager' | 'direct-report' | 'colleague';
export type DeckTone = 'neutral' | 'professional' | 'educational' | 'casual' | 'friendly' | 'inspirational' | 'humorous';

export interface DeckAdvancedValues {
  format: DeckFormat;
  cardSize: DeckCardSize;
  scenario: DeckScenario;
  audience: DeckAudience;
  tone: DeckTone;
  aspectRatio: DeckAspectRatio;
  additionalInstructions: string;
}

interface Props {
  values: DeckAdvancedValues;
  onChange: (patch: Partial<DeckAdvancedValues>) => void;
}

const CARD_SIZE_OPTS = [
  { id: 'default' as const, label: 'Default', hint: 'Fluid' },
  { id: 'traditional' as const, label: 'Traditional', hint: '16:9' },
  { id: 'tall' as const, label: 'Tall', hint: '4:3' },
];

const SCENARIO_OPTS = [
  { id: 'general' as const, label: 'General' },
  { id: 'auto' as const, label: 'Auto' },
  { id: 'teaching' as const, label: 'Teaching Courseware' },
  { id: 'work-summary' as const, label: 'Work Summary' },
  { id: 'work-plan' as const, label: 'Work Plan' },
  { id: 'project-report' as const, label: 'Project Report' },
  { id: 'solution' as const, label: 'Solution' },
  { id: 'research-report' as const, label: 'Research Report' },
];

const AUDIENCE_OPTS = [
  { id: 'auto' as const, label: 'Auto' },
  { id: 'students' as const, label: 'Students' },
  { id: 'educator' as const, label: 'Educator' },
  { id: 'manager' as const, label: 'Manager' },
  { id: 'direct-report' as const, label: 'Direct Report' },
  { id: 'colleague' as const, label: 'Colleague' },
];

const TONE_OPTS = [
  { id: 'neutral' as const, label: 'Neutral' },
  { id: 'professional' as const, label: 'Professional' },
  { id: 'educational' as const, label: 'Educational' },
  { id: 'casual' as const, label: 'Casual' },
  { id: 'friendly' as const, label: 'Friendly' },
  { id: 'inspirational' as const, label: 'Inspirational' },
  { id: 'humorous' as const, label: 'Humorous' },
];

const DeckAdvancedPanel: React.FC<Props> = ({ values, onChange }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card/60">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-2 px-3.5 sm:px-5 py-3"
      >
        <div className="flex items-center gap-2 min-w-0">
          <LayoutTemplate className="w-4 h-4 text-primary" />
          <h3 className="text-[14px] font-semibold text-foreground">Format</h3>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 sm:px-5 pb-4 space-y-4">
              <DeckFormatPicker value={values.format} onChange={(v) => onChange({ format: v })} />

              <DeckDropdown
                value={values.cardSize}
                options={CARD_SIZE_OPTS}
                onChange={(v) => onChange({ cardSize: v as DeckCardSize })}
                leadingIcon={<Frame className="w-4 h-4" />}
              />

              <div className="h-px bg-border/60" />

              <DeckDropdown
                label="Scenario"
                value={values.scenario}
                options={SCENARIO_OPTS}
                onChange={(v) => onChange({ scenario: v as DeckScenario })}
                leadingIcon={<Briefcase className="w-4 h-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DeckDropdown
                  label="Audience"
                  optional
                  value={values.audience}
                  options={AUDIENCE_OPTS}
                  onChange={(v) => onChange({ audience: v as DeckAudience })}
                  leadingIcon={<Users className="w-4 h-4" />}
                />
                <DeckDropdown
                  label="Tone"
                  value={values.tone}
                  options={TONE_OPTS}
                  onChange={(v) => onChange({ tone: v as DeckTone })}
                  leadingIcon={<MessageSquare className="w-4 h-4" />}
                />
              </div>

              <div>
                <div className="mb-1.5 text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Aspect Ratio
                </div>
                <DeckAspectRatioPicker value={values.aspectRatio} onChange={(v) => onChange({ aspectRatio: v })} />
              </div>

              <div>
                <div className="mb-1.5 text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <PencilLine className="w-3.5 h-3.5 text-primary" />
                  Additional instructions <span className="text-muted-foreground/60">(Optional)</span>
                </div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  value={values.additionalInstructions}
                  onChange={(e) => onChange({ additionalInstructions: e.target.value })}
                  placeholder="Add any additional requirements to make AI results better match your needs."
                  className="w-full resize-none rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckAdvancedPanel;
