import React from 'react';

// AI Model logo components with their brand colors
export const ChatGPTLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4043-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F"/>
  </svg>
);

export const ClaudeLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.23-4.72-2.646A2.97 2.97 0 0 1 3 7.64V6.36a2.97 2.97 0 0 1 1.709-2.562l5.582-3.13A2.97 2.97 0 0 1 11.75 0h2.5a2.97 2.97 0 0 1 1.459.668l5.582 3.13A2.97 2.97 0 0 1 23 6.36v1.28a2.97 2.97 0 0 1-1.709 2.562l-4.72 2.647-.08.23.08.23 4.72 2.646A2.97 2.97 0 0 1 23 18.52v1.28a2.97 2.97 0 0 1-1.709 2.562l-5.582 3.13a2.97 2.97 0 0 1-1.459.508h-2.5a2.97 2.97 0 0 1-1.459-.508l-5.582-3.13A2.97 2.97 0 0 1 3 19.8v-1.28a2.97 2.97 0 0 1 1.709-2.565z" fill="#D97706"/>
  </svg>
);

export const GeminiLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="url(#gemini-gradient)"/>
    <defs>
      <linearGradient id="gemini-gradient" x1="0" y1="12" x2="24" y2="12">
        <stop stopColor="#4285F4"/>
        <stop offset="0.5" stopColor="#9B72CB"/>
        <stop offset="1" stopColor="#D96570"/>
      </linearGradient>
    </defs>
  </svg>
);

export const DeepSeekLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#7C3AED"/>
    <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const GrokLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#000"/>
    <path d="M6 8h4l2 4 2-4h4l-4 8h-4l4-8" stroke="white" strokeWidth="1.5"/>
  </svg>
);

export const QwenLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#6366F1"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Q</text>
  </svg>
);

export const LlamaLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#0668E1"/>
    <path d="M8 16V10c0-2.2 1.8-4 4-4s4 1.8 4 4v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="11" r="1" fill="white"/>
    <circle cx="15" cy="11" r="1" fill="white"/>
  </svg>
);

export const PerplexityLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#20B2AA"/>
    <path d="M12 4v16M4 12h16M7 7l10 10M17 7l-10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const KimiLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#FF6B6B"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">K</text>
  </svg>
);

export const MistralLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FF7000"/>
    <path d="M6 8h3v8h-3zM10 6h4v12h-4zM15 8h3v8h-3z" fill="white"/>
  </svg>
);

export const SorixLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="url(#sorix-gradient)"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">S</text>
    <defs>
      <linearGradient id="sorix-gradient" x1="0" y1="0" x2="24" y2="24">
        <stop stopColor="#06B6D4"/>
        <stop offset="1" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
  </svg>
);

// Map model names to their logos
export const getModelLogo = (modelName) => {
  const name = modelName.toLowerCase();
  if (name.includes('chatgpt') || name.includes('gpt')) return ChatGPTLogo;
  if (name.includes('claude')) return ClaudeLogo;
  if (name.includes('gemini')) return GeminiLogo;
  if (name.includes('deepseek')) return DeepSeekLogo;
  if (name.includes('grok')) return GrokLogo;
  if (name.includes('qwen')) return QwenLogo;
  if (name.includes('llama')) return LlamaLogo;
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