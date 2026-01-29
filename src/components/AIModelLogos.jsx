import React from 'react';
import { cn } from '@/lib/utils';

// Import actual brand icons
import openaiIcon from '@/assets/icons/openai.png';
import claudeIcon from '@/assets/icons/claude.png';
import deepseekIcon from '@/assets/icons/deepseek.png';
import grokIcon from '@/assets/icons/grok.png';
import qwenIcon from '@/assets/icons/qwen.png';
import metaIcon from '@/assets/icons/meta.png';
import perplexityIcon from '@/assets/icons/perplexity.png';
import kimiIcon from '@/assets/icons/kimi.png';
import mistralIcon from '@/assets/icons/mistral.png';
import sorixLogo from '@/assets/logo.png';

// Theme-aware icon component
const ThemedIcon = ({ src, alt, className = "w-6 h-6", invertInDark = false, invertInLight = false }) => {
  return (
    <img 
      src={src} 
      alt={alt}
      className={cn(
        className,
        'object-contain',
        invertInDark && 'dark:invert',
        invertInLight && 'invert dark:invert-0'
      )}
    />
  );
};

// AI Model logo components with their brand icons
export const ChatGPTLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={openaiIcon} alt="ChatGPT" className={className} invertInDark />
);

export const ClaudeLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={claudeIcon} alt="Claude" className={className} />
);

export const GeminiLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="url(#gemini-gradient-landing)"/>
    <defs>
      <linearGradient id="gemini-gradient-landing" x1="0" y1="12" x2="24" y2="12">
        <stop stopColor="#4285F4"/>
        <stop offset="0.5" stopColor="#9B72CB"/>
        <stop offset="1" stopColor="#D96570"/>
      </linearGradient>
    </defs>
  </svg>
);

export const DeepSeekLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={deepseekIcon} alt="DeepSeek" className={className} />
);

export const GrokLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={grokIcon} alt="Grok" className={className} invertInDark />
);

export const QwenLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={qwenIcon} alt="Qwen" className={className} />
);

export const LlamaLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={metaIcon} alt="Llama" className={className} />
);

export const PerplexityLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={perplexityIcon} alt="Perplexity" className={className} invertInDark />
);

export const KimiLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={kimiIcon} alt="Kimi" className={className} />
);

export const MistralLogo = ({ className = "w-6 h-6" }) => (
  <ThemedIcon src={mistralIcon} alt="Mistral" className={className} />
);

export const SorixLogo = ({ className = "w-6 h-6" }) => (
  <img src={sorixLogo} alt="Sorix" className={cn(className, 'object-contain')} />
);

// Map model names to their logos
export const getModelLogo = (modelName) => {
  const name = modelName.toLowerCase();
  if (name.includes('chatgpt') || name.includes('gpt') || name.includes('openai')) return ChatGPTLogo;
  if (name.includes('claude')) return ClaudeLogo;
  if (name.includes('gemini')) return GeminiLogo;
  if (name.includes('deepseek')) return DeepSeekLogo;
  if (name.includes('grok')) return GrokLogo;
  if (name.includes('qwen')) return QwenLogo;
  if (name.includes('llama') || name.includes('meta')) return LlamaLogo;
  if (name.includes('perplexity')) return PerplexityLogo;
  if (name.includes('kimi')) return KimiLogo;
  if (name.includes('mistral')) return MistralLogo;
  if (name.includes('sorix')) return SorixLogo;
  return null;
};

// Model colors for gradients
export const modelColors = {
  chatgpt: { gradient: 'from-[#10A37F] to-[#1A7F64]', bg: 'bg-[#10A37F]' },
  claude: { gradient: 'from-[#D97706] to-[#B45309]', bg: 'bg-[#D97706]' },
  gemini: { gradient: 'from-[#4285F4] via-[#9B72CB] to-[#D96570]', bg: 'bg-gradient-to-r from-[#4285F4] to-[#D96570]' },
  deepseek: { gradient: 'from-[#7C3AED] to-[#5B21B6]', bg: 'bg-[#7C3AED]' },
  grok: { gradient: 'from-gray-800 to-black', bg: 'bg-black' },
  qwen: { gradient: 'from-[#6366F1] to-[#4F46E5]', bg: 'bg-[#6366F1]' },
  llama: { gradient: 'from-[#0668E1] to-[#0552B5]', bg: 'bg-[#0668E1]' },
  perplexity: { gradient: 'from-[#20B2AA] to-[#008B8B]', bg: 'bg-[#20B2AA]' },
  kimi: { gradient: 'from-[#FF6B6B] to-[#EE5A5A]', bg: 'bg-[#FF6B6B]' },
  mistral: { gradient: 'from-[#FF7000] to-[#E65C00]', bg: 'bg-[#FF7000]' },
  sorix: { gradient: 'from-[#06B6D4] to-[#3B82F6]', bg: 'bg-gradient-to-r from-[#06B6D4] to-[#3B82F6]' },
};
