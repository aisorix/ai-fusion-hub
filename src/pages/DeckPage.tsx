import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Presentation, History, X } from 'lucide-react';
import DeckSlideshow from '@/components/deck/DeckSlideshow';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { deckApi, type Slide, type DeckHistoryItem } from '@/services/deckApi';
import DeckPromptBar from '@/components/deck/DeckPromptBar';
import DeckThemePicker, { type DeckTheme } from '@/components/deck/DeckThemePicker';
import DeckTextContentPicker, { type TextContent } from '@/components/deck/DeckTextContentPicker';
import DeckArtStylePicker, { type ArtStyle } from '@/components/deck/DeckArtStylePicker';
import DeckSlideViewer from '@/components/deck/DeckSlideViewer';
import DeckHistory from '@/components/deck/DeckHistory';
import DeckActions from '@/components/deck/DeckActions';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';

const SLIDE_COUNTS = [3, 5, 8, 10, 12, 15, 20, 25, 30];

const DeckPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useChatStore();

  const [slides, setSlides] = useState<Slide[]>([]);
  const [title, setTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<DeckTheme>('dark');
  const [slideCount, setSlideCount] = useState(5);
  const [customSlideCount, setCustomSlideCount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [textContent, setTextContent] = useState<TextContent>('concise');
  const [artStyle, setArtStyle] = useState<ArtStyle>('illustration');
  const [customArtStyle, setCustomArtStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [historyItems, setHistoryItems] = useState<DeckHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyLoadingId, setHistoryLoadingId] = useState<string | null>(null);

  // Pre-fetch history on mount
  useEffect(() => {
    deckApi.getHistory().then(items => {
      setHistoryItems(items);
      setHistoryLoading(false);
    }).catch(() => setHistoryLoading(false));
  }, []);

  const effectiveSlideCount = showCustomInput && customSlideCount ? parseInt(customSlideCount) || slideCount : slideCount;
  const tokensRemaining = user.tokensLimit - user.tokensUsed;
  const estimatedCost = effectiveSlideCount * 2000 + effectiveSlideCount * 12000;
  const isFreeUser = user.plan === 'free';

  // Count total slides from history for free users
  const totalSlidesUsed = isFreeUser
    ? historyItems.reduce((sum, item) => sum + (item.result_data?.slides?.length || 0), 0)
    : 0;
  const freeSlidesRemaining = 20 - totalSlidesUsed;

  const handleGenerate = async (prompt: string) => {
    if (isFreeUser) {
      if (freeSlidesRemaining <= 0) {
        setShowUpgrade(true);
        return;
      }
    } else if (tokensRemaining < estimatedCost) {
      setShowUpgrade(true);
      return;
    }

    setIsGenerating(true);
    setSlides([]);
    setTitle('');

    const finalArtStyle = artStyle === 'custom' ? customArtStyle : artStyle;

    try {
      const result = await deckApi.generate(prompt, effectiveSlideCount, selectedTheme, true, textContent, finalArtStyle);
      setSlides(result.slides);
      setTitle(result.title);
      // Instantly add to local history cache
      const newHistoryItem: DeckHistoryItem = {
        id: crypto.randomUUID(),
        title: result.title,
        input_data: { prompt, slideCount: effectiveSlideCount, theme: selectedTheme },
        result_data: { slides: result.slides, tokens_used: result.tokensUsed },
        created_at: new Date().toISOString(),
      };
      setHistoryItems(prev => [newHistoryItem, ...prev]);
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

  const handleHistoryLoad = async (item: DeckHistoryItem) => {
    setHistoryLoadingId(item.id);
    try {
      const full = await deckApi.getPresentation(item.id);
      if (!full?.result_data?.slides) {
        toast.error('Failed to load presentation data');
        return;
      }
      setSlides(full.result_data.slides);
      setTitle(full.title);
      if (full.input_data?.theme) {
        setSelectedTheme(full.input_data.theme as DeckTheme);
      }
      setShowHistory(false);
    } catch {
      toast.error('Failed to load presentation');
    } finally {
      setHistoryLoadingId(null);
    }
  };

  const handleUpdateSlide = (index: number, updated: Slide) => {
    setSlides((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead title="Sorix Deck | AI Presentations | AI Sorix" description="Create stunning AI-powered presentations instantly. Generate professional slides with custom themes, art styles, and content." path="/deck" />
      {/* Header */}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
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
        <div className="max-w-3xl mx-auto px-3 md:px-4 py-4 md:py-12 flex flex-col items-center gap-4 md:gap-5">
          <DeckPromptBar onGenerate={handleGenerate} isGenerating={isGenerating} />

          {/* Slide count row */}
          <div className="w-full">
            <span className="text-xs text-muted-foreground mb-2 block">Slides:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {SLIDE_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => { setSlideCount(n); setShowCustomInput(false); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    slideCount === n && !showCustomInput
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showCustomInput
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                Custom
              </button>
              {showCustomInput && (
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={customSlideCount}
                  onChange={(e) => setCustomSlideCount(e.target.value)}
                  placeholder="1-50"
                  className="w-16 px-2 py-1 rounded-lg text-xs border border-border bg-card text-foreground outline-none focus:border-primary"
                />
              )}
            </div>
          </div>

          {/* Text Content */}
          <DeckTextContentPicker selected={textContent} onSelect={setTextContent} />

          {/* Art Style */}
          <DeckArtStylePicker
            selected={artStyle}
            onSelect={setArtStyle}
            customStyle={customArtStyle}
            onCustomStyleChange={setCustomArtStyle}
          />

          {/* Theme */}
          <div className="w-full flex items-center gap-3">
            <DeckThemePicker selected={selectedTheme} onSelect={setSelectedTheme} />
          </div>

          {/* Token / Free slides info */}
          <p className="text-[10px] text-muted-foreground/50 text-center -mt-2">
            {isFreeUser
              ? `${totalSlidesUsed}/20 free slides used • ${freeSlidesRemaining > 0 ? `${freeSlidesRemaining} remaining` : 'Upgrade for more'}`
              : `${tokensRemaining.toLocaleString()} tokens remaining • Est. cost: ${estimatedCost.toLocaleString()} tokens`
            }
          </p>

          {/* Actions */}
          {slides.length > 0 && <DeckActions slides={slides} title={title} theme={selectedTheme} onSlideshow={() => setShowSlideshow(true)} />}

          {/* Slides */}
          <DeckSlideViewer
            slides={slides}
            theme={selectedTheme}
            isGenerating={isGenerating}
            skeletonCount={effectiveSlideCount}
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
              className="fixed inset-0 bg-black/30 z-[200]"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-card border-l border-border z-[210] flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-foreground">Presentation History</h2>
                <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-muted rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DeckHistory onLoad={handleHistoryLoad} items={historyItems} loading={historyLoading} loadingId={historyLoadingId} onDelete={(id) => setHistoryItems(prev => prev.filter(i => i.id !== id))} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <AnimatePresence>
        {showSlideshow && slides.length > 0 && (
          <DeckSlideshow slides={slides} theme={selectedTheme} onClose={() => setShowSlideshow(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckPage;
