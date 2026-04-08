import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Workflow, History, X, FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const FlowBuilderPage: React.FC = () => {
  const { user, setUser } = useChatStore();
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const tokensRemaining = user.tokensLimit - user.tokensUsed;

  const handleGenerate = async (prompt: string) => {
    const cost = code.trim() ? 3000 : 5000;
    if (tokensRemaining < cost) {
      setShowUpgrade(true);
      return;
    }

    setIsGenerating(true);
    try {
      const themeName = colorThemes.find(t => t.id === selectedTheme)?.name;
      const result = await flowbuilderApi.generate(prompt, {
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

  const handleHistorySelect = (item: FlowHistoryItem) => {
    setCode((item.result_data as any)?.mermaidCode || '');
    setShowHistory(false);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead
        title="Sorix FlowBuilder | AI Diagram & Flowchart Generator | AI Sorix"
        description="Create professional diagrams and flowcharts from text prompts. Generate Mermaid diagrams with AI — export as PNG, SVG, PDF."
        path="/flowbuilder"
      />

      {/* Header */}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl relative">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link to="/chat" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix FlowBuilder</h1>
                <p className="text-[10px] text-muted-foreground">AI Diagram & Flowchart</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FlowExportActions code={code} />
            {code.trim() && (
              <button
                onClick={() => setCode('')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all"
                title="New Diagram"
              >
                <FilePlus className="w-3.5 h-3.5" /> New
              </button>
            )}
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              title="History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col gap-4 p-4 md:p-6 flex-1 overflow-hidden">
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
          <div className="flex-1 min-h-0" data-diagram-container>
            <FlowCanvas code={code} onCodeChange={setCode} isGenerating={isGenerating} />
          </div>
        </div>
      </main>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowHistory(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-card border-l border-border z-50 flex flex-col">
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
