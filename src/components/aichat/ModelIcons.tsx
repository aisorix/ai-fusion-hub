// Model Icons Component - Displays provider-specific icons for AI models
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Bot, 
  Brain, 
  Zap, 
  Search, 
  Code2, 
  Cpu,
  Globe,
  MessageSquare
} from 'lucide-react';

// Model provider icons mapping
export const getModelIcon = (modelId: string, modelName?: string): React.ReactNode => {
  const name = (modelName || modelId).toLowerCase();
  
  // OpenAI / GPT models
  if (name.includes('gpt') || name.includes('openai')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        <span className="text-white font-bold text-[10px]">GPT</span>
      </div>
    );
  }
  
  // Claude / Anthropic models
  if (name.includes('claude') || name.includes('anthropic')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <span className="text-white font-bold text-[10px]">C</span>
      </div>
    );
  }
  
  // Gemini / Google models
  if (name.includes('gemini') || name.includes('google')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
    );
  }
  
  // Grok / xAI models
  if (name.includes('grok') || name.includes('xai')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/20">
        <span className="text-white font-bold text-[10px]">X</span>
      </div>
    );
  }
  
  // DeepSeek models
  if (name.includes('deepseek')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
        <Brain className="w-3 h-3 text-white" />
      </div>
    );
  }
  
  // Perplexity / Search models
  if (name.includes('perplexity') || name.includes('sonar')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
        <Search className="w-3 h-3 text-white" />
      </div>
    );
  }
  
  // LLaMA / Meta models
  if (name.includes('llama') || name.includes('meta')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-[10px]">L</span>
      </div>
    );
  }
  
  // Qwen models
  if (name.includes('qwen')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
        <Code2 className="w-3 h-3 text-white" />
      </div>
    );
  }
  
  // Kimi / Moonshot models
  if (name.includes('kimi') || name.includes('moonshot')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
        <span className="text-white font-bold text-[10px]">K</span>
      </div>
    );
  }
  
  // Mistral models
  if (name.includes('mistral') || name.includes('codestral')) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <span className="text-white font-bold text-[10px]">M</span>
      </div>
    );
  }
  
  // Default Sorix AI icon
  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
      <Bot className="w-3 h-3 text-white" />
    </div>
  );
};

interface ModelIconProps {
  modelId?: string;
  modelName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showGlow?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const ModelIcon = ({ 
  modelId = '', 
  modelName = '', 
  size = 'sm', 
  className,
  showGlow = false 
}: ModelIconProps) => {
  return (
    <div className={cn(
      'relative flex-shrink-0',
      sizeClasses[size],
      showGlow && 'after:absolute after:inset-0 after:rounded-full after:bg-primary/30 after:blur-md after:scale-150 after:-z-10',
      className
    )}>
      {getModelIcon(modelId, modelName)}
    </div>
  );
};

export default ModelIcon;
