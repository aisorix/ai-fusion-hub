import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Activity, FileText, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import HealthIntakeForm from '@/components/health/HealthIntakeForm';
import HealthTestReview from '@/components/health/HealthTestReview';
import HealthAnalysisResults from '@/components/health/HealthAnalysisResults';
import HealthChatMode from '@/components/health/HealthChatMode';

export interface PatientData {
  symptoms: string;
  gender: 'male' | 'female' | 'other';
  patientCategory: 'men' | 'women' | 'kids' | 'pregnant';
  age: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  files: File[];
  fileContents: { name: string; type: string; base64: string }[];
}

export interface ExtractedTest {
  id: string;
  name: string;
  cost: number;
  category: 'necessary' | 'optional' | 'unnecessary';
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  tests: ExtractedTest[];
  totalCost: number;
  necessaryCost: number;
  savings: number;
  fairnessScore: number;
  fairnessLabel: string;
  categoryDistribution: { name: string; value: number; color: string }[];
  detailedAnalysis: string;
}

type Step = 'intake' | 'review' | 'results' | 'chat';

const stepConfig = [
  { key: 'intake', label: 'Patient Info', icon: FileText },
  { key: 'review', label: 'Review Tests', icon: Stethoscope },
  { key: 'results', label: 'Analysis', icon: Activity },
] as const;

const HealthPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('intake');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [extractedTests, setExtractedTests] = useState<ExtractedTest[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleIntakeSubmit = async (data: PatientData) => {
    setPatientData(data);
    setIsAnalyzing(true);

    try {
      // Call edge function for structured analysis (test extraction)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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
            },
            files: data.fileContents,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      if (result.tests && result.tests.length > 0) {
        setExtractedTests(result.tests.map((t: any, i: number) => ({
          id: `test-${i}`,
          name: t.name,
          cost: t.cost || 0,
          category: t.category || 'optional',
          explanation: t.explanation || '',
        })));
        setCurrentStep('review');
      } else {
        // No tests extracted, go directly to results
        setAnalysisResult(result);
        setCurrentStep('results');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback: go to chat mode with patient context
      setCurrentStep('chat');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTestReviewConfirm = async (tests: ExtractedTest[]) => {
    setExtractedTests(tests);
    setIsAnalyzing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            mode: 'detailed_analysis',
            patientData: {
              symptoms: patientData?.symptoms,
              gender: patientData?.gender,
              patientCategory: patientData?.patientCategory,
              age: patientData?.age,
              weight: patientData?.weight,
              weightUnit: patientData?.weightUnit,
              height: patientData?.height,
              heightUnit: patientData?.heightUnit,
            },
            tests,
            files: patientData?.fileContents || [],
          }),
        }
      );

      if (!response.ok) throw new Error('Detailed analysis failed');

      const result = await response.json();
      setAnalysisResult(result);
      setCurrentStep('results');
    } catch (error) {
      console.error('Detailed analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('intake');
    setPatientData(null);
    setExtractedTests([]);
    setAnalysisResult(null);
  };

  const activeStepIndex = stepConfig.findIndex(s => s.key === currentStep);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Sorix Health</h1>
                <p className="text-[10px] text-muted-foreground">AI Medical Assistant • Free</p>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
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

          <div className="text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              ✨ Free Forever
            </span>
          </div>
        </div>
      </header>

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
              <HealthIntakeForm onSubmit={handleIntakeSubmit} isLoading={isAnalyzing} />
            </motion.div>
          )}

          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <HealthTestReview
                tests={extractedTests}
                onConfirm={handleTestReviewConfirm}
                onStartOver={handleStartOver}
                isLoading={isAnalyzing}
              />
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
    </div>
  );
};

export default HealthPage;
