import { useState, useRef } from 'react';
import { Plus, X, Send, Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore, Message } from '@/stores/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export const MultiWindowChat = () => {
  const [input, setInput] = useState('');
  const {
    chatWindows,
    addChatWindow,
    removeChatWindow,
    setWindowModel,
    addWindowMessage,
    updateWindowLastMessage,
    setWindowStreaming,
    clearAllWindows,
    models,
    toggleSidebar,
    setViewMode,
  } = useChatStore();

  const handleSendToAll = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add user message to all windows
    chatWindows.forEach(window => {
      addWindowMessage(window.id, userMessage);
    });

    const messageContent = input;
    setInput('');

    // Stream responses in parallel for all windows
    await Promise.all(
      chatWindows.map(async (window) => {
        setWindowStreaming(window.id, true);
        
        try {
          const model = models.find(m => m.id === window.modelId);
          
          const response = await supabase.functions.invoke('chat', {
            body: {
              messages: [{ role: 'user', content: messageContent }],
              model: model?.backendId || 'openai/gpt-4o-mini',
              stream: true,
            },
          });

          if (response.error) throw new Error(response.error.message);

          const assistantMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            role: 'assistant',
            content: '',
            createdAt: new Date().toISOString(),
          };
          addWindowMessage(window.id, assistantMessage);

          const reader = response.data.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    updateWindowLastMessage(window.id, content);
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error in window ${window.id}:`, error);
          addWindowMessage(window.id, {
            id: (Date.now() + Math.random()).toString(),
            role: 'assistant',
            content: '❌ Error occurred',
            createdAt: new Date().toISOString(),
          });
        } finally {
          setWindowStreaming(window.id, false);
        }
      })
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold">Multi-Window Comparison</h2>
        </div>
        <div className="flex items-center gap-2">
          {chatWindows.length < 4 && (
            <Button variant="outline" size="sm" onClick={addChatWindow}>
              <Plus className="h-4 w-4 mr-1" /> Add Window
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearAllWindows}>
            Clear All
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setViewMode('single')}>
            Exit
          </Button>
        </div>
      </header>

      {/* Windows Grid */}
      <div className="flex-1 overflow-hidden p-4">
        <div className={cn(
          'grid gap-4 h-full',
          chatWindows.length === 1 && 'grid-cols-1',
          chatWindows.length === 2 && 'grid-cols-2',
          chatWindows.length === 3 && 'grid-cols-3',
          chatWindows.length === 4 && 'grid-cols-2 grid-rows-2'
        )}>
          {chatWindows.map((window) => {
            const model = models.find(m => m.id === window.modelId);
            return (
              <div
                key={window.id}
                className="flex flex-col border border-border rounded-xl overflow-hidden bg-card"
              >
                {/* Window Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
                  <select
                    value={window.modelId}
                    onChange={(e) => setWindowModel(window.id, e.target.value)}
                    className="text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  {chatWindows.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeChatWindow(window.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-3">
                  {window.messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      {model?.name} ready
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {window.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm',
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground ml-8'
                              : 'bg-muted mr-8'
                          )}
                        >
                          {msg.role === 'user' ? (
                            <p>{msg.content}</p>
                          ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))}
                      {window.isStreaming && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Input */}
      <div className="border-t border-border p-4 bg-background">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendToAll();
              }
            }}
            placeholder="Send to all models..."
            className="min-h-[52px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendToAll}
            disabled={!input.trim() || chatWindows.some(w => w.isStreaming)}
            className="h-[52px] w-[52px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
