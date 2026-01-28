import { useState } from 'react';
import { X, Sun, Moon, Globe, CreditCard, User, Bug, HelpCircle, FileText, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'general', label: 'General', icon: Sun },
  { id: 'plans', label: 'Plans & Tokens', icon: CreditCard },
  { id: 'health', label: 'Health Mode', icon: Stethoscope },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'help', label: 'Help Center', icon: HelpCircle },
];

interface SettingsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const { user: authUser } = useAuth();
  
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    user,
    isHealthMode,
    setHealthMode,
    healthAnalysisType,
    setHealthAnalysisType,
  } = useChatStore();

  // Internal state if not controlled
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const tokenPercentage = Math.min((user.tokensUsed / user.tokensLimit) * 100, 100);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-48 border-r border-border bg-muted/30 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  
                  {/* Theme */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-muted-foreground">Toggle dark/light mode</p>
                      </div>
                    </div>
                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">Select interface language</p>
                      </div>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">বাংলা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Plans & Token Usage</h3>
                  
                  {/* Current Plan */}
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Current Plan</span>
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium capitalize">
                        {user.plan}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.plan === 'free' 
                        ? 'Upgrade to unlock more models and tokens'
                        : 'Thank you for being a subscriber!'}
                    </p>
                  </div>

                  {/* Token Usage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Token Usage</span>
                      <span className="text-sm text-muted-foreground">
                        {user.tokensUsed.toLocaleString()} / {user.tokensLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${tokenPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(100 - tokenPercentage).toFixed(1)}% remaining this month
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Health Mode Settings</h3>
                  
                  {/* Health Mode Toggle */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Health Mode</p>
                        <p className="text-sm text-muted-foreground">Enable medical document analysis</p>
                      </div>
                    </div>
                    <Switch checked={isHealthMode} onCheckedChange={setHealthMode} />
                  </div>

                  {/* Analysis Type */}
                  {isHealthMode && (
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">Analysis Type</p>
                        <p className="text-sm text-muted-foreground">Select the type of health analysis</p>
                      </div>
                      <Select value={healthAnalysisType} onValueChange={(v: any) => setHealthAnalysisType(v)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="lab_report">Lab Report</SelectItem>
                          <SelectItem value="veterinary">Veterinary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile</h3>
                  
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {authUser?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{authUser?.user_metadata?.full_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{authUser?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Help Center</h3>
                  
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <HelpCircle className="h-5 w-5" />
                      <span>FAQ</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <Bug className="h-5 w-5" />
                      <span>Report a Bug</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <FileText className="h-5 w-5" />
                      <span>Terms of Service</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
