import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Leaf, Bug, Sprout, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgroIntakeForm } from '@/components/agro';
import { AgroAnalysisResults } from '@/components/agro';
import { AgroChatMode } from '@/components/agro';
import { AgroHistory } from '@/components/agro';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AnalysisTimer from '@/components/shared/AnalysisTimer';
import SafetyWarningBanner from '@/components/shared/SafetyWarningBanner';

export interface CropData {
  cropType: string;
  problemDescription: string;
  region: string;
  season: string;
  landArea: string;
  cropAge: string;
  previousTreatments: string;
  files: File[];
  fileContents: { name: string; type: string; base64: string }[];
}

export interface Medicine {
  name: string;
  type: string;
  dosage: string;
  applicationMethod: string;
  frequency: string;
  cost: number;
  isBiological: boolean;
}

export interface AgroResult {
  diagnosis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severityScore: number;
  causes: string[];
  medicines: Medicine[];
  preventionTips: string[];
  alternativeTreatments: string[];
  timeline: { treatmentDuration: string; expectedRecovery: string };
  detailedAnalysis: string;
}

type Step = 'intake' | 'results' | 'chat';

const stepConfig = [
  { key: 'intake', label: 'Crop Info', icon: Sprout },
  { key: 'results', label: 'Analysis', icon: Bug },
] as const;

const AgroPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('intake');
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AgroResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleIntakeSubmit = async (data: CropData) => {
    setCropData(data);
    setIsAnalyzing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agro-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: 'structured_analysis',
            cropData: {
              cropType: data.cropType,
              problemDescription: data.problemDescription,
              region: data.region,
              season: data.season,
              landArea: data.landArea,
              cropAge: data.cropAge,
              previousTreatments: data.previousTreatments,
            },
            files: data.fileContents,
          }),
        }
      );

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysisResult(result);
      setCurrentStep('results');

      // Save to history
      if (authUser) {
        await supabase.from('analysis_history' as any).insert({
          user_id: authUser.id,
          tool: 'agro',
          title: `${data.cropType} - ${result.diagnosis?.slice(0, 50) || 'Analysis'}`,
          input_data: {
            cropType: data.cropType,
            problemDescription: data.problemDescription,
            region: data.region,
            season: data.season,
          },
          result_data: result,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setCurrentStep('chat');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('intake');
    setCropData(null);
    setAnalysisResult(null);
  };

  const handleLoadHistory = (inputData: any, resultData: any) => {
    setCropData(inputData as CropData);
    setAnalysisResult(resultData as AgroResult);
    setCurrentStep('results');
    setShowHistory(false);
  };

  const activeStepIndex = stepConfig.findIndex(s => s.key === currentStep);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead title="Sorix Agro | AI Agriculture | AI Sorix" description="AI-powered agricultural analysis and insights. Get crop diagnosis, pest identification, and farming recommendations." path="/agro" />
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix Agro</h1>
                <p className="text-[10px] text-muted-foreground">AI Crop Doctor • Free</p>
              </div>
            </div>
          </div>

          {/* Step Indicator - Desktop */}
          {currentStep !== 'chat' && (
            <div className="hidden md:flex items-center gap-2">
              {stepConfig.map((step, i) => {
                const Icon = step.icon;
                const isActive = step.key === currentStep;
                const isPast = i < activeStepIndex;
                return (
                  <React.Fragment key={step.key}>
                    {i > 0 && (
                      <div className={`w-8 h-0.5 rounded-full ${isPast ? 'bg-emerald-500' : 'bg-border'}`} />
                    )}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isPast
                          ? 'bg-emerald-500/5 text-emerald-500/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {step.label}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Mobile Step Dots */}
          {currentStep !== 'chat' && (
            <div className="flex md:hidden items-center gap-1.5">
              {stepConfig.map((step, i) => (
                <div
                  key={step.key}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step.key === currentStep ? 'bg-emerald-500' : i < activeStepIndex ? 'bg-emerald-500/50' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              title="Analysis History"
            >
              <History className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              🌾 Free
            </span>
          </div>
        </div>
      </header>

      <SafetyWarningBanner kind="agro" />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        <AnimatePresence mode="wait">
          {currentStep === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <AgroIntakeForm onSubmit={handleIntakeSubmit} isLoading={isAnalyzing} />
              {isAnalyzing && (
                <div className="flex justify-center py-2">
                  <AnalysisTimer isActive={isAnalyzing} />
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <AgroAnalysisResults
                result={analysisResult}
                onStartOver={handleStartOver}
                onContinueChat={() => setCurrentStep('chat')}
              />
            </motion.div>
          )}

          {currentStep === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <AgroChatMode
                cropData={cropData}
                analysisResult={analysisResult}
                onStartOver={handleStartOver}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
                <h2 className="font-bold text-foreground">Analysis History</h2>
                <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-muted rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AgroHistory onLoad={handleLoadHistory} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgroPage;
