import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo, QwenLogo, LlamaLogo, PerplexityLogo, KimiLogo, MistralLogo, SorixLogo } from './AIModelLogos';
import logo from '../assets/logo.png';

const Workflow = () => {
  const { t } = useLanguage();

  // Models organized by plan tier
  const aiModels = [
    {
      title: "DeepSeek",
      subtitle: t('deepseekSubtitle'),
      desc: t('deepseekDesc'),
      Logo: DeepSeekLogo,
      gradient: 'from-[#7C3AED]/20 to-[#7C3AED]/5',
      borderColor: 'border-[#7C3AED]/30',
      iconBg: 'bg-[#7C3AED]/10',
      tier: 'Free'
    },
    {
      title: "Gemini",
      subtitle: t('geminiSubtitle'),
      desc: t('geminiDesc'),
      Logo: GeminiLogo,
      gradient: 'from-[#4285F4]/20 to-[#4285F4]/5',
      borderColor: 'border-[#4285F4]/30',
      iconBg: 'bg-[#4285F4]/10',
      tier: 'Free'
    },
    {
      title: "ChatGPT",
      subtitle: t('chatgptSubtitle'),
      desc: t('chatgptDesc'),
      Logo: ChatGPTLogo,
      gradient: 'from-[#10A37F]/20 to-[#10A37F]/5',
      borderColor: 'border-[#10A37F]/30',
      iconBg: 'bg-[#10A37F]/10',
      tier: 'Basic'
    },
    {
      title: "Qwen",
      subtitle: t('qwenSubtitle') || 'Alibaba\'s AI',
      desc: t('qwenDesc') || 'Advanced multilingual capabilities for diverse tasks.',
      Logo: QwenLogo,
      gradient: 'from-[#6366F1]/20 to-[#6366F1]/5',
      borderColor: 'border-[#6366F1]/30',
      iconBg: 'bg-[#6366F1]/10',
      tier: 'Basic'
    },
    {
      title: "Llama",
      subtitle: t('llamaSubtitle') || 'Meta\'s Open AI',
      desc: t('llamaDesc') || 'Open-source power for efficient AI processing.',
      Logo: LlamaLogo,
      gradient: 'from-[#0668E1]/20 to-[#0668E1]/5',
      borderColor: 'border-[#0668E1]/30',
      iconBg: 'bg-[#0668E1]/10',
      tier: 'Basic'
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-xs sm:text-sm font-semibold mb-6">
            {t('aiModelsLabel')}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-4 sm:mb-6 px-2 font-display">
            {t('aiModelsTitle1')}
            <br className="hidden sm:block" />
            <span className="animated-gradient-text">{t('aiModelsTitle2')}</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('aiModelsDesc')}
          </p>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="relative group">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl animate-pulse-slow" />
            
            {/* Main logo container */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 futuristic-card rounded-3xl flex items-center justify-center p-4 sm:p-6 group-hover:shadow-glow-lg transition-all duration-500">
              <img src={logo} alt="AI Sorix" className="w-full h-full object-contain" />
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute -inset-8 sm:-inset-12 animate-spin-slow hidden sm:block">
              <div className="absolute top-0 left-1/2 w-2 sm:w-3 h-2 sm:h-3 gradient-primary rounded-full -translate-x-1/2 shadow-glow" />
            </div>
            <div className="absolute -inset-12 sm:-inset-16 animate-reverse-spin-slow hidden sm:block">
              <div className="absolute top-0 left-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-accent rounded-full -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* AI Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {aiModels.map((model, index) => (
            <div
              key={index}
              className={`group futuristic-card p-6 sm:p-8 border ${model.borderColor} transition-all duration-500 hover:-translate-y-2`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${model.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 ${model.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                  <model.Logo className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">{model.title}</h3>
                <p className="text-primary font-semibold text-sm mb-3 text-center">{model.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                  {model.desc}
                </p>
              </div>
            </div>
          ))}
          
          {/* Premium Models Card */}
          <div className="group futuristic-card p-6 sm:p-8 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-500">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">+4</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">{t('premiumModelsCard')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {t('unlockPremiumModels')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;