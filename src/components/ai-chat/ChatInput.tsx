import { useState, useRef, KeyboardEvent } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  Loader2,
  Mic,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore, Message } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { readFileAsDataURL, readFileAsText, getFileType, getFileIcon, formatFileSize } from '@/lib/fileParser';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  const {
    activeChatId,
    createNewChat,
    addMessage,
    updateLastMessage,
    setStreaming,
    isStreaming,
    selectedModel,
    models,
    pendingAttachments,
    addAttachment,
    removeAttachment,
    clearAttachments,
    isHealthMode,
    healthAnalysisType,
  } = useChatStore();

  const selectedModelData = models.find(m => m.id === selectedModel);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const fileType = getFileType(file.name);
      
      if (type === 'image' || fileType === 'image') {
        const dataUrl = await readFileAsDataURL(file);
        addAttachment({
          type: 'image',
          url: dataUrl,
          name: file.name,
          size: file.size,
        });
      } else {
        let parsedContent = '';
        try {
          if (['txt', 'md', 'json', 'csv', 'code'].includes(fileType)) {
            parsedContent = await readFileAsText(file);
          }
        } catch (err) {
          console.error('Error parsing file:', err);
        }
        
        const dataUrl = await readFileAsDataURL(file);
        addAttachment({
          type: 'file',
          url: dataUrl,
          name: file.name,
          size: file.size,
          parsedContent,
          fileType,
        });
      }
    }
    
    e.target.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isStreaming) return;

    let chatId = activeChatId;
    if (!chatId) {
      const newChat = createNewChat();
      chatId = newChat.id;
    }

    // Build message content
    let messageContent = input.trim();
    const attachments = [...pendingAttachments];

    // Add file content to message
    for (const attachment of attachments) {
      if (attachment.type === 'file' && attachment.parsedContent) {
        messageContent += `\n\n📄 FILE: ${attachment.name}\n--- FILE CONTENT ---\n${attachment.parsedContent}\n--- END FILE ---`;
      }
    }

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      attachments: attachments.length > 0 ? attachments : null,
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    clearAttachments();
    setStreaming(true);

    try {
      // Build messages for API
      const apiMessages: any[] = [];
      
      // Add user message with images if any
      const imageAttachments = attachments.filter(a => a.type === 'image');
      if (imageAttachments.length > 0) {
        apiMessages.push({
          role: 'user',
          content: [
            { type: 'text', text: messageContent },
            ...imageAttachments.map(img => ({
              type: 'image_url',
              image_url: { url: img.url }
            }))
          ]
        });
      } else {
        apiMessages.push({ role: 'user', content: messageContent });
      }

      // Choose endpoint based on health mode
      const endpoint = isHealthMode 
        ? 'health-analysis'
        : 'chat';

      const response = await supabase.functions.invoke(endpoint, {
        body: {
          messages: apiMessages,
          model: selectedModelData?.backendId || 'openai/gpt-4o-mini',
          stream: true,
          analysisType: isHealthMode ? healthAnalysisType : undefined,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };
      addMessage(assistantMessage);

      // Handle streaming response
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
                updateLastMessage(content);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, an error occurred. Please try again.',
        createdAt: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      {/* Attachments Preview */}
      {pendingAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pendingAttachments.map((attachment, index) => (
            <div
              key={index}
              className="relative group flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
            >
              {attachment.type === 'image' ? (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="h-12 w-12 object-cover rounded"
                />
              ) : (
                <span className="text-xl">{getFileIcon(attachment.fileType || 'unknown')}</span>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {attachment.name}
                </span>
                {attachment.size && (
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isHealthMode ? "Describe your health concern or upload medical documents..." : "Ask me anything..."}
            disabled={isStreaming}
            className="min-h-[52px] max-h-40 pr-24 resize-none"
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e, 'file')}
              className="hidden"
              multiple
              accept=".txt,.md,.json,.csv,.pdf,.doc,.docx,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.css,.html"
            />
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) => handleFileSelect(e, 'image')}
              className="hidden"
              multiple
              accept="image/*"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isStreaming}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => imageInputRef.current?.click()}
              disabled={isStreaming}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={(!input.trim() && pendingAttachments.length === 0) || isStreaming}
          className="h-[52px] w-[52px]"
        >
          {isStreaming ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};
