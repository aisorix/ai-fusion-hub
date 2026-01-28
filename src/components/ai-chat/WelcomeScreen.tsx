import { Sparkles, Code, FileText, Image, MessageSquare, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const suggestions = [
  {
    icon: Code,
    title: 'Write Code',
    prompt: 'Help me write a React component for a user dashboard',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: FileText,
    title: 'Analyze Document',
    prompt: 'Upload a document and I\'ll analyze it for you',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Image,
    title: 'Describe Image',
    prompt: 'Upload an image and I\'ll describe what I see',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: MessageSquare,
    title: 'General Chat',
    prompt: 'Let\'s have a conversation about anything',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

export const WelcomeScreen = () => {
  const { createNewChat, addMessage, setHealthMode, isHealthMode } = useChatStore();

  const handleSuggestion = (prompt: string) => {
    const chat = createNewChat();
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {/* Logo & Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-primary">AI Sorix</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Your intelligent AI assistant. Ask me anything, upload files, or start with a suggestion below.
        </p>

        {/* Health Mode Toggle */}
        <div className="flex justify-center mb-8">
          <Button
            variant={isHealthMode ? 'default' : 'outline'}
            onClick={() => setHealthMode(!isHealthMode)}
            className={cn(
              'gap-2',
              isHealthMode && 'bg-emerald-500 hover:bg-emerald-600'
            )}
          >
            <Stethoscope className="h-4 w-4" />
            {isHealthMode ? 'Health Mode Active' : 'Enable Health Mode'}
          </Button>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.title}
              onClick={() => handleSuggestion(suggestion.prompt)}
              className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              <div className={cn('p-2.5 rounded-lg', suggestion.bg)}>
                <suggestion.icon className={cn('h-5 w-5', suggestion.color)} />
              </div>
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {suggestion.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};
