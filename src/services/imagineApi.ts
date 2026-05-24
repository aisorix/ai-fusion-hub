import { supabase } from '@/integrations/supabase/client';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Authentication required');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
};

export interface ImageGeneration {
  id: string;
  user_id: string;
  prompt: string;
  style: string | null;
  image_url: string;
  width: number;
  height: number;
  tokens_used: number;
  model: string | null;
  created_at: string;
}

export interface GenerateImageParams {
  prompt: string;
  model?: string;
  imageData?: string;
  aspectRatio?: string;
  resolution?: string;
  format?: string;
  count?: number;
}

export interface GenerateImageResult {
  imageUrls: string[];
  imageUrl: string;
  ids: string[];
  tokensUsed: number;
  totalTokensUsed: number;
}

export const imagineApi = {
  generateImage: async (params: GenerateImageParams): Promise<GenerateImageResult> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/imagine`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Image generation failed');
    }

    return data;
  },

  getHistory: async (): Promise<ImageGeneration[]> => {
    const { data, error } = await supabase
      .from('image_generations' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60);

    if (error) throw error;
    return (data as any) || [];
  },

  deleteGeneration: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('image_generations' as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
