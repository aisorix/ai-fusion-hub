// Chat API Service
// Handles AI chat communication with streaming support

import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | any[];
}

export interface ChatResponse {
  content: string;
  citations?: string[];
}

// Get the Supabase URL from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const chatApi = {
  /**
   * Send a message and receive a streaming response
   */
  async sendMessageStream(
    messages: ChatMessage[],
    model: string,
    userPlan: string,
    onChunk: (chunk: string) => void,
    onComplete: (citations?: string[]) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          messages,
          model,
          userPlan,
          stream: true,
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let citations: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete(citations.length > 0 ? citations : undefined);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.content) {
                onChunk(parsed.content);
              }
              
              if (parsed.citations) {
                citations = parsed.citations;
              }
              
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              // If it's not JSON, treat it as plain text
              if (data && !data.startsWith('{')) {
                onChunk(data);
              }
            }
          }
        }
      }

      onComplete(citations.length > 0 ? citations : undefined);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        onComplete();
        return;
      }
      onError(error);
    }
  },

  /**
   * Send a message and receive a non-streaming response
   */
  async sendMessage(
    messages: ChatMessage[],
    model: string,
    userPlan: string
  ): Promise<ChatResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
      },
      body: JSON.stringify({
        messages,
        model,
        userPlan,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content || '',
      citations: data.citations,
    };
  },
};

export default chatApi;
