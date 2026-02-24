import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface DeckPromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const DeckPromptBar: React.FC<DeckPromptBarProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-opacity" />
        <div className="relative flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your presentation... e.g. 'A 5-slide pitch deck for a green energy startup'"
            className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/60 outline-none"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="shrink-0 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeckPromptBar;
