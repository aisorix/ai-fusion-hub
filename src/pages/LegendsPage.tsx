import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, History, X, BookOpen, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import LegendCard, { type Persona } from '@/components/legends/LegendCard';
import LegendChat from '@/components/legends/LegendChat';
import LegendHistory from '@/components/legends/LegendHistory';

// Avatar imports
import jcBose from '@/assets/legends/jc_bose.png';
import humayun from '@/assets/legends/humayun.png';
import nazrul from '@/assets/legends/nazrul.png';
import jobs from '@/assets/legends/jobs.png';
import einstein from '@/assets/legends/einstein.png';
import tesla from '@/assets/legends/tesla.png';
import kalam from '@/assets/legends/kalam.png';
import bcsCoach from '@/assets/legends/bcs_coach.png';
import legalBot from '@/assets/legends/legal_bot.png';
import financeBot from '@/assets/legends/finance_bot.png';

const personas: Record<string, Persona[]> = {
  'Bengali Legends': [
    { id: 'jc_bose', name: 'Sir Jagadish Chandra Bose', role: 'Innovation & Research Guide', desc: 'The symbol of relentless research. Best for science projects and innovation.', avatar: jcBose, category: 'bengali' },
    { id: 'humayun', name: 'Humayun Ahmed', role: 'Creative Writing & Imagination', desc: "Bangladesh's beloved storyteller. The best companion for writing stories and scripts.", avatar: humayun, category: 'bengali' },
    { id: 'nazrul', name: 'Kazi Nazrul Islam', role: 'Motivation & Passion', desc: 'The Rebel Poet. Need energy or startup drive? His rebellious spirit will fuel you.', avatar: nazrul, category: 'bengali' },
  ],
  'Global Icons': [
    { id: 'jobs', name: 'Steve Jobs', role: 'Design, Marketing & UX', desc: "Focuses on 'Perfection' and 'Simplicity'. The ultimate mentor for startup founders.", avatar: jobs, badge: 'Must Have', category: 'global' },
    { id: 'einstein', name: 'Albert Einstein', role: 'Physics, Math & Logic', desc: 'The Problem Solver. Explains complex science and math in a fun, simple way.', avatar: einstein, category: 'global' },
    { id: 'tesla', name: 'Nikola Tesla', role: 'Electrical Engineering & Future Tech', desc: 'The Futurist. Ideal for engineering students and innovation discussions.', avatar: tesla, category: 'global' },
    { id: 'kalam', name: 'APJ Abdul Kalam', role: 'Student Career & Inspiration', desc: 'The Dreamer. Teaches students how to dream big. A tonic for motivation.', avatar: kalam, category: 'global' },
  ],
  'Specialists': [
    { id: 'bcs_coach', name: 'The BCS Cadre', role: 'Govt. Job & Exam Prep', desc: 'Your personal tutor for General Knowledge, Bangla Grammar, and BCS preparation.', avatar: bcsCoach, category: 'specialist' },
    { id: 'legal_bot', name: 'The Legal Advisor', role: 'BD Laws & Legal Aid', desc: 'Primary advice on land, family, and civil laws for the general public.', avatar: legalBot, category: 'specialist' },
    { id: 'finance_bot', name: 'The Financial Advisor', role: 'Investment & Savings', desc: 'Smart advice on savings certificates, stock market, and personal finance.', avatar: financeBot, category: 'specialist' },
  ],
};

const allPersonas = Object.values(personas).flat();

const LegendsPage: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [restoredMessages, setRestoredMessages] = useState<any[] | null>(null);

  const handleLoadHistory = (inputData: any, resultData: any) => {
    const persona = allPersonas.find(p => p.id === inputData?.personaId);
    if (persona && resultData?.messages) {
      setRestoredMessages(resultData.messages.map((m: any, i: number) => ({
        id: `h-${i}`,
        role: m.role,
        content: m.content,
      })));
      setSelectedPersona(persona);
      setShowHistory(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <SEOHead title="Sorix Legends | AI Historical Conversations | AI Sorix" description="Chat with history's greatest minds powered by AI. Converse with Einstein, Tesla, Nazrul, and more legendary figures." path="/legends" />
      {/* Header */}
      {!selectedPersona && (
        <div className="shrink-0 border-b border-border px-4 py-3 flex items-center gap-3 bg-card/80 backdrop-blur-sm">
          <button onClick={() => navigate(-1)}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-foreground text-sm">Sorix Legends</h1>
            <p className="text-[10px] text-muted-foreground">Chat with Historical Icons</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
            <Crown className="w-3 h-3" />
            3x Tokens
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} className="gap-1.5">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedPersona ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <LegendChat
                persona={selectedPersona}
                onBack={() => { setSelectedPersona(null); setRestoredMessages(null); }}
                initialMessages={restoredMessages || undefined}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ScrollArea className="h-full">
                <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-16">
                  {Object.entries(personas).map(([section, items]) => (
                    <div key={section}>
                      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <span className={
                          section === 'Bengali Legends' ? 'text-amber-500' :
                          section === 'Global Icons' ? 'text-blue-500' : 'text-purple-500'
                        }>●</span>
                        {section}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(persona => (
                          <LegendCard key={persona.id} persona={persona} onSelect={setSelectedPersona} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Sheet */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-foreground text-sm">Conversation History</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <LegendHistory onLoad={handleLoadHistory} />
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegendsPage;
