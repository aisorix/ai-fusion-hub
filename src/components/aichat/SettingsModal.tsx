import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  User, 
  CreditCard, 
  Receipt,
  Bug, 
  HelpCircle, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { translations } from '@/lib/translations';

// Import tab components
import GeneralTab from './settings/GeneralTab';
import ProfileTab from './settings/ProfileTab';
import PlansTokensTab from './settings/PlansTokensTab';
import ReportBugTab from './settings/ReportBugTab';
import HelpCenterTab from './settings/HelpCenterTab';
import TermsTab from './settings/TermsTab';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 'general' | 'profile' | 'plans' | 'bug' | 'help' | 'terms';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language } = useChatStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const tabs: { id: TabId; label: string; icon: typeof Settings; description: string }[] = [
    { id: 'general', label: t.general, icon: Sparkles, description: t.generalDesc },
    { id: 'profile', label: t.profile, icon: User, description: 'Manage your profile' },
    { id: 'plans', label: t.plansAndTokens, icon: CreditCard, description: 'Subscription & usage' },
    { id: 'bug', label: t.reportBug, icon: Bug, description: 'Report issues' },
    { id: 'help', label: t.helpCenter, icon: HelpCircle, description: 'Get support' },
    { id: 'terms', label: t.termsOfUse, icon: FileText, description: 'Legal information' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      case 'profile':
        return <ProfileTab />;
      case 'plans':
        return <PlansTokensTab />;
      case 'bug':
        return <ReportBugTab />;
      case 'help':
        return <HelpCenterTab />;
      case 'terms':
        return <TermsTab />;
      default:
        return <GeneralTab />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl border border-border w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col sm:flex-row overflow-hidden"
        >
          {/* Sidebar */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-border bg-muted/30 flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">{t.settings}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors sm:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs - horizontal scroll on mobile, vertical on desktop */}
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-x-visible p-2 sm:p-3 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap',
                      'text-left min-w-max sm:min-w-0 sm:w-full',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className={cn(
                      'w-4 h-4 flex-shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <div className="hidden sm:block flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isActive ? 'text-primary' : 'text-foreground'
                      )}>
                        {tab.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tab.description}
                      </p>
                    </div>
                    <span className="sm:hidden text-sm font-medium">{tab.label}</span>
                    <ChevronRight className={cn(
                      'w-4 h-4 hidden sm:block flex-shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Close button for desktop */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hidden sm:flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;