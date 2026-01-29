import React from 'react';
import { Sun, Moon, Monitor, Globe, Check, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/translations';

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'bn', label: 'বাংলা', flag: '🇧🇩' },
];

const GeneralTab = () => {
  const { theme, setTheme, language, setLanguage } = useChatStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const appearanceOptions = [
    { id: 'system', icon: Monitor, label: t.system },
    { id: 'light', icon: Sun, label: t.light },
    { id: 'dark', icon: Moon, label: t.dark },
  ];

  const handleThemeChange = (value: 'system' | 'light' | 'dark') => {
    if (value === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(value);
    }
  };

  const currentAppearance = theme === 'dark' ? 'dark' : 'light';
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">{t.general}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.generalDesc}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-6 sm:space-y-8 overflow-y-auto pr-1 sm:pr-2">
        {/* Appearance Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center">
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              )}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold">{t.appearance}</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t.manageLookAndFeel}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {appearanceOptions.map((option) => {
              const Icon = option.icon;
              const isActive = currentAppearance === option.id || 
                (option.id === 'system' && false);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleThemeChange(option.id as 'system' | 'light' | 'dark')}
                  className={cn(
                    'relative flex flex-col items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200',
                    'border-2',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-accent/50'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-br from-primary to-accent'
                      : 'bg-muted'
                  )}>
                    <Icon className={cn(
                      'w-4 h-4 sm:w-6 sm:h-6',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    )} />
                  </div>
                  <span className={cn(
                    'text-[10px] sm:text-sm font-medium',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}>
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Language Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold">{t.languagePreferences}</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {language === 'bn' ? 'আপনার পছন্দের ভাষা নির্বাচন করুন' : 'Choose your preferred language'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.id;
              
              return (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={cn(
                    'relative flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200',
                    'border-2',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-accent/50'
                  )}
                >
                  <span className="text-xl sm:text-3xl">{lang.flag}</span>
                  <div className="text-left min-w-0">
                    <p className={cn(
                      'text-sm sm:text-base font-semibold truncate',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}>
                      {lang.label}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {lang.id === 'en' ? 'English' : 'Bangla'}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;