// Model Icons Component - Displays provider-specific icons for AI models
import React from 'react';
import { cn } from '@/lib/utils';

// Import actual brand icons
import perplexityIcon from '@/assets/icons/perplexity.png';
import openaiIcon from '@/assets/icons/openai.png';
import deepseekIcon from '@/assets/icons/deepseek.png';
import grokIcon from '@/assets/icons/grok.png';
import metaIcon from '@/assets/icons/meta.png';
import qwenIcon from '@/assets/icons/qwen.png';
import claudeIcon from '@/assets/icons/claude.png';
import kimiIcon from '@/assets/icons/kimi.png';
import mistralIcon from '@/assets/icons/mistral.png';

// Model icon configuration with theme support
interface IconConfig {
  icon: string;
  name: string;
  // Whether the icon needs inversion in dark mode (for icons with white/light backgrounds)
  invertInDark?: boolean;
  // Whether the icon needs inversion in light mode (for icons with dark backgrounds)
  invertInLight?: boolean;
  // Custom background for the icon container
  bgLight?: string;
  bgDark?: string;
}

const getIconConfig = (modelId: string, modelName?: string): IconConfig => {
  const name = (modelName || modelId).toLowerCase();
  
  // OpenAI / GPT models
  if (name.includes('gpt') || name.includes('openai') || name.includes('chatgpt')) {
    return {
      icon: openaiIcon,
      name: 'ChatGPT',
      invertInDark: true, // Black icon on white bg -> invert in dark
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Claude / Anthropic models
  if (name.includes('claude') || name.includes('anthropic')) {
    return {
      icon: claudeIcon,
      name: 'Claude',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Gemini / Google models
  if (name.includes('gemini') || name.includes('google')) {
    return {
      icon: '', // Will use SVG for Gemini
      name: 'Gemini',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Grok / xAI models
  if (name.includes('grok') || name.includes('xai')) {
    return {
      icon: grokIcon,
      name: 'Grok',
      invertInLight: true, // White icon on black bg -> invert in light
      bgLight: 'bg-zinc-900',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // DeepSeek models
  if (name.includes('deepseek')) {
    return {
      icon: deepseekIcon,
      name: 'DeepSeek',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Perplexity / Sonar models
  if (name.includes('perplexity') || name.includes('sonar')) {
    return {
      icon: perplexityIcon,
      name: 'Perplexity',
      invertInLight: true, // White icon on black bg -> invert in light
      bgLight: 'bg-zinc-900',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // LLaMA / Meta models
  if (name.includes('llama') || name.includes('meta')) {
    return {
      icon: metaIcon,
      name: 'LLaMA',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Qwen models
  if (name.includes('qwen')) {
    return {
      icon: qwenIcon,
      name: 'Qwen',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Kimi / Moonshot models
  if (name.includes('kimi') || name.includes('moonshot')) {
    return {
      icon: kimiIcon,
      name: 'Kimi',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Mistral / Codestral models
  if (name.includes('mistral') || name.includes('codestral')) {
    return {
      icon: mistralIcon,
      name: 'Mistral',
      bgLight: 'bg-white',
      bgDark: 'bg-zinc-800',
    };
  }
  
  // Default Sorix AI
  return {
    icon: '',
    name: 'Sorix AI',
    bgLight: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    bgDark: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  };
};

// Gemini SVG Icon Component
const GeminiIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-full h-full", className)}>
    <defs>
      <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#9B72CB" />
        <stop offset="100%" stopColor="#D96570" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2C12 8.627 17.373 14 24 14C17.373 14 12 19.373 12 26C12 19.373 6.627 14 0 14C6.627 14 12 8.627 12 2Z" 
      fill="url(#gemini-gradient)" 
      transform="scale(0.85) translate(1.5, 1)"
    />
  </svg>
);

// Default Sorix Icon
const SorixIcon = ({ className }: { className?: string }) => (
  <div className={cn("w-full h-full flex items-center justify-center text-white font-bold text-sm", className)}>
    S
  </div>
);

interface ModelIconProps {
  modelId?: string;
  modelName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showGlow?: boolean;
  theme?: 'light' | 'dark';
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const imageSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const ModelIcon = ({ 
  modelId = '', 
  modelName = '', 
  size = 'sm', 
  className,
  showGlow = false,
  theme
}: ModelIconProps) => {
  const config = getIconConfig(modelId, modelName);
  const name = (modelName || modelId).toLowerCase();
  const isGemini = name.includes('gemini') || name.includes('google');
  const isSorix = !config.icon && !isGemini;
  
  // Determine current theme from document if not provided
  const isDarkMode = theme === 'dark' || 
    (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  
  return (
    <div className={cn(
      'relative flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center',
      sizeClasses[size],
      isDarkMode ? config.bgDark : config.bgLight,
      showGlow && 'ring-2 ring-primary/30 shadow-lg shadow-primary/20',
      className
    )}>
      {isGemini ? (
        <GeminiIcon className={imageSizeClasses[size]} />
      ) : isSorix ? (
        <SorixIcon />
      ) : (
        <img 
          src={config.icon} 
          alt={config.name}
          className={cn(
            'object-contain',
            imageSizeClasses[size],
            // Apply inversion based on theme
            isDarkMode && config.invertInDark && 'invert',
            !isDarkMode && config.invertInLight && 'invert'
          )}
        />
      )}
    </div>
  );
};

// Export a function to get model icon for use in other components
export const getModelIconElement = (
  modelId: string, 
  modelName?: string, 
  size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
  theme?: 'light' | 'dark'
): React.ReactNode => {
  return <ModelIcon modelId={modelId} modelName={modelName} size={size} theme={theme} />;
};

export default ModelIcon;
