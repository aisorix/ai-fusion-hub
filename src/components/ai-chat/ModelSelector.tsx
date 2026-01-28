import { useState } from 'react';
import { ChevronDown, Lock, Sparkles, Code, Search, Zap } from 'lucide-react';
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

const categoryIcons = {
  chat: Sparkles,
  code: Code,
  search: Search,
  system: Zap,
};

const categoryLabels = {
  chat: 'Chat Models',
  code: 'Code Models',
  search: 'Search Models',
  system: 'System Models',
};

export const ModelSelector = () => {
  const { models, selectedModel, setSelectedModel, isModelLocked, user } = useChatStore();

  const currentModel = models.find(m => m.id === selectedModel);
  const availableModels = models.filter(m => !isModelLocked(m.id));
  const lockedModels = models.filter(m => isModelLocked(m.id));

  const groupedAvailable = availableModels.reduce((acc, model) => {
    if (!acc[model.category]) acc[model.category] = [];
    acc[model.category].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  const groupedLocked = lockedModels.reduce((acc, model) => {
    if (!acc[model.category]) acc[model.category] = [];
    acc[model.category].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  const CurrentIcon = currentModel ? categoryIcons[currentModel.category] : Sparkles;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[160px] justify-between">
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4 text-primary" />
            <span className="truncate">{currentModel?.name || 'Select Model'}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Your Plan: <span className="text-primary capitalize">{user.plan}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Available Models by Category */}
        {Object.entries(groupedAvailable).map(([category, categoryModels]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <div key={category}>
              <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                <Icon className="h-3 w-3" />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </DropdownMenuLabel>
              {categoryModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer',
                    selectedModel === model.id && 'bg-primary/10'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                  {selectedModel === model.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          );
        })}

        {/* Locked Models */}
        {Object.keys(groupedLocked).length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Upgrade Required
            </DropdownMenuLabel>
            {Object.entries(groupedLocked).map(([category, categoryModels]) => (
              <div key={category}>
                {categoryModels.slice(0, 3).map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    disabled
                    className="flex items-center justify-between opacity-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {model.plans[0].charAt(0).toUpperCase() + model.plans[0].slice(1)}+ plan
                      </span>
                    </div>
                    <Lock className="h-3 w-3" />
                  </DropdownMenuItem>
                ))}
              </div>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
