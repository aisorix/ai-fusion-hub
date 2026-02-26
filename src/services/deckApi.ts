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

export interface Slide {
  slide_number: number;
  heading: string;
  bullet_points: string[];
  image_prompt: string;
  image_url?: string;
  layout: 'split' | 'text-only' | 'full-image';
}

export interface DeckResult {
  slides: Slide[];
  title: string;
  tokensUsed: number;
  totalTokensUsed: number;
  imageCount: number;
}

export interface DeckHistoryItem {
  id: string;
  title: string;
  input_data: { prompt: string; slideCount: number; theme: string };
  result_data: { slides: Slide[]; tokens_used: number };
  created_at: string;
}

export const deckApi = {
  generate: async (
    prompt: string,
    slideCount: number = 5,
    theme: string = 'dark',
    generateImages: boolean = true,
    textContent: string = 'concise',
    artStyle: string = 'illustration'
  ): Promise<DeckResult> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deck-generate`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, slideCount, theme, generateImages, textContent, artStyle }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Deck generation failed');
    }
    return data;
  },

  getHistory: async (): Promise<DeckHistoryItem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('analysis_history' as any)
      .select('id, title, input_data, result_data, created_at')
      .eq('tool', 'deck')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data as any) || [];
  },

  deletePresentation: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('analysis_history' as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
