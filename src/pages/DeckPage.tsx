import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Presentation, History, X, Layers, Undo2, Redo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { deckApi, type Slide, type DeckHistoryItem } from '@/services/deckApi';
import DeckPromptBar from '@/components/deck/DeckPromptBar';
import DeckThemeShowcase from '@/components/deck/DeckThemeShowcase';
import type { DeckTheme } from '@/components/deck/DeckThemePicker';
import type { TextContent } from '@/components/deck/DeckTextContentPicker';
import DeckTextContentCard from '@/components/deck/DeckTextContentCard';
import DeckArtStylePicker, { type ArtStyle } from '@/components/deck/DeckArtStylePicker';
import DeckLanguageSelector, { type DeckLanguage } from '@/components/deck/DeckLanguageSelector';
// DeckSlideViewer removed — replaced by DeckEditor
import DeckHistory from '@/components/deck/DeckHistory';
import DeckActions from '@/components/deck/DeckActions';
import DeckSlideshow from '@/components/deck/DeckSlideshow';
import DeckExplorer from '@/components/deck/DeckExplorer';
import DeckAdvancedPanel, { type DeckAdvancedValues } from '@/components/deck/DeckAdvancedPanel';
import DeckEditor from '@/components/deck/editor/DeckEditor';
import DeckCreateNewButton from '@/components/deck/editor/DeckCreateNewButton';
import DeckThemePicker from '@/components/deck/DeckThemePicker';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';
import { cn } from '@/lib/utils';

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
  const [language, setLanguage] = useState<DeckLanguage>('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [historyItems, setHistoryItems] = useState<DeckHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyLoadingId, setHistoryLoadingId] = useState<string | null>(null);
  const [injectPrompt, setInjectPrompt] = useState<string | undefined>();
  const [injectKey, setInjectKey] = useState(0);
  const [advanced, setAdvanced] = useState<DeckAdvancedValues>({
    format: 'presentation',
    cardSize: 'traditional',
    scenario: 'general',
    audience: 'auto',
    tone: 'neutral',
    aspectRatio: '16:9',
    additionalInstructions: '',
  });

  useEffect(() => {
    deckApi.getHistory().then(items => {
      setHistoryItems(items);
      setHistoryLoading(false);
    }).catch(() => setHistoryLoading(false));
  }, []);

  const effectiveSlideCount = showCustomInput && customSlideCount
    ? parseInt(customSlideCount) || slideCount
    : slideCount;
  const tokensRemaining = user.tokensLimit - user.tokensUsed;
  const estimatedCost = effectiveSlideCount * 2000 + effectiveSlideCount * 12000;
  const isFreeUser = user.plan === 'free';

  const totalSlidesUsed = isFreeUser
    ? historyItems.reduce((sum, item) => sum + (item.result_data?.slides?.length || item.input_data?.slideCount || 0), 0)
    : 0;
  const freeSlidesRemaining = Math.max(0, 20 - totalSlidesUsed);

  const slidesRef = useRef<HTMLDivElement>(null);

  const handleUseTemplate = (prompt: string, recommendedSlides?: number) => {
    setInjectPrompt(prompt);
    setInjectKey(k => k + 1);
    if (recommendedSlides && SLIDE_COUNTS.includes(recommendedSlides)) {
      setSlideCount(recommendedSlides);
      setShowCustomInput(false);
    }
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleGenerate = async (prompt: string) => {
    if (isFreeUser) {
      if (freeSlidesRemaining <= 0) { setShowUpgrade(true); return; }
    } else if (tokensRemaining < estimatedCost) {
      setShowUpgrade(true); return;
    }

    setIsGenerating(true);
    setSlides([]);
    setTitle('');

    const finalArtStyle = artStyle === 'custom' ? customArtStyle : artStyle;

    try {
      const result = await deckApi.generate(
        prompt, effectiveSlideCount, selectedTheme, true, textContent, finalArtStyle, language,
        {
          format: advanced.format,
          cardSize: advanced.cardSize,
          scenario: advanced.scenario,
          audience: advanced.audience,
          tone: advanced.tone,
          aspectRatio: advanced.aspectRatio,
          additionalInstructions: advanced.additionalInstructions,
        }
      );
      setSlides(result.slides);
      setTitle(result.title);
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
      requestAnimationFrame(() => {
        slidesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err: any) {
      if (err.message === 'insufficient_tokens') setShowUpgrade(true);
      else toast.error(err.message || 'Failed to generate presentation');
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
      if (full.input_data?.theme) setSelectedTheme(full.input_data.theme as DeckTheme);
      const inp: any = full.input_data;
      if (inp?.textContent) setTextContent(inp.textContent as TextContent);
      if (inp?.artStyle) setArtStyle(inp.artStyle as ArtStyle);
      setShowHistory(false);
      requestAnimationFrame(() => {
        slidesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch {
      toast.error('Failed to load presentation');
    } finally {
      setHistoryLoadingId(null);
    }
  };

  const handleUpdateSlide = (index: number, updated: Slide) => {
    setSlides(prev => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleCreateNew = () => {
    setSlides([]);
    setTitle('');
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleAddAiSlide = async (prompt: string, layout: Slide['layout'], insertAt: number) => {
    const finalArtStyle = artStyle === 'custom' ? customArtStyle : artStyle;
    const result = await deckApi.generateSingleSlide(prompt, {
      theme: selectedTheme,
      textContent,
      artStyle: finalArtStyle,
      language,
      layout,
      slideNumber: insertAt + 1,
    });
    setSlides(prev => {
      const next = [...prev];
      // Replace placeholder at insertAt if present, else insert
      next.splice(insertAt, 1, result.slide);
      return next.map((s, i) => ({ ...s, slide_number: i + 1 }));
    });
    setUser({ ...user, tokensUsed: result.totalTokensUsed });
  };

  const showEditor = slides.length > 0 || isGenerating;


  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead
        title="Sorix Deck | AI Presentations | AI Sorix"
        description="Create stunning AI-powered presentations instantly. Generate professional slides with custom themes, art styles, and multilingual content."
        path="/deck"
      />

      {/* Header — matches Imagine */}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                <Presentation className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-foreground truncate">Sorix Deck</h1>
                <p className="hidden sm:block text-[10px] text-muted-foreground">AI Presentations</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl border border-border/60 bg-card/60 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Presentation History"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline text-[12.5px] font-medium">History</span>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      {showEditor ? (
        <>
          {slides.length > 0 && (
            <div className="shrink-0 border-b border-border/40 bg-card/40 backdrop-blur-md px-3 sm:px-5 py-2">
              <DeckActions
                slides={slides}
                title={title}
                theme={selectedTheme}
                onSlideshow={() => setShowSlideshow(true)}
              />
            </div>
          )}
          <DeckEditor
            slides={slides}
            onSlidesChange={setSlides}
            theme={selectedTheme}
            isGenerating={isGenerating}
            expectedSlideCount={effectiveSlideCount}
            onCreateNew={handleCreateNew}
            onAddAiSlide={handleAddAiSlide}
          />
        </>
      ) : (
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-3 pb-6 sm:pt-5 sm:pb-8 md:pt-8 flex flex-col gap-4 sm:gap-5">

            {/* Prompt bar */}
            <div className="relative z-[60]">
              <DeckPromptBar
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                injectPrompt={injectPrompt}
                injectKey={injectKey}
              />
            </div>

            {/* Tokens / free-slides pill */}
            <div className="flex justify-center -mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[10.5px] text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary/70" />
                {isFreeUser ? (
                  <>
                    <span className="tabular-nums">{totalSlidesUsed}/20</span> free slides used
                    <span className="text-muted-foreground/40">·</span>
                    <span className="tabular-nums">{freeSlidesRemaining}</span> remaining
                  </>
                ) : (
                  <>
                    <span className="tabular-nums">{tokensRemaining.toLocaleString()}</span> tokens left
                    <span className="text-muted-foreground/40">·</span>
                    <span className="tabular-nums">{estimatedCost.toLocaleString()}</span> per run
                  </>
                )}
              </span>
            </div>

            {/* Options panel — Slides + Language + Image style */}
            <div className="w-full rounded-2xl border border-border/60 bg-card/60 p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-[13px] font-semibold text-foreground">Slides</h3>
                  <span className="text-[11px] text-muted-foreground">· {effectiveSlideCount}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SLIDE_COUNTS.map((n) => {
                    const active = slideCount === n && !showCustomInput;
                    return (
                      <button
                        key={n}
                        onClick={() => { setSlideCount(n); setShowCustomInput(false); }}
                        className={cn(
                          'min-w-[34px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                      showCustomInput
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
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
                      className="w-20 px-2 py-1 rounded-lg text-xs border border-border bg-card text-foreground outline-none focus:border-primary"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-[13px] font-semibold text-foreground">Language</h3>
                  <span className="text-[10.5px] text-muted-foreground">Multilingual</span>
                </div>
                <DeckLanguageSelector value={language} onChange={setLanguage} />
              </div>

              <div>
                <DeckArtStylePicker
                  selected={artStyle}
                  onSelect={setArtStyle}
                  customStyle={customArtStyle}
                  onCustomStyleChange={setCustomArtStyle}
                />
              </div>
            </div>

            <DeckAdvancedPanel
              values={advanced}
              onChange={(patch) => setAdvanced((prev) => ({ ...prev, ...patch }))}
            />

            <DeckTextContentCard selected={textContent} onSelect={setTextContent} />

            <DeckThemeShowcase selected={selectedTheme} onSelect={setSelectedTheme} />

            <div className="py-2 sm:py-4" />

            <DeckExplorer
              onUseTemplate={handleUseTemplate}
              historyItems={historyItems}
              historyLoading={historyLoading}
              historyLoadingId={historyLoadingId}
              onLoadHistory={handleHistoryLoad}
              onDeleteHistory={(id) => setHistoryItems(prev => prev.filter(i => i.id !== id))}
            />

            <div className="h-6" />
          </div>
        </main>
      )}


      {/* History side panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200]"
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
                <DeckHistory
                  onLoad={handleHistoryLoad}
                  items={historyItems}
                  loading={historyLoading}
                  loadingId={historyLoadingId}
                  onDelete={(id) => setHistoryItems(prev => prev.filter(i => i.id !== id))}
                />
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
