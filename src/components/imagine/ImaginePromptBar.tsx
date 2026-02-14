import React, { useState } from 'react';
import { Send, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const ImaginePromptBar: React.FC<Props> = ({ onGenerate, isGenerating, disabled }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating || disabled) return;
    onGenerate(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative flex items-end gap-2 rounded-2xl border transition-all duration-300',
          'bg-card/80 backdrop-blur-sm',
          isGenerating
            ? 'border-primary/30 shadow-lg shadow-primary/5'
            : 'border-border/50 focus-within:border-primary/40 focus-within:shadow-lg focus-within:shadow-primary/5'
        )}
      >
        <div className="flex-1 flex items-end gap-2 px-4 py-3">
          <Wand2 className="w-4 h-4 text-primary shrink-0 mb-1" />
          <TextareaAutosize
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to create..."
            disabled={isGenerating || disabled}
            maxRows={4}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating || disabled}
          className={cn(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mr-2 mb-1.5 transition-all',
            prompt.trim() && !isGenerating && !disabled
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ImaginePromptBar;
