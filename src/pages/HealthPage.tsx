import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import { ArrowLeft, Heart, Activity, FileText, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import HealthHistory from '@/components/health/HealthHistory';
import HealthIntakeForm from '@/components/health/HealthIntakeForm';
import HealthAnalysisResults from '@/components/health/HealthAnalysisResults';
import HealthChatMode from '@/components/health/HealthChatMode';
import AnalysisTimer from '@/components/shared/AnalysisTimer';
import SafetyWarningBanner from '@/components/shared/SafetyWarningBanner';

export interface PatientData {
  symptoms: string;
  gender: 'male' | 'female' | 'other';
  patientCategory: 'men' | 'women' | 'kids' | 'pregnant';
  age: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  existingMedications: string;
  medicalHistory: string;
  allergies: string;
  files: File[];
  fileContents: { name: string; type: string; base64: string }[];
}

export interface Medicine {
  name: string;
  type: string;
  dosage: string;
  frequency: string;
  duration: string;
  cost: number;
  warning: string;
}

export interface RecommendedTest {
  name: string;
  reason: string;
  urgency: 'routine' | 'soon' | 'urgent';
  estimatedCost: number;
}

export interface AnalysisResult {
  diagnosis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severityScore: number;
  causes: string[];
  medicines: Medicine[];
  recommendedTests: RecommendedTest[];
  preventionTips: string[];
  lifestyle: string[];
  timeline: { treatmentDuration: string; expectedRecovery: string };
  detailedAnalysis: string;
  whenToSeeDoctor: string;
}

type Step = 'intake' | 'results' | 'chat';

const stepConfig = [
  { key: 'intake', label: 'Patient Info', icon: FileText },
  { key: 'results', label: 'Analysis', icon: Activity },
] as const;

const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('intake');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleIntakeSubmit = async (data: PatientData) => {
    setPatientData(data);
    setIsAnalyzing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: 'structured_analysis',
            patientData: {
              symptoms: data.symptoms,
              gender: data.gender,
              patientCategory: data.patientCategory,
              age: data.age,
              weight: data.weight,
              weightUnit: data.weightUnit,
              height: data.height,
              heightUnit: data.heightUnit,
              existingMedications: data.existingMedications,
              medicalHistory: data.medicalHistory,
              allergies: data.allergies,
            },
            files: data.fileContents,
          }),
        }
      );

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysisResult(result);
      setCurrentStep('results');

      if (authUser) {
        await supabase.from('analysis_history' as any).insert({
          user_id: authUser.id,
          tool: 'health',
          title: `Health Analysis - ${data.patientCategory || 'General'}`,
          input_data: { symptoms: data.symptoms, gender: data.gender, patientCategory: data.patientCategory, age: data.age },
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
    setPatientData(null);
    setAnalysisResult(null);
  };

  const handleLoadHistory = (inputData: any, resultData: any) => {
    setPatientData(inputData as PatientData);
    setAnalysisResult(resultData as AnalysisResult);
    setCurrentStep('results');
    setShowHistory(false);
  };

  const activeStepIndex = stepConfig.findIndex(s => s.key === currentStep);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <SEOHead title="Sorix Health | AI Health Analysis | AI Sorix" description="Get AI-powered health insights and analysis. Understand symptoms, receive wellness recommendations, and track your health journey." path="/health" />
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix Health</h1>
                <p className="text-[10px] text-muted-foreground">AI Medical Assistant</p>
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
                      <div className={`w-8 h-0.5 rounded-full ${isPast ? 'bg-primary' : 'bg-border'}`} />
                    )}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : isPast
                          ? 'bg-primary/5 text-primary/70'
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
                    step.key === currentStep ? 'bg-primary' : i < activeStepIndex ? 'bg-primary/50' : 'bg-border'
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
              ✨ Free Forever
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <SafetyWarningBanner kind="health" />
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
              <HealthIntakeForm onSubmit={handleIntakeSubmit} isLoading={isAnalyzing} />
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
              <HealthAnalysisResults
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
              <HealthChatMode
                patientData={patientData}
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
                <HealthHistory onLoad={handleLoadHistory} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthPage;
