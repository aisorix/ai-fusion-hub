import { useState } from 'react';
import { 
  Sun, 
  Moon, 
  CreditCard, 
  User, 
  HelpCircle, 
  Stethoscope,
  Receipt,
  Bug,
  FileText,
  CreditCard as CardIcon
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

import { GeneralTab } from './settings/GeneralTab';
import { PlansTokensTab } from './settings/PlansTokensTab';
import { ProfileTab } from './settings/ProfileTab';
import { SubscriptionTab } from './settings/SubscriptionTab';
import { PaymentHistoryTab } from './settings/PaymentHistoryTab';
import { ReportBugTab } from './settings/ReportBugTab';
import { HelpCenterTab } from './settings/HelpCenterTab';
import { TermsTab } from './settings/TermsTab';
import { HealthModeToggle } from '../health/HealthModeToggle';

const tabs = [
  { id: 'general', label: 'General', icon: Sun },
  { id: 'plans', label: 'Plans & Tokens', icon: CreditCard },
  { id: 'subscription', label: 'Subscription', icon: CardIcon },
  { id: 'history', label: 'Payment History', icon: Receipt },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'bug', label: 'Report Bug', icon: Bug },
  { id: 'help', label: 'Help Center', icon: HelpCircle },
  { id: 'terms', label: 'Terms & Legal', icon: FileText },
];

interface SettingsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme } = useChatStore();

  // Internal state if not controlled
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      case 'plans':
        return <PlansTokensTab />;
      case 'subscription':
        return <SubscriptionTab />;
      case 'history':
        return <PaymentHistoryTab />;
      case 'profile':
        return <ProfileTab />;
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden p-0">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-52 border-r border-border bg-muted/30 flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Settings</h2>
            </div>
            
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </ScrollArea>

            {/* Health Mode in Sidebar */}
            <div className="p-4 border-t border-border">
              <HealthModeToggle />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">
                {tabs.find(t => t.id === activeTab)?.label || 'Settings'}
              </h3>
            </div>
            <ScrollArea className="flex-1 p-6">
              {renderContent()}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
