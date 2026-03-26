import React from 'react';
import { PanelLeft, Bot } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import ModelSelector from './ModelSelector';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

const MobileHeader = ({ onOpenSidebar, onNewChat }: MobileHeaderProps) => {
  const { user } = useChatStore();
  const navigate = useNavigate();
  const isPaidUser = user.plan !== 'free';

  return (
    <header className={cn(
      'flex items-center justify-between px-3 py-2 border-b md:hidden',
      'bg-background/95 backdrop-blur-md',
      isPaidUser ? 'border-primary/20' : 'border-border'
    )}>
      {/* Left: Sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={onOpenSidebar}
        className="h-9 w-9 shrink-0 border-border"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {/* Center: Model selector */}
      <div className="flex justify-center">
        <ModelSelector />
      </div>

      {/* Right: Sorix Agent */}
      <button
        onClick={() => navigate("/cowork")}
        title="Sorix Agent"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors shrink-0"
      >
        <Bot className="h-5 w-5" />
      </button>
    </header>
  );
};

export default MobileHeader;
