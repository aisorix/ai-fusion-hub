import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-end gap-2 bg-muted/40 border border-border/60 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-violet-500/30 transition-all">
        <TextareaAutosize
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your diagram... e.g. 'User authentication flowchart'"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 resize-none"
          disabled={isGenerating}
          minRows={1}
          maxRows={5}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
          className="shrink-0 w-8 h-8 mb-0.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default FlowPromptBar;
