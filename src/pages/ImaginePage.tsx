import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ImageIcon, History, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { imagineApi, type ImageGeneration } from '@/services/imagineApi';
import ImaginePromptBar from '@/components/imagine/ImaginePromptBar';
import ImagineStyleCarousel, { trendingStyles, type StyleOption } from '@/components/imagine/ImagineStyleCarousel';
import ImagineCanvas from '@/components/imagine/ImagineCanvas';
import ImagineHistory from '@/components/imagine/ImagineHistory';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';

const ImaginePage: React.FC = () => {
  const { user, setUser } = useChatStore();

  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(trendingStyles[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const tokensRemaining = user.tokensLimit - user.tokensUsed;

  const handleGenerate = async (prompt: string) => {
    if (tokensRemaining < 12000) {
      setShowUpgrade(true);
      return;
    }

    setCurrentPrompt(prompt);
    setIsGenerating(true);
    setImageUrl(null);

    try {
      const result = await imagineApi.generateImage(prompt, selectedStyle.modifier || undefined);
      setImageUrl(result.imageUrl);
      setRefreshHistory((p) => p + 1);

      // Update local token count
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

  const handleHistorySelect = (gen: ImageGeneration) => {
    setImageUrl(gen.image_url);
    setCurrentPrompt(gen.prompt);
    setShowHistory(false);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link
              to="/chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
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

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground">
                12K tokens/image
              </span>
            </div>
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              title="Generation History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center gap-6">
          {/* Canvas / Image Display */}
          <ImagineCanvas
            imageUrl={imageUrl}
            isGenerating={isGenerating}
            prompt={currentPrompt}
          />

          {/* Style Carousel */}
          <ImagineStyleCarousel
            selectedStyle={selectedStyle.id}
            onSelectStyle={setSelectedStyle}
          />

          {/* Prompt Bar */}
          <ImaginePromptBar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Token info */}
          <p className="text-[10px] text-muted-foreground/50 text-center">
            {tokensRemaining.toLocaleString()} tokens remaining • Each image costs 12,000 tokens
          </p>
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
