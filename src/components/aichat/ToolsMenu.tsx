import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Stethoscope,
  Leaf,
  Crown,
  Presentation,
  Workflow,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';

interface ToolsMenuProps {
  open: boolean;
  onClose: () => void;
}

const ToolsMenu = ({ open, onClose }: ToolsMenuProps) => {
  const navigate = useNavigate();
  const { language } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: 'agent', name: 'Sorix Agent', nameBn: 'সরিক্স এজেন্ট', desc: 'Autonomous task executor', descBn: 'স্বয়ংক্রিয় কাজ সম্পাদনকারী', icon: Bot, route: '/agent', gradient: 'from-cyan-500 to-teal-500', free: false },
    { id: 'imagine', name: 'Sorix Imagine', nameBn: 'সরিক্স ইমাজিন', desc: 'Generate & edit images', descBn: 'ছবি তৈরি ও সম্পাদনা', icon: Palette, route: '/imagine', gradient: 'from-cyan-500 to-blue-500', free: false },
    { id: 'health', name: 'Sorix Health', nameBn: 'সরিক্স হেলথ', desc: 'AI health analysis', descBn: 'এআই স্বাস্থ্য বিশ্লেষণ', icon: Stethoscope, route: '/health', gradient: 'from-emerald-500 to-teal-500', free: true },
    { id: 'agro', name: 'Sorix Agro', nameBn: 'সরিক্স এগ্রো', desc: 'AI agriculture advisor', descBn: 'এআই কৃষি পরামর্শদাতা', icon: Leaf, route: '/agro', gradient: 'from-green-500 to-lime-500', free: true },
    { id: 'legends', name: 'Sorix Legends', nameBn: 'সরিক্স লিজেন্ডস', desc: 'Chat with legends', descBn: 'কিংবদন্তিদের সাথে চ্যাট', icon: Crown, route: '/legends', gradient: 'from-blue-500 to-cyan-500', free: false },
    { id: 'deck', name: 'Sorix Deck', nameBn: 'সরিক্স ডেক', desc: 'AI presentations', descBn: 'এআই প্রেজেন্টেশন', icon: Presentation, route: '/deck', gradient: 'from-cyan-500 to-blue-500', free: false },
    { id: 'flowbuilder', name: 'Sorix FlowBuilder', nameBn: 'সরিক্স ফ্লোবিল্ডার', desc: 'Diagrams & flowcharts', descBn: 'ডায়াগ্রাম ও ফ্লোচার্ট', icon: Workflow, route: '/flowbuilder', gradient: 'from-violet-500 to-purple-500', free: false },
  ];

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Defer to avoid catching the same click that opened the menu
    const t = setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  const handleSelect = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute bottom-full left-0 mb-2 z-50 origin-bottom-left',
            'w-[300px] sm:w-[320px] max-w-[calc(100vw-2rem)]',
            'rounded-2xl overflow-hidden',
            'bg-popover border border-border shadow-2xl backdrop-blur-xl'
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
            <p className="text-sm font-semibold text-foreground">
              {language === 'bn' ? 'সরিক্স টুলস' : 'Sorix Tools'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {language === 'bn' ? 'যেকোনো টুলে দ্রুত ঢুকুন' : 'Jump into any tool instantly'}
            </p>
          </div>

          {/* Tool list */}
          <div className="py-1.5 max-h-[60vh] overflow-y-auto">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.route)}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 w-full text-left',
                  'transition-colors hover:bg-accent/60'
                )}
              >
                <div
                  className={cn(
                    'shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm',
                    tool.gradient
                  )}
                >
                  <tool.icon className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground truncate">
                      {language === 'bn' ? tool.nameBn : tool.name}
                    </span>
                    {tool.free && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 shrink-0">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {language === 'bn' ? tool.descBn : tool.desc}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>

          {/* Footer */}
          <button
            onClick={() => handleSelect('/tools')}
            className={cn(
              'flex items-center justify-center gap-1.5 w-full px-4 py-2.5',
              'text-xs font-medium text-primary',
              'border-t border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors'
            )}
          >
            {language === 'bn' ? 'সব টুলস দেখুন' : 'View all tools'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolsMenu;
