import React from 'react';
import { 
  Stethoscope, 
  FileText, 
  HeartPulse, 
  PawPrint, 
  ShieldCheck,
  Clock,
  Languages,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chatStore';

const features = [
  {
    icon: HeartPulse,
    title: 'General Health Advice',
    description: 'Get guidance on symptoms, wellness tips, and health information',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: FileText,
    title: 'Prescription Analysis',
    description: 'Understand your medications, dosages, and potential interactions',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Stethoscope,
    title: 'Lab Report Interpretation',
    description: 'Get clear explanations of your blood tests and medical reports',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: PawPrint,
    title: 'Veterinary Support',
    description: 'Health advice for your pets and animals',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    description: 'Your health data is never stored or shared',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Languages,
    title: 'Multilingual Support',
    description: 'Available in English and Bengali for local accessibility',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
];

interface HealthFeaturesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HealthFeaturesModal: React.FC<HealthFeaturesModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { setHealthMode } = useChatStore();

  const handleEnable = () => {
    setHealthMode(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-emerald-500" />
            </div>
            Sorix Health Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Enable Health Mode for specialized medical AI assistance. Get help understanding 
            prescriptions, lab reports, and general health questions.
          </p>

          <div className="grid gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <p className="text-xs">
              <strong>Disclaimer:</strong> This is not a substitute for professional medical advice. 
              Always consult a healthcare provider for medical concerns.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              onClick={handleEnable}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Enable Health Mode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
