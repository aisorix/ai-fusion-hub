import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, DeepSeekLogo, GrokLogo } from './AIModelLogos';
import logo from '../assets/logo.png';

const Workflow = () => {
  const { t } = useLanguage();

  const aiModels = [
    {
      title: "ChatGPT 5",
      subtitle: t('chatgptSubtitle'),
      desc: t('chatgptDesc'),
      Logo: ChatGPTLogo,
      bgColor: 'bg-[#10A37F]/10',
      borderColor: 'border-[#10A37F]/30',
    },
    {
      title: "Claude Sonnet 4",
      subtitle: t('claudeSubtitle'),
      desc: t('claudeDesc'),
      Logo: ClaudeLogo,
      bgColor: 'bg-[#D97706]/10',
      borderColor: 'border-[#D97706]/30',
    },
    {
      title: "DeepSeek R1",
      subtitle: t('deepseekSubtitle'),
      desc: t('deepseekDesc'),
      Logo: DeepSeekLogo,
      bgColor: 'bg-[#7C3AED]/10',
      borderColor: 'border-[#7C3AED]/30',
    },
    {
      title: "Gemini 2.5 Pro",
      subtitle: t('geminiSubtitle'),
      desc: t('geminiDesc'),
      Logo: GeminiLogo,
      bgColor: 'bg-[#4285F4]/10',
      borderColor: 'border-[#4285F4]/30',
    },
    {
      title: "Grok 4",
      subtitle: t('grokSubtitle'),
      desc: t('grokDesc'),
      Logo: GrokLogo,
      bgColor: 'bg-gray-900/10 dark:bg-gray-100/10',
      borderColor: 'border-gray-900/30 dark:border-gray-100/30',
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            {t('aiModelsLabel')}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-3 sm:mb-4 px-2">
            {t('aiModelsTitle1')}
            <br className="hidden sm:block" />
            <span className="text-gradient-primary">{t('aiModelsTitle2')}</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('aiModelsDesc')}
          </p>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-card rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border border-border p-3 sm:p-4 glow-effect">
              <img src={logo} alt="AI Sorix" className="w-full h-full object-contain" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute -inset-6 sm:-inset-8 animate-spin hidden sm:block" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full -translate-x-1/2" />
            </div>
            <div className="absolute -inset-10 sm:-inset-12 animate-spin hidden sm:block" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              <div className="absolute top-0 left-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-accent rounded-full -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* AI Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {aiModels.map((model, index) => (
            <div
              key={index}
              className={`group bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border ${model.borderColor} hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 ${model.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <model.Logo className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 text-center">{model.title}</h3>
              <p className="text-primary font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-center">{model.subtitle}</p>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-center">
                {model.desc}
              </p>
            </div>
          ))}
          
          {/* +10 More Card */}
          <div className="group bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-primary/20 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl sm:text-2xl font-bold text-foreground">+10</span>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 text-center">More AI Models</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-center">
              Access additional premium AI models including Qwen, Llama, Mistral, and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;