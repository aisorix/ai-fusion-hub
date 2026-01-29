import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronUp, Play } from 'lucide-react';
import { VOICE_PERSONAS, type VoicePersona } from '@/hooks/useSpeechSynthesis';
import { cn } from '@/lib/utils';

interface VoicePersonaSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedPersona: VoicePersona;
  onSelect: (persona: VoicePersona) => void;
  onPreview: (persona: VoicePersona) => void;
}

const VoicePersonaSelector: React.FC<VoicePersonaSelectorProps> = ({
  isOpen,
  onToggle,
  selectedPersona,
  onSelect,
  onPreview,
}) => {
  return (
    <div className="relative">
      {/* Selector trigger - minimal design */}
      <motion.button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-white/5 hover:bg-white/10 border border-white/10",
          "text-white/60 hover:text-white/80 transition-all duration-200"
        )}
        whileTap={{ scale: 0.98 }}
      >
        <div 
          className="w-2 h-2 rounded-full"
          style={{ background: selectedPersona.color }}
        />
        <span className="text-sm">{selectedPersona.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronUp className="w-3.5 h-3.5 opacity-50" />
        </motion.div>
      </motion.button>

      {/* Dropdown panel - ChatGPT style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
              "w-64 p-2 rounded-xl",
              "bg-[#2a2a2a] border border-white/10",
              "shadow-xl"
            )}
          >
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 px-2 pt-1">
              Select Voice
            </p>
            
            <div className="space-y-0.5">
              {VOICE_PERSONAS.map((persona) => (
                <motion.button
                  key={persona.id}
                  onClick={() => onSelect(persona)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                    "transition-all duration-150",
                    selectedPersona.id === persona.id
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Color indicator */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ 
                      background: `${persona.color}20`,
                      border: `1px solid ${persona.color}40`
                    }}
                  >
                    <User className="w-3.5 h-3.5" style={{ color: persona.color }} />
                  </div>
                  
                  {/* Name and description */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-white/90 text-sm font-medium">{persona.name}</p>
                    <p className="text-white/40 text-[11px] truncate">{persona.description}</p>
                  </div>
                  
                  {/* Preview button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(persona);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-3 h-3 text-white/50" fill="currentColor" />
                  </motion.button>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoicePersonaSelector;
