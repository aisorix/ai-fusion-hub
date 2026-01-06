import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo } from './AIModelLogos';
import logo from '../assets/logo.png';

const Workflow = () => {
  const { t } = useLanguage();

  const aiModels = [
    {
      title: "ChatGPT",
      subtitle: t('chatgptSubtitle'),
      desc: t('chatgptDesc'),
      Logo: ChatGPTLogo,
      gradient: 'from-[#10A37F]/20 to-[#10A37F]/5',
      borderColor: 'border-[#10A37F]/30',
      iconBg: 'bg-[#10A37F]/10',
    },
    {
      title: "Claude",
      subtitle: t('claudeSubtitle'),
      desc: t('claudeDesc'),
      Logo: ClaudeLogo,
      gradient: 'from-[#D97706]/20 to-[#D97706]/5',
      borderColor: 'border-[#D97706]/30',
      iconBg: 'bg-[#D97706]/10',
    },
    {
      title: "DeepSeek",
      subtitle: t('deepseekSubtitle'),
      desc: t('deepseekDesc'),
      Logo: DeepSeekLogo,
      gradient: 'from-[#7C3AED]/20 to-[#7C3AED]/5',
      borderColor: 'border-[#7C3AED]/30',
      iconBg: 'bg-[#7C3AED]/10',
    },
    {
      title: "Gemini",
      subtitle: t('geminiSubtitle'),
      desc: t('geminiDesc'),
      Logo: GeminiLogo,
      gradient: 'from-[#4285F4]/20 to-[#4285F4]/5',
      borderColor: 'border-[#4285F4]/30',
      iconBg: 'bg-[#4285F4]/10',
    },
    {
      title: "Grok",
      subtitle: t('grokSubtitle'),
      desc: t('grokDesc'),
      Logo: GrokLogo,
      gradient: 'from-gray-500/20 to-gray-500/5',
      borderColor: 'border-gray-500/30',
      iconBg: 'bg-gray-500/10',
    }
  ];

  return (
    <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
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
        <div className="flex justify-center mb-12 sm:mb-16">
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
          
          {/* +5 More Card */}
          <div className="group futuristic-card p-6 sm:p-8 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-500">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">+5</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">More AI Models</h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Access Qwen, Llama, Perplexity, Kimi & Mistral in premium plans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;