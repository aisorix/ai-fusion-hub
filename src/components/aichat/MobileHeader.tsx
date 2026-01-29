import React from 'react';
import { Menu, Plus } from 'lucide-react';
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
      'flex items-center justify-between px-3 py-2 border-b md:hidden',
      'bg-background/95 backdrop-blur-md',
      isPaidUser ? 'border-primary/20' : 'border-border'
    )}>
      {/* Left: Menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="h-9 w-9 shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Center: Model selector */}
      <div className="flex-1 flex justify-center px-2">
        <ModelSelector />
      </div>

      {/* Right: New chat button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNewChat}
        className="h-9 w-9 shrink-0"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default MobileHeader;
