import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';

interface FlowPromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const FlowPromptBar: React.FC<FlowPromptBarProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim());
    setPrompt('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = prompt.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={cn(
        'relative flex flex-col rounded-3xl border transition-all duration-200',
        'bg-muted/40 border-border/50',
        'focus-within:border-primary/40 focus-within:bg-muted/60',
        'shadow-sm px-2 sm:px-3 pt-1 pb-1.5'
      )}>
        <TextareaAutosize
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your diagram... e.g. 'User authentication flowchart'"
          disabled={isGenerating}
          minRows={1}
          maxRows={6}
          className={cn(
            'w-full px-2 sm:px-3 pt-2.5 pb-1 bg-transparent resize-none focus:outline-none',
            'text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground/70',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        <div className="flex items-center justify-end gap-1 mt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasContent || isGenerating}
            className={cn(
              'p-2 sm:p-2.5 rounded-full transition-all duration-200',
              hasContent
                ? 'bg-foreground text-background hover:opacity-90'
                : 'bg-muted text-muted-foreground opacity-50',
              'disabled:opacity-30 disabled:cursor-not-allowed'
            )}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowPromptBar;
