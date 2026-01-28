import React from 'react';
import { Moon, Sun, Globe, Bell, Keyboard } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

export const GeneralTab: React.FC = () => {
  const { theme, setTheme, language, setLanguage } = useChatStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <Label className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Language</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">Display Language</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language
              </p>
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

      <div>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and announcements
              </p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">Enable Shortcuts</Label>
              <p className="text-sm text-muted-foreground">
                Use keyboard shortcuts for quick actions
              </p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};
