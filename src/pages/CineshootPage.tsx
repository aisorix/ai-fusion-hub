import React, { useEffect, useRef, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Clapperboard, Film, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { cineshootApi, type VideoGeneration } from '@/services/cineshootApi';
import { useCineshootJob } from '@/hooks/useCineshootJob';
import CineshootPromptBar from '@/components/cineshoot/CineshootPromptBar';
import CineshootOptionsPanel from '@/components/cineshoot/CineshootOptionsPanel';
import CineshootCanvas from '@/components/cineshoot/CineshootCanvas';
import CineshootExplorer from '@/components/cineshoot/CineshootExplorer';
import PlanLockScreen from '@/components/shared/PlanLockScreen';
import {
  cineshootModels, estimateTokens, resolutionOptions,
  type CineshootModel, type VideoAspect, type VideoResolution,
} from '@/components/cineshoot/cineshootModels';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';
import TokenCostChip from '@/components/shared/TokenCostChip';
import { useSubscription } from '@/hooks/useSubscription';
import { meetsPlan } from '@/lib/planAccess';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const FREE_TRIAL_LIMIT = 2;


const CineshootPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useChatStore();
  const { currentPlan, isLoading: planLoading } = useSubscription();
  const { user: authUser } = useAuth();

  const [freeRendersUsed, setFreeRendersUsed] = useState<number>(0);
  const [trialLoaded, setTrialLoaded] = useState(false);
  const isPaidCineshoot = meetsPlan(currentPlan, 'premium_plus');
  const freeRendersLeft = Math.max(0, FREE_TRIAL_LIMIT - freeRendersUsed);
  const trialExhausted = !isPaidCineshoot && freeRendersLeft <= 0;

  useEffect(() => {
    if (!authUser?.id || isPaidCineshoot) { setTrialLoaded(true); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('cineshoot_free_renders_used')
        .eq('user_id', authUser.id)
        .maybeSingle();
      if (!cancelled) {
        setFreeRendersUsed((data as any)?.cineshoot_free_renders_used ?? 0);
        setTrialLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [authUser?.id, isPaidCineshoot]);


  const [selectedModel, setSelectedModel] = useState<CineshootModel>(cineshootModels[0]);
  const [aspect, setAspect] = useState<VideoAspect>('16:9');
  const [resolution, setResolution] = useState<VideoResolution>('1080p');
  const [duration, setDuration] = useState<number>(6);
  const [sound, setSound] = useState<boolean>(true);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [injectPrompt, setInjectPrompt] = useState<string | undefined>();
  const [injectAttachmentUrl, setInjectAttachmentUrl] = useState<string | undefined>();
  const [injectKey, setInjectKey] = useState(0);
  const [refineEnabled, setRefineEnabled] = useState(true);

  // Async job polling
  const { job, isPolling } = useCineshootJob(activeJobId, (final) => {
    if (final.status === 'completed' && final.videoUrl) {
      setVideoUrl(final.videoUrl);
      setRefreshHistory((p) => p + 1);
      if (typeof final.totalTokensUsed === 'number') {
        setUser({ ...user, tokensUsed: final.totalTokensUsed });
      }
    } else if (final.status === 'failed') {
      toast.error(final.error || 'Video generation failed. No tokens were charged.');
    }
    setActiveJobId(null);
  });

  const isGenerating = !!activeJobId || isPolling;

  useEffect(() => {
    const state = location.state as { prompt?: string; imageUrl?: string } | null;
    if (state?.prompt || state?.imageUrl) {
      if (state.prompt) setInjectPrompt(state.prompt);
      if (state.imageUrl) setInjectAttachmentUrl(state.imageUrl);
      setInjectKey((k) => k + 1);
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isProPlus = meetsPlan(currentPlan, 'pro');
  const tokensRemaining = user.tokensLimit - user.tokensUsed;

  useEffect(() => {
    const allowed = resolutionOptions(selectedModel);
    if (!allowed.includes(resolution)) setResolution(allowed[allowed.length - 1]);
    if (!selectedModel.durations.includes(duration)) {
      const closest = selectedModel.durations.reduce((a, b) => Math.abs(b - duration) < Math.abs(a - duration) ? b : a);
      setDuration(closest);
    }
    if (!selectedModel.supportsSound && sound) setSound(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel]);

  const costEstimate = estimateTokens(selectedModel, duration, resolution);

  const handleUseTemplate = (t: { prompt: string; aspect: VideoAspect; duration: number }) => {
    setInjectPrompt(t.prompt);
    setInjectKey((k) => k + 1);
    setAspect(t.aspect);
    if (selectedModel.durations.includes(t.duration)) setDuration(t.duration);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleGenerate = async (prompt: string, attachments?: Attachment[]) => {
    if (!isPaidCineshoot) {
      if (trialExhausted) { setShowUpgrade(true); return; }
    } else if (tokensRemaining < costEstimate) {
      setShowUpgrade(true); return;
    }
    if (activeJobId) return;

    const isRefining = refineEnabled && !!videoUrl && !attachments?.length;
    const finalPrompt = isRefining && currentPrompt
      ? `Previous video: ${currentPrompt}\nChanges requested: ${prompt}`
      : prompt;

    setCurrentPrompt(prompt);
    if (!isRefining) setVideoUrl(null);

    let imageData: string | undefined;
    if (attachments?.length) {
      const img = attachments.find((a) => a.type === 'image' && a.url);
      if (img) imageData = img.url;
    }

    try {
      const { jobId } = await cineshootApi.startJob({
        prompt: finalPrompt,
        model: selectedModel.modelId,
        aspectRatio: aspect,
        resolution,
        durationSec: duration,
        sound,
        imageData,
      });
      setActiveJobId(jobId);
      if (!isPaidCineshoot) {
        // Optimistically reflect the trial increment; backend will confirm.
        setFreeRendersUsed((n) => n + 1);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg === 'insufficient_tokens' || msg === 'free_trial_exhausted' || msg.includes('Free Cineshoot')) {
        setShowUpgrade(true);
      } else {
        toast.error(msg || 'Failed to start video generation');
      }
    }
  };


  const handleHistorySelect = (gen: VideoGeneration) => {
    setVideoUrl(gen.video_url);
    setCurrentPrompt(gen.prompt);
    if (gen.aspect_ratio === '16:9' || gen.aspect_ratio === '9:16' || gen.aspect_ratio === '1:1') {
      setAspect(gen.aspect_ratio);
    }
    if (gen.model) {
      const m = cineshootModels.find((cm) => cm.modelId === gen.model);
      if (m) setSelectedModel(m);
    }
    requestAnimationFrame(() => canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };

  const seo = (
    <SEOHead
      title="Sorix Cineshoot | AI Video Generation | AI Sorix"
      description="Generate cinematic AI videos from text, images, or videos. Multiple frontier video models including Veo 3.1, Sora 2 Pro, Kling, and Seedance."
      path="/cineshoot"
    />
  );

  if (planLoading) {
    return (
      <>
        {seo}
        <div className="min-h-[100dvh] flex items-center justify-center bg-background">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </>
    );
  }

  if (!isPaidCineshoot && trialLoaded && trialExhausted) {
    return (
      <>
        {seo}
        <PlanLockScreen
          toolName="Sorix Cineshoot"
          tagline="Free trial used up"
          description={`You've used your ${FREE_TRIAL_LIMIT} free Cineshoot renders. Upgrade to Premium Plus, Max, or Enterprise for unlimited cinematic video generation.`}
          requiredPlan="premium_plus"
          accentGradient="from-fuchsia-500 to-pink-500"
          icon={Clapperboard}
          features={[
            "Unlimited renders on frontier video models",
            "Veo 3.1, Sora 2 Pro, Kling, Seedance",
            "Text-to-video and image-to-video",
            "Up to 4K, customizable aspect ratio and duration",
            "Refine the previous render with a single prompt",
          ]}
        />
      </>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {seo}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">

        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shrink-0 shadow-md shadow-fuchsia-500/30">
              <Clapperboard className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-foreground truncate">Sorix Cineshoot</h1>
              <p className="hidden sm:block text-[10px] text-muted-foreground">AI Video Generation</p>
            </div>
          </div>
          {job?.status === 'rendering' || job?.status === 'uploading' ? (
            <div className="hidden sm:flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {job?.status === 'uploading' ? 'Finalizing…' : 'Rendering…'}
            </div>
          ) : null}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-3 pb-6 sm:pt-5 sm:pb-8 md:pt-8 flex flex-col gap-4 sm:gap-5">
          {!isPaidCineshoot && (
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/30">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-fuchsia-500 shrink-0" />
                <p className="text-xs sm:text-sm text-foreground truncate">
                  <span className="font-semibold">Free trial:</span>{' '}
                  <span className="text-muted-foreground">{freeRendersLeft} of {FREE_TRIAL_LIMIT} renders left</span>
                </p>
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Upgrade
              </button>
            </div>
          )}
          <div className="relative z-[60]">

            <CineshootPromptBar
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
              label={`per render · ${selectedModel.shortName}`}
              hint="Tokens are only deducted after a successful render."
            />
            {videoUrl && refineEnabled && !isGenerating && (
              <button
                onClick={() => setRefineEnabled(false)}
                className="inline-flex items-center gap-1.5 text-[10.5px] text-muted-foreground hover:text-foreground transition-colors"
                title="Stop refining the previous video"
              >
                <Film className="w-3 h-3 text-primary" />
                <span>Refining previous video</span>
                <span className="text-primary underline">· Clear</span>
              </button>
            )}
          </div>

          <CineshootOptionsPanel
            model={selectedModel}
            aspect={aspect}
            onAspectChange={setAspect}
            resolution={resolution}
            onResolutionChange={setResolution}
            duration={duration}
            onDurationChange={setDuration}
            sound={sound}
            onSoundChange={setSound}
            isProPlus={isProPlus}
            onUpgrade={() => setShowUpgrade(true)}
          />

          <div ref={canvasRef} className="w-full pt-2">
            <CineshootCanvas
              videoUrl={videoUrl}
              isGenerating={isGenerating}
              prompt={currentPrompt}
              aspect={aspect}
              onGenerateImage={(p) => navigate('/imagine', { state: { prompt: p } })}
            />
          </div>

          <div className="py-2 sm:py-4" />

          <CineshootExplorer
            onSelectHistory={handleHistorySelect}
            refreshHistory={refreshHistory}
            onUseTemplate={handleUseTemplate}
          />
          <div className="h-6" />
        </div>
      </main>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default CineshootPage;
