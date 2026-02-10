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
import { useIsMobile } from '@/hooks/use-mobile';

// Import tab components
import GeneralTab from './settings/GeneralTab';
import ProfileTab from './settings/ProfileTab';
import PlansTokensTab from './settings/PlansTokensTab';
import ReportBugTab from './settings/ReportBugTab';
import HelpCenterTab from './settings/HelpCenterTab';
import TermsTab from './settings/TermsTab';
import SubscriptionTab from './settings/SubscriptionTab';
import PaymentHistoryTab from './settings/PaymentHistoryTab';

export type TabId = 'general' | 'profile' | 'plans' | 'subscription' | 'payment' | 'bug' | 'help' | 'terms';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TabId;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { language } = useChatStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [activeTab, setActiveTab] = useState<TabId | null>(initialTab || null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const accountTabs: { id: TabId; label: string; icon: typeof Settings }[] = [
    { id: 'general', label: t.general, icon: Sparkles },
    { id: 'plans', label: t.plansAndTokens, icon: CreditCard },
    { id: 'subscription', label: 'Subscription', icon: Receipt },
    { id: 'payment', label: 'Payment History', icon: Receipt },
    { id: 'profile', label: t.profile, icon: User },
  ];

  const supportTabs: { id: TabId; label: string; icon: typeof Settings }[] = [
    { id: 'bug', label: t.reportBug, icon: Bug },
    { id: 'help', label: t.helpCenter, icon: HelpCircle },
    { id: 'terms', label: t.termsOfUse, icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      case 'profile':
        return <ProfileTab />;
      case 'plans':
        return <PlansTokensTab />;
      case 'subscription':
        return <SubscriptionTab />;
      case 'payment':
        return <PaymentHistoryTab />;
      case 'bug':
        return <ReportBugTab />;
      case 'help':
        return <HelpCenterTab />;
      case 'terms':
        return <TermsTab />;
      default:
        return null;
    }
  };

  const renderTabButton = (tab: { id: TabId; label: string; icon: typeof Settings }) => {
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={cn(
          'w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
          'bg-muted/30 hover:bg-muted/50 border border-border/50',
          'text-left group'
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="flex-1 font-medium text-foreground">{tab.label}</span>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
    );
  };

  if (!isOpen) return null;

  // Mobile: Full screen with navigation
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {activeTab ? (
              <button
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-2 text-foreground"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span className="font-medium">Back</span>
              </button>
            ) : (
              <h2 className="text-xl font-bold text-foreground">{t.settings}</h2>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-4"
                >
                  {renderContent()}
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 space-y-6"
                >
                  {/* Account Section */}
                  <div className="space-y-2">
                    {accountTabs.map(renderTabButton)}
                  </div>

                  {/* Help & Support Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
                      HELP & SUPPORT
                    </h3>
                    <div className="space-y-2">
                      {supportTabs.map(renderTabButton)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop: Two-column layout
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
          className="bg-background rounded-2xl border border-border w-full max-w-4xl h-[80vh] flex overflow-hidden"
        >
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-muted/30 flex-shrink-0 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">{t.settings}</h2>
            </div>

            {/* Tabs */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {[...accountTabs, ...supportTabs].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className={cn(
                      'w-4 h-4 flex-shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-primary' : 'text-foreground'
                    )}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab || 'general'}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {activeTab ? renderContent() : <GeneralTab />}
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
