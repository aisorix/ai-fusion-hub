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

export const PerplexityLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L18.36 7.5 12 10.82 5.64 7.5 12 4.18zM5 8.82l6 3.32v6.04l-6-3.32V8.82zm8 9.36v-6.04l6-3.32v6.04l-6 3.32z" fill="#20808D"/>
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

// Map model names to their logos
export const getModelLogo = (modelName) => {
  const name = modelName.toLowerCase();
  if (name.includes('chatgpt') || name.includes('gpt')) return ChatGPTLogo;
  if (name.includes('claude')) return ClaudeLogo;
  if (name.includes('gemini')) return GeminiLogo;
  if (name.includes('perplexity') || name.includes('sonar')) return PerplexityLogo;
  if (name.includes('deepseek')) return DeepSeekLogo;
  if (name.includes('grok')) return GrokLogo;
  return null;
};

// Model colors for gradients
export const modelColors = {
  chatgpt: { gradient: 'from-[#10A37F] to-[#1A7F64]', bg: 'bg-[#10A37F]' },
  claude: { gradient: 'from-[#D97706] to-[#B45309]', bg: 'bg-[#D97706]' },
  gemini: { gradient: 'from-[#4285F4] via-[#9B72CB] to-[#D96570]', bg: 'bg-gradient-to-r from-[#4285F4] to-[#D96570]' },
  perplexity: { gradient: 'from-[#20808D] to-[#166B77]', bg: 'bg-[#20808D]' },
  deepseek: { gradient: 'from-[#7C3AED] to-[#5B21B6]', bg: 'bg-[#7C3AED]' },
  grok: { gradient: 'from-gray-800 to-black', bg: 'bg-black' },
};
