// Health Analysis API Service
// Handles health document analysis with streaming support

import { supabase } from '@/integrations/supabase/client';

export interface HealthMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | any[];
}

export type HealthAnalysisType = 'general' | 'prescription' | 'lab_report' | 'veterinary';

// Get the Supabase URL from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const healthApi = {
  /**
   * Send a health analysis request with streaming response
   */
  async sendMessageStream(
    messages: HealthMessage[],
    analysisType: HealthAnalysisType,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/health-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          messages,
          analysisType,
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.content) {
                onChunk(parsed.content);
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

      onComplete();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        onComplete();
        return;
      }
      onError(error);
    }
  },

  /**
   * Send a health analysis request with non-streaming response
   */
  async sendMessage(
    messages: HealthMessage[],
    analysisType: HealthAnalysisType
  ): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/health-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
      },
      body: JSON.stringify({
        messages,
        analysisType,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.content || '';
  },
};

export default healthApi;
