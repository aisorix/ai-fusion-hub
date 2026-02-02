import React from 'react';
import { PanelLeft } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import ModelSelector from './ModelSelector';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

const MobileHeader = ({ onOpenSidebar, onNewChat }: MobileHeaderProps) => {
  const { user } = useChatStore();
  const isPaidUser = user.plan !== 'free';

  return (
    <header className={cn(
      'flex items-center justify-center px-3 py-2 border-b md:hidden relative',
      'bg-background/95 backdrop-blur-md',
      isPaidUser ? 'border-primary/20' : 'border-border'
    )}>
      {/* Left: Sidebar toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onOpenSidebar}
        className="h-9 w-9 shrink-0 absolute left-3 border-border"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {/* Center: Model selector */}
      <div className="flex justify-center">
        <ModelSelector />
      </div>
    </header>
  );
};

export default MobileHeader;
