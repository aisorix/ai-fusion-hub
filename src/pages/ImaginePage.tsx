import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, ImageIcon, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { imagineApi, type ImageGeneration } from '@/services/imagineApi';
import ImaginePromptBar from '@/components/imagine/ImaginePromptBar';
import { imageModels, type ImageModel } from '@/components/imagine/ImagineModelSelector';
import ImagineOptionsPanel, {
  type AspectRatio,
  type Resolution,
  type OutputFormat,
  type OutputCount,
} from '@/components/imagine/ImagineOptionsPanel';
import ImagineCanvas from '@/components/imagine/ImagineCanvas';
import ImagineHistory from '@/components/imagine/ImagineHistory';
import ImagineHistoryFeed from '@/components/imagine/ImagineHistoryFeed';
import ImagineTemplates from '@/components/imagine/ImagineTemplates';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';

const ImaginePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useChatStore();

  const [selectedModel, setSelectedModel] = useState<ImageModel>(imageModels[0]);
  const [aspect, setAspect] = useState<AspectRatio>('1:1');
  const [resolution, setResolution] = useState<Resolution>('1K');
  const [format, setFormat] = useState<OutputFormat>('webp');
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

  const tokensRemaining = user.tokensLimit - user.tokensUsed;
  const isProPlus = user.plan === 'pro' || user.plan === 'premium';

  const resMultiplier = resolution === '4K' ? 4 : resolution === '2K' ? 2 : 1;
  const costEstimate = 12000 * count * resMultiplier;

  const handleGenerate = async (prompt: string, attachments?: Attachment[]) => {
    if (tokensRemaining < costEstimate) {
      setShowUpgrade(true);
      return;
    }

    setCurrentPrompt(prompt);
    setIsGenerating(true);
    setImageUrls([]);

    let imageData: string | undefined;
    if (attachments?.length) {
      const imgAtt = attachments.find((a) => a.type === 'image' && a.url);
      if (imgAtt) imageData = imgAtt.url;
    }

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
    } catch (err: any) {
      if (err.message === 'insufficient_tokens') {
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
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix Imagine</h1>
                <p className="text-[10px] text-muted-foreground">AI Image Generation</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="Generation History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-5">
          {/* Prompt bar with embedded model picker */}
          <div className="relative z-[60]">
            <ImaginePromptBar
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              userPlan={user.plan}
              onUpgrade={() => setShowUpgrade(true)}
            />
          </div>

          <p className="text-[10.5px] text-muted-foreground/60 text-center -mt-2">
            {tokensRemaining.toLocaleString()} tokens remaining · {costEstimate.toLocaleString()} for this generation
          </p>

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
            />
          </div>

          {/* Visual gap */}
          <div className="py-6" />

          {/* Inline history feed */}
          <ImagineHistoryFeed onSelect={handleHistorySelect} refreshTrigger={refreshHistory} />

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
