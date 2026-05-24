import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { imagineApi, type ImageGeneration } from '@/services/imagineApi';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  onSelect: (gen: ImageGeneration) => void;
  refreshTrigger: number;
}

const ImagineHistoryFeed: React.FC<Props> = ({ onSelect, refreshTrigger }) => {
  const [history, setHistory] = useState<ImageGeneration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await imagineApi.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await imagineApi.deleteGeneration(id);
      setHistory((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">Your Creations</h2>
          {history.length > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border/50 bg-card/30">
          <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No images yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Your creations will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {history.map((gen, idx) => (
            <motion.button
              key={gen.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
              onClick={() => onSelect(gen)}
              className="group relative rounded-xl overflow-hidden border border-border/40 bg-card text-left hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all"
            >
              <img
                src={gen.image_url}
                alt={gen.prompt}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-white line-clamp-2 leading-snug">{gen.prompt}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] text-white/60">
                    {new Date(gen.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, gen.id)}
                    className="p-1 rounded hover:bg-white/20 text-white/80"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagineHistoryFeed;
