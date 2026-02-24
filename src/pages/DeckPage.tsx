import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Presentation, History, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { deckApi, type Slide, type DeckHistoryItem } from '@/services/deckApi';
import DeckPromptBar from '@/components/deck/DeckPromptBar';
import DeckThemePicker, { type DeckTheme } from '@/components/deck/DeckThemePicker';
import DeckSlideViewer from '@/components/deck/DeckSlideViewer';
import DeckHistory from '@/components/deck/DeckHistory';
import DeckActions from '@/components/deck/DeckActions';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';

const SLIDE_COUNTS = [3, 5, 8, 10];

const DeckPage: React.FC = () => {
  const { user, setUser } = useChatStore();

  const [slides, setSlides] = useState<Slide[]>([]);
  const [title, setTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<DeckTheme>('dark');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const tokensRemaining = user.tokensLimit - user.tokensUsed;
  const estimatedCost = slideCount * 2000 + slideCount * 12000;

  const handleGenerate = async (prompt: string) => {
    if (tokensRemaining < estimatedCost) {
      setShowUpgrade(true);
      return;
    }

    setIsGenerating(true);
    setSlides([]);
    setTitle('');

    try {
      const result = await deckApi.generate(prompt, slideCount, selectedTheme, true);
      setSlides(result.slides);
      setTitle(result.title);
      setRefreshHistory((p) => p + 1);
      setUser({ ...user, tokensUsed: result.totalTokensUsed });
      toast.success(`Generated ${result.slides.length} slides`);
    } catch (err: any) {
      if (err.message === 'insufficient_tokens') {
        setShowUpgrade(true);
      } else {
        toast.error(err.message || 'Failed to generate presentation');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistoryLoad = (item: DeckHistoryItem) => {
    setSlides(item.result_data.slides || []);
    setTitle(item.title);
    if (item.input_data?.theme) {
      setSelectedTheme(item.input_data.theme as DeckTheme);
    }
    setShowHistory(false);
  };

  const handleUpdateSlide = (index: number, updated: Slide) => {
    setSlides((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link
              to="/chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Presentation className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix Deck</h1>
                <p className="text-[10px] text-muted-foreground">AI Presentations</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="Presentation History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-5">
          <DeckPromptBar onGenerate={handleGenerate} isGenerating={isGenerating} />

          {/* Controls row */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            {/* Slide count */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Slides:</span>
              {SLIDE_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSlideCount(n)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    slideCount === n
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <DeckThemePicker selected={selectedTheme} onSelect={setSelectedTheme} />
          </div>

          {/* Token info */}
          <p className="text-[10px] text-muted-foreground/50 text-center -mt-2">
            {tokensRemaining.toLocaleString()} tokens remaining • Est. cost: {estimatedCost.toLocaleString()} tokens
          </p>

          {/* Actions */}
          {slides.length > 0 && <DeckActions slides={slides} title={title} theme={selectedTheme} />}

          {/* Slides */}
          <DeckSlideViewer
            slides={slides}
            theme={selectedTheme}
            isGenerating={isGenerating}
            skeletonCount={slideCount}
            onUpdateSlide={handleUpdateSlide}
          />
        </div>
      </main>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-foreground">Presentation History</h2>
                <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-muted rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DeckHistory onLoad={handleHistoryLoad} refreshTrigger={refreshHistory} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default DeckPage;
