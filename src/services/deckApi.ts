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

  // In-memory cache for instant panel open
  _cache: null as DeckHistoryItem[] | null,
  _cacheTime: 0,

  getHistory: async (forceRefresh = false): Promise<DeckHistoryItem[]> => {
    // Return cache if fresh (within 30s) and not forced
    if (!forceRefresh && deckApi._cache && Date.now() - deckApi._cacheTime < 30000) {
      return deckApi._cache;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('analysis_history' as any)
      .select('id,title,input_data,result_data,created_at')
      .eq('tool', 'deck')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    const items = (data as any) || [];
    deckApi._cache = items;
    deckApi._cacheTime = Date.now();
    return items;
  },

  addToCache: (item: Omit<DeckHistoryItem, 'id'> & { id?: string }) => {
    const newItem: DeckHistoryItem = {
      id: item.id || crypto.randomUUID(),
      title: item.title,
      input_data: item.input_data,
      result_data: item.result_data,
      created_at: item.created_at || new Date().toISOString(),
    };
    if (deckApi._cache) {
      deckApi._cache = [newItem, ...deckApi._cache];
    } else {
      deckApi._cache = [newItem];
    }
    deckApi._cacheTime = Date.now();
  },

  deletePresentation: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('analysis_history' as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
