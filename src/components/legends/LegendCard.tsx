import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Persona {
  id: string;
  name: string;
  role: string;
  desc: string;
  avatar: string;
  badge?: string;
  category: 'bengali' | 'global' | 'specialist';
}

interface LegendCardProps {
  persona: Persona;
  onSelect: (persona: Persona) => void;
}

const categoryColors = {
  bengali: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  global: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  specialist: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
};

const categoryBadgeColors = {
  bengali: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  global: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  specialist: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const LegendCard: React.FC<LegendCardProps> = ({ persona, onSelect }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(persona)}
      className={cn(
        'relative group w-full text-left p-5 rounded-2xl border backdrop-blur-sm bg-gradient-to-br transition-shadow duration-300',
        'hover:shadow-xl hover:shadow-primary/5',
        categoryColors[persona.category]
      )}
    >
      {persona.badge && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-lg">
          <Star className="w-3 h-3" fill="white" />
          {persona.badge}
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-border/50 shadow-lg">
          <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm md:text-base truncate">{persona.name}</h3>
          <span className={cn('inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', categoryBadgeColors[persona.category])}>
            {persona.role}
          </span>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{persona.desc}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageSquare className="w-3.5 h-3.5" />
          Start Chat
        </div>
      </div>
    </motion.button>
  );
};

export default LegendCard;
