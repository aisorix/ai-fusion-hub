import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Workflow, History, X, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { flowbuilderApi, type FlowHistoryItem } from '@/services/flowbuilderApi';
import FlowPromptBar from '@/components/flowbuilder/FlowPromptBar';
import FlowCanvas from '@/components/flowbuilder/FlowCanvas';
import FlowStylePanel, { colorThemes } from '@/components/flowbuilder/FlowStylePanel';
import FlowTemplates, { type DiagramTemplate } from '@/components/flowbuilder/FlowTemplates';
import FlowHistory from '@/components/flowbuilder/FlowHistory';
import FlowExportActions from '@/components/flowbuilder/FlowExportActions';
import UpgradePlanModal from '@/components/aichat/UpgradePlanModal';
import { sanitizeMermaid } from '@/lib/flowbuilderMermaid';

const FlowBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useChatStore();
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('bw');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const tokensRemaining = user.tokensLimit - user.tokensUsed;

  const handleGenerate = async (prompt: string, attachments?: any[]) => {
    let finalPrompt = prompt;
    if (attachments && attachments.length > 0) {
      const fileText = attachments
        .filter(a => a.parsedContent)
        .map(a => `\n\n[File: ${a.name}]\n${a.parsedContent}`)
        .join('');
      if (fileText) finalPrompt = prompt + fileText;
    }
    const cost = code.trim() ? 3000 : 5000;
    if (tokensRemaining < cost) {
      setShowUpgrade(true);
      return;
    }

    setIsGenerating(true);
    try {
      const themeName = colorThemes.find(t => t.id === selectedTheme)?.name;
      const result = await flowbuilderApi.generate(finalPrompt, {
        existingCode: code.trim() || undefined,
        colorTheme: selectedTheme !== 'default' ? themeName : undefined,
      });
      setCode(result.mermaidCode);
      setRefreshHistory(p => p + 1);
      setUser({ ...user, tokensUsed: result.totalTokensUsed });
    } catch (err: any) {
      if (err.message === 'insufficient_tokens') {
        setShowUpgrade(true);
      } else {
        toast.error(err.message || 'Failed to generate diagram');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: DiagramTemplate) => {
    setCode(template.code);
  };

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleHistorySelect = (item: FlowHistoryItem) => {
    const raw = (item.result_data as any)?.mermaidCode || '';
    setCode(sanitizeMermaid(raw));
    setShowHistory(false);
    requestAnimationFrame(() => {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <SEOHead
        title="Sorix FlowBuilder | AI Diagram & Flowchart Generator | AI Sorix"
        description="Create professional diagrams and flowcharts from text prompts. Generate Mermaid diagrams with AI — export as PNG, SVG, PDF."
        path="/flowbuilder"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Sorix FlowBuilder",
        "url": "https://www.aisorix.com/flowbuilder",
        "image": "https://storage.googleapis.com/gpt-engineer-file-uploads/TW4KYntEtgdPvf4urbHFts3hfl32/uploads/1770273544597-logo_(2).png",
        "applicationCategory": "DesignApplication",
        "applicationSubCategory": "AI Diagram Generator",
        "operatingSystem": "Web",
        "description": "AI-powered diagram and flowchart generator. Turn prompts into Mermaid diagrams, customize themes, choose templates, and export as PNG, SVG, or PDF.",
        "featureList": ["AI Mermaid Generation", "Diagram Templates", "Color Themes", "PNG / SVG / PDF Export", "History & Versioning", "Prompt Iteration"],
        "isPartOf": { "@type": "WebSite", "name": "AI Sorix", "url": "https://www.aisorix.com" },
        "publisher": { "@type": "Organization", "name": "AI Sorix", "url": "https://www.aisorix.com" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "Included in AI Sorix plans" }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aisorix.com/" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.aisorix.com/tools" },
          { "@type": "ListItem", "position": 3, "name": "Sorix FlowBuilder", "item": "https://www.aisorix.com/flowbuilder" }
        ]
      }) }} />

      {/* Header */}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix FlowBuilder</h1>
                <p className="text-[10px] text-muted-foreground hidden md:block">AI Diagram & Flowchart</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <FlowExportActions code={code} />
            {code.trim() && (
              <button
                onClick={() => setCode('')}
                className="flex items-center gap-1 px-1.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all"
                title="New Diagram"
              >
                <FilePlus className="w-3.5 h-3.5" /> <span className="hidden md:inline">New</span>
              </button>
            )}
            <button
              onClick={() => setShowHistory(true)}
              className="p-1.5 md:p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              title="History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col gap-4 p-4 md:p-6 flex-1">
          {/* Prompt + Style */}
          <div className="flex flex-col gap-3 shrink-0">
            <FlowPromptBar onGenerate={handleGenerate} isGenerating={isGenerating} />
            <p className="text-[10px] text-muted-foreground/50 text-center">
              {tokensRemaining.toLocaleString()} tokens remaining • {code.trim() ? '3,000 per edit' : '5,000 per diagram'}
            </p>
            <FlowStylePanel selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
          </div>

          {/* Templates (only when no code) */}
          {!code.trim() && !isGenerating && (
            <div className="shrink-0">
              <FlowTemplates onSelectTemplate={handleTemplateSelect} />
            </div>
          )}

          {/* Canvas */}
          <div ref={canvasRef} className="flex-1 min-h-0" data-diagram-container>
            <FlowCanvas code={code} onCodeChange={setCode} isGenerating={isGenerating} />
          </div>
        </div>
      </main>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-[200]" onClick={() => setShowHistory(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-card border-l border-border z-[210] flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-foreground">Diagram History</h2>
                <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-muted rounded-md"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FlowHistory onSelect={handleHistorySelect} refreshTrigger={refreshHistory} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default FlowBuilderPage;
