import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface FlowPromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const FlowPromptBar: React.FC<FlowPromptBarProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim());
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2 bg-muted/40 border border-border/60 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-violet-500/30 transition-all">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your diagram... e.g. 'User authentication flowchart'"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
};

export default FlowPromptBar;
