import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthModeToggleProps {
  isHealthMode: boolean;
  onToggle: () => void;
  analysisType: 'general' | 'prescription' | 'lab_report' | 'veterinary';
  onAnalysisTypeChange: (type: 'general' | 'prescription' | 'lab_report' | 'veterinary') => void;
}

const analysisTypes = [
  { id: 'general', label: 'General Health', emoji: '🏥', description: 'Any health question' },
  { id: 'prescription', label: 'Prescription', emoji: '💊', description: 'Medication analysis' },
  { id: 'lab_report', label: 'Lab Reports', emoji: '🔬', description: 'Test results' },
  { id: 'veterinary', label: 'Pet Health', emoji: '🐾', description: 'Animal care' },
] as const;

const HealthModeToggle: React.FC<HealthModeToggleProps> = ({
  isHealthMode,
  onToggle,
  analysisType,
  onAnalysisTypeChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Health Mode Button */}
      <motion.button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
          isHealthMode
            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
            : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Heart className={cn("w-4 h-4", isHealthMode && "animate-pulse")} />
        <span className="hidden sm:inline">Health Mode</span>
        {isHealthMode && (
          <X className="w-3 h-3 ml-1 opacity-70" />
        )}
      </motion.button>

      {/* Analysis Type Selector - Only show when health mode is active */}
      <AnimatePresence>
        {isHealthMode && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1 overflow-hidden"
          >
            {analysisTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => onAnalysisTypeChange(type.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all whitespace-nowrap",
                  analysisType === type.id
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={type.description}
              >
                <span>{type.emoji}</span>
                <span className="hidden md:inline">{type.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthModeToggle;
