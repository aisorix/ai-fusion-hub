// AI Chat hook for the main chat interface
// Handles message sending, streaming, smart routing, and state management

import { useCallback, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { chatApi } from '@/services/api';
import { healthApi } from '@/services/healthApi';
import { toast } from '@/hooks/use-toast';
import { formatFileForPrompt } from '@/lib/fileParser';
import { shouldApplySmartRouting, WORKER_MODEL_ID } from '@/lib/smartRouting';

// Estimate tokens: ~4 characters per token (rough approximation)
const estimateTokens = (text: string): number => {
  if (typeof text === 'string') {
    return Math.ceil(text.length / 4);
  }
  return 100; // Default estimate for non-string content
};

export const useAIChat = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasShownMultiplierWarningRef = useRef<string | null>(null);
  
  const {
    activeChatId,
    chats,
    isStreaming,
    isLoading,
    error,
    pendingAttachments,
    selectedModel,
    models,
    user,
    isHealthMode,
    healthAnalysisType,
    addMessage,
    updateLastMessage,
    setLastMessageCitations,
    setMessages,
    setStreaming,
    setLoading,
    setError,
    clearAttachments,
    createNewChat,
    setUser,
    getModelMultiplier
  } = useChatStore();
  
  // Derive messages from active chat for proper reactivity
  const messages = chats.find(c => c.id === activeChatId)?.messages || [];

  // Get the backend model ID for the selected model
  const getBackendModelId = useCallback(() => {
    const model = models.find(m => m.id === selectedModel);
    return model?.backendId || 'openai/gpt-4o-mini';
  }, [models, selectedModel]);

  // Show warning toast for high-multiplier models
  const showMultiplierWarning = useCallback((modelName: string, multiplier: number) => {
    // Only show once per model selection
    if (hasShownMultiplierWarningRef.current === selectedModel) return;
    hasShownMultiplierWarningRef.current = selectedModel;
    
    toast({
      title: "⚡ Super-Intelligence Model",
      description: `This is a super-intelligence model. It consumes tokens ${multiplier}x faster. Switch to GPT-5 nano for longer chats.`,
      variant: "default",
      duration: 5000,
    });
  }, [selectedModel]);

  // Update token usage with warnings and multiplier support
  const updateTokenUsage = useCallback((inputTokens: number, outputTokens: number, multiplier: number = 1) => {
    const baseTokens = inputTokens + outputTokens;
    const totalTokens = Math.ceil(baseTokens * multiplier);
    const newUsage = Math.min(user.tokensUsed + totalTokens, user.tokensLimit);
    const prevPercent = user.tokensLimit > 0 ? (user.tokensUsed / user.tokensLimit) * 100 : 0;
    const newPercent = user.tokensLimit > 0 ? (newUsage / user.tokensLimit) * 100 : 0;
    
    // Show warning at 80%
    if (prevPercent < 80 && newPercent >= 80 && newPercent < 100) {
      toast({
        title: "⚠️ Token Usage Warning",
        description: "You've used 80% of your monthly tokens. Consider upgrading your plan.",
        variant: "default",
      });
    }
    
    // Show warning at 100%
    if (prevPercent < 100 && newPercent >= 100) {
      toast({
        title: "🚫 Token Limit Reached",
        description: "You've used all your monthly tokens. Upgrade to continue chatting.",
        variant: "destructive",
      });
    }
    
    setUser({
      ...user,
      tokensUsed: newUsage
    });
    
    console.log(`Token usage: +${totalTokens} (base: ${baseTokens}, multiplier: ${multiplier}x), total: ${newUsage}/${user.tokensLimit} (${newPercent.toFixed(1)}%)`);
  }, [user, setUser]);

  // Build multimodal content for GPT-4o vision
  const buildMultimodalContent = useCallback((text: string, imageAttachments: any[]) => {
    const content: any[] = [];
    
    // Add text content first
    if (text.trim()) {
      content.push({
        type: 'text',
        text: text
      });
    }
    
    // Add image content for vision analysis
    imageAttachments.forEach(att => {
      if (att.url && att.url.startsWith('data:image')) {
        content.push({
          type: 'image_url',
          image_url: {
            url: att.url,
            detail: 'high' // Use high detail for better analysis
          }
        });
      }
    });
    
    return content;
  }, []);
  
  // Send message with streaming and smart routing
  const sendMessage = useCallback(async (content: string, useStreaming = true) => {
    if (!content.trim() && pendingAttachments.length === 0) return;

    // Check if user has tokens available
    if (user.tokensUsed >= user.tokensLimit && user.tokensLimit > 0) {
      setError('You have reached your token limit. Please upgrade your plan.');
      return;
    }

    // Create a new chat if none is active
    let chatId = activeChatId;
    if (!chatId) {
      const newChat = createNewChat();
      chatId = newChat.id;
    }
    
    // Get current model info
    const currentModel = models.find(m => m.id === selectedModel);
    const modelName = currentModel?.name || 'Sorix AI';
    let activeMultiplier = currentModel?.multiplier || 1;
    let activeBackendId = currentModel?.backendId || 'openai/gpt-4o-mini';
    let wasSmartRouted = false;

    // Show warning for high-multiplier models (>1x)
    if (activeMultiplier > 1) {
      showMultiplierWarning(modelName, activeMultiplier);
    }

    // Build conversation history for smart routing check
    const currentMessages = useChatStore.getState().chats.find(c => c.id === chatId)?.messages || [];
    const conversationHistory = currentMessages
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    // Apply smart routing for simple queries on premium models
    if (activeMultiplier > 1 && shouldApplySmartRouting(activeMultiplier, content, conversationHistory)) {
      console.log(`🧠 Smart Routing: Downgrading ${modelName} to Worker Model for simple query`);
      activeBackendId = WORKER_MODEL_ID;
      activeMultiplier = 1;
      wasSmartRouted = true;
    }
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: content.trim(),
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
      createdAt: new Date().toISOString()
    };
    
    addMessage(userMessage);
    clearAttachments();
    
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: '',
      modelId: selectedModel,
      modelName: modelName,
      createdAt: new Date().toISOString()
    };
    
    addMessage(assistantMessage);
    setStreaming(true);
    setError(null);

    // Build messages array for API (last 20 messages for context)
    const contextMessages = currentMessages
      .slice(-20)
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    // Separate image and document attachments
    const imageAttachments = pendingAttachments.filter(att => att.type === 'image');
    const documentAttachments = pendingAttachments.filter(att => att.type === 'file' && att.parsedContent);

    // Build user message content
    let userText = content.trim();
    
    // Append parsed file content for documents
    if (documentAttachments.length > 0) {
      const totalDocs = documentAttachments.length;
      userText += `\n\n📁 ATTACHED FILES (${totalDocs} ${totalDocs === 1 ? 'file' : 'files'}):\n`;
      documentAttachments.forEach((att, index) => {
        userText += formatFileForPrompt({
          name: att.name,
          type: att.fileType || 'unknown',
          mimeType: '',
          size: att.size || 0,
          content: att.parsedContent || '',
          isImage: false
        }, index + 1, totalDocs);
      });
      userText += `\n📁 END OF ATTACHED FILES\n`;
    }

    // Add context for images
    if (imageAttachments.length > 0) {
      const imageNames = imageAttachments.map(att => att.name).join(', ');
      if (!userText.trim()) {
        userText = `Please analyze ${imageAttachments.length === 1 ? 'this image' : 'these images'}: ${imageNames}`;
      } else {
        userText += `\n\n[Attached ${imageAttachments.length === 1 ? 'image' : 'images'}: ${imageNames}]`;
      }
    }

    // Build the API messages array
    let apiMessages: any[];
    
    if (imageAttachments.length > 0) {
      // Use multimodal format for images
      const multimodalContent = buildMultimodalContent(userText, imageAttachments);
      apiMessages = [
        ...contextMessages.slice(0, -1),
        { role: 'user' as const, content: multimodalContent }
      ];
    } else {
      // Use standard text format
      apiMessages = [
        ...contextMessages.slice(0, -1),
        { role: 'user' as const, content: userText }
      ];
    }

    // Estimate input tokens
    const inputTokens = apiMessages.reduce((acc, msg) => {
      if (typeof msg.content === 'string') {
        return acc + estimateTokens(msg.content);
      } else if (Array.isArray(msg.content)) {
        return acc + msg.content.reduce((sum: number, item: any) => {
          if (item.type === 'text') return sum + estimateTokens(item.text);
          if (item.type === 'image_url') return sum + 1000; // Approximate tokens for images
          return sum;
        }, 0);
      }
      return acc;
    }, 0);

    // Always use GPT-4o-mini for file/image attachments
    const hasAttachments = imageAttachments.length > 0 || documentAttachments.length > 0;
    const backendModel = hasAttachments ? 'openai/gpt-4o-mini' : activeBackendId;
    const finalMultiplier = hasAttachments ? 1 : activeMultiplier;
    
    console.log(`Sending message with model: ${backendModel}${hasAttachments ? ' (forced for attachments)' : wasSmartRouted ? ' (smart routed)' : ''}, multiplier: ${finalMultiplier}x, images: ${imageAttachments.length}, docs: ${documentAttachments.length}`);

    // Create abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      if (useStreaming) {
        let fullResponse = '';
        
        // Route to health API if health mode is enabled
        if (isHealthMode) {
          console.log(`🏥 Health Mode: Sending to health-analysis with type: ${healthAnalysisType}`);
          await healthApi.sendMessageStream(
            apiMessages,
            healthAnalysisType,
            (chunk) => {
              fullResponse += chunk;
              updateLastMessage(chunk);
            },
            () => {
              setStreaming(false);
              const outputTokens = estimateTokens(fullResponse);
              updateTokenUsage(inputTokens, outputTokens, finalMultiplier);
              
              // Show optimization toast if smart routed
              if (wasSmartRouted) {
                toast({
                  title: "✨ Optimized Response",
                  description: "Simple query detected. Token deduction reduced to 1x.",
                  variant: "default",
                  duration: 3000,
                });
              }
              
              console.log('🏥 Health analysis complete, response length:', fullResponse.length);
            },
            (err) => {
              console.error('Health analysis error:', err);
              const errorMessage = err.message || 'An error occurred';
              setError(errorMessage);
              setStreaming(false);
              toast({
                title: "🏥 Health Analysis Error",
                description: errorMessage,
                variant: "destructive",
              });
            },
            abortControllerRef.current.signal
          );
        } else {
          // Standard chat API
          await chatApi.sendMessageStream(
            apiMessages,
            backendModel,
            user.plan,
            (chunk) => {
              fullResponse += chunk;
              updateLastMessage(chunk);
            },
            (citations) => {
              setStreaming(false);
              // Set citations if available (from Perplexity/search models)
              if (citations && citations.length > 0) {
                setLastMessageCitations(citations);
                console.log(`📚 Added ${citations.length} citations to message`);
              }
              // Estimate output tokens and update usage with multiplier
              const outputTokens = estimateTokens(fullResponse);
              updateTokenUsage(inputTokens, outputTokens, finalMultiplier);
              
              // Show optimization toast if smart routed
              if (wasSmartRouted) {
                toast({
                  title: "✨ Optimized Response",
                  description: "Simple query detected. Token deduction reduced to 1x.",
                  variant: "default",
                  duration: 3000,
                });
              }
              
              console.log('Streaming complete, response length:', fullResponse.length);
            },
            (err) => {
              console.error('Streaming error:', err);
              const errorMessage = err.message || 'An error occurred';
              setError(errorMessage);
              setStreaming(false);
              
              // Show appropriate toast based on error type
              if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
                toast({
                  title: "⏳ Rate Limited",
                  description: "Too many requests. Please wait a moment before trying again.",
                  variant: "destructive",
                });
              } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
                toast({
                  title: "🔒 Authentication Error",
                  description: "API authentication failed. Please check your configuration.",
                  variant: "destructive",
                });
              } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
                toast({
                  title: "🌐 Network Error",
                  description: "Unable to connect. Please check your internet connection.",
                  variant: "destructive",
                });
              } else if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
                toast({
                  title: "🔧 Server Error",
                  description: "The server is experiencing issues. Please try again later.",
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "❌ Error",
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            },
            abortControllerRef.current.signal,
            modelName // Pass model name to API
          );
        }
      } else {
        const response = await chatApi.sendMessage(apiMessages, backendModel, user.plan, modelName);
        updateLastMessage(response.content);
        // Set citations if available
        if (response.citations && response.citations.length > 0) {
          setLastMessageCitations(response.citations);
        }
        setStreaming(false);
        
        // Estimate output tokens and update usage with multiplier
        const outputTokens = estimateTokens(response.content);
        updateTokenUsage(inputTokens, outputTokens, finalMultiplier);
        
        // Show optimization toast if smart routed
        if (wasSmartRouted) {
          toast({
            title: "✨ Optimized Response",
            description: "Simple query detected. Token deduction reduced to 1x.",
            variant: "default",
            duration: 3000,
          });
        }
      }
    } catch (err: any) {
      console.error('Send message error:', err);
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      setStreaming(false);
      
      // Show toast for caught errors (non-streaming or unexpected errors)
      if (err.name !== 'AbortError') {
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
          toast({
            title: "⏳ Rate Limited",
            description: "Too many requests. Please wait a moment before trying again.",
            variant: "destructive",
          });
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
          toast({
            title: "🌐 Network Error",
            description: "Unable to connect. Please check your internet connection.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "❌ Failed to Send Message",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    }
  }, [activeChatId, pendingAttachments, selectedModel, models, user, addMessage, updateLastMessage, setLastMessageCitations, setStreaming, setError, clearAttachments, createNewChat, updateTokenUsage, buildMultimodalContent, isHealthMode, healthAnalysisType, showMultiplierWarning, getModelMultiplier]);
  
  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreaming(false);
  }, [setStreaming]);
  
  // Load messages (local only - no backend persistence yet)
  const loadMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;
    setLoading(true);
    // Messages are already in the store
    setLoading(false);
  }, [setLoading]);
  
  return {
    messages,
    isStreaming,
    isLoading,
    error,
    sendMessage,
    loadMessages,
    stopStreaming
  };
};

export default useAIChat;
