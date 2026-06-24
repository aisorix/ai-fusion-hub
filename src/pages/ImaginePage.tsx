import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, ImageIcon, History, X, Wand2, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { imagineApi, type ImageGeneration } from '@/services/imagineApi';
import ImaginePromptBar from '@/components/imagine/ImaginePromptBar';
import { imageModels, getImageModelCost, type ImageModel } from '@/components/imagine/ImagineModelSelector';
import ImagineOptionsPanel, {
  type AspectRatio,
  type Resolution,
  type OutputFormat,
  type OutputCount,
} from '@/components/imagine/ImagineOptionsPanel';
import ImagineCanvas from '@/components/imagine/ImagineCanvas';
import ImagineHistory from '@/components/imagine/ImagineHistory';
import ImagineExplorer from '@/components/imagine/ImagineExplorer';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';
import TokenCostChip from '@/components/shared/TokenCostChip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const FREE_IMAGINE_LIMIT = 3;

const ImaginePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useChatStore();
  const { user: authUser } = useAuth();

  const [selectedModel, setSelectedModel] = useState<ImageModel>(imageModels[0]);
  const [aspect, setAspect] = useState<AspectRatio>('1:1');
  const [resolution, setResolution] = useState<Resolution>('1K');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [count, setCount] = useState<OutputCount>(1);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [injectPrompt, setInjectPrompt] = useState<string | undefined>();
  const [injectAttachmentUrl, setInjectAttachmentUrl] = useState<string | undefined>();
  const [injectKey, setInjectKey] = useState(0);
  // When user submits a follow-up prompt with no new attachment, refine the
  // currently-displayed image instead of starting fresh.
  const [refineEnabled, setRefineEnabled] = useState(true);

  const isPaidImagine = user.plan !== 'free';
  const [freeRendersUsed, setFreeRendersUsed] = useState<number>(0);
  const freeRendersLeft = Math.max(0, FREE_IMAGINE_LIMIT - freeRendersUsed);
  const trialExhausted = !isPaidImagine && freeRendersLeft <= 0;

  // Server-truth: hydrate trial counter from profiles.
  useEffect(() => {
    if (!authUser?.id || isPaidImagine) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('imagine_free_renders_used')
        .eq('user_id', authUser.id)
        .maybeSingle();
      if (!cancelled) setFreeRendersUsed((data as any)?.imagine_free_renders_used ?? 0);
    })();
    return () => { cancelled = true; };
  }, [authUser?.id, isPaidImagine]);


  const tokensRemaining = user.tokensLimit - user.tokensUsed;
  const isProPlus = user.plan === 'pro' || user.plan === 'premium';

  const resMultiplier = resolution === '4K' ? 4 : resolution === '2K' ? 2 : 1;
  const costEstimate = getImageModelCost(selectedModel) * count * resMultiplier;

  // Handoff from Cineshoot: inject prompt
  useEffect(() => {
    const state = location.state as { prompt?: string; imageUrl?: string } | null;
    if (state?.prompt || state?.imageUrl) {
      if (state.prompt) setInjectPrompt(state.prompt);
      if (state.imageUrl) setInjectAttachmentUrl(state.imageUrl);
      setInjectKey(k => k + 1);
      // clear navigation state so refresh doesn't re-inject
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-device restore: on mount, if canvas is empty, hydrate from latest DB row
  useEffect(() => {
    if (imageUrls.length > 0 || currentPrompt) return;
    let cancelled = false;
    imagineApi
      .getHistory()
      .then((items) => {
        if (cancelled || !items || items.length === 0) return;
        const latest = items[0];
        setImageUrls([latest.image_url]);
        setCurrentPrompt(latest.prompt);
        if (latest.model) {
          const m = imageModels.find((im) => im.modelId === latest.model);
          if (m) setSelectedModel(m);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseTemplate = (prompt: string, asp?: AspectRatio, res?: Resolution, sampleUrl?: string) => {
    setInjectPrompt(prompt);
    setInjectAttachmentUrl(sampleUrl);
    setInjectKey(k => k + 1);
    if (asp) setAspect(asp);
    if (res) {
      if ((res === '2K' || res === '4K') && !isProPlus) {
        // keep current resolution; user will see upgrade if they generate at higher tier
      } else {
        setResolution(res);
      }
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleGenerate = async (prompt: string, attachments?: Attachment[]) => {
    // Free trial gate (3 renders for free users).
    if (!isPaidImagine && trialExhausted) {
      setShowUpgrade(true);
      return;
    }
    if (isPaidImagine && tokensRemaining < costEstimate) {
      setShowUpgrade(true);
      return;
    }

    setCurrentPrompt(prompt);
    setIsGenerating(true);

    let imageData: string | undefined;
    if (attachments?.length) {
      const imgAtt = attachments.find((a) => a.type === 'image' && a.url);
      if (imgAtt) imageData = imgAtt.url;
    }
    // Auto-refine: if no new attachment but we have a previously displayed image, use it as context
    if (!imageData && refineEnabled && imageUrls[0]) {
      imageData = imageUrls[0];
    }
    if (!imageData) setImageUrls([]);

    try {
      const result = await imagineApi.generateImage({
        prompt,
        model: selectedModel.modelId,
        imageData,
        aspectRatio: aspect,
        resolution,
        format,
        count,
      });
      setImageUrls(result.imageUrls || (result.imageUrl ? [result.imageUrl] : []));
      setRefreshHistory((p) => p + 1);
      setUser({ ...user, tokensUsed: result.totalTokensUsed });
      if (!isPaidImagine && typeof result.freeRendersUsed === 'number') {
        setFreeRendersUsed(result.freeRendersUsed);
      } else if (!isPaidImagine) {
        setFreeRendersUsed((n) => n + (result.imageUrls?.length || 1));
      }
    } catch (err: any) {
      if (err.message === 'insufficient_tokens' || err.message === 'free_trial_exhausted') {
        setShowUpgrade(true);
      } else {
        toast.error(err.message || 'Failed to generate image');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleHistorySelect = (gen: ImageGeneration) => {
    setImageUrls([gen.image_url]);
    setCurrentPrompt(gen.prompt);
    if (gen.model) {
      const m = imageModels.find((im) => im.modelId === gen.model);
      if (m) setSelectedModel(m);
    }
    setShowHistory(false);
    requestAnimationFrame(() => {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead
        title="Sorix Imagine | AI Image Generation | AI Sorix"
        description="Generate beautiful AI images with multiple artistic styles. Create stunning visuals from text prompts instantly."
        path="/imagine"
      />
      {/* Header */}
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-foreground truncate">Sorix Imagine</h1>
                <p className="hidden sm:block text-[10px] text-muted-foreground">AI Image Generation</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl border border-border/60 bg-card/60 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Generation History"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline text-[12.5px] font-medium">History</span>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-3 pb-6 sm:pt-5 sm:pb-8 md:pt-8 flex flex-col gap-4 sm:gap-5">
          {!isPaidImagine && (
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                <p className="text-xs sm:text-sm text-foreground truncate">
                  <span className="font-semibold">Free trial:</span>{' '}
                  <span className="text-muted-foreground">{freeRendersLeft} of {FREE_IMAGINE_LIMIT} images left</span>
                </p>
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Upgrade
              </button>
            </div>
          )}


          {/* Prompt bar with embedded model picker */}
          <div className="relative z-[60]">
            <ImaginePromptBar
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              userPlan={user.plan}
              onUpgrade={() => setShowUpgrade(true)}
              injectPrompt={injectPrompt}
              injectAttachmentUrl={injectAttachmentUrl}
              injectKey={injectKey}
            />
          </div>

          <div className="flex flex-col items-center gap-2 -mt-1">
            <TokenCostChip
              cost={costEstimate}
              remaining={tokensRemaining}
              label={`per image · ${selectedModel.shortName}`}
              hint="Cost depends on model tier, resolution, and number of images."
            />
            {imageUrls.length > 0 && refineEnabled && (
              <button
                onClick={() => setRefineEnabled(false)}
                className="inline-flex items-center gap-1.5 text-[10.5px] text-muted-foreground hover:text-foreground transition-colors"
                title="Stop refining the previous image"
              >
                <Wand2 className="w-3 h-3 text-primary" />
                <span>Refining previous image</span>
                <span className="text-primary underline">· Clear</span>
              </button>
            )}
          </div>


          {/* Options panel */}
          <ImagineOptionsPanel
            aspect={aspect}
            onAspectChange={setAspect}
            resolution={resolution}
            onResolutionChange={setResolution}
            format={format}
            onFormatChange={setFormat}
            count={count}
            onCountChange={setCount}
            isProPlus={isProPlus}
            onUpgrade={() => setShowUpgrade(true)}
          />

          {/* Canvas */}
          <div ref={canvasRef} className="w-full pt-2">
            <ImagineCanvas
              imageUrls={imageUrls}
              isGenerating={isGenerating}
              prompt={currentPrompt}
              aspect={aspect}
              count={count}
              onGenerateVideo={(url, p) => navigate('/cineshoot', { state: { prompt: p, imageUrl: url } })}
            />
          </div>

          {/* Visual gap */}
          <div className="py-2 sm:py-4" />


          {/* Tabbed explorer: Templates | Your Creations */}
          <ImagineExplorer
            onSelectHistory={handleHistorySelect}
            refreshHistory={refreshHistory}
            onUseTemplate={handleUseTemplate}
          />

          <div className="h-6" />
        </div>
      </main>

      {/* Slide-in history panel */}
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
                <h2 className="font-bold text-foreground">Generation History</h2>
                <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-muted rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ImagineHistory onSelect={handleHistorySelect} refreshTrigger={refreshHistory} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default ImaginePage;
