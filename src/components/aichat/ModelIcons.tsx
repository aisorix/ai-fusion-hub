// Model Icons Component - Displays provider-specific icons for AI models
import React from 'react';
import { cn } from '@/lib/utils';

// Get provider-specific icon component with professional styling
export const getModelIcon = (modelId: string, modelName?: string): React.ReactNode => {
  const name = (modelName || modelId).toLowerCase();
  
  // OpenAI / GPT models - Green theme
  if (name.includes('gpt') || name.includes('openai')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="url(#gpt-gradient)" />
        <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07z" fill="#10A37F" transform="scale(0.4) translate(18, 18)" />
        <defs>
          <linearGradient id="gpt-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#10A37F" />
            <stop offset="1" stopColor="#1A7F64" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Claude / Anthropic models - Orange/Amber theme
  if (name.includes('claude') || name.includes('anthropic')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="url(#claude-gradient)" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">C</text>
        <defs>
          <linearGradient id="claude-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#D97706" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Gemini / Google models - Multi-color gradient
  if (name.includes('gemini') || name.includes('google')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2C12 8.627 17.373 14 24 14C17.373 14 12 19.373 12 26C12 19.373 6.627 14 0 14C6.627 14 12 8.627 12 2Z" fill="url(#gemini-gradient)" transform="scale(0.85) translate(1.5, 1)" />
        <defs>
          <linearGradient id="gemini-gradient" x1="0" y1="12" x2="24" y2="12">
            <stop stopColor="#4285F4" />
            <stop offset="0.5" stopColor="#9B72CB" />
            <stop offset="1" stopColor="#D96570" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Grok / xAI models - Black/White theme
  if (name.includes('grok') || name.includes('xai')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="#000000" />
        <circle cx="12" cy="12" r="10" fill="none" stroke="#333" strokeWidth="0.5" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="system-ui">𝕏</text>
      </svg>
    );
  }
  
  // DeepSeek models - Purple/Blue theme
  if (name.includes('deepseek')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="url(#deepseek-gradient)" />
        <path d="M8 12h8M12 8v8M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <defs>
          <linearGradient id="deepseek-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Perplexity / Search models - Teal theme
  if (name.includes('perplexity') || name.includes('sonar')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="6" fill="url(#perplexity-gradient)" />
        <path d="M12 6v12M6 12h12M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="perplexity-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#20B2AA" />
            <stop offset="1" stopColor="#008B8B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // LLaMA / Meta models - Blue theme
  if (name.includes('llama') || name.includes('meta')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="url(#llama-gradient)" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">Lλ</text>
        <defs>
          <linearGradient id="llama-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#0668E1" />
            <stop offset="1" stopColor="#0552B5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Qwen models - Indigo/Purple theme
  if (name.includes('qwen')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="url(#qwen-gradient)" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">Q</text>
        <defs>
          <linearGradient id="qwen-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Kimi / Moonshot models - Red/Pink theme
  if (name.includes('kimi') || name.includes('moonshot')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="url(#kimi-gradient)" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">K</text>
        <defs>
          <linearGradient id="kimi-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#FF6B6B" />
            <stop offset="1" stopColor="#EE5A5A" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Mistral / Codestral models - Orange theme
  if (name.includes('mistral') || name.includes('codestral')) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="6" fill="url(#mistral-gradient)" />
        <rect x="5" y="7" width="3.5" height="10" rx="1" fill="white" />
        <rect x="10.25" y="5" width="3.5" height="14" rx="1" fill="white" />
        <rect x="15.5" y="7" width="3.5" height="10" rx="1" fill="white" />
        <defs>
          <linearGradient id="mistral-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#FF7000" />
            <stop offset="1" stopColor="#E65C00" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Default Sorix AI icon - Cyan/Blue gradient
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="11" fill="url(#sorix-gradient)" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">S</text>
      <defs>
        <linearGradient id="sorix-gradient" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
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
      'relative flex-shrink-0 rounded-full overflow-hidden',
      sizeClasses[size],
      showGlow && 'after:absolute after:inset-0 after:rounded-full after:bg-primary/30 after:blur-md after:scale-150 after:-z-10',
      className
    )}>
      {getModelIcon(modelId, modelName)}
    </div>
  );
};

export default ModelIcon;
