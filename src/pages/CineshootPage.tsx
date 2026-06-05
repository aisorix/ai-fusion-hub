import React, { useEffect, useRef, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { cineshootApi, type VideoGeneration } from '@/services/cineshootApi';
import CineshootPromptBar from '@/components/cineshoot/CineshootPromptBar';
import CineshootOptionsPanel from '@/components/cineshoot/CineshootOptionsPanel';
import CineshootCanvas from '@/components/cineshoot/CineshootCanvas';
import CineshootExplorer from '@/components/cineshoot/CineshootExplorer';
import {
  cineshootModels, estimateTokens, resolutionOptions,
  type CineshootModel, type VideoAspect, type VideoResolution,
} from '@/components/cineshoot/cineshootModels';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';

const CineshootPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useChatStore();

  const [selectedModel, setSelectedModel] = useState<CineshootModel>(cineshootModels[0]);
  const [aspect, setAspect] = useState<VideoAspect>('16:9');
  const [resolution, setResolution] = useState<VideoResolution>('1080p');
  const [duration, setDuration] = useState<number>(6);
  const [sound, setSound] = useState<boolean>(true);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [injectPrompt, setInjectPrompt] = useState<string | undefined>();
  const [injectKey, setInjectKey] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isProPlus = user.plan === 'pro' || user.plan === 'premium';
  const tokensRemaining = user.tokensLimit - user.tokensUsed;

  // Keep settings consistent with model caps
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
    setInjectKey(k => k + 1);
    setAspect(t.aspect);
    if (selectedModel.durations.includes(t.duration)) setDuration(t.duration);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleGenerate = async (prompt: string, attachments?: Attachment[]) => {
    if (tokensRemaining < costEstimate) { setShowUpgrade(true); return; }
    setCurrentPrompt(prompt);
    setIsGenerating(true);
    setVideoUrl(null);

    let imageData: string | undefined;
    if (attachments?.length) {
      const img = attachments.find(a => a.type === 'image' && a.url);
      if (img) imageData = img.url;
    }

    try {
      const result = await cineshootApi.generateVideo({
        prompt,
        model: selectedModel.modelId,
        aspectRatio: aspect,
        resolution,
        durationSec: duration,
        sound,
        imageData,
      });
      setVideoUrl(result.videoUrl);
      setRefreshHistory(p => p + 1);
      setUser({ ...user, tokensUsed: result.totalTokensUsed });
    } catch (err: any) {
      if (err.message === 'insufficient_tokens') setShowUpgrade(true);
      else toast.error(err.message || 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (gen: VideoGeneration) => {
    setVideoUrl(gen.video_url);
    setCurrentPrompt(gen.prompt);
    if (gen.aspect_ratio === '16:9' || gen.aspect_ratio === '9:16' || gen.aspect_ratio === '1:1') {
      setAspect(gen.aspect_ratio);
    }
    if (gen.model) {
      const m = cineshootModels.find(cm => cm.modelId === gen.model);
      if (m) setSelectedModel(m);
    }
    requestAnimationFrame(() => canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead
        title="Sorix Cineshoot | AI Video Generation | AI Sorix"
        description="Generate cinematic AI videos from text, images, or videos. Multiple frontier video models including Veo 3.1, Sora 2 Pro, Kling, and Seedance."
        path="/cineshoot"
      />
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-foreground truncate">Sorix Cineshoot</h1>
              <p className="hidden sm:block text-[10px] text-muted-foreground">AI Video Generation</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-3 pb-6 sm:pt-5 sm:pb-8 md:pt-8 flex flex-col gap-4 sm:gap-5">
          <div className="relative z-[60]">
            <CineshootPromptBar
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              userPlan={user.plan}
              onUpgrade={() => setShowUpgrade(true)}
              injectPrompt={injectPrompt}
              injectKey={injectKey}
            />
          </div>

          <div className="flex justify-center -mt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[10.5px] text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-primary/70" />
              <span className="tabular-nums">{tokensRemaining.toLocaleString()}</span> tokens left
              <span className="text-muted-foreground/40">·</span>
              <span className="tabular-nums">{costEstimate.toLocaleString()}</span> per render
            </span>
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
