import React, { useEffect, useState } from 'react';
import { Presentation, Trash2, Loader2, Clock } from 'lucide-react';
import { deckApi, type DeckHistoryItem } from '@/services/deckApi';

interface DeckHistoryProps {
  onLoad: (item: DeckHistoryItem) => void;
  refreshTrigger: number;
}

const DeckHistory: React.FC<DeckHistoryProps> = ({ onLoad, refreshTrigger }) => {
  const [items, setItems] = useState<DeckHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await deckApi.getHistory();
      setItems(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deckApi.deletePresentation(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
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
        <Presentation className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p>No presentations yet</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onLoad(item)}
          className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/60 border border-border/50 transition-colors group"
        >
          <div className="flex items-start gap-2">
            <Presentation className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span>{item.result_data?.slides?.length || 0} slides</span>
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(e, item.id)}
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

export default DeckHistory;
