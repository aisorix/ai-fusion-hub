import { supabase } from '@/integrations/supabase/client';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Authentication required');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
};

export interface FlowHistoryItem {
  id: string;
  title: string;
  tool: string;
  input_data: { prompt: string; diagramType?: string; colorTheme?: string };
  result_data: { mermaidCode: string; tokensUsed: number };
  created_at: string;
  user_id: string;
}

export const flowbuilderApi = {
  generate: async (prompt: string, options?: {
    existingCode?: string;
    diagramType?: string;
    colorTheme?: string;
  }): Promise<{ mermaidCode: string; tokensUsed: number; totalTokensUsed: number }> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/flowbuilder-generate`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, ...options }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Diagram generation failed');
    return data;
  },

  getHistory: async (): Promise<FlowHistoryItem[]> => {
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('tool', 'flowbuilder')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data as any) || [];
  },

  deleteHistory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('analysis_history')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
