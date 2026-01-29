// Window Model Selector Stub
// For multi-window chat mode

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

interface WindowModelSelectorProps {
  windowId: string;
  currentModelId?: string;
}

const WindowModelSelector = ({ windowId, currentModelId }: WindowModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { chatWindows, setWindowModel, models, isModelLocked } = useChatStore();
  
  const window = chatWindows.find(w => w.id === windowId);
  const modelId = currentModelId || window?.modelId;
  const currentModel = models.find(m => m.id === modelId) || models[0];
  
  const availableModels = models.filter(m => !isModelLocked(m.id));
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200',
          'bg-muted/50 hover:bg-muted text-sm'
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium truncate max-w-[100px]">{currentModel.name}</span>
        <ChevronDown className={cn(
          'w-3 h-3 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-50 w-48 rounded-lg bg-popover border border-border shadow-lg overflow-hidden">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setWindowModel(windowId, model.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm transition-colors',
                  modelId === model.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                )}
              >
                {model.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WindowModelSelector;
