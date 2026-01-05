import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatGPTLogo, ClaudeLogo, GeminiLogo, PerplexityLogo, DeepSeekLogo, GrokLogo } from './AIModelLogos';
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
      title: "Gemini 2.5 Pro",
      subtitle: t('geminiSubtitle'),
      desc: t('geminiDesc'),
      Logo: GeminiLogo,
      bgColor: 'bg-[#4285F4]/10',
      borderColor: 'border-[#4285F4]/30',
    },
    {
      title: "Perplexity Sonar",
      subtitle: t('perplexitySubtitle'),
      desc: t('perplexityDesc'),
      Logo: PerplexityLogo,
      bgColor: 'bg-[#20808D]/10',
      borderColor: 'border-[#20808D]/30',
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
      title: "Grok 4",
      subtitle: t('grokSubtitle'),
      desc: t('grokDesc'),
      Logo: GrokLogo,
      bgColor: 'bg-gray-900/10',
      borderColor: 'border-gray-900/30',
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
            {t('aiModelsLabel')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            {t('aiModelsTitle1')}
            <br className="hidden sm:block" />
            <span className="text-gradient-primary">{t('aiModelsTitle2')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('aiModelsDesc')}
          </p>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-card rounded-3xl flex items-center justify-center shadow-2xl border border-border p-4">
              <img src={logo} alt="AI Sorix" className="w-full h-full object-contain" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute -inset-8 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2" />
            </div>
            <div className="absolute -inset-12 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-secondary rounded-full -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* AI Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {aiModels.map((model, index) => (
            <div
              key={index}
              className={`group bg-card rounded-2xl p-6 lg:p-8 border ${model.borderColor} hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-16 h-16 mx-auto mb-6 ${model.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <model.Logo className="w-10 h-10" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 text-center">{model.title}</h3>
              <p className="text-primary font-semibold text-sm mb-3 text-center">{model.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed text-center">
                {model.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
