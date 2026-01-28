import React from 'react';
import { Stethoscope, HeartPulse, FileText, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const analysisTypes = [
  { 
    id: 'general', 
    label: 'General Health', 
    icon: HeartPulse,
    description: 'General health questions and advice'
  },
  { 
    id: 'prescription', 
    label: 'Prescription Analysis', 
    icon: FileText,
    description: 'Analyze medication prescriptions'
  },
  { 
    id: 'lab_report', 
    label: 'Lab Report', 
    icon: Stethoscope,
    description: 'Interpret lab test results'
  },
  { 
    id: 'veterinary', 
    label: 'Veterinary', 
    icon: PawPrint,
    description: 'Pet health analysis'
  },
] as const;

export const HealthModeToggle: React.FC = () => {
  const { isHealthMode, healthAnalysisType, setHealthMode, setHealthAnalysisType } = useChatStore();

  const currentType = analysisTypes.find(t => t.id === healthAnalysisType) || analysisTypes[0];
  const CurrentIcon = currentType.icon;

  if (!isHealthMode) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setHealthMode(true)}
        className="gap-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
      >
        <Stethoscope className="h-4 w-4" />
        <span className="hidden sm:inline">Health Mode</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentType.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          Health Mode Active
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            onClick={() => setHealthMode(false)}
          >
            Disable
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          return (
            <DropdownMenuItem
              key={type.id}
              onClick={() => setHealthAnalysisType(type.id)}
              className={cn(
                'flex items-start gap-3 p-3 cursor-pointer',
                healthAnalysisType === type.id && 'bg-emerald-500/10'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 mt-0.5',
                healthAnalysisType === type.id ? 'text-emerald-500' : 'text-muted-foreground'
              )} />
              <div>
                <div className="font-medium">{type.label}</div>
                <div className="text-xs text-muted-foreground">{type.description}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
