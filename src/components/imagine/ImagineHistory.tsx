import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Clock } from 'lucide-react';
import { imagineApi, type ImageGeneration } from '@/services/imagineApi';
import { Skeleton } from '@/components/ui/skeleton';
import ImagineActions from './ImagineActions';

interface Props {
  onSelect: (gen: ImageGeneration) => void;
  refreshTrigger: number;
}

const ImagineHistory: React.FC<Props> = ({ onSelect, refreshTrigger }) => {
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

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await imagineApi.deleteGeneration(id);
      setHistory((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No images generated yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Your creations will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {history.map((gen) => (
        <motion.div
          key={gen.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelect(gen)}
          className="relative group rounded-xl overflow-hidden border border-border/30 bg-card cursor-pointer hover:border-primary/30 transition-colors"
        >
          <img
            src={gen.image_url}
            alt={gen.prompt}
            className="w-full aspect-square object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p className="text-[10px] text-white line-clamp-2">{gen.prompt}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] text-white/60">
                {new Date(gen.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(gen.id); }}
                className="p-1 rounded hover:bg-white/20 text-white/70 pointer-events-auto"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImagineHistory;
