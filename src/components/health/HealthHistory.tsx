import React, { useEffect, useState } from 'react';
import { Heart, Trash2, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HealthHistoryProps {
  onLoad: (inputData: any, resultData: any) => void;
}

interface HistoryItem {
  id: string;
  title: string;
  input_data: any;
  result_data: any;
  created_at: string;
}

const HealthHistory: React.FC<HealthHistoryProps> = ({ onLoad }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('analysis_history' as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('tool', 'health')
      .order('created_at', { ascending: false })
      .limit(20);
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from('analysis_history' as any).delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground text-sm">
        <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p>No analysis history yet</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onLoad(item.input_data, item.result_data)}
          className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/60 border border-border/50 transition-colors group"
        >
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HealthHistory;
