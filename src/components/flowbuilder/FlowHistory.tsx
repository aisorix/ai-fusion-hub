import React, { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { flowbuilderApi, type FlowHistoryItem } from '@/services/flowbuilderApi';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeHistory } from '@/hooks/useRealtimeHistory';

interface FlowHistoryProps {
  onSelect: (item: FlowHistoryItem) => void;
  refreshTrigger: number;
}

const FlowHistory: React.FC<FlowHistoryProps> = ({ onSelect, refreshTrigger }) => {
  const [items, setItems] = useState<FlowHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await flowbuilderApi.getHistory();
      setItems(data);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [refreshTrigger]);

  useRealtimeHistory({
    table: 'analysis_history',
    userId: user?.id,
    filter: { tool: 'flowbuilder' },
    onChange: fetchHistory,
  });

    try {
      await flowbuilderApi.deleteHistory(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  if (!items.length) {
    return <p className="text-center text-xs text-muted-foreground py-8">No diagrams yet</p>;
  }

  return (
    <div className="p-2 space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(item.created_at).toLocaleDateString()} • {(item.result_data as any)?.tokensUsed?.toLocaleString()} tokens
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(e, item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FlowHistory;
