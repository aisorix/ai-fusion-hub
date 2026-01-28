import { useRef, useEffect } from 'react';
import { Menu, Columns2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/stores/chatStore';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { ModelSelector } from './ModelSelector';
import { WelcomeScreen } from './WelcomeScreen';
import { MultiWindowChat } from './MultiWindowChat';
import { cn } from '@/lib/utils';

export const ChatArea = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    toggleSidebar,
    viewMode,
    setViewMode,
    activeChatId,
    getMessages,
    isStreaming,
    isHealthMode,
  } = useChatStore();

  const messages = getMessages();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (viewMode === 'multi') {
    return <MultiWindowChat />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <ModelSelector />

          {isHealthMode && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">
              <Sparkles className="h-3 w-3" />
              Health Mode
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'single' ? 'multi' : 'single')}
            className="gap-2"
          >
            <Columns2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {viewMode === 'single' ? 'Multi-Window' : 'Single'}
            </span>
          </Button>
        </div>
      </header>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        {!activeChatId || messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="max-w-4xl mx-auto p-4">
              <MessageList messages={messages} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};
