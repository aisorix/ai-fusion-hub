import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  pitch: number;
  rate: number;
  color: string;
}

export const voicePersonas: VoicePersona[] = [
  {
    id: 'sky',
    name: 'Sky',
    description: 'Calm and clear voice',
    pitch: 1.1,
    rate: 1.0,
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Warm and friendly tone',
    pitch: 0.9,
    rate: 0.95,
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    description: 'Deep and professional',
    pitch: 0.8,
    rate: 0.9,
    color: 'from-slate-400 to-slate-600',
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Energetic and upbeat',
    pitch: 1.2,
    rate: 1.1,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Thoughtful and measured',
    pitch: 1.0,
    rate: 0.85,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'echo',
    name: 'Echo',
    description: 'Neutral and versatile',
    pitch: 1.0,
    rate: 1.0,
    color: 'from-gray-400 to-gray-500',
  },
];

interface VoicePersonaSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPersona: string;
  onSelect: (persona: VoicePersona) => void;
}

export const VoicePersonaSelector: React.FC<VoicePersonaSelectorProps> = ({
  open,
  onOpenChange,
  selectedPersona,
  onSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choose Voice Persona
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {voicePersonas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                onSelect(persona);
                onOpenChange(false);
              }}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all',
                selectedPersona === persona.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              {selectedPersona === persona.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  'w-10 h-10 rounded-full bg-gradient-to-br mb-3',
                  persona.color
                )}
              />

              <h4 className="font-semibold text-sm">{persona.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {persona.description}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
