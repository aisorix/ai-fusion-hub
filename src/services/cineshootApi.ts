import { supabase } from '@/integrations/supabase/client';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Authentication required');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
};

export interface VideoGeneration {
  id: string;
  user_id: string;
  prompt: string;
  model: string | null;
  video_url: string;
  thumbnail_url: string | null;
  aspect_ratio: string;
  resolution: string;
  duration_sec: number;
  sound: boolean;
  source_type: string;
  tokens_used: number;
  created_at: string;
}

export interface GenerateVideoParams {
  prompt: string;
  model: string;
  aspectRatio: string;
  resolution: string;
  durationSec: number;
  sound: boolean;
  imageData?: string;
  videoUrl?: string;
}

export interface GenerateVideoResult {
  videoUrl: string;
  id: string;
  tokensUsed: number;
  totalTokensUsed: number;
}

export const cineshootApi = {
  generateVideo: async (params: GenerateVideoParams): Promise<GenerateVideoResult> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cineshoot`,
      { method: 'POST', headers, body: JSON.stringify(params) }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Video generation failed');
    return data;
  },

  getHistory: async (): Promise<VideoGeneration[]> => {
    const { data, error } = await supabase
      .from('video_generations' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60);
    if (error) throw error;
    return (data as any) || [];
  },

  deleteGeneration: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('video_generations' as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
