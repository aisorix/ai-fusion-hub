import { supabase } from '@/integrations/supabase/client';
import { getGuestId } from '@/hooks/useGuestSession';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    // Guest path — backend uses x-guest-id for rate limiting
    headers['x-guest-id'] = getGuestId();
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
  }
  return headers;
};

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

// OpenRouter streaming chat
export const chatApi = {
  // Stream message to OpenRouter via edge function
  sendMessageStream: async (
    messages: Message[],
    model: string,
    userPlan: string,
    onDelta: (text: string) => void,
    onDone: (citations?: string[]) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal,
    modelName?: string
  ) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ messages, model, stream: true, userPlan, modelName }),
          signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let citations: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            onDone(citations.length > 0 ? citations : undefined);
            return;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            
            // Check for citations in the response
            if (parsed.citations && Array.isArray(parsed.citations)) {
              citations = parsed.citations;
              console.log(`📚 Received ${citations.length} citations`);
            }
            
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch {
            // Incomplete JSON, put it back and wait for more data
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            
            // Check for citations
            if (parsed.citations && Array.isArray(parsed.citations)) {
              citations = parsed.citations;
            }
            
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch { /* ignore partial leftovers */ }
        }
      }

      onDone(citations.length > 0 ? citations : undefined);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        onDone();
        return;
      }
      onError(error as Error);
    }
  },

  // Non-streaming message
  sendMessage: async (messages: Message[], model: string, userPlan: string, modelName?: string): Promise<{ content: string; citations?: string[] }> => {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { messages, model, stream: false, userPlan, modelName }
    });

    if (error) {
      throw new Error(error.message || 'Failed to send message');
    }

    return {
      content: data?.choices?.[0]?.message?.content || '',
      citations: data?.citations
    };
  }
};

export default chatApi;
